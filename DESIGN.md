# xperteo.pl — DESIGN.md (brief dla Claude Code)

> Ten plik jest źródłem prawdy. Przy każdym prompcie: "Przeczytaj DESIGN.md i trzymaj się go."
> Cel: najlepsza strona agencji web/AI w Polsce — konkretna w przekazie (jak wibify.de), z efektem wow w ruchu (jak fplus.ai / salo.uk / 1367studio.com / jesperlandberg.com).

---

## 0. Pozycjonowanie i przekaz (JEDNO zdanie)

**Xperteo — automatyzacje AI, marketing, software i szkolenia dla MŚP. Wszystko z jednej ręki, w całej Polsce.**

Zasięg: **ogólnopolski, praca zdalna.** Nie pozycjonujemy się na Wrocław ani żadne miasto — żadnego "z Wrocławia", "agencja Wrocław", lokalnych fraz SEO ani miasta w hero/pasku. Adres może pojawić się wyłącznie w stopce przy danych rejestrowych.

Cztery filary (w tej kolejności, zawsze):

| # | Filar | Co dokładnie | Dla kogo |
|---|-------|--------------|----------|
| 01 | **Automatyzacje i wdrażanie AI** | agenci AI, n8n, automatyzacja obsługi/leadów/dokumentów, integracje z CRM/ERP | MŚP, które toną w powtarzalnej robocie |
| 02 | **Marketing** | Google Ads, Meta Ads, ChatGPT Ads, SEO/GEO | firmy, które chcą mierzalnych leadów |
| 03 | **Software house** | strony www, e-commerce (B2B/B2C), aplikacje, platformy SaaS | firmy, które potrzebują własnego narzędzia |
| 04 | **Szkolenia — Akademia Xperteo** | AI w firmie, automatyzacje, marketing AI; dofinansowanie KFS/BUR | zespoły, które chcą to robić same |

Ton copy: **po polsku, konkretnie, bez korpo-bełkotu.** Krótkie zdania. Czasowniki. Liczby. Zero "innowacyjnych rozwiązań szytych na miarę".

### Social proof — niepodważalny priorytet

Strona ma przekonywać dowodami, nie obietnicami. Trzy elementy są **obowiązkowe na stronie głównej** i mają swoje podstrony:

1. **Opinie klientów** (`/opinie`) — prawdziwe opinie Google z imieniem, firmą i zdjęciem/awatarem; liczba opinii i ocena widoczne w hero (stats), w sekcji S6 i w finalnym CTA. Link "Zobacz w Google" prowadzi do wizytówki. Nigdy nie wymyślaj opinii — jeśli nie masz danych, zostaw komponent z danymi z Sanity i pustym stanem.
2. **Portfolio / realizacje** (`/realizacje`) — siatka wszystkich projektów z filtrem po filarze (AI / Marketing / Software / Szkolenia) i branży; każda karta: wizual z Higgsfield, nazwa, branża, 1 liczba wyniku, tagi technologii.
3. **Case studies** (`/realizacje/<slug>`) — dla 5–6 flagowych projektów pełna podstrona: problem → co zrobiliśmy → wynik w liczbach → cytat klienta → stack → galeria/wideo. Struktura jak salo.uk (jedna liczba w nagłówku) + 1367 (wideo z realizacji zamiast screena).

Dane do opinii i realizacji trzymamy w Sanity (schematy `review`, `project`, `caseStudy`). Na start wypełniam je ja — Claude Code buduje komponenty i schematy, nie treść.

---

## 1. Referencje — co dokładnie bierzemy z każdej

### Przekaz i kolorystyka

