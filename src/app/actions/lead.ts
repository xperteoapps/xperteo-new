"use server";

import { CONTACT } from "@/content/site";
import {
  fieldErrorsOf,
  leadFromFormData,
  leadSchema,
  type LeadState,
} from "@/lib/lead";

const FALLBACK = `Nie udało się wysłać. Napisz na ${CONTACT.email} albo zadzwoń: ${CONTACT.phone}.`;

/** Produkcyjny webhook n8n (workflow „xperteo.pl — lead z formularza (S2)”). Env nadpisuje. */
const DEFAULT_WEBHOOK = "https://xperteo.app.n8n.cloud/webhook/xperteo-lead";

/**
 * Server action S2: walidacja zod → POST JSON do n8n (`N8N_WEBHOOK`).
 * Honeypot `website`: wypełniony = bot → udajemy sukces, nic nie wysyłamy.
 * Działa też bez JS (zwykły POST formularza, Next renderuje stan).
 */
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  if (String(formData.get("website") ?? "") !== "") {
    return { ok: true };
  }

  const parsed = leadSchema.safeParse(leadFromFormData(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Popraw zaznaczone pola.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }

  const payload = {
    ...parsed.data,
    source: "xperteo.pl/#kontakt",
    submittedAt: new Date().toISOString(),
  };

  const webhook = (process.env.N8N_WEBHOOK ?? "").trim() || DEFAULT_WEBHOOK;
  if (!process.env.N8N_WEBHOOK_SECRET) {
    console.warn("[lead] Brak N8N_WEBHOOK_SECRET — n8n odrzuci żądanie (401)");
  }

  try {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (process.env.N8N_WEBHOOK_SECRET) {
      headers["x-webhook-secret"] = process.env.N8N_WEBHOOK_SECRET.trim();
    }
    const res = await fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook odpowiedział ${res.status} (${webhook})`);
    return { ok: true };
  } catch (err) {
    console.error("[lead] Błąd wysyłki do n8n:", err);
    return { ok: false, error: FALLBACK };
  }
}
