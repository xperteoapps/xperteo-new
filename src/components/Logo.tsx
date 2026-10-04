import Link from "next/link";

/**
 * Wordmark XPERTEO (DESIGN.md §2): "XPER" biały / "TEO" żółty
 * + żółty kwadrat z czarnym X. Bez czapki akademickiej.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Xperteo — strona główna"
      className={`inline-flex items-center gap-2 font-sans text-xl font-bold tracking-tight ${className}`}
    >
      <span aria-hidden="true" className="flex items-baseline leading-none">
        <span className="text-fg">XPER</span>
        <span className="text-signal">TEO</span>
      </span>
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        className="shrink-0"
      >
        <rect width="22" height="22" rx="2" fill="var(--signal)" />
        <path
          d="M6 6l10 10M16 6L6 16"
          stroke="var(--signal-ink)"
          strokeWidth="2.6"
          strokeLinecap="square"
        />
      </svg>
    </Link>
  );
}