**wibify.de** → *struktura strony i copy*
- Hero: jedno zdanie "Wzrost przez [rotujące słowo]" + sub z linkami do każdej usługi + 2 CTA ("Bezpłatna konsultacja" / "Zobacz projekty") + 3 liczby zaufania pod spodem.
- Formularz 3-krokowy TUŻ POD hero (kontakt → projekt → budżet), "Tylko 2 minuty", autosave.
- Marquee logotypów klientów → opinie Google (liczba + 5,0) → siatka realizacji z tagami branży → usługi w 3 ponumerowanych grupach z podlinkami → FAQ (10 pytań o cenę/czas/proces) → finalne CTA ("Bezpłatnie · Niezobowiązująco · Odpowiedź w 24 h") + WhatsApp/telefon.
- Pasek nad hero: "Odpowiedź w 24 h · Cała Polska, zdalnie" + "Wolne terminy na Q4".
- Nawigacja: mega-menu z usługami pogrupowanymi w 3–4 kolumny.

**303.pl** → *odwaga kolorystyczna*
- Jedna mocna, nasycona barwa akcentowa (u nich elektryczny fiolet `#6666FF`) na dużych płaszczyznach, nie tylko na przyciskach. Przenosimy ten odruch na nasz żółty: **duże bloki żółtego** (cała sekcja CTA, pinned numery, kursor), nie żółte kropeczki.

### Animacje i efekty wow

**fplus.ai** → *scroll jako podróż*
- Dark mode, logo on-dark, "Scroll to explore →" pod hero.
- Case studies jako pełnoekranowe "rozdziały" (horizontal scroll pinned sekcja).
- Podwójny marquee technologii/kompetencji (dwa rzędy w przeciwnych kierunkach).
- Finalne CTA jako jedno wielkie zdanie: "A gdyby następny projekt był Twój?"

**salo.uk** → *interakcja i stacking*
- Multiplayer-cursor effect w hero: etykiety z imionami zespołu ("Carl", "Sophie") pływające jak kursory w Figmie, a jedna z etykietą "Ty".
- Usługi jako **sticky stacking cards** (każda karta przykleja się i następna nachodzi na nią).
- Pływające mockupy mobile obok tekstu, ręczne "adnotacje" (strzałki/odręczna linia SVG) przy case studies.
- Case study = jedna liczba wyniku w nagłówku ("+144% zapytań").

**1367studio.com** → *wideo i rytm*
- Hero z wideo w tle (mp4 loop, mute, lekki).
- "Focus Areas" jako rzędy: duży nagłówek + marquee pod-tagów w rzędzie.
- Pływająca galeria mockupów (parallax, różne prędkości na scroll).
- Testimoniale jako slider 01/03 ze zdjęciem i rolą.
- Featured case = wideo z realizacji zamiast screena.

**jesperlandberg.com** → *motion craft*
- Płynne page transitions, obrazy z WebGL distortion na hover (shader "liquid"), kinetic typography w hero (litery wjeżdżają z maską), smooth scroll z inercją.
- Mobilna wersja to NIE ta sama animacja odchudzona — to świadomie inna, prostsza.

---

## 2. Design system

```css
:root {
  --bg: #0A0A0A;          /* czerń bazowa */
  --bg-2: #141414;        /* panele / karty */
  --fg: #F4F4F2;          /* tekst */
  --muted: #8A8A86;       /* tekst drugorzędny */
  --signal: #FFD500;      /* żółty Xperteo — jedyny akcent */
  --signal-ink: #0A0A0A;  /* tekst na żółtym */
  --line: rgba(244,244,242,.12);
}
```

- **Typografia:** Space Grotesk (nagłówki, 600/700, tracking -0.03em), IBM Plex Mono (etykiety, numery sekcji, stats). Skala hero: `clamp(3rem, 9vw, 9rem)`.
- **Zasada żółtego:** żółty = akcja lub najważniejsza liczba. Nic innego. Jedna żółta rzecz na ekran.
- **Logo:** wordmark XPERTEO w całości żółty + okrągły żółty znak z czarnym X (pliki od klienta, 2026-10-04: `public/brand/logo-source.png`, `public/brand/icon-source.png`). Bez czapki akademickiej.
- **Grid:** 12 kolumn, gutter 24px, max-width 1440px, padding 24px mobile / 64px desktop.
- **Radius:** 4px (ostro, techniczne). Bez glassmorphism.
- **Motion tokens:** `--ease: cubic-bezier(.16,1,.3,1)`, duration 0.6–1.2s, stagger 0.06s.

