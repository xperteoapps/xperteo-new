"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HERO_WORDS } from "./hero-scroll";

/** Rotujące słowo w żółtym pod H1: zmiana co 2 s, flip z maską. Bez JS: pierwsze słowo. */
export function RotatingWord() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    let timer = 0;
    let gsapMod: typeof import("gsap")["default"] | null = null;

    const flip = async () => {
      if (!alive || !el.current) return;
      if (!gsapMod) gsapMod = (await import("gsap")).default;
      const g = gsapMod;
      await g.to(el.current, { yPercent: -100, duration: 0.35, ease: "power2.in" });
      if (!alive) return;
      setI((n) => (n + 1) % HERO_WORDS.length);
      g.fromTo(el.current, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: "expo.out" });
    };

    timer = window.setInterval(() => void flip(), 2000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [reduced]);

  return (
    <span className="relative block overflow-hidden">
      <span ref={el} className="inline-block text-signal" aria-hidden="true">
        {HERO_WORDS[i]}
      </span>
      <span className="sr-only">{HERO_WORDS.join(", ")}</span>
    </span>
  );
}
