"use client";

import type Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LenisContext = createContext<Lenis | null>(null);

/** Dostęp do instancji Lenis (np. velocity dla marquee w S3/S9). `null` przy reduced motion lub przed inicjalizacją. */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis + GSAP ticker (jeden RAF). Przy prefers-reduced-motion natywny scroll.
 * Lenis i GSAP są importowane dynamicznie PO hydracji — nie blokują LCP/TBT
 * (DESIGN.md §3.4: Lighthouse mobile ≥ 90).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const [{ default: LenisCtor }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const instance = new LenisCtor({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
      });

      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);

      cleanup = () => {
        gsap.ticker.remove(tick);
        instance.destroy();
        setLenis(null);
      };
    };

    // Po pierwszym malowaniu, w czasie bezczynności — nie konkuruje z LCP.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(() => void init(), { timeout: 1500 });
    } else {
      window.setTimeout(() => void init(), 300);
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
