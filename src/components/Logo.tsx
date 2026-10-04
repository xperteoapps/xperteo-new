import Link from "next/link";

/**
 * Logo Xperteo wg plików od klienta (2026-10-04): cały wordmark w żółci
 * + okrągły żółty znak z czarnym X. Wordmark jako tekst (Space Grotesk 700),
 * znak jako wektor.
 */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0"
    >
      <circle cx="50" cy="50" r="48" fill="var(--signal)" />
      <path
        d="M31 31l38 38M69 31L31 69"
        stroke="var(--signal-ink)"
        strokeWidth="11"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Xperteo — strona główna"
      className={`inline-flex items-center gap-1.5 font-sans text-[22px] font-bold leading-none tracking-[-0.04em] text-signal ${className}`}
    >
      <span aria-hidden="true">XPERTEO</span>
      <LogoMark size={22} />
    </Link>
  );
}
