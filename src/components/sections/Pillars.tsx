"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScroll";
import { PILLARS, PROJECTS } from "@/content/site";
import { isDesktop, useGsap } from "@/hooks/useGsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const fmt = (n: number, d: number) =>
  n.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d });

type Dir = "down" | "up";

/**
 * S4 · Cztery filary — sticky stacking cards (salo.uk) w trybie pełnoekranowym:
 * gdy sekcja wjeżdża na ekran (desktop), panel przejmuje cały viewport, karty
 * przewijają się w środku (sticky + scale/dim poprzedniej), X / Esc zamyka,
 * scroll za ostatnią kartą wychodzi na S5, scroll nad pierwszą wraca na S3.
 * Bez JS / mobile / reduced-motion: zwykła sekcja w flow (sticky działa w CSS).
 */
export function Pillars() {
  const host = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const entryDir = useRef<Dir>("down");
  const dismissed = useRef(false);
  const played = useRef(new Set<number>());

  /* ── wizuale kart (timeline per karta, odtwarzane raz) ─────────────── */
  const buildVisuals = useCallback((gsap: typeof import("gsap").gsap, cards: HTMLElement[]) =>
    cards.map((card, i) => {
      const tl = gsap.timeline({ paused: true });
      if (i === 0) {
        const paths = card.querySelectorAll<SVGPathElement>("[data-draw]");
        paths.forEach((p) => {
          const len = p.getTotalLength();
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
        });
        tl.to(paths, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", stagger: 0.12 }, 0).from(
          card.querySelectorAll("[data-node]"),
          { scale: 0.7, opacity: 0, transformOrigin: "center", duration: 0.6, ease: "expo.out", stagger: 0.1 },
          0.25,
        );
      }
      if (i === 1) {
        tl.from(card.querySelectorAll("[data-bar]"), { scaleY: 0, transformOrigin: "bottom", duration: 1, ease: "expo.out", stagger: 0.06 });
        card.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
          const target = Number(node.dataset.count);
          const decimals = Number(node.dataset.decimals ?? 0);
          const suffix = node.dataset.suffix ?? "";
          const o = { n: 0 };
          tl.to(o, { n: target, duration: 1.4, ease: "power3.out", onUpdate: () => (node.textContent = fmt(o.n, decimals) + suffix) }, 0);
        });
      }
      if (i === 2) {
        const mocks = card.querySelectorAll<HTMLElement>("[data-mock]");
        tl.from(mocks, { y: 60, opacity: 0, rotate: -2, duration: 1, ease: "expo.out", stagger: 0.12 });
        mocks.forEach((m, k) => gsap.to(m, { y: k % 2 ? -10 : 10, duration: 3 + k * 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 }));
      }
      if (i === 3) {
        tl.from(card.querySelector("[data-photo]"), { scale: 1.12, duration: 1.4, ease: "expo.out" }).from(
          card.querySelector("[data-badge]"),
          { y: 16, opacity: 0, duration: 0.6, ease: "expo.out" },
          0.4,
        );
      }
      return tl;
    }), []);

  /* ── trigger otwarcia (desktop) / fade-up (mobile) ──────────────────── */
  useGsap(host, ({ gsap, ScrollTrigger }, el) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
    if (!isDesktop()) {
      const visuals = buildVisuals(gsap, cards);
      cards.forEach((card, i) => {
        gsap.from(card, { y: 28, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%", once: true } });
        ScrollTrigger.create({ trigger: card, start: "top 70%", once: true, onEnter: () => visuals[i].play() });
      });
      return;
    }
    ScrollTrigger.create({
      trigger: el,
      start: "top 45%",
      end: "bottom 55%",
      onEnter: () => {
        if (dismissed.current) return;
        entryDir.current = "down";
        el.style.minHeight = `${el.offsetHeight}px`; // placeholder: sekcja trzyma wysokość, gdy panel jest fixed
        setOpen(true);
      },
      onEnterBack: () => {
        if (dismissed.current) return;
        entryDir.current = "up";
        el.style.minHeight = `${el.offsetHeight}px`;
        setOpen(true);
      },
      onLeave: () => (dismissed.current = false),
      onLeaveBack: () => (dismissed.current = false),
    });
  });

  const close = useCallback(
    (dir: Dir) => {
      const el = host.current;
      if (!el) return;
      dismissed.current = true;
      setOpen(false);
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const y = dir === "down" ? top + r.height - 72 : Math.max(0, top - window.innerHeight + 72);
      if (lenis) {
        lenis.start();
        lenis.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: y });
      }
    },
    [lenis],
  );

  /* ── tryb pełnoekranowy ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const p = panel.current;
    const el = host.current;
    if (!p || !el) return;
    lenis?.stop();
    document.documentElement.classList.add("overflow-hidden");
    const last = p.querySelectorAll<HTMLElement>("[data-card]");
    const lastTop = last.length ? last[last.length - 1].offsetTop - 96 : p.scrollHeight;
    p.scrollTop = entryDir.current === "down" ? 0 : lastTop;
    p.focus({ preventScroll: true });
    played.current.clear(); // wizuale budowane od nowa przy każdym otwarciu — odtwarzamy je ponownie

    let cancelled = false;
    let revert: (() => void) | undefined;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
        const visuals = buildVisuals(gsap, cards);
        cards.forEach((card, i) => {
          ScrollTrigger.create({
            scroller: p,
            trigger: card,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          });
          ScrollTrigger.create({
            scroller: p,
            trigger: card,
            start: "top 70%",
            once: true,
            onEnter: () => {
              if (!played.current.has(i)) {
                played.current.add(i);
                visuals[i].play();
              }
            },
          });
          const next = cards[i + 1];
          if (next) {
            gsap.to(card, {
              scale: 0.95,
              filter: "brightness(0.5)",
              ease: "none",
              scrollTrigger: { scroller: p, trigger: next, start: "top bottom", end: "top top+=96", scrub: true },
            });
          }
        });
        gsap.from(p, { opacity: 0, scale: 0.985, duration: 0.7, ease: "expo.out" });
      }, el);
      ScrollTrigger.refresh();
      revert = () => ctx.revert();
    })();

    const onWheel = (e: WheelEvent) => {
      const atBottom = p.scrollTop + p.clientHeight >= p.scrollHeight - 2;
      const atTop = p.scrollTop <= 0;
      if (atBottom && e.deltaY > 0) close("down");
      else if (atTop && e.deltaY < 0 && entryDir.current === "up") close("up");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(entryDir.current);
    };
    p.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      revert?.();
      p.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("overflow-hidden");
      lenis?.start();
      requestAnimationFrame(() => {
        if (host.current) host.current.style.minHeight = "";
      });
    };
  }, [open, lenis, close, buildVisuals]);

  const mock = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;

  return (
    <section ref={host} id="s4" data-slug="co-robimy" aria-labelledby="s4-heading" className="pillars border-b border-line">
      <span id="co-robimy" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div
        ref={panel}
        className={`pillars-panel ${open ? "is-open" : ""}`}
        role={open ? "dialog" : undefined}
        aria-modal={open ? "true" : undefined}
        aria-label={open ? "Co robimy — pełny ekran" : undefined}
        tabIndex={open ? -1 : undefined}
        data-lenis-prevent
      >
        {/* Pasek pełnego ekranu: tylko gdy otwarte */}
        {open && (
          <div className="pillars-bar">
            <span className="label-mono text-muted">S4 · Co robimy · {PILLARS[active].number} / 04</span>
            <button
              ref={closeBtn}
              type="button"
              onClick={() => close(entryDir.current)}
              aria-label="Zamknij pełny ekran"
              className="pillars-close"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="container-site grid-12 gap-y-10 py-20 lg:py-28">
          {/* Lewa kolumna — sticky */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky" style={{ top: open ? "6rem" : "calc(var(--nav-h) + 2rem)" }}>
              <p className="label-mono text-muted">S4 · Co robimy</p>
              <h2 id="s4-heading" className="mt-6 text-4xl font-bold tracking-tight lg:text-6xl">
                Cztery rzeczy.
                <br />
                Jedna firma.
              </h2>
              <p className="mt-6 max-w-[26rem] text-base leading-relaxed text-fg/75">
                Automatyzacje, marketing, software i szkolenia. Zamiast czterech dostawców, jeden kontakt i jedna
                odpowiedzialność za wynik.
              </p>
              <p className="mt-10 font-mono text-5xl leading-none lg:text-7xl" aria-live="polite">
                <span className="text-signal">{PILLARS[active].number}</span>
                <span className="text-fg/30"> / 04</span>
              </p>
              {open && !reduced && (
                <p className="label-mono mt-10 hidden text-muted lg:block">Scroll ↓ · Esc zamyka</p>
              )}
            </div>
          </div>

          {/* Prawa kolumna — karty */}
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-8 lg:gap-0">
            {PILLARS.map((p, i) => (
              <article key={p.id} data-card className="pillar-card" style={{ zIndex: i + 1 }} aria-labelledby={`pillar-${p.id}`}>
                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-8">
                  <div className="flex flex-col lg:col-span-6">
                    <span className="label-mono text-muted">{p.number}</span>
                    <h3 id={`pillar-${p.id}`} className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                      {p.name}
                    </h3>
                    <p className="mt-4 text-base text-fg/75">{p.forWhom}</p>
                    <ul className="mt-6 flex flex-col border-t border-line">
                      {p.services.map((s) => (
                        <li key={s.href} className="border-b border-line">
                          <Link
                            prefetch={false}
                            href={s.href}
                            className="group flex items-center justify-between py-3 text-base transition-colors hover:text-signal"
                          >
                            {s.label}
                            <span aria-hidden="true" className="arrow">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      prefetch={false}
                      href={p.href}
                      className="group mt-6 inline-flex w-max items-center gap-3 font-mono text-sm uppercase tracking-[0.08em]"
                    >
                      Zobacz ofertę
                      <span aria-hidden="true" className="arrow">
                        →
                      </span>
                    </Link>
                  </div>
                  <div className="lg:col-span-6">
                    {i === 0 && <AiDiagram />}
                    {i === 1 && <AdsPanel />}
                    {i === 2 && <FloatingMockups items={[mock("enedeal"), mock("energynat"), mock("clearviewcar")]} />}
                    {i === 3 && <TrainingVisual />}
                  </div>
                </div>
              </article>
            ))}
            {open && (
              <div className="flex justify-end pt-10">
                <button
                  type="button"
                  onClick={() => close("down")}
                  className="group inline-flex h-12 items-center gap-3 rounded bg-fg px-6 text-base font-bold text-bg transition-colors hover:bg-signal hover:text-signal-ink"
                >
                  Dalej: realizacje
                  <span aria-hidden="true" className="arrow">
                    ↓
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 01 · diagram n8n-style ──────────────────────────────────────────────── */
function AiDiagram() {
  const nodes = [
    { id: "form", x: 60, y: 200, label: "Formularz" },
    { id: "ai", x: 300, y: 200, label: "Agent AI", hub: true },
    { id: "crm", x: 540, y: 90, label: "CRM" },
    { id: "mail", x: 540, y: 200, label: "E-mail" },
    { id: "inv", x: 540, y: 310, label: "Faktura" },
  ];
  const links = [
    "M 120 200 C 180 200, 200 200, 240 200",
    "M 360 200 C 430 200, 440 90, 480 90",
    "M 360 200 C 430 200, 440 200, 480 200",
    "M 360 200 C 430 200, 440 310, 480 310",
  ];
  return (
    <div className="visual">
      <Image
        src="/img/ai-network.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-cover opacity-30"
      />
      <svg viewBox="0 0 600 400" className="relative h-full w-full" aria-hidden="true">
        {links.map((d, i) => (
          <path
            key={i}
            d={d}
            data-draw
            fill="none"
            stroke="rgba(244,244,242,0.55)"
            strokeWidth="1.5"
          />
        ))}
        {nodes.map((n) => (
          <g key={n.id} data-node>
            <rect
              x={n.x - 60}
              y={n.y - 24}
              width="120"
              height="48"
              rx="4"
              fill="#0a0a0a"
              stroke={n.hub ? "#FFD500" : "rgba(244,244,242,0.4)"}
              strokeWidth={n.hub ? 1.5 : 1}
            />
            <text
              x={n.x}
              y={n.y + 5}
              textAnchor="middle"
              fontSize="14"
              fontFamily="var(--font-plex-mono)"
              fill={n.hub ? "#FFD500" : "#F4F4F2"}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="label-mono absolute bottom-4 left-4 text-muted">n8n · agent · integracje</p>
    </div>
  );
}

/* ── 02 · panel kampanii (przykład) ──────────────────────────────────────── */
function AdsPanel() {
  const bars = [22, 30, 28, 41, 46, 52, 61, 58, 70, 78, 84, 96];
  return (
    <div className="visual flex flex-col justify-between p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-mono text-muted">ROAS · przykładowy panel</p>
          <p className="mt-2 font-mono text-5xl leading-none text-signal lg:text-6xl">
            <span data-count="4.2" data-decimals="1" data-suffix="×">
              4,2×
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="label-mono text-muted">Leady / tydz.</p>
          <p className="mt-2 font-mono text-2xl leading-none">
            <span data-count="96" data-decimals="0" data-suffix="">
              96
            </span>
          </p>
        </div>
      </div>
      <div className="flex h-40 items-end gap-2 lg:h-48" aria-hidden="true">
        {bars.map((h, i) => (
          <span
            key={i}
            data-bar
            className={`flex-1 rounded-t ${i === bars.length - 1 ? "bg-fg" : "bg-fg/25"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="label-mono text-muted">Google Ads · Meta Ads · ChatGPT Ads · SEO/GEO</p>
    </div>
  );
}

/* ── 03 · pływające mockupy ──────────────────────────────────────────────── */
function FloatingMockups({ items }: { items: { slug: string; name: string; image: string }[] }) {
  const layout = ["left-0 top-6 w-[62%]", "right-0 top-[30%] w-[58%]", "left-[14%] bottom-2 w-[56%]"];
  return (
    <div className="visual">
      {items.map((it, i) => (
        <div
          key={it.slug}
          data-mock
          className={`absolute ${layout[i]} overflow-hidden rounded border border-line shadow-[0_30px_60px_rgba(0,0,0,0.6)]`}
        >
          <Image
            src={it.image}
            alt={`Mockup: ${it.name}`}
            width={1600}
            height={1000}
            sizes="(min-width: 1024px) 25vw, 60vw"
            className="h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}

/* ── 04 · szkolenia ──────────────────────────────────────────────────────── */
function TrainingVisual() {
  return (
    <div className="visual">
      <div data-photo className="absolute inset-0">
        <Image
          src="/img/training.webp"
          alt="Sala szkoleniowa Akademii Xperteo: uczestnicy przy laptopach"
          fill
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
        />
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
        <span data-badge className="rounded bg-signal px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] text-signal-ink">
          KFS / BUR · do 80% dofinansowania
        </span>
        <span className="label-mono text-fg/80">Akademia Xperteo</span>
      </div>
    </div>
  );
}
