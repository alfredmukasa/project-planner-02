import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, ArrowRight, CircleCheck, CircleDashed, CircleHelp, Info, OctagonX } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ Button */

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-strong border border-transparent',
  secondary: 'bg-surface text-text border border-border hover:border-border-strong',
  ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-surface-2 border border-transparent',
};
const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-3.5 text-sm',
  lg: 'h-10 px-4 text-sm',
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  external = false,
  icon,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  icon?: boolean;
}) {
  const cls = `inline-flex items-center gap-1.5 rounded-md font-medium transition-colors ${variantClass[variant]} ${sizeClass[size]} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls}>
        {children}
        {icon && <ArrowRight size={14} aria-hidden />}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {icon && <ArrowRight size={14} aria-hidden />}
    </Link>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ariaDescribedBy,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  ariaDescribedBy?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------- Badge */

export type Tone = 'neutral' | 'info' | 'active' | 'success' | 'warning' | 'danger';

const toneClass: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-text-muted border-border',
  info: 'bg-info-soft text-info border-info/30',
  active: 'bg-accent-soft text-accent border-accent/30',
  success: 'bg-success-soft text-success border-success/30',
  warning: 'bg-warning-soft text-warning border-warning/30',
  danger: 'bg-danger-soft text-danger border-danger/30',
};

const toneIcon: Record<Tone, LucideIcon> = {
  neutral: CircleHelp,
  info: Info,
  active: CircleDashed,
  success: CircleCheck,
  warning: AlertTriangle,
  danger: OctagonX,
};

export function Badge({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-px text-2xs font-medium leading-4 ${toneClass[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Status is always icon + label + colour, never colour alone. */
export function StatusPill({ label, tone, icon: Icon, className = '' }: { label: string; tone: Tone; icon?: LucideIcon; className?: string }) {
  const I = Icon ?? toneIcon[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-px text-2xs font-medium leading-4 whitespace-nowrap ${toneClass[tone]} ${className}`}>
      <I size={11} aria-hidden />
      {label}
    </span>
  );
}

/* ----------------------------------------------------------------- Layout */

export function Section({ children, className = '', id, muted = false }: { children: ReactNode; className?: string; id?: string; muted?: boolean }) {
  return (
    <section id={id} className={`${muted ? 'bg-bg-subtle border-y border-border' : ''} ${className}`}>
      <div className="container-x py-16 md:py-20">{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: { eyebrow?: string; title: string; description?: ReactNode; align?: 'left' | 'center' }) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl md:text-[28px] font-semibold tracking-tight text-text">{title}</h2>
      {description && <div className="mt-3 text-[15px] text-text-muted">{description}</div>}
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <div className="border-b border-border bg-bg-subtle">
      <div className="container-x py-14 md:py-16">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>}
          <h1 className="mt-2 text-3xl md:text-[38px] leading-[1.15] font-semibold tracking-tight text-text">{title}</h1>
          {description && <p className="mt-4 text-base md:text-[17px] text-text-muted">{description}</p>}
          {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export function Card({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'article' | 'li' }) {
  return <Tag className={`rounded-lg border border-border bg-surface ${className}`}>{children}</Tag>;
}

export function FeatureItem({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-accent">
        <Icon size={15} aria-hidden />
      </span>
      <div>
        <h3 className="text-[15px] font-semibold text-text">{title}</h3>
        <p className="mt-1 text-sm text-text-muted">{children}</p>
      </div>
    </li>
  );
}

/* ---------------------------------------------------------------- Callout */

export function Callout({ tone = 'info', title, children, className = '' }: { tone?: 'info' | 'warning' | 'neutral'; title?: string; children: ReactNode; className?: string }) {
  const Icon = tone === 'warning' ? AlertTriangle : Info;
  const cls = tone === 'warning' ? 'border-warning/40 bg-warning-soft text-text' : tone === 'info' ? 'border-info/30 bg-info-soft text-text' : 'border-border bg-surface-2 text-text';
  return (
    <div role="note" className={`flex gap-2.5 rounded-md border px-3.5 py-3 text-sm ${cls} ${className}`}>
      <Icon size={16} aria-hidden className={`mt-0.5 shrink-0 ${tone === 'warning' ? 'text-warning' : tone === 'info' ? 'text-info' : 'text-text-muted'}`} />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-text-muted">{children}</div>
      </div>
    </div>
  );
}

/** Every mock interface carries this label so preview content is never mistaken for a live product. */
export function PreviewLabel({ children = 'Preview — demo project content' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-2 px-1.5 py-px text-2xs font-medium uppercase tracking-wide text-text-faint" data-testid="preview-label">
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd>{children}</kbd>;
}
