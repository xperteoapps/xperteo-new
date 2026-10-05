"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScroll";
import { PILLARS, PROJECTS } from "@/content/site";
import { isDesktop, useGsap } from "@/hooks/useGsap";

const fmt = (n: number, d: number) =>
  n.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d });

const N = PILLARS.length;

type Scroller = { toIndex: (i: number) => void };

/**
 * S4 · Cztery filary — „wybór postaci”: sekcja przypięta, scroll przesuwa karty
 * na boki (aktywna w centrum, sąsiednie wystają z boków, mniejsze i przygaszone),
 * snap karta po karcie, nawigacja 01–04 + strzałki. Mobile / bez JS: poziomy
 * carousel ze scroll-snap (ta sama treść w HTML).
 */
export function Pillars() {
  const host = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState(false);
  const scroller = useRef<Scroller | null>(null);

  useGsap(
    host,
    ({ gsap, ScrollTrigger }, el) => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);

      /* ── timeline wizuali per karta (odtwarzane przy aktywacji) ── */
      const visuals = cards.map((card, i) => {
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
          tl.from(card.querySelectorAll("[data-bar]"), {
            scaleY: 0,
            transformOrigin: "bottom",
            duration: 1,
            ease: "expo.out",
            stagger: 0.06,
          });
          card.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
            const target = Number(node.dataset.count);
            const decimals = Number(node.dataset.decimals ?? 0);
            const suffix = node.dataset.suffix ?? "";
            const o = { n: 0 };
            tl.to(
              o,
              { n: target, duration: 1.4, ease: "power3.out", onUpdate: () => (node.textContent = fmt(o.n, decimals) + suffix) },
              0,
            );
          });
        }
        if (i === 2) {
          const mocks = card.querySelectorAll<HTMLElement>("[data-mock]");
          tl.from(mocks, { y: 60, opacity: 0, rotate: -2, duration: 1, ease: "expo.out", stagger: 0.12 });
          mocks.forEach((m, k) =>
            gsap.to(m, { y: k % 2 ? -10 : 10, duration: 3 + k * 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 }),
          );
        }
        if (i === 3) {
          tl.from(card.querySelector("[data-photo]"), { scale: 1.12, duration: 1.4, ease: "expo.out" }).from(
            card.querySelector("[data-badge]"),
            { y: 16, opacity: 0, duration: 0.6, ease: "expo.out" },
            0.4,
          );
        }
        return tl;
      });
      const played = new Set<number>();
      const play = (i: number) => {
        if (played.has(i)) return;
        played.add(i);
        visuals[i]?.play();
      };

      /* ── mobile / wąski ekran: carousel, wizuale po wejściu karty ── */
      if (!isDesktop()) {
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) {
                const i = cards.indexOf(e.target as HTMLElement);
                play(i);
                setActive(i);
              }
            }),
          { root: track.current, threshold: 0.6 },
        );
        cards.forEach((c) => io.observe(c));
        return () => io.disconnect();
      }

      /* ── desktop: stage + pin + snap ── */
      setStage(true);
      el.classList.add("is-stage");

      const layout = () => {
        const w = cards[0].offsetWidth;
        return { offset: w * 0.82 };
      };
      let L = layout();

      const render = (p: number) => {
        cards.forEach((card, i) => {
          const d = i - p; // 0 = centrum
          const a = Math.min(Math.abs(d), 2.2);
          if (a < 1.3) play(i); // karta w polu widzenia (także z boku) ma odtworzone wizuale
          gsap.set(card, {
            x: d * L.offset,
            scale: 1 - 0.16 * Math.min(a, 1) - 0.04 * Math.max(a - 1, 0),
            rotationY: -d * 10,
            opacity: 1 - 0.5 * Math.min(a, 1) - 0.5 * Math.max(a - 1, 0),
            zIndex: 10 - Math.round(a * 2),
            transformPerspective: 1600,
          });
        });
      };

      let lastIdx = -1;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top+=72",
        end: () => `+=${(N - 1) * window.innerHeight * 0.85}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (N - 1), duration: { min: 0.3, max: 0.7 }, ease: "power2.inOut", delay: 0.05 },
        onRefresh: () => {
          L = layout();
        },
        onUpdate: (self) => {
          const p = self.progress * (N - 1);
          render(p);
          const idx = Math.round(p);
          if (idx !== lastIdx) {
            lastIdx = idx;
            setActive(idx);
            play(idx);
          }
        },
      });
      render(0);
      play(0);

      scroller.current = {
        toIndex: (i) => {
          const y = st.start + ((st.end - st.start) * i) / (N - 1);
          if (lenis) lenis.scrollTo(y, { duration: 1.1 });
          else window.scrollTo({ top: y, behavior: "smooth" });
        },
      };

      return () => {
        scroller.current = null;
        el.classList.remove("is-stage");
        setStage(false);
        visuals.forEach((t) => t.kill());
      };
    },
    [lenis],
  );

  const goTo = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(N - 1, i));
      if (scroller.current) scroller.current.toIndex(idx);
      else {
        const card = track.current?.querySelectorAll<HTMLElement>("[data-card]")[idx];
        card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    },
    [],
  );

  // Strzałki klawiatury, gdy sekcja jest w widoku (desktop stage)
  useEffect(() => {
    if (!stage) return;
    const onKey = (e: KeyboardEvent) => {
      const r = host.current?.getBoundingClientRect();
      if (!r || r.top > 10 || r.bottom < window.innerHeight * 0.5) return;
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, active, goTo]);

  const mock = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;

  return (
    <section
      ref={host}
      id="s4"
      data-slug="co-robimy"
      aria-labelledby="s4-heading"
      className="select border-b border-line"
    >
      <span id="co-robimy" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="select-inner">
        {/* Nagłówek */}
        <div className="container-site flex flex-wrap items-end justify-between gap-6 pt-14 lg:pt-8">
          <div>
            <p className="label-mono text-muted">S4 · Co robimy</p>
            <h2 id="s4-heading" className="mt-3 text-4xl font-bold tracking-tight lg:text-5xl">
              Cztery rzeczy. Jedna firma.
            </h2>
          </div>
          <p className="font-mono text-4xl leading-none lg:text-6xl" aria-live="polite">
            <span className="text-signal">{PILLARS[active].number}</span>
            <span className="text-fg/30"> / 04</span>
          </p>
        </div>

        {/* Scena / carousel */}
        <div ref={track} className="select-track" aria-label="Filary oferty">
          {PILLARS.map((p, i) => (
            <article
              key={p.id}
              data-card
              className="select-card"
              aria-labelledby={`pillar-${p.id}`}
              aria-current={stage && i === active ? "true" : undefined}
              onClick={() => stage && i !== active && goTo(i)}
            >
              <div className="flex h-full flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="flex min-h-0 flex-col lg:col-span-6">
                  <span className="label-mono text-muted">{p.number}</span>
                  <h3 id={`pillar-${p.id}`} className="mt-3 text-2xl font-bold tracking-tight lg:text-[2.1rem] lg:leading-[1.05]">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-base text-fg/75">{p.forWhom}</p>
                  <ul className="mt-5 flex flex-col border-t border-line">
                    {p.services.map((s) => (
                      <li key={s.href} className="border-b border-line">
                        <Link
                          prefetch={false}
                          href={s.href}
                          className="group flex items-center justify-between py-2.5 text-base transition-colors hover:text-signal"
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
                    className="group mt-5 inline-flex w-max items-center gap-3 font-mono text-sm uppercase tracking-[0.08em]"
                  >
                    Zobacz ofertę
                    <span aria-hidden="true" className="arrow">
                      →
                    </span>
                  </Link>
                </div>
                <div className="min-h-0 lg:col-span-6">
                  {i === 0 && <AiDiagram />}
                  {i === 1 && <AdsPanel />}
                  {i === 2 && <FloatingMockups items={[mock("enedeal"), mock("energynat"), mock("clearviewcar")]} />}
                  {i === 3 && <TrainingVisual />}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Nawigacja */}
        <div className="container-site flex items-center justify-between gap-4 pb-8 pt-6 lg:pb-6">
          <ol className="flex flex-wrap gap-x-6 gap-y-2">
            {PILLARS.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "true" : undefined}
                  className={`group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors ${
                    i === active ? "text-signal" : "text-muted hover:text-fg"
                  }`}
                >
                  <span>{p.number}</span>
                  <span className="hidden md:inline">{p.short}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Poprzedni filar"
              className="flex h-11 w-11 items-center justify-center rounded border border-line transition-colors hover:border-fg disabled:opacity-30"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === N - 1}
              aria-label="Następny filar"
              className="flex h-11 w-11 items-center justify-center rounded border border-line transition-colors hover:border-fg disabled:opacity-30"
            >
              →
            </button>
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
      <Image src="/img/ai-network.webp" alt="" fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover opacity-30" />
      <svg viewBox="0 0 600 400" className="relative h-full w-full" aria-hidden="true">
        {links.map((d, i) => (
          <path key={i} d={d} data-draw fill="none" stroke="rgba(244,244,242,0.55)" strokeWidth="1.5" />
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
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontFamily="var(--font-plex-mono)" fill={n.hub ? "#FFD500" : "#F4F4F2"}>
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
      <div className="flex h-32 items-end gap-2 lg:h-40" aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} data-bar className={`flex-1 rounded-t ${i === bars.length - 1 ? "bg-fg" : "bg-fg/25"}`} style={{ height: `${h}%` }} />
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
          <Image src={it.image} alt={`Mockup: ${it.name}`} width={1600} height={1000} sizes="(min-width: 1024px) 20vw, 60vw" className="h-auto w-full" />
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
          sizes="(min-width: 1024px) 30vw, 90vw"
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
