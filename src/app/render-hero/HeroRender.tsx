"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { HeroLayout } from "@/components/hero/HeroScene";

const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), { ssr: false });

export function HeroRender() {
  const [layout, setLayout] = useState<HeroLayout | null>(null);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("layout");
    setLayout(p === "mobile" ? "mobile" : "desktop");
  }, []);
  if (!layout) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#0a0a0a" }}>
      <HeroScene layout={layout} manual />
    </div>
  );
}
