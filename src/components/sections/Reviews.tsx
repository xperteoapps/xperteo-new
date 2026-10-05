"use client";

import { useEffect, useRef, useState } from "react";
import { REVIEWS, REVIEWS_META } from "@/content/site";
import { useGsap } from "@/hooks/useGsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * S6 · Opinie Google — slider 01/03 (1367), autoplay 6 s.
 * Dane WYŁĄCZNIE prawdziwe (Sanity / Google). Brak danych = pusty stan.
 */
export function Reviews() {
  const host = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = REVIEWS.length;

  useEffect(() => {
    if (n < 2 || paused || reduced) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => window.clearInterval(t);
  }, [n, paused, reduced]);

  useGsap(host, ({ gsap }, el) => {
    gsap.from(el.querySelectorAll("[data-fade]"), {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 75%", once: true },
    });
  });

  const stars = (
    <span className="font-mono text-signal" aria-label={`${REVIEWS_META.rating} na 5`}>
      ★★★★★
    </span>
  );

  return (
    <section ref={host} id="s6" data-slug="opinie" aria-labelledby="s6-heading" className="border-b border-line">
      <span id="opinie" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="container-site grid-12 gap-y-10 py-20 lg:py-28">
        <div className="col-span-12 lg:col-span-5" data-fade>
          <p className="label-mono text-muted">S6 · Opinie Google</p>
          <h2 id="s6-heading" className="mt-6 text-4xl font-bold tracking-tight lg:text-6xl">
            {REVIEWS_META.count} opinie.
            <br />
            Wszystkie 5 gwiazdek.
          </h2>
          <p className="mt-6 flex items-center gap-3 font-mono text-sm">
            {stars}
            <span className="text-fg/80">
              {REVIEWS_META.rating.toLocaleString("pl-PL", { minimumFractionDigits: 1 })} / 5 · {REVIEWS_META.count} opinii
            </span>
          </p>
          <a
            href={REVIEWS_META.googleUrl}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded border border-fg/40 px-6 text-base font-bold transition-colors hover:border-fg hover:bg-fg hover:text-bg"
          >
            Zobacz w Google <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div
          className="col-span-12 lg:col-span-7"
          data-fade
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative rounded border border-line bg-bg-2 p-8 lg:p-12">
            <span aria-hidden="true" className="absolute -top-6 left-8 font-sans text-[7rem] leading-none text-signal lg:left-12">
              “
            </span>
            {n === 0 ? (
              <div className="pt-8">
                <p className="text-xl leading-relaxed text-fg/80 lg:text-2xl">
                  Treść opinii pobieramy bezpośrednio z Google. Do czasu podpięcia wizytówki
                  zobacz je u źródła.
                </p>
                <p className="label-mono mt-8 text-muted">Źródło: wizytówka Google Xperteo</p>
              </div>
            ) : (
              <>
                <div className="relative min-h-[14rem] pt-8" aria-live="polite">
                  {REVIEWS.map((r, k) => (
                    <blockquote
                      key={r.id}
                      className={`transition-opacity duration-700 ease-expo ${
                        k === i ? "relative opacity-100" : "pointer-events-none absolute inset-0 pt-8 opacity-0"
                      }`}
                      aria-hidden={k !== i}
                    >
                      <p className="text-xl leading-relaxed lg:text-2xl">{r.text}</p>
                      <footer className="mt-8 flex items-center gap-4">
                        {r.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fg font-mono text-sm text-bg">
                            {r.author.slice(0, 1)}
                          </span>
                        )}
                        <div>
                          <p className="font-bold">{r.author}</p>
                          <p className="text-sm text-muted">
                            {[r.role, r.company].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                      </footer>
                    </blockquote>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-line pt-6 font-mono text-sm">
                  <span>
                    {pad(i + 1)} <span className="text-muted">/ {pad(n)}</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setI((v) => (v - 1 + n) % n)}
                      aria-label="Poprzednia opinia"
                      className="flex h-10 w-10 items-center justify-center rounded border border-line hover:border-fg"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setI((v) => (v + 1) % n)}
                      aria-label="Następna opinia"
                      className="flex h-10 w-10 items-center justify-center rounded border border-line hover:border-fg"
                    >
                      →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
