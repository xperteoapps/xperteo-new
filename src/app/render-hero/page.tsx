import { notFound } from "next/navigation";
import { HeroRender } from "./HeroRender";

/**
 * Narzędzie deweloperskie: pełnoekranowa scena hero z ręcznym zegarem
 * (window.__heroSetTime) do renderu klatek wideo przez Playwright + ffmpeg.
 * Dostępne tylko przy buildzie z HERO_RENDER=1 — w produkcji 404.
 */
export default function RenderHeroPage() {
  if (process.env.HERO_RENDER !== "1") notFound();
  return <HeroRender />;
}
