import { Hero } from "@/components/hero/Hero";
import { QuickFormSection } from "@/components/form/QuickFormSection";
import { ClientsMarquee } from "@/components/sections/ClientsMarquee";
import { Pillars } from "@/components/sections/Pillars";
import { CasesHorizontal } from "@/components/sections/CasesHorizontal";
import { Reviews } from "@/components/sections/Reviews";
import { Numbers } from "@/components/sections/Numbers";
import { Process } from "@/components/sections/Process";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * Strona główna — storyboard S1–S11 wg DESIGN.md §4 (S12 = Footer w layout).
 * Każda sekcja renderuje pełną treść w HTML (SSG); JS dodaje tylko ruch.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <QuickFormSection />
      <ClientsMarquee />
      <Pillars />
      <CasesHorizontal />
      <Reviews />
      <Numbers />
      <Process />
      <SkillsMarquee />
      <Faq />
      <FinalCta />
    </>
  );
}
