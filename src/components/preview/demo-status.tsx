import { StatusPill } from '@/components/ui/primitives';
import { status, type StatusKey } from '@/content/demo-project';

export function DemoStatus({ value }: { value: StatusKey | string }) {
  const meta = status[value as StatusKey] ?? { label: value.replace(/_/g, ' '), tone: 'neutral' as const };
  return <StatusPill label={meta.label} tone={meta.tone} />;
}

export function ProgressBar({ value, label }: { value: number | null; label: string }) {
  if (value === null) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-surface-3" role="img" aria-label={`${label}: not evaluated`} />
        <span className="w-20 text-right text-2xs text-text-faint">Not evaluated</span>
      </div>
    );
  }
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-20 text-right text-2xs tabular-nums text-text-muted">{pct}%</span>
    </div>
  );
}
