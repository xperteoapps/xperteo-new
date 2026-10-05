/** Dane strukturalne strony — źródło: DESIGN.md §0. */

export const SITE = {
  name: "Xperteo",
  domain: "xperteo.pl",
  url: "https://xperteo.pl",
  tagline:
    "Automatyzacje AI, marketing, software i szkolenia dla MŚP. Wszystko z jednej ręki, w całej Polsce.",
  description:
    "Automatyzacje AI, marketing, software i szkolenia dla MŚP. Jedna firma, jeden kontakt, mierzalne wyniki. Cała Polska, zdalnie.",
} as const;

export type Pillar = {
  id: "ai" | "marketing" | "software" | "szkolenia";
  number: "01" | "02" | "03" | "04";
  name: string;
  short: string;
  href: string;
  forWhom: string;
  services: { label: string; href: string }[];
};

/** Cztery filary — zawsze w tej kolejności. */
export const PILLARS: Pillar[] = [
  {
    id: "ai",
    number: "01",
    name: "Automatyzacje i wdrażanie AI",
    short: "Automatyzacje i AI",
    href: "/automatyzacje-ai",
    forWhom: "MŚP, które toną w powtarzalnej robocie.",
    services: [
      { label: "Agenci AI", href: "/automatyzacje-ai#agenci-ai" },
      { label: "Automatyzacje n8n", href: "/automatyzacje-ai#n8n" },
      {
        label: "Obsługa klienta, leady, dokumenty",
        href: "/automatyzacje-ai#obsluga",
      },
      { label: "Integracje CRM / ERP", href: "/automatyzacje-ai#integracje" },
    ],
  },
  {
    id: "marketing",
    number: "02",
    name: "Marketing",
    short: "Marketing",
    href: "/marketing",
    forWhom: "Firmy, które chcą mierzalnych leadów.",
    services: [
      { label: "Google Ads", href: "/marketing#google-ads" },
      { label: "Meta Ads", href: "/marketing#meta-ads" },
      { label: "ChatGPT Ads", href: "/marketing#chatgpt-ads" },
      { label: "SEO / GEO", href: "/marketing#seo-geo" },
    ],
  },
  {
    id: "software",
    number: "03",
    name: "Software house",
    short: "Software",
    href: "/software",
    forWhom: "Firmy, które potrzebują własnego narzędzia.",
    services: [
      { label: "Strony www", href: "/software#strony" },
      { label: "E-commerce B2B / B2C", href: "/software#e-commerce" },
      { label: "Aplikacje", href: "/software#aplikacje" },
      { label: "Platformy SaaS", href: "/software#saas" },
    ],
  },
  {
    id: "szkolenia",
    number: "04",
    name: "Szkolenia — Akademia Xperteo",
    short: "Szkolenia",
    href: "/akademia",
    forWhom: "Zespoły, które chcą to robić same.",
    services: [
      { label: "AI w firmie", href: "/akademia#ai-w-firmie" },
      { label: "Automatyzacje", href: "/akademia#automatyzacje" },
      { label: "Marketing AI", href: "/akademia#marketing-ai" },
      { label: "Dofinansowanie KFS / BUR", href: "/akademia#kfs-bur" },
    ],
  },
];

/** Dane kontaktowe i rejestrowe — ze strony xperteo.pl (2026-10-04). Adres tylko w stopce. */
export const CONTACT = {
  email: "hello@xperteo.pl",
  phone: "+48 453 288 709",
  phoneHref: "tel:+48453288709",
  address: "ul. Skarbowców 23A/B, lok. B2/117, 53-025 Wrocław",
} as const;

export const NAV_LINKS = [
  { label: "Realizacje", href: "/realizacje" },
  { label: "Opinie", href: "/opinie" },
  { label: "Kontakt", href: "/#kontakt" },
] as const;

/** Storyboard scrolla — DESIGN.md §4. Kolejność sekcji strony głównej. */
export const SECTIONS = [
  { id: "s1", slug: "hero", label: "Hero" },
  { id: "s2", slug: "kontakt", label: "Formularz szybki" },
  { id: "s3", slug: "klienci", label: "Marquee klientów" },
  { id: "s4", slug: "co-robimy", label: "Cztery filary" },
  { id: "s5", slug: "realizacje", label: "Realizacje" },
  { id: "s6", slug: "opinie", label: "Opinie Google" },
  { id: "s7", slug: "liczby", label: "Liczby" },
  { id: "s8", slug: "jak-pracujemy", label: "Jak pracujemy" },
  { id: "s9", slug: "kompetencje", label: "Marquee kompetencji" },
  { id: "s10", slug: "faq", label: "FAQ" },
  { id: "s11", slug: "cta", label: "Finalne CTA" },
] as const;
