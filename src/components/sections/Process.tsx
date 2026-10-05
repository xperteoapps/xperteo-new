"use client";

import { useRef } from "react";
import { PROCESS } from "@/content/site";
import { useGsap } from "@/hooks/useGsap";

/** S8 · Jak pracujemy — pozioma oś 4 kroków, linia rysuje się na scroll, kroki zapalają się kolejno. */
export function Process() {
  const host = useRef<HTMLElement>(null);

  useGsap(host, ({ gsap }, el) => {
    const line = el.querySelector<SVGPathElement>("[data-line]");
    const steps = el.querySelectorAll<HTMLElement>("[data-step]");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 70%", scrub: 0.6 },
    });
    if (line) {
      const len = line.getTotalLength();
      line.style.strokeDasharray = `${len}`;
      line.style.strokeDashoffset = `${len}`;
      tl.to(line, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
    }
    steps.forEach((s, i) => {
      tl.fromTo(
        s,
        { opacity: 0.25, y: 12 },
        { opacity: 1, y: 0, ease: "none", duration: 0.2 },
        i * 0.22,
      );
    });
  });

  return (
    <section ref={host} id="s8" data-slug="jak-pracujemy" aria-labelledby="s8-heading" className="border-b border-line">
      <span id="jak-pracujemy" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="container-site py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-mono text-muted">S8 · Jak pracujemy</p>
            <h2 id="s8-heading" className="mt-6 text-4xl font-bold tracking-tight lg:text-6xl">
              Od rozmowy do wyniku
              <br />
              w czterech krokach.
            </h2>
          </div>
          <p className="max-w-[22rem] text-base text-fg/75">
            Bez warsztatów za tysiące i bez prezentacji zamiast efektu. Liczby na starcie, działający produkt co 2 tygodnie.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Linia — pozioma na desktopie, pionowa na mobile (CSS) */}
          <svg className="process-line" viewBox="0 0 1000 2" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 1 H1000" stroke="rgba(244,244,242,0.15)" strokeWidth="2" fill="none" />
            <path data-line d="M0 1 H1000" stroke="#FFD500" strokeWidth="2" fill="none" />
          </svg>
          <ol className="process-steps">
            {PROCESS.map((s) => (
              <li key={s.step} data-step className="process-step">
                <span className="process-dot" aria-hidden="true" />
                <span className="label-mono text-muted">{s.step}</span>
                <h3 className="mt-3 text-xl font-bold tracking-tight lg:text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg/75 lg:text-base">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
