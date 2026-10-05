"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/components/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Marquee (S3, S9): treść zdublowana w HTML, bazowy ruch w CSS (działa bez JS),
 * po hydracji JS przejmuje transform i moduluje prędkość prędkością scrolla Lenis.
 */
export function Marquee({
  children,
  direction = "left",
  speed = 40,
  className = "",
  gap = "gap-12",
}: {
  children: ReactNode;
  direction?: "left" | "right";
  /** px / s */
  speed?: number;
  className?: string;
  gap?: string;
}) {
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = track.current;
    if (!el) return;
    el.style.animation = "none";
    let x = 0;
    let raf = 0;
    let last = performance.now();
    const sign = direction === "left" ? -1 : 1;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const v = lenis ? Math.min(Math.abs(lenis.velocity), 60) : 0;
      x += sign * (speed + v * 8) * dt;
      const half = el.scrollWidth / 2;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      el.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      el.style.animation = "";
      el.style.transform = "";
    };
  }, [lenis, reduced, direction, speed]);

  return (
    <div className={`marquee overflow-hidden ${className}`} aria-hidden="true">
      <div
        ref={track}
        className={`marquee-track flex w-max items-center ${gap} ${
          direction === "right" ? "marquee-right" : ""
        }`}
      >
        <div className={`flex shrink-0 items-center ${gap}`}>{children}</div>
        <div className={`flex shrink-0 items-center ${gap}`}>{children}</div>
      </div>
    </div>
  );
}