---

## 3. Stack

- **Next.js 15 (App Router) + TypeScript + Tailwind** — SSG/ISR, bo obecna strona ma pusty HTML bez JS (problem SEO). **Każda sekcja musi mieć treść w HTML bez JS.**
- **Lenis** — smooth scroll.
- **GSAP + ScrollTrigger** — wszystkie animacje scroll-driven.
- **React Three Fiber + drei** — 3D tylko w hero (jeden obiekt) i w sekcji AI.
- **Framer Motion** — page transitions, hover micro.
- **CMS:** Sanity (case studies, FAQ, opinie, blog).
- **Formularz:** server action → n8n webhook → CRM (Google Sheets/Apollo).
- **Deploy:** Vercel.

Zasady techniczne (wklejać do każdego promptu):
1. `prefers-reduced-motion` → wszystkie animacje off, treść widoczna.
2. Canvas 3D ładowany `dynamic(() => import(...), { ssr: false })` + lazy po `IntersectionObserver`.
3. Mobile (<768px): bez R3F, bez horizontal scroll, bez multiplayer-cursor — zamiast tego fade-up + prosty parallax.
4. Lighthouse mobile ≥ 90 (Performance, SEO, A11y). LCP < 2.5 s.
5. Wideo: mp4 h264 + webm, ≤ 2 MB, `poster`, `playsInline muted loop`.
6. Wszystkie obrazy przez `next/image`.

---

## 4. Storyboard scrolla (strona główna)

Jednostka: `vh` od góry strony. Desktop. (Mobile = ta sama kolejność, animacje uproszczone.)

### S0 · Preloader (0–1.5 s)
Czarny ekran, licznik 0→100 w Plex Mono, żółta linia rośnie od lewej. Przy 100 kurtyna odjeżdża w górę (`clip-path`). Tylko przy pierwszej wizycie (cookie).

### S1 · Hero (0–100vh) — pinned
- Pasek na górze: `Odpowiedź w 24 h · Cała Polska, zdalnie · Wolne terminy: listopad`.
- H1 kinetic: **"Automatyzujemy, promujemy i budujemy."** — każda linia wjeżdża z maską od dołu, stagger 0.08 s. Pod H1 rotujące słowo w żółtym: `AI dla MŚP / Google Ads / sklepy B2B / aplikacje / szkolenia` (zmiana co 2 s, flip z maską).
- Sub: "Automatyzacje AI, marketing, software i szkolenia dla MŚP. Jedna firma, jeden kontakt, mierzalne wyniki."
- CTA: `[Bezpłatna konsultacja]` (żółty) · `[Zobacz realizacje ↓]` (outline).
- 3 stats w Plex Mono: `120+ projektów` · `5,0 Google` · `24 h odpowiedź` — liczby odliczają od 0 przy wejściu.
- **Tło 3D (R3F):** abstrakcyjny obiekt "X" z logo — czarna matowa bryła z żółtymi krawędziami emisyjnymi, obraca się 15° za kursorem (lerp), przy scrollu 0→100vh obraca się o 90° i oddala (scale 1→0.6). Fallback: wideo loop z Higgsfield.
- **Multiplayer cursors:** 3 etykiety "Mat", "Wojtek", "Dawid" dryfują po hero (sinusoidalnie), czwarta "Ty" przyklejona do prawdziwego kursora.
- Dół: `Scroll →` w Plex Mono z pulsującą strzałką.

### S2 · Formularz szybki (100–160vh)
- Lewa kolumna sticky: "Opowiedz nam o projekcie. 2 minuty." + lista "Bezpłatnie · Bez zobowiązań · Odpowiedź w 24 h".
- Prawa: 3-krokowy formularz (Kontakt → Czego potrzebujesz [4 filary jako chipy] → Budżet i termin). Pasek postępu żółty. Autosave do localStorage. `Enter ↵` → dalej.
- Animacja: kolumna wjeżdża z prawej (x: 80→0, opacity).

