# Leady z formularza S2 → n8n

Server action `src/app/actions/lead.ts` wysyła POST JSON na `N8N_WEBHOOK`
z nagłówkiem `x-webhook-secret: N8N_WEBHOOK_SECRET` (zmienne w Vercel, wzór w `.env.example`).

## Workflow w n8n

- Nazwa: **xperteo.pl — lead z formularza (S2)**
- Link: https://xperteo.app.n8n.cloud/workflow/BXc1ubimShvRftSa
- Webhook (POST): `https://xperteo.app.n8n.cloud/webhook/xperteo-lead`

Przebieg:

1. `Lead z xperteo.pl` — Webhook POST, odpowiedź przez node „Respond to Webhook”.
2. `Secret poprawny?` — porównuje nagłówek `x-webhook-secret` z sekretem. Brak lub zły → `Odpowiedz 401`.
3. `Normalizuj lead` — spłaszcza `body` do pól: name, email, phone, company, pillars (tekst „ai, software”),
   message, budget, deadline, consent, source, submittedAt, receivedAt.
4. Równolegle:
   - `Zapisz w tabeli Leady` — Data Table **Leady xperteo.pl** (n8n → Data tables).
   - `Mail na hello@xperteo.pl` — Gmail (credential „Gmail account”), reply-to = e-mail klienta.
   - `Odpowiedz 200` — `{ "ok": true }` dla strony.

Zapis i mail mają `onError: continueRegularOutput` — awaria jednego nie blokuje drugiego ani odpowiedzi.

## Payload (przykład)

```json
{
  "name": "Jan Kowalski",
  "email": "jan@firma.pl",
  "phone": "+48 600 100 200",
  "company": "Firma Sp. z o.o.",
  "pillars": ["ai", "software"],
  "message": "Chcemy zautomatyzować obsługę leadów.",
  "budget": "10-30k",
  "deadline": "1-3m",
  "consent": true,
  "source": "xperteo.pl/#kontakt",
  "submittedAt": "2026-10-05T08:48:05.700Z"
}
```

Słowniki `budget` i `deadline`: `src/lib/lead.ts` (`BUDGETS`, `DEADLINES`). Filary: `ai | marketing | software | szkolenia`.

## Rozszerzanie

Żeby dodać CRM (Apollo, Google Sheets, Slack), dołóż kolejny node za `Normalizuj lead` — strona nie wymaga zmian.
