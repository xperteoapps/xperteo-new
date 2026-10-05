/** Współdzielony postęp scrolla hero (0–1), zapisywany przez ScrollTrigger w Hero,
 *  czytany w pętli renderowania sceny R3F. Mutowalny obiekt, bez re-renderów. */
export const heroScroll = { p: 0 };

export const HERO_WORDS = [
  "AI dla MŚP",
  "Google Ads",
  "sklepy B2B",
  "aplikacje",
  "szkolenia",
] as const;
