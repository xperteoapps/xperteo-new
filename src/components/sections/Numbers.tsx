"use client";

import { useRef } from "react";
import { NUMBERS } from "@/content/site";
import { useGsap } from "@/hooks/useGsap";

const fmt = (n: number, d: number) =>
  n.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d });

/** S7 · Liczby — cała sekcja w żółci (303.pl), 4 liczniki, grain. */
export function Numbers() {
  const host = useRef<HTMLElement>(null);

  useGsap(host, ({ gsap }, el) => {
    el.querySelectorAll<HTMLElement>("[data-count]").forEach((node, i) => {
      const target = Number(node.dataset.count);
      const decimals = Number(node.dataset.decimals ?? 0);
      const suffix = node.dataset.suffix ?? "";
      const o = { n: 0 };
      gsap.to(o, {
        n: target,
        duration: 1.8,
        delay: i * 0.12,
        ease: "power3.out",
        onUpdate: () => (node.textContent = fmt(o.n, decimals) + suffix),
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
    });
  });

  return (
    <section
      ref={host}
      id="s7"
      data-slug="liczby"
      aria-labelledby="s7-heading"
      className="grain border-b border-line bg-signal text-signal-ink"
    >
      <span id="liczby" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="grain-layer" aria-hidden="true" />
      <div className="container-site relative py-20 lg:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="s7-heading" className="font-mono text-xs uppercase tracking-[0.08em]">
            S7 · W liczbach
          </h2>
          <p className="font-mono text-xs uppercase tracking-[0.08em] opacity-70">Stan: {new Date().getFullYear()}</p>
        </div>
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {NUMBERS.map((s) => (
            <div key={s.label} className="flex flex-col gap-3 border-t border-signal-ink/30 pt-6">
              <dd
                data-count={s.value}
                data-decimals={s.decimals}
                data-suffix={s.suffix}
                className="order-1 font-mono text-5xl leading-none tracking-tight lg:text-7xl"
              >
                {`${fmt(s.value, s.decimals)}${s.suffix}`}
              </dd>
              <dt className="order-2 max-w-[14rem] text-sm leading-snug lg:text-base">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
