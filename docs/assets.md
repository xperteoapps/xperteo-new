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

## Jeszcze nie wygenerowane (brak danych)
- **Mockupy case (×6)** i **case videos (×2)** — wymagają listy flagowych realizacji
  (nazwa klienta, branża, co to za strona/aplikacja). Generujemy po otrzymaniu danych,
  w tym samym standardzie.

## Odrzucone, ale zachowane w Higgsfield
- 6 wideo z literą X typograficzną (przed decyzją o znaku z logo).
- 3 klatki 16:9 i 2 klatki 9:16 z samym X bez kółka (h100–h102, v110–v111) — bardzo dobre,
  mogą posłużyć jako OG image / tła sekcji, jeśli zdecydujesz.

## Zużycie kredytów
Start 464,25 → stan po P0.5 w raporcie z sesji.