### S3 · Marquee klientów (160–180vh)
Dwa rzędy logotypów w przeciwnych kierunkach, grayscale → kolor na hover, prędkość zależna od prędkości scrolla (Lenis velocity).

### S4 · Cztery filary — sticky stacking cards (180–480vh) — pinned
- Lewa kolumna sticky: nagłówek `Co robimy` + numer aktywnego filaru `01 / 04` w żółtym (zmienia się przy przejściu).
- Prawa: 4 karty, każda 100vh, przyklejają się i nachodzą na siebie (scale 1→0.95 + lekkie przyciemnienie poprzedniej).
- Każda karta: numer `01`, H2 filaru, 1 zdanie "dla kogo", lista 3–4 podusług jako linki, mały wizual po prawej:
  - 01 AI: animowany diagram węzłów (n8n-style) rysujący się w SVG `stroke-dashoffset`.
  - 02 Marketing: licznik ROAS + słupki rosnące.
  - 03 Software: 3 mockupy mobile pływające z różnym parallaxem (jak 1367).
  - 04 Szkolenia: zdjęcie z sali + badge "KFS / BUR do 80% dofinansowania".
- Pod każdą kartą CTA `Zobacz ofertę →` z animowaną strzałką.

### S5 · Realizacje — horizontal scroll (480–780vh) — pinned
- Sekcja przykleja się, scroll pionowy → przesuw poziomy 5–6 case'ów (każdy 70vw).
- Karta case: obraz z WebGL hover distortion (shader liquid), tag branży, nazwa, **jedna liczba wyniku w żółtym** (np. `+144% zapytań`, `–12 h/tydz. pracy ręcznej`), link.
- Ostatnia karta: "Wszystkie realizacje →".
- Mobile: zwykły poziomy carousel (CSS scroll-snap).

### S6 · Opinie Google (780–860vh)
- Nagłówek: `24 opinie. Wszystkie 5 gwiazdek.` + przycisk "Zobacz w Google".
- Slider 01/03 (jak 1367), awatar + imię + firma, duży cudzysłów w żółtym. Autoplay 6 s.

### S7 · Liczby — żółta sekcja (860–940vh)
Cała sekcja w `--signal`, tekst czarny. 4 wielkie liczby odliczające: projekty / lata doświadczenia / godzin pracy zaoszczędzonych klientom / przeszkolonych osób. Tło: subtelny grain.

### S8 · Jak pracujemy (940–1040vh)
Pozioma oś 4 kroków: `Rozmowa 30 min → Oferta A/B/C w 48 h → Sprinty 2-tyg. → Opieka`. Linia rysuje się na scroll, kroki zapalają się kolejno.

### S9 · Marquee kompetencji (1040–1060vh)
Dwa rzędy jak fplus: `AI agents · n8n · Claude · Next.js · Lovable · Supabase · Google Ads · Meta Ads · ChatGPT Ads · Shopify · PrestaShop · WordPress · …`

### S10 · FAQ (1060–1180vh)
10 pytań, accordion, numeracja Plex Mono. Pytania o: cenę strony, cenę automatyzacji, czas, dofinansowanie KFS/BUR, czy trzeba mieć treści, czy można zacząć od jednej usługi, jak wygląda start, czy zdalnie, co z utrzymaniem, czy robicie Allegro/Ceneo.

### S11 · Finalne CTA (1180–1280vh)
Jedno wielkie zdanie na cały ekran, litery wjeżdżają z maską: **"A gdyby następny projekt był Twój?"** Pod spodem `[Bezpłatna konsultacja]` · `[Napisz na WhatsApp]` · telefon. Awatary opinii + `5,0 z 24 opinii`.

### S12 · Footer
"Dobre pomysły zaczynają się od cześć." · kontakt (kopiuj e-mail na klik) · 4 kolumny usług · social · © 2026 Xperteo. Stopka/kontakt: Xperteo / xperteo.pl. Adres firmy tylko w drobnych danych rejestrowych, bez eksponowania miasta.

---

## 5. Assety z Higgsfield

