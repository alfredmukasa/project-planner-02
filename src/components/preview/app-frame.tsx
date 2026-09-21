import { Bell, ChevronDown, Minus, Search, Square, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { demoProject } from '@/content/demo-project';
import { PreviewLabel } from '@/components/ui/primitives';

/** Sidebar structure of the planned desktop application. */
export const sidebarGroups = [
  { title: 'Workspace', items: ['Overview', 'Project', 'Plan', 'Requirements', 'Milestones', 'Tasks'] },
  { title: 'Architecture', items: ['Architecture', 'System Map', 'Data Flow', 'Dependencies', 'Integrations', 'Database', 'APIs'] },
  { title: 'AI', items: ['Agents', 'Agent Groups', 'MCP', 'Skills', 'Memory', 'AI Providers', 'Agent Activity'] },
  { title: 'Development', items: ['Files', 'Terminal', 'Git', 'Environment', 'Testing', 'Builds'] },
  { title: 'Documentation', items: ['Documentation', 'Blueprint', 'Decisions', 'Change Log', 'Export'] },
  { title: 'Quality', items: ['Audit', 'Security', 'Accessibility', 'Compliance', 'Cost Analysis'] },
  { title: 'Settings', items: ['Project Settings', 'Application Settings', 'Account', 'Theme', 'Shortcuts'] },
] as const;

interface AppFrameProps {
  active: string;
  title: string;
  children: ReactNode;
  inspector?: ReactNode;
  /** Sidebar groups to render; defaults to the groups containing `active` plus neighbours. */
  groups?: readonly string[];
  className?: string;
  compact?: boolean;
}

/**
 * Static representation of the desktop application shell: Windows-style title
 * bar, top bar, grouped sidebar, workspace and optional inspector. Purely
 * presentational; nothing here is interactive product functionality.
 */
export function AppFrame({ active, title, children, inspector, groups, className = '', compact = false }: AppFrameProps) {
  const visibleGroups = groups ? sidebarGroups.filter((g) => groups.includes(g.title)) : sidebarGroups;
  return (
    <figure className={`overflow-hidden rounded-lg border border-border bg-surface text-[11px] leading-4 text-text shadow-[var(--shadow)] ${className}`} aria-label={`Preview of the ${title} screen in the Project Planner desktop application`}>
      {/* title bar */}
      <div className="flex h-8 items-center gap-2 border-b border-border bg-bg-subtle px-3 text-text-muted select-none">
        <span className="font-medium text-text">Project Planner</span>
        <span className="text-text-faint">—</span>
        <span className="truncate">{demoProject.name}</span>
        <span className="ml-1 rounded-sm border border-border px-1 text-2xs uppercase tracking-wide text-text-faint">Demo</span>
        <span className="ml-auto inline-flex items-center gap-3 text-text-faint" aria-hidden>
          <Minus size={11} />
          <Square size={9} />
          <X size={11} />
        </span>
      </div>
      {/* top bar */}
      <div className="flex h-9 items-center gap-2 border-b border-border px-3">
        <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-2 px-1.5 py-0.5 font-medium">
          {demoProject.name}
          <ChevronDown size={10} aria-hidden />
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm border border-warning/40 bg-warning-soft px-1.5 py-0.5 text-warning">
          <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden /> {demoProject.statusLabel}
        </span>
        <span className="hidden sm:inline-flex flex-1 max-w-[280px] items-center gap-1.5 rounded-sm border border-border bg-bg px-2 py-0.5 text-text-faint">
          <Search size={10} aria-hidden />
          Search or run a command
          <kbd className="ml-auto !text-[9px]">Ctrl K</kbd>
        </span>
        <span className="ml-auto inline-flex items-center gap-2 text-text-muted">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent pp-pulse" aria-hidden />3 agents running
          </span>
          <Bell size={11} aria-hidden />
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface-2 text-2xs font-semibold">D</span>
        </span>
      </div>
      <div className={`grid ${inspector ? 'md:grid-cols-[168px_1fr] lg:grid-cols-[168px_1fr_220px]' : 'md:grid-cols-[168px_1fr]'}`}>
        {/* sidebar */}
        <nav aria-label="Preview sidebar" className={`hidden md:block border-r border-border bg-bg-subtle px-2 py-2 ${compact ? 'max-h-[360px]' : 'max-h-[520px]'} overflow-hidden`}>
          {visibleGroups.map((g) => (
            <div key={g.title} className="mb-2">
              <p className="px-2 pb-0.5 pt-1 text-2xs font-semibold uppercase tracking-wide text-text-faint">{g.title}</p>
              <ul>
                {g.items.map((item) => (
                  <li key={item}>
                    <span className={`flex items-center rounded-sm px-2 py-[3px] ${item === active ? 'bg-surface-3 font-medium text-text' : 'text-text-muted'}`} aria-current={item === active ? 'page' : undefined}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* workspace */}
        <div className={`min-w-0 ${compact ? 'min-h-[300px]' : 'min-h-[420px]'} bg-surface`}>
          <div className="flex h-8 items-center gap-2 border-b border-border px-3">
            <h3 className="text-xs font-semibold text-text">{title}</h3>
            <span className="ml-auto">
              <PreviewLabel />
            </span>
          </div>
          <div className="p-3">{children}</div>
        </div>
        {/* inspector */}
        {inspector && (
          <aside aria-label="Preview inspector" className="hidden lg:block border-l border-border bg-bg-subtle">
            <div className="flex h-8 items-center border-b border-border px-3 text-xs font-semibold">Inspector</div>
            <div className="p-3 space-y-2.5">{inspector}</div>
          </aside>
        )}
      </div>
    </figure>
  );
}

export function InspectorField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-2xs uppercase tracking-wide text-text-faint">{label}</p>
      <div className="mt-0.5 text-[11px] text-text">{children}</div>
    </div>
  );
}

export function MiniTable({ columns, rows, className = '' }: { columns: readonly string[]; rows: readonly (readonly ReactNode[])[]; className?: string }) {
  return (
    <div className={`overflow-x-auto rounded-md border border-border ${className}`}>
      <table className="w-full text-left text-[11px]">
        <thead className="bg-bg-subtle text-2xs uppercase tracking-wide text-text-faint">
          <tr>
            {columns.map((c) => (
              <th key={c} className="whitespace-nowrap px-2 py-1.5 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((cell, j) => (
                <td key={j} className="px-2 py-1.5 align-top whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
