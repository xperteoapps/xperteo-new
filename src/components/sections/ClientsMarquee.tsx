import { Marquee } from "@/components/ui/Marquee";
import { PROJECTS } from "@/content/site";

/**
 * S3 · Marquee klientów. Bez plików logo klientów — wordmarki tekstowe
 * (Space Grotesk 700), muted → fg na hover. Dwa rzędy w przeciwnych kierunkach.
 */
export function ClientsMarquee() {
  const names = PROJECTS.map((p) => p.name);
  const rowA = names;
  const rowB = [...names.slice(3), ...names.slice(0, 3)];

  return (
    <section id="s3" data-slug="klienci" aria-labelledby="s3-heading" className="border-b border-line py-14 lg:py-20">
      <span id="klienci" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <div className="container-site mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="s3-heading" className="label-mono text-muted">
          Zaufali nam
        </h2>
        <p className="label-mono text-muted">120+ projektów · cała Polska</p>
      </div>
      {/* Lista klientów w HTML dla SEO / bez JS; sam marquee jest aria-hidden. */}
      <ul className="sr-only">
        {PROJECTS.map((p) => (
          <li key={p.slug}>{p.name}</li>
        ))}
      </ul>
      <div className="flex flex-col gap-6">
        <Marquee direction="left" speed={34} gap="gap-16">
          {rowA.map((n) => (
            <span key={n} className="client-mark">
              {n}
            </span>
          ))}
        </Marquee>
        <Marquee direction="right" speed={28} gap="gap-16">
          {rowB.map((n) => (
            <span key={n} className="client-mark">
              {n}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
