"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** Błąd sceny (np. brak GLB, brak WebGL) nie może zdjąć całej strony — zostaje wideo fallback. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Canvas 3D: tylko desktop (≥768px), bez reduced-motion, ładowany leniwie
 * po IntersectionObserver (DESIGN.md §3.2–3.3). Do czasu gotowości sceny
 * pod spodem gra wideo fallback.
 */
export function HeroSceneLoader({ onReady }: { onReady: () => void }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} className="absolute inset-0 hidden md:block" aria-hidden="true">
      {mount ? (
        <SceneBoundary>
          <HeroScene onReady={onReady} />
        </SceneBoundary>
      ) : null}
    </div>
  );
}
