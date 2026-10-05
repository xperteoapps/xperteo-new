import { z } from "zod";
import { PILLARS } from "@/content/site";

/**
 * S2 · Formularz szybki — model danych (DESIGN.md §4 S2, §6 P2).
 * Wspólne dla klienta (walidacja kroków, autosave) i server action (walidacja całości).
 */

export const LEAD_STORAGE_KEY = "xperteo:lead-draft:v1";

export const STEPS = [
  { id: "kontakt", label: "Kontakt", title: "Jak się do Ciebie odezwać?" },
  { id: "potrzeby", label: "Czego potrzebujesz", title: "Czego potrzebujesz?" },
  { id: "budzet", label: "Budżet i termin", title: "Jaki budżet i termin?" },
] as const;

export const PILLAR_IDS = PILLARS.map((p) => p.id);

export const BUDGETS = [
  { value: "do-10k", label: "do 10 tys. zł" },
  { value: "10-30k", label: "10–30 tys. zł" },
  { value: "30-100k", label: "30–100 tys. zł" },
  { value: "100k-plus", label: "ponad 100 tys. zł" },
  { value: "nie-wiem", label: "Jeszcze nie wiem" },
] as const;

export const DEADLINES = [
  { value: "asap", label: "Jak najszybciej" },
  { value: "1-3m", label: "W ciągu 1–3 miesięcy" },
  { value: "3-6m", label: "Za 3–6 miesięcy" },
  { value: "planuje", label: "Dopiero planuję" },
] as const;

const BUDGET_VALUES = BUDGETS.map((b) => b.value);
const DEADLINE_VALUES = DEADLINES.map((d) => d.value);

/** Krok 1 — kontakt */
export const leadStep1 = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Podaj imię i nazwisko")
    .max(120, "Maksymalnie 120 znaków"),
  email: z.email("Podaj poprawny adres e-mail").max(160, "Maksymalnie 160 znaków"),
  phone: z
    .string()
    .trim()
    .max(32, "Maksymalnie 32 znaki")
    .regex(/^$|^\+?[\d\s().\-]{7,}$/, "Podaj poprawny numer telefonu"),
  company: z.string().trim().max(120, "Maksymalnie 120 znaków"),
});

/** Krok 2 — czego potrzebujesz (4 filary jako chipy) */
export const leadStep2 = z.object({
  pillars: z.array(z.enum(PILLAR_IDS)).min(1, "Wybierz przynajmniej jeden obszar"),
  message: z.string().trim().max(2000, "Maksymalnie 2000 znaków"),
});

/** Krok 3 — budżet i termin */
export const leadStep3 = z.object({
  budget: z.enum(BUDGET_VALUES, "Wybierz budżet"),
  deadline: z.enum(DEADLINE_VALUES, "Wybierz termin"),
  consent: z.literal(true, "Potrzebujemy Twojej zgody, żeby odpowiedzieć"),
});

export const STEP_SCHEMAS = [leadStep1, leadStep2, leadStep3] as const;

export const leadSchema = leadStep1.extend(leadStep2.shape).extend(leadStep3.shape);

export type Lead = z.infer<typeof leadSchema>;
export type LeadField = keyof Lead;
export type FieldErrors = Partial<Record<LeadField, string>>;

/** Stan roboczy formularza (przed walidacją) — to trafia do localStorage. */
export type LeadDraft = {
  name: string;
  email: string;
  phone: string;
  company: string;
  pillars: string[];
  message: string;
  budget: string;
  deadline: string;
  consent: boolean;
};

export const EMPTY_LEAD: LeadDraft = {
  name: "",
  email: "",
  phone: "",
  company: "",
  pillars: [],
  message: "",
  budget: "",
  deadline: "",
  consent: false,
};

/** Które pola należą do którego kroku — do skoku na krok z błędem. */
export const STEP_FIELDS: readonly (readonly LeadField[])[] = [
  ["name", "email", "phone", "company"],
  ["pillars", "message"],
  ["budget", "deadline", "consent"],
];

export type LeadState = {
  ok: boolean;
  error?: string;
  fieldErrors?: FieldErrors;
};

export const INITIAL_LEAD_STATE: LeadState = { ok: false };

export function leadFromFormData(fd: FormData): LeadDraft {
  const str = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v : "";
  };
  return {
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    company: str("company"),
    pillars: fd.getAll("pillars").filter((v): v is string => typeof v === "string"),
    message: str("message"),
    budget: str("budget"),
    deadline: str("deadline"),
    consent: fd.get("consent") === "on",
  };
}

/** Pierwszy komunikat błędu per pole. */
export function fieldErrorsOf(error: z.ZodError): FieldErrors {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  const out: FieldErrors = {};
  for (const [k, msgs] of Object.entries(flat)) {
    if (msgs?.[0]) out[k as LeadField] = msgs[0];
  }
  return out;
}

export function isDraftEmpty(d: LeadDraft): boolean {
  return (
    !d.name && !d.email && !d.phone && !d.company && d.pillars.length === 0 &&
    !d.message && !d.budget && !d.deadline && !d.consent
  );
}
