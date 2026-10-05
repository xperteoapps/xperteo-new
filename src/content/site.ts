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

/* ── Realizacje (S5) — prawdziwi klienci; wyniki liczbowe TYLKO po dostarczeniu danych. ── */
export type Project = {
  slug: string;
  name: string;
  url: string;
  industry: string;
  /** Co zrobiliśmy — typ realizacji (prawdziwe, z realizacji). */
  type: string;
  pillar: Pillar["id"];
  tags: string[];
  image: string;
  video?: { mp4: string; webm: string; poster: string };
  /** Jedna liczba wyniku, np. "+144% zapytań". Brak = nie pokazujemy liczby. */
  result?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "energynat",
    name: "Energynat Solutions",
    url: "https://energynat.solutions",
    industry: "Energetyka · OZE",
    type: "Strona www B2B",
    pillar: "software",
    tags: ["Strona www", "Lead gen", "SEO"],
    image: "/img/cases/energynat.webp",
    video: {
      mp4: "/video/cases/energynat.mp4",
      webm: "/video/cases/energynat.webm",
      poster: "/video/cases/energynat-poster.jpg",
    },
  },
  {
    slug: "funduszeszkoleniowe",
    name: "Fundusze Szkoleniowe",
    url: "https://funduszeszkoleniowe.pl",
    industry: "Szkolenia · Dofinansowania",
    type: "Portal z wyszukiwarką naborów",
    pillar: "software",
    tags: ["Platforma", "Wyszukiwarka", "Automatyzacja danych"],
    image: "/img/cases/funduszeszkoleniowe.webp",
    video: {
      mp4: "/video/cases/funduszeszkoleniowe.mp4",
      webm: "/video/cases/funduszeszkoleniowe.webm",
      poster: "/video/cases/funduszeszkoleniowe-poster.jpg",
    },
  },
  {
    slug: "enedeal",
    name: "Enedeal Shop",
    url: "https://shop.enedeal.com",
    industry: "E-commerce · Komponenty OZE",
    type: "Sklep B2B",
    pillar: "software",
    tags: ["E-commerce B2B", "Katalog produktów", "Konta firmowe"],
    image: "/img/cases/enedeal.webp",
  },
  {
    slug: "303",
    name: "303",
    url: "https://303.pl",
    industry: "Produkcja · Odzież dla firm",
    type: "Strona www",
    pillar: "software",
    tags: ["Strona www", "Realizacje", "Konfigurator zapytań"],
    image: "/img/cases/303.webp",
  },
  {
    slug: "clearviewcar",
    name: "ClearView Car",
    url: "https://clearviewcar.pl",
    industry: "Produkt D2C · Motoryzacja",
    type: "Landing sprzedażowy",
    pillar: "marketing",
    tags: ["Landing page", "Sprzedaż online", "Kampanie"],
    image: "/img/cases/clearviewcar.webp",
  },
  {
    slug: "mrgroszek",
    name: "MrGroszek.pl",
    url: "https://mrgroszek.pl",
    industry: "Handel · Opał",
    type: "Strona sprzedażowa z zamówieniami",
    pillar: "marketing",
    tags: ["Strona www", "Zamówienia", "Google Ads"],
    image: "/img/cases/mrgroszek.webp",
  },
];

/* ── Opinie (S6) — wyłącznie prawdziwe opinie Google. Pusta lista = pusty stan komponentu. ── */
export type Review = {
  id: string;
  author: string;
  company?: string;
  role?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  avatar?: string;
};

/** Dane zbiorcze z DESIGN.md §4 S6 (wizytówka Google). */
export const REVIEWS_META = {
  count: 24,
  rating: 5.0,
  googleUrl: "https://www.google.com/maps/search/Xperteo",
} as const;

export const REVIEWS: Review[] = [];

/* ── Liczby (S7) — tylko wartości potwierdzone w DESIGN.md. ── */
export const NUMBERS = [
  { value: 120, suffix: "+", label: "zrealizowanych projektów", decimals: 0 },
  { value: 5, suffix: "", label: "ocena w Google", decimals: 1 },
  { value: 24, suffix: "", label: "opinii, wszystkie 5 gwiazdek", decimals: 0 },
  { value: 24, suffix: " h", label: "maksymalny czas odpowiedzi", decimals: 0 },
] as const;

