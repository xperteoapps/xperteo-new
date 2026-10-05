"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PILLARS, PROJECTS, type Project } from "@/content/site";
import { isDesktop, useGsap } from "@/hooks/useGsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LiquidImage = dynamic(() => import("@/components/cases/LiquidImage").then((m) => m.LiquidImage), {
  ssr: false,
});

/**
 * S5 · Realizacje — pinned sekcja, scroll pionowy → przesuw poziomy (fplus),
 * obraz z WebGL liquid distortion na hover (desktop). Mobile: CSS scroll-snap.
 * Wyniki liczbowe tylko z danych (brak = pokazujemy typ realizacji).
 */
export function CasesHorizontal() {
  const host = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);

  // WebGL tylko na desktopie, po wejściu sekcji w okolice viewportu
  useEffect(() => {
    if (reduced || !isDesktop()) return;
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setWebgl(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useGsap(host, ({ gsap }, el) => {
    if (!isDesktop()) {
      gsap.from(el.querySelectorAll("[data-case]"), {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      return;
    }
    const t = track.current!;
    const distance = () => t.scrollWidth - window.innerWidth;
    const cards = gsap.utils.toArray<HTMLElement>("[data-case]", el);
    const medias = cards.map((c) => c.querySelector<HTMLElement>("[data-media-inner]"));
    const counter = el.querySelector<HTMLElement>("[data-counter]");
    const bar = el.querySelector<HTMLElement>("[data-progress]");

    // Karta blisko środka: scale 1, pełna opacity meta; dalej: 0.92 i przygaszona.
    // Obraz wewnątrz karty przesuwa się wolniej niż karta (parallax), skala 1.12 daje zapas.
    const update = () => {
      const vw = window.innerWidth;
      const cx = vw / 2;
      let best = 0;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = (r.left + r.width / 2 - cx) / vw; // -1 … 1
        const f = 1 - Math.min(Math.abs(d) / 0.75, 1);
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = i;
        }
        gsap.set(c, { scale: 0.92 + 0.08 * f });
        c.style.setProperty("--f", f.toFixed(3));
        const m = medias[i];
        if (m) m.style.transform = `translate3d(${(d * -7).toFixed(2)}%, 0, 0) scale(1.12)`;
      });
      if (counter) counter.textContent = String(Math.min(best + 1, PROJECTS.length)).padStart(2, "0");
    };

    const tween = gsap.to(t, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top+=72",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (st) => {
          if (bar) bar.style.transform = `scaleX(${st.progress})`;
          update();
        },
        onRefresh: update,
      },
    });

    // Wejście: karty wjeżdżają z prawej, raz.
    gsap.from(cards, {
      x: 160,
      opacity: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.07,
      scrollTrigger: { trigger: el, start: "top 70%", once: true },
      onUpdate: update,
    });
    update();

    return () => {
      tween.kill();
    };
  });

  const pillarName = (id: Project["pillar"]) => PILLARS.find((p) => p.id === id)?.short ?? "";

  return (
    <section
      ref={host}
      id="s5"
      data-slug="realizacje"
      aria-labelledby="s5-heading"
      className="cases relative border-b border-line"
    >
      <span id="realizacje" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="container-site flex flex-wrap items-end justify-between gap-6 pt-20 lg:pt-10">
        <div>
          <p className="label-mono text-muted">S5 · Realizacje</p>
          <h2 id="s5-heading" className="mt-3 text-4xl font-bold tracking-tight lg:text-[2.75rem]">
            Strony, sklepy i systemy, które pracują.
          </h2>
        </div>
        <div className="flex items-center gap-8">
          <p className="hidden font-mono text-2xl md:block" aria-hidden="true">
            <span data-counter>01</span>
            <span className="text-muted"> / {String(PROJECTS.length).padStart(2, "0")}</span>
          </p>
        <Link
          prefetch={false}
          href="/realizacje"
          className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.08em]"
        >
          Wszystkie realizacje
          <span aria-hidden="true" className="arrow">
            →
          </span>
        </Link>
        </div>
      </div>

      <div className="cases-viewport">
        <div ref={track} className="cases-track">
          <div className="cases-spacer" aria-hidden="true" />
          {PROJECTS.map((p, i) => (
            <article key={p.slug} data-case className="case-card" aria-labelledby={`case-${p.slug}`}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener"
                className="case-media group"
                aria-label={`${p.name} — otwórz stronę klienta`}
              >
                <div data-media-inner className="case-media-inner">
                {p.video ? (
                  <video
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    poster={p.video.poster}
                    className="h-full w-full object-cover"
                  >
                    <source src={p.video.webm} type="video/webm" />
                    <source src={p.video.mp4} type="video/mp4" />
                  </video>
                ) : webgl ? (
                  <LiquidImage src={p.image} width={1600} height={1000} className="h-full w-full" />
                ) : (
                  <Image
                    src={p.image}
                    alt={`${p.name}: ${p.type}`}
                    fill
                    sizes="(min-width: 768px) 70vw, 85vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                )}
                </div>
                <span className="label-mono absolute left-4 top-4 rounded bg-bg/80 px-2 py-1 text-fg/90">
                  {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                </span>
              </a>
              <div className="case-meta mt-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="label-mono text-muted">
                    {p.industry} · {pillarName(p.pillar)}
                  </p>
                  <h3 id={`case-${p.slug}`} className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">
                    <a href={p.url} target="_blank" rel="noopener" className="hover:text-signal">
                      {p.name}
                    </a>
                  </h3>
                </div>
                <p className="font-mono text-xl leading-tight lg:text-2xl">
                  {p.result ? <span className="text-signal">{p.result}</span> : <span className="text-fg/80">{p.type}</span>}
                </p>
              </div>
              <ul className="case-meta mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li key={t} className="rounded border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <article data-case className="case-card case-card-last">
            <Link prefetch={false} href="/realizacje" className="group flex h-full flex-col justify-between">
              <span className="label-mono text-muted">120+ projektów</span>
              <span className="text-4xl font-bold tracking-tight lg:text-6xl">
                Wszystkie
                <br />
                realizacje
                <span aria-hidden="true" className="arrow ml-4 inline-block">
                  →
                </span>
              </span>
            </Link>
          </article>
          <div className="cases-spacer" aria-hidden="true" />
        </div>
      </div>

      <div className="container-site pb-6 lg:pb-8">
        <div className="h-px w-full bg-line">
          <div data-progress className="h-px w-full origin-left scale-x-0 bg-fg" />
        </div>
      </div>
    </section>
  );
}
