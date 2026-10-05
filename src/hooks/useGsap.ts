"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

export type GsapKit = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
};

/**
 * GSAP + ScrollTrigger dla jednej sekcji: dynamiczny import po hydracji,
 * `gsap.context` scope'owany do elementu, pełny revert przy odmontowaniu.
 * Przy prefers-reduced-motion nic się nie uruchamia (DESIGN.md §3.1).
 */
export function useGsap(
  ref: RefObject<HTMLElement | null>,
  setup: (kit: GsapKit, el: HTMLElement) => void | (() => void),
  deps: DependencyList = [],
) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      // Do QA w przeglądarce (window.__ST.getAll()).
      (window as unknown as { __ST?: typeof ScrollTriggerType }).__ST = ScrollTrigger;
      let extra: void | (() => void) = undefined;
      const ctx = gsap.context(() => {
        extra = setup({ gsap, ScrollTrigger }, el);
      }, el);
      // Sekcje montują się asynchronicznie (dynamic import), więc triggery mogą powstać
      // w innej kolejności niż na stronie. ScrollTrigger dolicza pin-spacing tylko pinom
      // utworzonym wcześniej — bez sort() kolejna przypięta sekcja startuje za wcześnie.
      const raf = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      cleanup = () => {
        cancelAnimationFrame(raf);
        if (typeof extra === "function") (extra as () => void)();
        ctx.revert();
      };
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ref, ...deps]);
}

/** Czy jesteśmy na desktopie (≥768px) — do decyzji „pin / bez pinu” w setupie. */
export const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
