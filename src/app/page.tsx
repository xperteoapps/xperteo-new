import { SECTIONS } from "@/content/site";

/**
 * Strona główna — szkielet S1–S11 wg DESIGN.md §4 (S12 = Footer w layout).
 * Każda sekcja to <section id> z nagłówkiem w HTML (SSG). Treść właściwa
 * powstaje w P1–P7, sekcja po sekcji.
 */
export default function Home() {
  return (
    <>
      {SECTIONS.map((s, i) => {
        const Heading = i === 0 ? "h1" : "h2";
        return (
          <section
            key={s.id}
            id={s.id}
            data-slug={s.slug}
            aria-labelledby={`${s.id}-heading`}
            className="border-b border-line"
          >
            {/* Kotwica dla linków /#kontakt itp. */}
            <span id={s.slug} className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
            <div className="container-site flex min-h-[40vh] flex-col justify-between py-10 lg:min-h-[50vh] lg:py-14">
              <p className="label-mono text-muted">
                {s.id.toUpperCase()} · {s.label}
              </p>
              <Heading
                id={`${s.id}-heading`}
                className="mt-10 text-3xl font-bold tracking-tight text-fg/40 lg:text-5xl"
              >
                {s.label}
              </Heading>
            </div>
          </section>
        );
      })}
    </>
  );
}
