import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CONTACT, NAV_LINKS, PILLARS, SITE } from "@/content/site";

/**
 * S12 · Footer (DESIGN.md §4). Szkielet z P0: tagline, 4 kolumny usług, stopka.
 * Kopiowanie e-maila na klik, social i dane rejestrowe — P6.
 */
export function Footer() {
  return (
    <footer id="s12" className="border-t border-line bg-bg">
      <div className="container-site py-16 lg:py-24">
        <div className="grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight lg:text-5xl">
              Dobre pomysły zaczynają się od cześć.
            </h2>
            <Link
              prefetch={false}
              href="/#kontakt"
              className="mt-8 inline-flex rounded bg-signal px-5 py-3.5 text-base font-bold text-signal-ink"
            >
              Bezpłatna konsultacja
            </Link>
          </div>

          <nav
            aria-label="Usługi"
            className="col-span-12 grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-4 lg:gap-6"
          >
            {PILLARS.map((p) => (
              <div key={p.id} className="flex flex-col gap-3">
                <Link
              prefetch={false}
                  href={p.href}
                  className="flex flex-col gap-1 transition-colors hover:text-signal"
                >
                  <span className="label-mono text-muted">{p.number}</span>
                  <span className="text-sm font-bold leading-snug">
                    {p.short}
                  </span>
                </Link>
                <ul className="flex flex-col gap-2">
                  {p.services.map((s) => (
                    <li key={s.href}>
                      <Link
              prefetch={false}
                        href={s.href}
                        className="text-sm text-muted transition-colors hover:text-fg"
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Logo className="text-base" />
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
              prefetch={false}
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="label-mono text-muted">
            © 2026 {SITE.name} · {SITE.domain} · Cała Polska, zdalnie
          </p>
        </div>
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted/70">
          Dane rejestrowe: {SITE.name}, {CONTACT.address}
        </p>
      </div>
    </footer>
  );
}
