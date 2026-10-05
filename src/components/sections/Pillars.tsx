"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { PILLARS, PROJECTS } from "@/content/site";
import { isDesktop, useGsap } from "@/hooks/useGsap";

const fmt = (n: number, d: number) =>
  n.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d });

/**
 * S4 · Cztery filary — sticky stacking cards (DESIGN.md §4 S4, salo.uk).
 * Układ i treść w CSS/HTML (sticky działa bez JS); GSAP dodaje: scale 0.95 +
 * przyciemnienie poprzedniej karty, numer aktywnej karty, wizuale.
 */
export function Pillars() {
  const host = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGsap(host, ({ gsap, ScrollTrigger }, el) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
    const desktop = isDesktop();

    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      });
      if (desktop) {
        const next = cards[i + 1];
        if (next) {
          gsap.to(card, {
            scale: 0.95,
            filter: "brightness(0.5)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top+=96", scrub: true },
          });
        }
      } else {
        gsap.from(card, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      }
    });

    // 01 · diagram rysowany stroke-dashoffset
    el.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    gsap.to("[data-draw]", {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: "power2.inOut",
      stagger: 0.14,
      scrollTrigger: { trigger: cards[0], start: "top 60%", once: true },
    });
    gsap.from("[data-node]", {
      scale: 0.7,
      opacity: 0,
      transformOrigin: "center",
      duration: 0.7,
      ease: "expo.out",
      stagger: 0.1,
      delay: 0.3,
      scrollTrigger: { trigger: cards[0], start: "top 60%", once: true },
    });

    // 02 · słupki + licznik
    gsap.from("[data-bar]", {
      scaleY: 0,
      transformOrigin: "bottom",
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.07,
      scrollTrigger: { trigger: cards[1], start: "top 60%", once: true },
    });
    el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
      const target = Number(node.dataset.count);
      const decimals = Number(node.dataset.decimals ?? 0);
      const suffix = node.dataset.suffix ?? "";
      const o = { n: 0 };
      gsap.to(o, {
        n: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => (node.textContent = fmt(o.n, decimals) + suffix),
        scrollTrigger: { trigger: cards[1], start: "top 60%", once: true },
      });
    });

    // 03 · mockupy z różnym parallaxem
    el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((m) => {
      gsap.to(m, {
        yPercent: Number(m.dataset.parallax),
        ease: "none",
        scrollTrigger: { trigger: cards[2], start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  });

  const mock = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;

  return (
    <section
      ref={host}
      id="s4"
      data-slug="co-robimy"
      aria-labelledby="s4-heading"
      className="border-b border-line"
    >
      <span id="co-robimy" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="container-site grid-12 gap-y-10 py-20 lg:py-28">
        {/* Lewa kolumna — sticky */}
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky" style={{ top: "calc(var(--nav-h) + 2rem)" }}>
            <p className="label-mono text-muted">S4 · Co robimy</p>
            <h2 id="s4-heading" className="mt-6 text-4xl font-bold tracking-tight lg:text-6xl">
              Cztery rzeczy.
              <br />
              Jedna firma.
            </h2>
            <p className="mt-6 max-w-[26rem] text-base leading-relaxed text-fg/75">
              Automatyzacje, marketing, software i szkolenia. Zamiast czterech dostawców,
              jeden kontakt i jedna odpowiedzialność za wynik.
            </p>
            <p className="mt-10 font-mono text-5xl leading-none lg:text-7xl" aria-live="polite">
              <span className="text-signal">{PILLARS[active].number}</span>
              <span className="text-fg/30"> / 04</span>
            </p>
          </div>
        </div>

        {/* Prawa kolumna — karty */}
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-8 lg:gap-0">
          {PILLARS.map((p, i) => (
            <article
              key={p.id}
              data-card
              className="pillar-card"
              style={{ zIndex: i + 1 }}
              aria-labelledby={`pillar-${p.id}`}
            >
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
                  {i === 2 && (
                    <FloatingMockups
                      items={[mock("enedeal"), mock("energynat"), mock("clearviewcar")]}
                    />
                  )}
                  {i === 3 && <TrainingVisual />}
                </div>
              </div>
            </article>
          ))}
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
  const layout = [
    { cls: "left-0 top-6 w-[62%]", p: -18 },
    { cls: "right-0 top-[30%] w-[58%]", p: -34 },
    { cls: "left-[14%] bottom-2 w-[56%]", p: -8 },
  ];
  return (
    <div className="visual">
      {items.map((it, i) => (
        <div
          key={it.slug}
          data-parallax={layout[i].p}
          className={`absolute ${layout[i].cls} overflow-hidden rounded border border-line shadow-[0_30px_60px_rgba(0,0,0,0.6)]`}
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
      <Image
        src="/img/training.webp"
        alt="Sala szkoleniowa Akademii Xperteo: uczestnicy przy laptopach"
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-cover"
      />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
        <span className="rounded bg-signal px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] text-signal-ink">
          KFS / BUR · do 80% dofinansowania
        </span>
        <span className="label-mono text-fg/80">Akademia Xperteo</span>
      </div>
    </div>
  );
}
