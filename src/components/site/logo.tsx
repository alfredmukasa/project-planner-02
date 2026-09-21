import Link from 'next/link';

/** Original Project Planner mark: a compact planning grid with one filled cell. */
export function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden focusable="false">
      <rect x="1" y="1" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4.5" y="4.5" width="4.5" height="4.5" rx="1" fill="currentColor" />
      <rect x="11" y="4.5" width="4.5" height="4.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <rect x="4.5" y="11" width="4.5" height="4.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <rect x="11" y="11" width="4.5" height="4.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-text font-semibold tracking-tight" aria-label="Project Planner home">
      <span className="text-accent">
        <LogoMark />
      </span>
      {!compact && <span>Project Planner</span>}
    </Link>
  );
}