**Instrukcja dla Claude Code — OBOWIĄZKOWA:** masz podpięty MCP `Higgsfield` (`generate_video`, `generate_3d`, `generate_image`, `upscale_image`, `remove_background`, `jobs_wait`). **Wszystkie** materiały wizualne na stronie — wideo, obrazy, modele 3D, mockupy, tła — generujesz przez Higgsfield. Zero stocków, zero placeholderów, zero unsplash, zero szarych prostokątów. Jakość ma być na poziomie Awwwards: dla każdego assetu wygeneruj **minimum 3 warianty**, obejrzyj je (Read na pliku), wybierz najlepszy i uzasadnij wybór w jednym zdaniu. Jeśli wynik jest przeciętny — popraw prompt i generuj ponownie, nie zadowalaj się pierwszym. Obrazy przepuść przez `upscale_image`. Każdy asset ma pasować do jednej estetyki: czerń, matowe powierzchnie, żółte (#FFD500) światło krawędziowe, delikatny grain, bez tekstu na grafikach. Jeśli narzędzie Higgsfield zwróci błąd — zatrzymaj się i zgłoś, nie obchodź tego innym źródłem.

Ścieżki docelowe: `/public/video/hero.mp4` + `hero-mobile.mp4`, `/public/models/x.glb`, `/public/img/ai-network.webp`, `/public/img/cases/<slug>.webp`, `/public/img/training.webp`, `/public/video/cases/<slug>.mp4`.

| Asset | Narzędzie | Prompt | Specyfikacja |
|-------|-----------|--------|--------------|
| Hero video fallback | generate_video | "Abstract black matte 3D letter X with thin glowing yellow (#FFD500) edges, slowly rotating in dark void, subtle volumetric fog, cinematic, seamless 8s loop, no text, 4K" | 8 s loop, 16:9 + 9:16 |
| Obiekt 3D "X" | generate_3d | "Minimal geometric letter X, chamfered edges, matte black, clean topology, single mesh" | GLB, < 1 MB, do R3F |
| Tło sekcji AI | generate_image | "Dark technical illustration of a network of glowing yellow nodes connected by thin lines, black background, top-down, minimal, no text" | 2400×1350 webp |
| Mockupy case (×6) | generate_image | "Ultra-clean device mockup of [opis strony klienta], dark background, soft yellow rim light, studio, no text overlay" | 1600×1000 |
| Zdjęcie szkolenia | generate_image | "Modern training room, small group of professionals at laptops, dark walls, yellow accent lighting, candid, photorealistic" | 2000×1333 |
| Case videos (×2) | generate_video | screen-recording style przejazd po stronie klienta, 6 s | mp4 ≤ 2 MB |

Wszystko w jednej estetyce: czerń, żółte światło krawędziowe, grain. Bez stocków.

---

## 6. Sekwencja promptów do Claude Code

Każdy prompt zaczyna się od: **"Przeczytaj DESIGN.md. Pracujemy nad sekcją X. Nie ruszaj innych sekcji."** Jeden prompt = jedna sekcja. Zatwierdzam → następna.

**P0 — Setup**
> Zainicjuj Next.js 15 App Router + TS + Tailwind. Dodaj Lenis, GSAP (+ScrollTrigger), @react-three/fiber, @react-three/drei, framer-motion. Zaimplementuj design tokens z DESIGN.md §2 jako CSS vars + Tailwind theme. Fonty Space Grotesk + IBM Plex Mono przez next/font. Komponent `<SmoothScroll>` (Lenis + GSAP ticker). Hook `useReducedMotion`. Layout z nav (mega-menu 4 kolumny) i footerem. Pusta strona główna z placeholderami sekcji S1–S12 jako `<section id>`. Lighthouse musi być zielony od startu.

**P0.5 — Assety przez Higgsfield (obowiązkowy)**
> Przeczytaj DESIGN.md §5. Dla każdego wiersza tabeli wygeneruj przez Higgsfield MCP minimum 3 warianty, obejrzyj je, wybierz najlepszy, upscale'uj, poczekaj na zakończenie (`jobs_wait`), pobierz plik i zapisz pod ścieżką docelową. Hero video w 16:9 i 9:16. GLB < 1 MB — jeśli większy, zdecymuj. Na koniec wypisz listę zapisanych plików z rozmiarami i jednozdaniowym uzasadnieniem każdego wyboru. Nie zaczynaj kodować sekcji, dopóki assety nie są na dysku. Jeśli w trakcie kodowania kolejnych sekcji zabraknie jakiegoś wizuału — generujesz go przez Higgsfield w tym samym standardzie, nie wstawiasz zamiennika.

**P1 — Hero**
> Zbuduj S1 wg DESIGN.md §4. Kinetic H1 z maskami (GSAP SplitText lub własny split), rotujące słowo, stats odliczające, multiplayer cursors (3 drifting + 1 podążający). Tło R3F: załaduj `/models/x.glb`, obrót za kursorem (lerp 0.05), ScrollTrigger scrub 0→100vh → rotacja 90°, scale 0.6. Canvas dynamic/no-ssr, lazy. Mobile: zamiast canvas wideo `/video/hero.mp4` z posterem. Treść H1/sub/CTA w HTML bez JS.

**P2 — Formularz**
> Zbuduj S2: 3-krokowy formularz z server action → POST do `process.env.N8N_WEBHOOK`. Walidacja zod. Autosave localStorage. Sticky lewa kolumna. Honeypot. Toast po wysłaniu.

**P3 — Stacking cards (filary)**
> Zbuduj S4: 4 karty sticky stacking (GSAP pin + scale poprzedniej do 0.95). Lewa kolumna z numerem `01/04` aktualizowanym w onEnter. Wizuale: SVG diagram rysowany stroke-dashoffset (01), countery (02), 3 mockupy z parallaxem różnej prędkości (03), zdjęcie + badge (04). Mobile: zwykłe karty pod sobą, fade-up.

**P4 — Horizontal cases**
> Zbuduj S5: pinned sekcja, scroll pionowy → translateX kart (GSAP scrub). Karta z obrazem w R3F plane + shader distortion na hover (uv displacement, strength 0.3, easing). Dane z Sanity. Mobile: scroll-snap carousel bez WebGL.

**P5 — Opinie, liczby, proces, marquee**
> Zbuduj S3, S6, S7, S8, S9 wg specyfikacji. Marquee: CSS translate z prędkością modulowaną Lenis velocity. S7: żółta sekcja, countery. S8: linia SVG rysowana na scroll.

**P5.5 — Podstrony social proof**
> Zbuduj `/realizacje` (siatka z filtrem po filarze i branży, dane z Sanity), `/realizacje/[slug]` (case study: problem → rozwiązanie → wynik w liczbach → cytat → stack → galeria/wideo; hero case'a z jedną liczbą w żółtym i wideo z Higgsfield) oraz `/opinie` (wszystkie opinie Google + ocena zbiorcza + link do wizytówki). Schematy Sanity: `review`, `project`, `caseStudy`. Każda podstrona SSG z pełnym HTML.

**P6 — FAQ + CTA + footer**
> S10 accordion (Radix), S11 wielkie zdanie z maskami, S12 footer. Copy e-mail na klik.

**P7 — Preloader + page transitions**
> S0 licznik + kurtyna (tylko pierwsza wizyta). Framer Motion `AnimatePresence` dla przejść między podstronami (fade + y 20).

**P8 — QA**
> Uruchom Lighthouse mobile+desktop, napraw do ≥ 90. Sprawdź `prefers-reduced-motion`. Sprawdź, czy `curl` strony zwraca pełny HTML z treścią wszystkich sekcji. Sprawdź bundle size, odetnij nieużywane importy GSAP/three.

---

## 7. Czego NIE robić
- Nie dodawać gradientów, glassmorphism, fioletów, "AI-sparkle" ikonek.
- Nie animować wszystkiego — jeden efekt wow na sekcję.
- Nie pisać copy w stylu "innowacyjne rozwiązania". Jeśli zdanie nie ma liczby albo czasownika — przepisać.
- Nie budować SPA. Treść musi być w HTML.
