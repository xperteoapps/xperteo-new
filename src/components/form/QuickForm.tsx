"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/app/actions/lead";
import { CONTACT, PILLARS } from "@/content/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  BUDGETS,
  DEADLINES,
  EMPTY_LEAD,
  INITIAL_LEAD_STATE,
  LEAD_STORAGE_KEY,
  STEPS,
  STEP_FIELDS,
  STEP_SCHEMAS,
  fieldErrorsOf,
  isDraftEmpty,
  type FieldErrors,
  type LeadDraft,
  type LeadField,
} from "@/lib/lead";

const LAST = STEPS.length - 1;
const pad = (n: number) => String(n).padStart(2, "0");

type Saved = { draft: Partial<LeadDraft>; step: number };

/**
 * S2 · 3-krokowy formularz (DESIGN.md §4 S2, §6 P2).
 * Bez JS: wszystkie kroki widoczne w HTML, zwykły POST do server action.
 * Z JS: jeden krok na raz, żółty pasek postępu, Enter ↵ → dalej,
 * autosave do localStorage, walidacja zod per krok, toast po wysłaniu.
 */
export function QuickForm() {
  const reduced = useReducedMotion();
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_STATE);
  const [enhanced, setEnhanced] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<LeadDraft>(EMPTY_LEAD);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<string | null>(null);
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const focusStep = useRef(false);
  const uid = useId();

  /* ── Hydracja: tryb krokowy + odczyt autosave ───────────────────────── */
  useEffect(() => {
    setEnhanced(true);
    try {
      const raw = localStorage.getItem(LEAD_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        const merged = { ...EMPTY_LEAD, ...saved.draft, consent: false };
        if (!isDraftEmpty(merged)) {
          setDraft(merged);
          setStep(Math.min(Math.max(saved.step ?? 0, 0), LAST));
          setRestoredFromDraft(true);
        }
      }
    } catch {
      /* brak storage (tryb prywatny) — formularz działa bez autosave */
    }
    setReady(true);
  }, []);

  /* ── Autosave (debounce 300 ms) ─────────────────────────────────────── */
  useEffect(() => {
    if (!ready || state.ok) return;
    const t = window.setTimeout(() => {
      try {
        if (isDraftEmpty(draft)) localStorage.removeItem(LEAD_STORAGE_KEY);
        else localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify({ draft, step } satisfies Saved));
      } catch {
        /* ignore */
      }
    }, 300);
    return () => window.clearTimeout(t);
  }, [draft, step, ready, state.ok]);

  /* ── Wynik server action ────────────────────────────────────────────── */
  useEffect(() => {
    if (state.ok) {
      try {
        localStorage.removeItem(LEAD_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setToast("Dzięki! Odpowiemy w ciągu 24 h.");
      return;
    }
    if (state.error) {
      const fe = state.fieldErrors ?? {};
      setErrors(fe);
      const firstBad = STEP_FIELDS.findIndex((fields) => fields.some((f) => fe[f]));
      if (firstBad >= 0) {
        focusStep.current = true;
        setStep(firstBad);
      }
      setToast(state.error);
    }
  }, [state]);

  /* ── Toast: auto-hide ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ── Fokus na pierwsze pole kroku po nawigacji użytkownika ──────────── */
  useEffect(() => {
    if (!focusStep.current || !formRef.current) return;
    focusStep.current = false;
    const stepEl = formRef.current.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const bad = stepEl?.querySelector<HTMLElement>("[aria-invalid='true']");
    const first = bad ?? stepEl?.querySelector<HTMLElement>("input, textarea");
    first?.focus({ preventScroll: true });
  }, [step]);

  /* ── Wjazd kolumny z prawej (x: 80→0, opacity); mobile: fade-up ─────── */
  useEffect(() => {
    if (reduced) return;
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const tween = gsap.from(el, {
        x: desktop ? 80 : 0,
        y: desktop ? 0 : 32,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        // po animacji zdejmujemy transform — inaczej host staje się containing block dla position: fixed
        onComplete: () => gsap.set(el, { clearProps: "transform,opacity" }),
      });
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(el, { clearProps: "all" });
      };
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced]);

  /* ── Pomocnicze ─────────────────────────────────────────────────────── */
  const set = useCallback(<K extends keyof LeadDraft>(key: K, value: LeadDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key as LeadField] ? { ...e, [key]: undefined } : e));
  }, []);

  const togglePillar = (id: string) =>
    set(
      "pillars",
      draft.pillars.includes(id) ? draft.pillars.filter((p) => p !== id) : [...draft.pillars, id],
    );

  const validateStep = (i: number): boolean => {
    const r = STEP_SCHEMAS[i].safeParse(draft);
    if (r.success) return true;
    setErrors((e) => ({ ...e, ...fieldErrorsOf(r.error) }));
    focusStep.current = true;
    setStep(i);
    return false;
  };

  const next = () => {
    if (!validateStep(step)) return;
    focusStep.current = true;
    setStep((s) => Math.min(s + 1, LAST));
  };
  const back = () => {
    focusStep.current = true;
    setStep((s) => Math.max(s - 1, 0));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (!enhanced || e.key !== "Enter" || step === LAST) return;
    const t = e.target as HTMLElement;
    if (t.tagName === "TEXTAREA" || t.tagName === "BUTTON") return;
    e.preventDefault();
    next();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!enhanced) return;
    for (let i = 0; i < STEPS.length; i++) {
      if (!validateStep(i)) {
        e.preventDefault();
        return;
      }
    }
  };

  const clearDraft = () => {
    setDraft(EMPTY_LEAD);
    setErrors({});
    setStep(0);
    setRestoredFromDraft(false);
  };

  const progress = enhanced ? (step + 1) / STEPS.length : 1;
  const id = (f: string) => `${uid}-${f}`;
  const err = (f: LeadField) =>
    errors[f] ? (
      <p id={id(`${f}-err`)} className="form-error" role="alert">
        {errors[f]}
      </p>
    ) : null;
  const ariaErr = (f: LeadField) =>
    errors[f] ? { "aria-invalid": true as const, "aria-describedby": id(`${f}-err`) } : {};

  /* ── Sukces ─────────────────────────────────────────────────────────── */
  if (state.ok) {
    return (
      <div ref={host} className="form-panel" aria-live="polite">
        <p className="label-mono text-muted">Wysłano</p>
        <h3 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          Dzięki{draft.name ? `, ${draft.name.split(" ")[0]}` : ""}. Mamy Twoją wiadomość.
        </h3>
        <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-fg/80">
          Odpowiemy w ciągu 24 h na {draft.email || "podany adres"}. Chcesz szybciej? Zadzwoń:{" "}
          <a href={CONTACT.phoneHref} className="font-mono text-fg underline-offset-4 hover:underline">
            {CONTACT.phone}
          </a>
          .
        </p>
        {toast && <Toast>{toast}</Toast>}
      </div>
    );
  }

  return (
    <div ref={host} className="form-panel">
      {/* Pasek postępu — żółty (jedyny żółty element do ostatniego kroku) */}
      <div className="form-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <form
        ref={formRef}
        action={formAction}
        onKeyDown={onKeyDown}
        onSubmit={onSubmit}
        noValidate={enhanced}
        className="flex flex-col gap-10"
      >
        {restoredFromDraft && (
          <p className="label-mono flex flex-wrap items-center gap-x-4 gap-y-2 text-muted">
            Przywróciliśmy Twoją wersję roboczą.
            <button type="button" onClick={clearDraft} className="underline underline-offset-4 hover:text-fg">
              Zacznij od nowa
            </button>
          </p>
        )}

        {/* ── Krok 1 · Kontakt ─────────────────────────────────────────── */}
        <fieldset data-step={0} hidden={enhanced && step !== 0} className="form-step">
          <legend className="label-mono text-muted">
            Krok {pad(1)} / {pad(STEPS.length)} · {STEPS[0].label}
          </legend>
          <h3 className="form-step-title">{STEPS[0].title}</h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={id("name")} className="form-label">
                Imię i nazwisko
              </label>
              <input
                id={id("name")}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                className="form-field"
                {...ariaErr("name")}
              />
              {err("name")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={id("email")} className="form-label">
                E-mail
              </label>
              <input
                id={id("email")}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
                className="form-field"
                {...ariaErr("email")}
              />
              {err("email")}
            </div>
            <div>
              <label htmlFor={id("phone")} className="form-label">
                Telefon <span className="text-muted">(opcjonalnie)</span>
              </label>
              <input
                id={id("phone")}
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={draft.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="form-field"
                {...ariaErr("phone")}
              />
              {err("phone")}
            </div>
            <div>
              <label htmlFor={id("company")} className="form-label">
                Firma <span className="text-muted">(opcjonalnie)</span>
              </label>
              <input
                id={id("company")}
                name="company"
                type="text"
                autoComplete="organization"
                value={draft.company}
                onChange={(e) => set("company", e.target.value)}
                className="form-field"
                {...ariaErr("company")}
              />
              {err("company")}
            </div>
          </div>
        </fieldset>

        {/* ── Krok 2 · Czego potrzebujesz ──────────────────────────────── */}
        <fieldset data-step={1} hidden={enhanced && step !== 1} className="form-step">
          <legend className="label-mono text-muted">
            Krok {pad(2)} / {pad(STEPS.length)} · {STEPS[1].label}
          </legend>
          <h3 className="form-step-title">{STEPS[1].title}</h3>
          <p className="mt-3 text-sm text-muted">Możesz zaznaczyć kilka obszarów.</p>
          <div
            role="group"
            aria-label="Obszary"
            className="mt-6 grid gap-3 sm:grid-cols-2"
            {...(errors.pillars ? { "aria-describedby": id("pillars-err") } : {})}
          >
            {PILLARS.map((p) => (
              <label key={p.id} className="chip">
                <input
                  type="checkbox"
                  name="pillars"
                  value={p.id}
                  checked={draft.pillars.includes(p.id)}
                  onChange={() => togglePillar(p.id)}
                  className="sr-only"
                />
                <span className="chip-box">
                  <span className="label-mono text-muted">{p.number}</span>
                  <span className="text-base font-bold leading-tight tracking-tight">{p.name}</span>
                  <span className="text-sm text-muted">{p.forWhom}</span>
                </span>
              </label>
            ))}
          </div>
          {err("pillars")}
          <div className="mt-8">
            <label htmlFor={id("message")} className="form-label">
              O co chodzi? <span className="text-muted">(2 zdania wystarczą)</span>
            </label>
            <textarea
              id={id("message")}
              name="message"
              rows={4}
              maxLength={2000}
              value={draft.message}
              onChange={(e) => set("message", e.target.value)}
              className="form-field resize-y"
              {...ariaErr("message")}
            />
            {err("message")}
          </div>
        </fieldset>

        {/* ── Krok 3 · Budżet i termin ─────────────────────────────────── */}
        <fieldset data-step={2} hidden={enhanced && step !== 2} className="form-step">
          <legend className="label-mono text-muted">
            Krok {pad(3)} / {pad(STEPS.length)} · {STEPS[2].label}
          </legend>
          <h3 className="form-step-title">{STEPS[2].title}</h3>

          <div
            role="radiogroup"
            aria-labelledby={id("budget-label")}
            className="mt-8"
            {...(errors.budget ? { "aria-describedby": id("budget-err") } : {})}
          >
            <p id={id("budget-label")} className="form-label">
              Budżet
            </p>
            <div className="flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <label key={b.value} className="chip">
                  <input
                    type="radio"
                    name="budget"
                    value={b.value}
                    required
                    checked={draft.budget === b.value}
                    onChange={() => set("budget", b.value)}
                    className="sr-only"
                  />
                  <span className="chip-pill">{b.label}</span>
                </label>
              ))}
            </div>
            {err("budget")}
          </div>

          <div
            role="radiogroup"
            aria-labelledby={id("deadline-label")}
            className="mt-8"
            {...(errors.deadline ? { "aria-describedby": id("deadline-err") } : {})}
          >
            <p id={id("deadline-label")} className="form-label">
              Termin
            </p>
            <div className="flex flex-wrap gap-2">
              {DEADLINES.map((d) => (
                <label key={d.value} className="chip">
                  <input
                    type="radio"
                    name="deadline"
                    value={d.value}
                    required
                    checked={draft.deadline === d.value}
                    onChange={() => set("deadline", d.value)}
                    className="sr-only"
                  />
                  <span className="chip-pill">{d.label}</span>
                </label>
              ))}
            </div>
            {err("deadline")}
          </div>

          <div className="mt-8">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-fg/80">
              <input
                id={id("consent")}
                type="checkbox"
                name="consent"
                required
                checked={draft.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="form-check"
                {...ariaErr("consent")}
              />
              <span>
                Zgadzam się na kontakt w sprawie tego zapytania. Administratorem danych jest Xperteo.
                Użyjemy ich tylko, żeby odpowiedzieć.
              </span>
            </label>
            {err("consent")}
          </div>
        </fieldset>

        {/* Honeypot — poza ekranem, boty wypełniają, ludzie nie */}
        <div className="hp" aria-hidden="true">
          <label htmlFor={id("website")}>Strona www</label>
          <input id={id("website")} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        {/* ── Nawigacja kroków / submit ────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          {enhanced && step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="label-mono inline-flex h-12 items-center gap-2 text-muted transition-colors hover:text-fg"
            >
              <span aria-hidden="true">←</span> Wstecz
            </button>
          ) : (
            <span className="label-mono text-muted">Bezpłatnie · Bez zobowiązań</span>
          )}

          {enhanced && step < LAST ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex h-12 items-center gap-3 rounded bg-fg px-6 text-base font-bold text-bg transition-colors hover:bg-signal hover:text-signal-ink"
            >
              Dalej
              <kbd className="label-mono rounded border border-bg/30 px-1.5 py-1 text-[10px] font-normal" aria-hidden="true">
                Enter ↵
              </kbd>
            </button>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-12 items-center gap-2 rounded bg-signal px-6 text-base font-bold text-signal-ink transition-colors hover:bg-fg disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? "Wysyłam…" : "Wyślij"}
              {!pending && <span aria-hidden="true">→</span>}
            </button>
          )}
        </div>

        {/* Bez JS: błędy z serwera widoczne pod formularzem */}
        {!enhanced && state.error && (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        )}
      </form>

      {toast && <Toast>{toast}</Toast>}
    </div>
  );
}

/** Toast renderowany portalem do <body> — niezależny od transformów rodzica. */
function Toast({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div role="status" aria-live="polite" className="toast">
      <span className="font-mono text-sm">{children}</span>
    </div>,
    document.body,
  );
}
