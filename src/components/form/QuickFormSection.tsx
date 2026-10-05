import { CONTACT } from "@/content/site";
import { QuickForm } from "./QuickForm";

const PROMISES = ["Bezpłatnie", "Bez zobowiązań", "Odpowiedź w 24 h"] as const;

/**
 * S2 · Formularz szybki (DESIGN.md §4 S2). Lewa kolumna sticky z nagłówkiem
 * i obietnicami, prawa — 3-krokowy formularz. Nagłówek i obietnice w HTML (SSG).
 */
export function QuickFormSection() {
  return (
    <section id="s2" data-slug="kontakt" aria-labelledby="s2-heading" className="border-b border-line">
      <span id="kontakt" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="container-site grid-12 gap-y-12 py-20 lg:py-32">
        <div
          className="col-span-12 self-start lg:sticky lg:col-span-5"
          style={{ top: "calc(var(--nav-h) + 4rem)" }}
        >
          <p className="label-mono text-muted">S2 · Kontakt</p>
          <h2 id="s2-heading" className="mt-6 text-4xl font-bold tracking-tight lg:text-6xl">
            Opowiedz nam o&nbsp;projekcie.
            <br />
            <span className="text-muted">2 minuty.</span>
          </h2>
          <ul className="mt-8 flex flex-col gap-3 font-mono text-sm">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-5 bg-fg/40" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-muted">
            Wolisz porozmawiać?{" "}
            <a href={CONTACT.phoneHref} className="font-mono text-fg underline-offset-4 hover:underline">
              {CONTACT.phone}
            </a>{" "}
            lub{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-mono text-fg underline-offset-4 hover:underline">
              {CONTACT.email}
            </a>
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <QuickForm />
        </div>
      </div>
    </section>
  );
}