/* ── Proces (S8) ── */
export const PROCESS = [
  { step: "01", title: "Rozmowa 30 min", text: "Mówisz, co boli. My pytamy o liczby: ile leadów, ile godzin, ile zamówień." },
  { step: "02", title: "Oferta A/B/C w 48 h", text: "Trzy warianty zakresu i ceny. Wybierasz, co ma sens, bez „wyceny na żądanie”." },
  { step: "03", title: "Sprinty 2-tygodniowe", text: "Co 2 tygodnie widzisz działający efekt, nie prezentację. Zmiany wrzucamy od razu." },
  { step: "04", title: "Opieka", text: "Po wdrożeniu nie znikamy: monitoring, poprawki, rozwój o kolejne automatyzacje." },
] as const;

/* ── Kompetencje (S9) ── */
export const SKILLS_ROW_1 = [
  "AI agents", "n8n", "Claude", "OpenAI", "Next.js", "React", "Lovable", "Supabase",
  "Sanity", "Vercel", "TypeScript", "Python",
] as const;
export const SKILLS_ROW_2 = [
  "Google Ads", "Meta Ads", "ChatGPT Ads", "SEO", "GEO", "Shopify", "PrestaShop",
  "WordPress", "WooCommerce", "Allegro", "Ceneo", "GA4",
] as const;

/* ── FAQ (S10) ── */
export const FAQ = [
  {
    q: "Ile kosztuje strona www?",
    a: "Zależy od zakresu: strona firmowa to inna skala niż sklep B2B z integracjami. Po 30-minutowej rozmowie dostajesz w 48 h ofertę w trzech wariantach A/B/C z konkretną ceną i terminem.",
  },
  {
    q: "Ile kosztuje automatyzacja z AI?",
    a: "Liczymy ją od procesu, nie od godzin. Najpierw mierzymy, ile czasu dziś zjada ręczna praca, potem wyceniamy wdrożenie i utrzymanie. Pierwszy proces zwykle startuje w jednym sprincie, czyli w 2 tygodnie.",
  },
  {
    q: "Jak długo trwa realizacja?",
    a: "Pracujemy w sprintach 2-tygodniowych. Landing lub pierwsza automatyzacja: 1 sprint. Strona firmowa: 2–3 sprinty. Sklep B2B lub aplikacja: od 4 sprintów. Dokładny harmonogram jest w ofercie.",
  },
  {
    q: "Czy szkolenia można dofinansować z KFS lub BUR?",
    a: "Tak. Akademia Xperteo prowadzi szkolenia z AI, automatyzacji i marketingu AI, które kwalifikują się do dofinansowania KFS i BUR do 80%. Pomagamy przygotować wniosek.",
  },
  {
    q: "Czy muszę mieć gotowe treści i zdjęcia?",
    a: "Nie. Teksty piszemy na podstawie rozmowy z Tobą, grafiki i wizualizacje przygotowujemy sami. Jeśli masz własne materiały, wykorzystamy je.",
  },
  {
    q: "Czy mogę zacząć od jednej usługi?",
    a: "Tak, większość klientów zaczyna od jednej rzeczy: strony, kampanii albo jednej automatyzacji. Kolejne dokładamy, gdy pierwsza przynosi wynik.",
  },
  {
    q: "Jak wygląda start współpracy?",
    a: "Wypełniasz formularz (2 minuty) albo dzwonisz. W ciągu 24 h umawiamy 30-minutową rozmowę. Po niej w 48 h masz ofertę. Po akceptacji ruszamy od pierwszego sprintu.",
  },
  {
    q: "Czy pracujecie zdalnie?",
    a: "Tak, obsługujemy firmy z całej Polski zdalnie. Spotkania online, dostęp do postępów na bieżąco, kontakt przez jeden kanał.",
  },
  {
    q: "Co z utrzymaniem po wdrożeniu?",
    a: "Każde wdrożenie ma opcję opieki: monitoring, aktualizacje, poprawki i rozwój. Zakres i cena są w ofercie, bez ukrytych kosztów.",
  },
  {
    q: "Czy robicie integracje z Allegro i Ceneo?",
    a: "Tak. Integrujemy sklepy z Allegro, Ceneo i systemami magazynowo-księgowymi, a procesy obsługi zamówień automatyzujemy w n8n.",
  },
] as const;

export const WHATSAPP_URL = "https://wa.me/48453288709";
