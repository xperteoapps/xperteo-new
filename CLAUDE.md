# CLAUDE.md — xperteo.pl

## Źródło prawdy
- `DESIGN.md` jest **jedynym źródłem prawdy**. Przeczytaj go w całości przed każdą pracą.
- Jeśli coś jest w DESIGN.md opisane — robisz to dokładnie tak. Jeśli czegoś tam nie ma — **pytasz**, nie zgadujesz.
- Pracujemy sekcja po sekcji: **jeden prompt = jeden punkt z §6 DESIGN.md**. Po każdym zatrzymujesz się i czekasz na akceptację.
- Nie wyprzedzasz kolejnych punktów. Nie dotykasz "przy okazji" innych sekcji.

## Wizuale — Higgsfield MCP (obowiązkowo)
- Wszystkie materiały wizualne (wideo, obrazy, modele 3D, mockupy, tła) generujesz przez MCP `Higgsfield`
  (`generate_video`, `generate_3d`, `generate_image`, `upscale_image`, `remove_background`, `jobs_wait`) wg DESIGN.md §5.
- Poziom Awwwards: min. 3 warianty na asset, obejrzyj je, wybierz najlepszy, uzasadnij w jednym zdaniu, przepuść obrazy przez `upscale_image`.
- **Zero** stocków, placeholderów, unsplash, szarych prostokątów.
- Jedna estetyka: czerń, matowe powierzchnie, żółte (#FFD500) światło krawędziowe, delikatny grain, bez tekstu na grafikach.
- Błąd Higgsfield → zatrzymaj się i zgłoś. Nie obchodź innym źródłem.

## Zasady techniczne (DESIGN.md §3)
- Next.js 15 App Router + TypeScript + Tailwind. SSG/ISR.
- **Treść każdej sekcji musi być w HTML bez JS.** Sprawdzaj to `curl`-em po każdej sekcji.
- `prefers-reduced-motion` → wszystkie animacje off, treść widoczna.
- Canvas 3D: `dynamic(() => import(...), { ssr: false })` + lazy po `IntersectionObserver`.
- Mobile (<768px): bez R3F, bez horizontal scroll, bez multiplayer-cursor — fade-up + prosty parallax.
- Lighthouse mobile ≥ 90 (Performance, SEO, A11y). LCP < 2,5 s.
- Wideo: mp4 h264 + webm, ≤ 2 MB, `poster`, `playsInline muted loop`.
- Wszystkie obrazy przez `next/image`.
- Stack: Lenis, GSAP + ScrollTrigger, React Three Fiber + drei, Framer Motion, Sanity, Vercel.

## Design (DESIGN.md §2, §7)
- Żółty `#FFD500` **tylko** jako akcja lub najważniejsza liczba. Jedna żółta rzecz na ekran.
- Bez gradientów, glassmorphism, fioletów, ikonek "AI-sparkle".
- Radius 4px. Space Grotesk (nagłówki) + IBM Plex Mono (etykiety, numery, stats).
- Jeden efekt wow na sekcję, nie animować wszystkiego.

## Treść i pozycjonowanie (DESIGN.md §0)
- Zasięg ogólnopolski, zdalnie. **Nie pozycjonujemy się na Wrocław ani żadne miasto** — żadnego miasta poza danymi rejestrowymi w stopce.
- Copy po polsku, konkretne, z liczbami i czasownikami. Zero korpo-bełkotu.
- Opinie i realizacje — **tylko prawdziwe dane z Sanity**. Nic nie wymyślasz. Brak danych = komponent z pustym stanem.
- Cztery filary zawsze w kolejności: 01 Automatyzacje i AI → 02 Marketing → 03 Software house → 04 Szkolenia (Akademia Xperteo).

## Workflow
- Branch: `claude/keen-franklin-7o1zaa`. Commity opisowe, push po każdej zaakceptowanej sekcji.
- Pakiety: pnpm.
