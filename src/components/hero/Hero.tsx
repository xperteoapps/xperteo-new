"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HeroSceneLoader } from "./HeroSceneLoader";
import { RotatingWord } from "./RotatingWord";
import { heroScroll } from "./hero-scroll";

/** DESIGN.md §4 S1 — treść. Wszystko poniżej renderuje się w HTML bez JS. */
const TOPBAR = ["Odpowiedź w 24 h", "Cała Polska, zdalnie", "Wolne terminy: listopad"] as const;
const H1_LINES = ["Automatyzujemy,", "promujemy", "i budujemy."] as const;
const SUB =
  "Automatyzacje AI, marketing, software i szkolenia dla MŚP. Jedna firma, jeden kontakt, mierzalne wyniki.";
const STATS = [
  { value: 120, suffix: "+", label: "projektów", decimals: 0 },
  { value: 5, suffix: "", label: "Google", decimals: 1 },
  { value: 24, suffix: " h", label: "odpowiedź", decimals: 0 },
] as const;

const fmt = (n: number, decimals: number) =>
  n.toLocaleString("pl-PL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * S1 · Hero (pinned na desktopie). Intro linii H1 i fade'ów jest w CSS
 * (keyframes) — LCP nie czeka na JS. GSAP obsługuje tylko: pin + scrub
 * (→ heroScroll.p dla sceny R3F), odliczanie stats i gaszenie treści.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const host = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const videoDesktop = useRef<HTMLVideoElement>(null);
  const videoMobile = useRef<HTMLVideoElement>(null);
  const [sceneReady, setSceneReady] = useState(false);

  const onSceneReady = useCallback(() => setSceneReady(true), []);

  // Wideo fallback: gramy tylko to, które jest widoczne; desktop gaśnie, gdy scena gotowa.
  useEffect(() => {
    if (reduced) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const v = desktop ? videoDesktop.current : videoMobile.current;
    if (!v) return;
    if (desktop && sceneReady) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
    return () => v.pause();
  }, [reduced, sceneReady]);

  // GSAP: pin + scrub (desktop), odliczanie stats.
  useEffect(() => {
    if (reduced) return;
    const el = host.current;
    const inner = content.current;
    if (!el || !inner) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Stats: 0 → wartość, start po wjeździe H1.
        el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
          const target = Number(node.dataset.count);
          const decimals = Number(node.dataset.decimals ?? 0);
          const suffix = node.dataset.suffix ?? "";
          const o = { n: 0 };
          gsap.to(o, {
            n: target,
            duration: 1.4,
            delay: 0.9,
            ease: "power3.out",
            onUpdate: () => (node.textContent = fmt(o.n, decimals) + suffix),
          });
        });

        // Pin + scrub tylko na desktopie (§3.3: mobile bez pinów).
        ScrollTrigger.matchMedia({
          "(min-width: 768px)": () => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top top+=72",
                end: "+=100%",
                pin: true,
                pinSpacing: true,
                scrub: 0.6,
                onUpdate: (st) => (heroScroll.p = st.progress),
                onLeave: () => (heroScroll.p = 1),
                onLeaveBack: () => (heroScroll.p = 0),
              },
            });
            tl.to(inner, { yPercent: -12, opacity: 0, ease: "none" }, 0.35);
          },
        });
      }, el);

      cleanup = () => {
        ctx.revert();
        heroScroll.p = 0;
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced]);

  const poster = getImageProps({
    src: "/video/hero-poster.jpg",
    alt: "",
    width: 1600,
    height: 900,
    sizes: "100vw",
  }).props;
  const posterMobile = getImageProps({
    src: "/video/hero-mobile-poster.jpg",
    alt: "",
    width: 1080,
    height: 1920,
    sizes: "100vw",
  }).props;
  // Poster wideo: konkretny kandydat z srcSet (nie największy w=3840).
  const pick = (srcSet: string | undefined, w: string, fallback: string) =>
    srcSet?.split(",").map((c) => c.trim().split(" ")).find(([, d]) => d === w)?.[0] ?? fallback;
  const posterSrc = pick(poster.srcSet, "1920w", poster.src);
  const posterMobileSrc = pick(posterMobile.srcSet, "1080w", posterMobile.src);

  return (
    <section
      ref={host}
      id="s1"
      data-slug="hero"
      aria-labelledby="s1-heading"
      className="hero relative isolate overflow-hidden border-b border-line"
    >
      <span id="hero" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />

      {/* ── Tło: poster → wideo loop → scena R3F (desktop) ─────────────── */}
      <div className="hero-bg absolute inset-0 -z-10" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={posterMobile.srcSet} sizes="100vw" />
          <img
            {...poster}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <video
          ref={videoDesktop}
          muted
          loop
          playsInline
          preload="none"
          poster={posterSrc}
          className={`absolute inset-0 hidden h-full w-full object-cover transition-opacity duration-700 md:block ${
            sceneReady ? "opacity-0" : "opacity-100"
          }`}
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <video
          ref={videoMobile}
          muted
          loop
          playsInline
          preload="none"
          poster={posterMobileSrc}
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        >
          <source src="/video/hero-mobile.webm" type="video/webm" />
          <source src="/video/hero-mobile.mp4" type="video/mp4" />
        </video>
        <HeroSceneLoader onReady={onSceneReady} />
        {/* ciemna winieta pod tekstem, żeby H1 trzymał kontrast nad wideo */}
        <div className="hero-shade absolute inset-0" />
      </div>

      {/* ── Treść ──────────────────────────────────────────────────────── */}
      <div
        ref={content}
        className="container-site relative flex flex-col"
        style={{ minHeight: "calc(100svh - var(--nav-h))" }}
      >
        <p data-fade style={{ "--d": "0.05s" } as React.CSSProperties} className="label-mono flex flex-wrap gap-x-3 gap-y-1 pt-5 text-muted">
          {TOPBAR.map((t, i) => (
            <span key={t} className="flex items-center gap-3">
              {i > 0 && <span className="text-fg/30">·</span>}
              {t}
            </span>
          ))}
        </p>

        <div className="flex flex-1 flex-col justify-center py-8 md:py-6">
          <h1 id="s1-heading" className="hero-h1">
            {H1_LINES.map((line, i) => (
              <span key={line} className="hero-mask">
                <span data-line style={{ "--i": i } as React.CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div
            data-fade
            style={{ "--d": "0.3s" } as React.CSSProperties}
            className="hero-word mt-2 font-bold tracking-tight md:mt-3"
          >
            <RotatingWord />
          </div>

          <p
            data-fade
            style={{ "--d": "0s" } as React.CSSProperties}
            className="mt-6 max-w-[34rem] text-base leading-relaxed text-fg/80 md:text-lg"
          >
            {SUB}
          </p>

          <div
            data-fade
            style={{ "--d": "0.35s" } as React.CSSProperties}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link
              href="/#kontakt"
              prefetch={false}
              className="inline-flex h-12 items-center rounded bg-signal px-6 text-base font-bold text-signal-ink transition-colors hover:bg-fg"
            >
              Bezpłatna konsultacja
            </Link>
            <a
              href="#realizacje"
              className="inline-flex h-12 items-center gap-2 rounded border border-fg/40 px-6 text-base font-bold text-fg transition-colors hover:border-fg hover:bg-fg hover:text-bg"
            >
              Zobacz realizacje <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div
          data-fade
          style={{ "--d": "0.45s" } as React.CSSProperties}
          className="flex flex-wrap items-end justify-between gap-6 border-t border-line py-5"
        >
          <dl className="flex flex-wrap gap-x-10 gap-y-4 font-mono">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dd
                  data-count={s.value}
                  data-decimals={s.decimals}
                  data-suffix={s.suffix}
                  className="order-1 text-2xl leading-none text-fg md:text-3xl"
                >
                  {`${fmt(s.value, s.decimals)}${s.suffix}`}
                </dd>
                <dt className="label-mono order-2 text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="label-mono hidden items-center gap-3 text-muted md:flex" aria-hidden="true">
            Scroll
            <span className="hero-arrow inline-block">→</span>
          </p>
        </div>
      </div>
    </section>
  );
}
