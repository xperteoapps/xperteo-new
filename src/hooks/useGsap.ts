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
      let extra: void | (() => void);
      const ctx = gsap.context(() => {
        extra = setup({ gsap, ScrollTrigger }, el);
      }, el);
      cleanup = () => {
        if (typeof extra === "function") extra();
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
