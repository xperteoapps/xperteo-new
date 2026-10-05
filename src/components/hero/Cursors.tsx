"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const NAMES = ["Mat", "Wojtek", "Dawid"] as const;

/**
 * Multiplayer cursors (DESIGN.md §1 salo.uk / §4 S1): 3 etykiety dryfują
 * sinusoidalnie, czwarta "Ty" podąża za prawdziwym kursorem. Desktop only.
 */
export function Cursors({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(min-width: 768px) and (pointer: fine)").matches) return;
    const host = hostRef.current;
    const root = wrap.current;
    if (!host || !root) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-cursor]"));
    const you = root.querySelector<HTMLElement>("[data-you]");
    const seeds = els.map((_, i) => ({
      cx: 0.55 + i * 0.14,
      cy: 0.3 + i * 0.18,
      ax: 0.05 + i * 0.015,
      ay: 0.06 + i * 0.012,
      fx: 0.00022 + i * 0.00005,
      fy: 0.00017 + i * 0.00004,
      ph: i * 1.7,
    }));
    const target = { x: -100, y: -100, active: false };
    const pos = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      target.active = true;
    };
    const onLeave = () => (target.active = false);
    host.addEventListener("mousemove", onMove, { passive: true });
    host.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = (t: number) => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      els.forEach((el, i) => {
        const s = seeds[i];
        const x = (s.cx + Math.sin(t * s.fx + s.ph) * s.ax) * w;
        const y = (s.cy + Math.cos(t * s.fy + s.ph) * s.ay) * h;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      if (you) {
        pos.x += (target.x - pos.x) * 0.18;
        pos.y += (target.y - pos.y) * 0.18;
        you.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        you.style.opacity = target.active ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    root.classList.add("is-live");
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      root.classList.remove("is-live");
    };
  }, [reduced, hostRef]);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="cursors pointer-events-none absolute inset-0 hidden md:block"
    >
      {NAMES.map((n) => (
        <span key={n} data-cursor className="cursor">
          <CursorArrow />
          <span className="cursor-label">{n}</span>
        </span>
      ))}
      <span data-you className="cursor cursor-you">
        <CursorArrow />
        <span className="cursor-label">Ty</span>
      </span>
    </div>
  );
}

function CursorArrow() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" className="cursor-arrow">
      <path d="M1 1l12 8.5-5.2 1.1L10.5 17 8.2 17.8 5.6 11.5 1 15z" />
    </svg>
  );
}
