import { Marquee } from "@/components/ui/Marquee";
import { SKILLS_ROW_1, SKILLS_ROW_2 } from "@/content/site";

/** S9 · Marquee kompetencji — dwa rzędy jak fplus, w przeciwnych kierunkach. */
export function SkillsMarquee() {
  return (
    <section id="s9" data-slug="kompetencje" aria-labelledby="s9-heading" className="border-b border-line py-12 lg:py-16">
      <span id="kompetencje" className="block" style={{ scrollMarginTop: "var(--nav-h)" }} />
      <h2 id="s9-heading" className="sr-only">
        Kompetencje i narzędzia
      </h2>
      <ul className="sr-only">
        {[...SKILLS_ROW_1, ...SKILLS_ROW_2].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="flex flex-col gap-4">
        <Marquee direction="left" speed={50} gap="gap-10">
          {SKILLS_ROW_1.map((s) => (
            <span key={s} className="skill-mark">
              {s}
              <span className="skill-dot" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
        <Marquee direction="right" speed={44} gap="gap-10">
          {SKILLS_ROW_2.map((s) => (
            <span key={s} className="skill-mark skill-mark-outline">
              {s}
              <span className="skill-dot" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
