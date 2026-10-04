"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { NAV_LINKS, PILLARS } from "@/content/site";

/**
 * Nawigacja z mega-menu (4 kolumny = 4 filary, DESIGN.md §1 wibify / §6 P0).
 * Cała treść menu jest w HTML (SSR) — JS tylko przełącza widoczność.
 */
export function Nav() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaId = useId();
  const mobileId = useId();
  const closeTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const openMega = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);
  const closeMegaSoon = useCallback(() => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 120);
  }, []);

  // Esc zamyka, klik poza zamyka, blokada scrolla przy mobile menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", mobileOpen);
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-[2px]"
      style={{ height: "var(--nav-h)" }}
    >
      <div className="container-site flex h-full items-center justify-between">
        <Logo />

        {/* Desktop */}
        <nav aria-label="Główna" className="hidden items-center gap-8 lg:flex">
          <div
            className="relative"
            onMouseEnter={openMega}
            onMouseLeave={closeMegaSoon}
          >
            <button
              type="button"
              aria-expanded={megaOpen}
              aria-controls={megaId}
              onClick={() => setMegaOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-fg/90 transition-colors hover:text-fg"
            >
              Usługi
              <svg
                aria-hidden="true"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className={`transition-transform duration-300 ease-expo ${megaOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M1 3l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
          {NAV_LINKS.map((l) => (
            <Link
              prefetch={false}
              key={l.href}
              href={l.href}
              className="py-2 text-sm font-medium text-fg/90 transition-colors hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
              prefetch={false}
            href="/#kontakt"
            className="hidden rounded bg-fg px-4 py-2.5 text-sm font-bold text-bg transition-colors hover:bg-signal hover:text-signal-ink lg:inline-flex"
          >
            Bezpłatna konsultacja
          </Link>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-line lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-fg transition-transform duration-300 ease-expo ${mobileOpen ? "translate-y-[5.5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-fg transition-transform duration-300 ease-expo ${mobileOpen ? "-translate-y-[5.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mega-menu — 4 kolumny */}
      <div
        id={megaId}
        onMouseEnter={openMega}
        onMouseLeave={closeMegaSoon}
        className={`absolute inset-x-0 top-full hidden border-b border-line bg-bg lg:block ${
          megaOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        } transition-[opacity,transform,visibility] duration-500 ease-expo`}
      >
        <div className="container-site grid grid-cols-4 gap-6 py-10">
          {PILLARS.map((p) => (
            <div key={p.id} className="flex flex-col gap-4">
              <Link
              prefetch={false}
                href={p.href}
                onClick={() => setMegaOpen(false)}
                className="group flex flex-col gap-2"
              >
                <span className="label-mono text-muted">{p.number}</span>
                <span className="text-lg font-bold leading-tight tracking-tight transition-colors group-hover:text-signal">
                  {p.name}
                </span>
                <span className="text-sm text-muted">{p.forWhom}</span>
              </Link>
              <ul className="flex flex-col gap-2 border-t border-line pt-4">
                {p.services.map((s) => (
                  <li key={s.href}>
                    <Link
              prefetch={false}
                      href={s.href}
                      onClick={() => setMegaOpen(false)}
                      className="text-sm text-fg/80 transition-colors hover:text-fg"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div
        id={mobileId}
        className={`fixed inset-x-0 bottom-0 top-[var(--nav-h)] overflow-y-auto bg-bg lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        } transition-[opacity,visibility] duration-300 ease-expo`}
      >
        <nav aria-label="Mobilna" className="container-site flex flex-col py-6">
          <span className="label-mono mb-4 text-muted">Usługi</span>
          <ul className="flex flex-col">
            {PILLARS.map((p) => (
              <li key={p.id} className="border-t border-line">
                <Link
              prefetch={false}
                  href={p.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline gap-4 py-4"
                >
                  <span className="label-mono text-muted">{p.number}</span>
                  <span className="text-xl font-bold tracking-tight">
                    {p.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-8 flex flex-col">
            {NAV_LINKS.map((l) => (
              <li key={l.href} className="border-t border-line">
                <Link
              prefetch={false}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 text-xl font-bold tracking-tight"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
              prefetch={false}
            href="/#kontakt"
            onClick={() => setMobileOpen(false)}
            className="mt-8 inline-flex justify-center rounded bg-signal px-5 py-3.5 text-base font-bold text-signal-ink"
          >
            Bezpłatna konsultacja
          </Link>
        </nav>
      </div>
    </header>
  );
}
