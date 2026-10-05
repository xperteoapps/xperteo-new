"use server";

import { CONTACT } from "@/content/site";
import {
  fieldErrorsOf,
  leadFromFormData,
  leadSchema,
  type LeadState,
} from "@/lib/lead";

const FALLBACK = `Nie udało się wysłać. Napisz na ${CONTACT.email} albo zadzwoń: ${CONTACT.phone}.`;

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

  const webhook = process.env.N8N_WEBHOOK;
  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[lead] Brak N8N_WEBHOOK — payload (dev):", payload);
      return { ok: true };
    }
    console.error("[lead] Brak zmiennej N8N_WEBHOOK");
    return { ok: false, error: FALLBACK };
  }

  try {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (process.env.N8N_WEBHOOK_SECRET) {
      headers["x-webhook-secret"] = process.env.N8N_WEBHOOK_SECRET;
    }
    const res = await fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook odpowiedział ${res.status}`);
    return { ok: true };
  } catch (err) {
    console.error("[lead] Błąd wysyłki do n8n:", err);
    return { ok: false, error: FALLBACK };
  }
}
