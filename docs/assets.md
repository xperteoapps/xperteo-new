# Assety Higgsfield — P0.5 (DESIGN.md §5)

Stan: wygenerowane, obejrzane, wybrane, przetworzone i zapisane w storage Higgsfield.
Pobranie do `/public`: `bash scripts/fetch-assets.sh` (wymaga dostępu sieciowego do
`d2ol7oe51mr4n9.cloudfront.net`).

Estetyka wspólna: czerń, matowe powierzchnie, żółty #FFD500, delikatny grain, bez tekstu.
Decyzja klienta (2026-10-04): obiekt "X" to **pełny znak z logo** — żółty dysk + czarny X
o zaokrąglonych ramionach.

| Plik docelowy | Źródło | Rozmiar | Wybór i uzasadnienie |
|---|---|---|---|
| `public/video/hero.mp4` | Kling 3.0 pro, start frame GPT Image 2.5 z ikoną jako referencją; 3 warianty 16:9 | 698 kB, 1920×1080, 7 s, h264 | Wariant z ćwierćobrotem dysku po prawej stronie kadru: spójny, wolny ruch, widać grubość dysku, lewa połowa czarna na H1. Pętla: crossfade 1 s. |
| `public/video/hero.webm` | j.w. | 192 kB, VP9 | — |
| `public/video/hero-poster.jpg` | pierwsza klatka | 50 kB | — |
| `public/video/hero-mobile.mp4` | Kling 3.0 pro; 3 warianty 9:16 | 928 kB, 1080×1920, 7 s | Wariant z dyskiem w górnej połowie i czarną dolną połową na tekst; odrzucony wariant centralny, bo kończył się dyskiem widzianym od krawędzi (brak pętli). |
| `public/video/hero-mobile.webm` | j.w. | 287 kB | — |
| `public/video/hero-mobile-poster.jpg` | pierwsza klatka | 56 kB | — |
| `public/models/x.glb` | Hunyuan3D v3 image-to-3D z referencji produktowej (3 modele: Meshy 7, Hunyuan v3 ×2, Tripo H3.1) | 157 kB, 21k tri, Draco, tekstura 1024 webp, unlit | Hunyuan (regeneracja) dał jedyną siatkę z nienaruszonym, grubym X o zaokrąglonych końcach; Meshy miał cienki X, Tripo zapadnięty relief, pierwszy Hunyuan pofragmentowany. Materiały nadpiszemy w R3F (matowy żółty / czarny). |
| `public/img/ai-network.webp` | GPT Image 2.5, 3 warianty, upscale 4K | 51 kB, 2400×1350 | Wariant z hubami świecącymi i dużą czarną przestrzenią — czyta się jak graf n8n, zostawia miejsce na tekst; konstelacja była zbyt "kosmiczna", obwód zbyt sztywny. |
| `public/img/training.webp` | Soul 2 (×3) + GPT Image (×1), upscale 4K | 47 kB, 2000×1333 | Długi czarny stół, cienka żółta linia na ścianie, naturalny śmiech — jedyny, który nie wygląda jak stock; wariant GPT był zbyt wypolerowany, wariant z trenerem w muszce nienaturalny. |

## Mockupy case (×6) — `public/img/cases/<slug>.webp`, 1600×1000

Metoda: prawdziwy zrzut ekranu strony klienta (Playwright, 1440×900, w sandboxie Higgsfield)
jako referencja obrazu → GPT Image 2.5, 3 warianty na klienta (laptop ¾, laptop + telefon,
pływające okno + telefon) → wybór → upscale 2K → webp. Wybrano konsekwentnie wariant
**laptop ¾ na czarnym tle z żółtym światłem krawędziowym**, żeby siatka realizacji miała
jeden kąt i rytm; ekrany odwzorowują realne strony.

| Slug | Strona | Rozmiar | Uwaga |
|---|---|---|---|
| `energynat` | energynat.solutions | 99 kB | wierny hero strony |
| `funduszeszkoleniowe` | funduszeszkoleniowe.pl | 109 kB | wierny hero strony |
| `enedeal` | shop.enedeal.com | 121 kB | wierny hero sklepu |
| `303` | 303.pl | 75 kB | nagłówek "Szyjemy i znakujemy odzież dla firm" powtórzył się w 5 niezależnych generacjach z tego samego zrzutu, więc to realny tekst slidera strony (słabo widoczny w moim podglądzie); zostawiony |
| `clearviewcar` | clearviewcar.pl | 89 kB | wierny hero strony |
| `mrgroszek` | mrgroszek.pl | 95 kB | wierny hero strony |

## Case videos (×2) — `public/video/cases/<slug>.mp4|.webm|-poster.jpg`, 1600×1000, 6 s

Kling 3.0 pro od prawdziwego zrzutu strony jako klatki startowej, 3 warianty na stronę
(płynne przewijanie, pauza + przewijanie, delikatny najazd). **Warianty z przewijaniem
odrzucone**: po 2–3 s model wymyślał sekcje poniżej hero z bełkotliwym tekstem, co łamie
zasadę "nic nie wymyślamy". Wybrano wariant z najazdem, który przez 6 s pokazuje wyłącznie
prawdziwą treść hero.

| Slug | Strona | mp4 | webm | poster |
|---|---|---|---|---|
| `energynat` | energynat.solutions | 1,0 MB | 537 kB | 121 kB |
| `funduszeszkoleniowe` | funduszeszkoleniowe.pl | 1,2 MB | 796 kB | 138 kB |

Uwaga: prawdziwy przejazd po stronie (scroll) da się nagrać Playwrightem w sandboxie
Higgsfield jako realny screen recording. To nie jest generacja AI, więc wymaga Twojej decyzji.

## Odrzucone, ale zachowane w Higgsfield
- 6 wideo z literą X typograficzną (przed decyzją o znaku z logo).
- 3 klatki 16:9 i 2 klatki 9:16 z samym X bez kółka (h100–h102, v110–v111) — bardzo dobre,
  mogą posłużyć jako OG image / tła sekcji, jeśli zdecydujesz.

## Zużycie kredytów
Start 464,25 → 74 po hero/3D/obrazach → doładowanie do 512 → mockupy + case videos → stan w raporcie z sesji.
