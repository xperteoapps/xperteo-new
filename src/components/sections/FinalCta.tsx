"use client";

import Link from "next/link";
import { useRef } from "react";
import { CONTACT, REVIEWS_META, WHATSAPP_URL } from "@/content/site";
import { useGsap } from "@/hooks/useGsap";

const WORDS = ["A", "gdyby", "następny", "projekt", "był", "Twój?"] as const;

/**
 * S11 · Finalne CTA — jedno zdanie na cały ekran (fplus), słowa wjeżdżają z maską.
 * Bez JS wszystko widoczne; GSAP tylko odtwarza wjazd przy wejściu w viewport.
 */
export function FinalCta() {
  const host = useRef<HTMLElement>(null);

  useGsap(host, ({ gsap }, el) => {
    gsap.from(el.querySelectorAll("[data-word]"), {
      yPercent: 110,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.07,
      scrollTrigger: { trigger: el, start: "top 65%", once: true },
    });
    gsap.from(el.querySelectorAll("[data-after]"), {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.08,
      delay: 0.5,
      scrollTrigger: { trigger: el, start: "top 65%", once: true },
    });
  });

  return (
    <section ref={host} id="s11" data-slug="cta" aria-labelledby="s11-heading" className="border-b border-line">
      <span id="cta" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="container-site flex min-h-[90svh] flex-col justify-center py-24 lg:py-32">
        <h2 id="s11-heading" className="cta-h2">
          {WORDS.map((w, i) => (
            <span key={i} className="cta-mask">
              <span data-word className={w === "Twój?" ? "text-signal" : ""}>
                {w}
              </span>
            </span>
          ))}
        </h2>

        <div data-after className="mt-12 flex flex-wrap items-center gap-3">
          <Link
            prefetch={false}
            href="/#kontakt"
            className="inline-flex h-12 items-center rounded bg-fg px-6 text-base font-bold text-bg transition-colors hover:bg-signal hover:text-signal-ink"
          >
            Bezpłatna konsultacja
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex h-12 items-center gap-2 rounded border border-fg/40 px-6 text-base font-bold transition-colors hover:border-fg hover:bg-fg hover:text-bg"
          >
            Napisz na WhatsApp <span aria-hidden="true">↗</span>
          </a>
          <a href={CONTACT.phoneHref} className="inline-flex h-12 items-center px-2 font-mono text-base hover:text-signal">
            {CONTACT.phone}
          </a>
        </div>

        <p data-after className="mt-10 flex flex-wrap items-center gap-3 font-mono text-sm text-fg/80">
          <span className="text-signal" aria-hidden="true">
            ★★★★★
          </span>
          {REVIEWS_META.rating.toLocaleString("pl-PL", { minimumFractionDigits: 1 })} z {REVIEWS_META.count} opinii w Google ·
          Bezpłatnie · Niezobowiązująco · Odpowiedź w 24 h
        </p>
      </div>
    </section>
  );
}
