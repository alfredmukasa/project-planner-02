import { Clock, Wrench } from 'lucide-react';

import {
  activity,
  agentRuns,
  agents,
  artifacts,
  auditItems,
  components,
  decisions,
  demoProject,
  flowEdges,
  flowNodes,
  health,
  metrics,
  milestones,
  progress,
  requirements,
  sectionLabels,
  tasks,
} from '@/content/demo-project';

import { AppFrame, InspectorField, MiniTable } from './app-frame';
import { DemoStatus, ProgressBar } from './demo-status';
import { GraphSvg } from './graph-svg';

/* ------------------------------------------------------------- Overview */

export function OverviewPreview({ compact = false }: { compact?: boolean }) {
  return (
    <AppFrame active="Overview" title="Overview" compact={compact} groups={['Workspace', 'Architecture', 'AI', 'Development']}>
      <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <div className="rounded-md border border-border p-3">
            <div className="flex items-start gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold">{demoProject.name}</p>
                <p className="mt-0.5 text-text-muted">{demoProject.description}</p>
              </div>
              <span className="ml-auto shrink-0 rounded-sm border border-border px-1.5 py-0.5 text-2xs text-text-muted">{demoProject.type}</span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4 text-2xs">
              {[
                ['Status', demoProject.statusLabel],
                ['Phase', demoProject.phase],
                ['Created', demoProject.created],
                ['Updated', demoProject.updated],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="uppercase tracking-wide text-text-faint">{k}</dt>
                  <dd className="text-text">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-2xs font-semibold uppercase tracking-wide text-text-faint">Progress</p>
            <div className="space-y-1.5">
              {progress.slice(0, compact ? 4 : 7).map((p) => (
                <div key={p.label} className="grid grid-cols-[88px_1fr] items-center gap-2">
                  <span className="text-text-muted">{p.label}</span>
                  <ProgressBar value={p.value} label={p.label} />
                </div>
              ))}
            </div>
          </div>
          {!compact && (
            <div className="grid grid-cols-4 gap-2">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-md border border-border px-2 py-1.5">
                  <p className="text-sm font-semibold tabular-nums">{m.value}</p>
                  <p className="text-2xs text-text-faint">{m.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-2xs font-semibold uppercase tracking-wide text-text-faint">Health</p>
            <ul className="space-y-1.5">
              {health.slice(0, compact ? 4 : 7).map((h) => (
                <li key={h.label} className="flex items-center gap-2">
                  <DemoStatus value={h.state} />
                  <span className="truncate text-text">{h.label}</span>
                  <span className="ml-auto truncate text-text-faint">{h.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-2xs font-semibold uppercase tracking-wide text-text-faint">Activity</p>
            <ol className="space-y-1.5">
              {activity.slice(0, compact ? 4 : 7).map((a) => (
                <li key={a.time + a.text} className="flex gap-2">
                  <span className="w-9 shrink-0 font-mono text-text-faint">{a.time}</span>
                  <span className="text-text-muted">
                    <span className="font-medium text-text">{a.actor}</span> {a.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ----------------------------------------------------------- System map */

export function SystemMapPreview({ compact = false }: { compact?: boolean }) {
  const selected = components.find((c) => c.id === 'sync-api')!;
  const nodes = components.map((c) => ({ id: c.id, label: c.name, group: c.section, kind: sectionLabels[c.section].toLowerCase().replace(' services', ''), status: c.status }));
  const edges = components.flatMap((c) => c.dependsOn.map((d) => ({ id: `${c.id}->${d}`, source: d, target: c.id })));
  return (
    <AppFrame
      active="System Map"
      title="System Map"
      compact={compact}
      groups={['Workspace', 'Architecture', 'AI']}
      inspector={
        <>
          <InspectorField label="Component">
            <span className="font-semibold">{selected.ref}</span> {selected.name}
          </InspectorField>
          <InspectorField label="Type">{sectionLabels[selected.section]} · {selected.technology}</InspectorField>
          <InspectorField label="Status">
            <DemoStatus value={selected.status} />
          </InspectorField>
          <InspectorField label="Description">{selected.description}</InspectorField>
          <InspectorField label="Depends on">
            {selected.dependsOn.map((d) => components.find((c) => c.id === d)?.name).join(', ')}
          </InspectorField>
          <InspectorField label="Used by">{components.filter((c) => c.dependsOn.includes(selected.id)).map((c) => c.name).join(', ')}</InspectorField>
          <InspectorField label="Inputs">{selected.inputs.join(', ')}</InspectorField>
          <InspectorField label="Outputs">{selected.outputs.join(', ')}</InspectorField>
          <InspectorField label="Requirements">{selected.requirements.join(', ')}</InspectorField>
          <InspectorField label="Owner">{selected.owner}</InspectorField>
        </>
      }
    >
      <div className="mb-2 flex flex-wrap gap-1 text-2xs">
        {['System', 'Frontend', 'Backend', 'Database', 'AI', 'APIs', 'Infrastructure'].map((v, i) => (
          <span key={v} className={`rounded-sm border px-1.5 py-0.5 ${i === 0 ? 'border-border-strong bg-surface-2 font-medium text-text' : 'border-border text-text-muted'}`}>
            {v}
          </span>
        ))}
      </div>
      <GraphSvg nodes={nodes} edges={edges} selectedId={selected.id} ariaLabel="System map of the demo project showing fifteen components and their dependencies, with the Sync API selected" />
    </AppFrame>
  );
}

/* ------------------------------------------------------------ Data flow */

export function DataFlowPreview({ compact = false }: { compact?: boolean }) {
  const selected = flowNodes.find((n) => n.id === 'router')!;
  const nodes = flowNodes.map((n) => ({ id: n.id, label: n.name, group: n.type, kind: n.type }));
  const edges = flowEdges.map((e) => ({ id: e.id, source: e.from, target: e.to, label: e.data.length > 18 ? `${e.data.slice(0, 17)}…` : e.data }));
  const inbound = flowEdges.filter((e) => e.to === selected.id);
  const outbound = flowEdges.filter((e) => e.from === selected.id);
  return (
    <AppFrame
      active="Data Flow"
      title="Data Flow"
      compact={compact}
      groups={['Workspace', 'Architecture', 'AI']}
      inspector={
        <>
          <InspectorField label="Node">
            <span className="font-semibold">{selected.ref}</span> {selected.name}
          </InspectorField>
          <InspectorField label="Type">{selected.type}</InspectorField>
          <InspectorField label="Description">{selected.description}</InspectorField>
          <InspectorField label="Inputs">
            <ul className="list-disc pl-3">
              {inbound.map((e) => (
                <li key={e.id}>
                  {e.data} <span className="text-text-faint">from {flowNodes.find((n) => n.id === e.from)?.name}</span>
                </li>
              ))}
            </ul>
          </InspectorField>
          <InspectorField label="Outputs">
            <ul className="list-disc pl-3">
              {outbound.map((e) => (
                <li key={e.id}>
                  {e.data} <span className="text-text-faint">to {flowNodes.find((n) => n.id === e.to)?.name}</span>
                </li>
              ))}
            </ul>
          </InspectorField>
          <InspectorField label="Component">{components.find((c) => c.id === selected.component)?.name}</InspectorField>
          <InspectorField label="Requirements">REQ-003</InspectorField>
          <InspectorField label="Responsible agent">Technical Planner</InspectorField>
          <InspectorField label="Security">Anonymised job data only; PII never leaves the tenant boundary (AUD-001 open).</InspectorField>
        </>
      }
    >
      <div className="mb-2 flex flex-wrap items-center gap-1 text-2xs text-text-muted">
        <span className="rounded-sm border border-border-strong bg-surface-2 px-1.5 py-0.5 font-medium text-text">All data</span>
        {['Personal', 'Internal', 'Credential'].map((c) => (
          <span key={c} className="rounded-sm border border-border px-1.5 py-0.5">
            {c}
          </span>
        ))}
        <span className="ml-auto">Show external services · Show infrastructure</span>
      </div>
      <GraphSvg nodes={nodes} edges={edges} selectedId={selected.id} ariaLabel="Data flow of the demo project from the technician through the mobile app, sync API, database and routing agent to the dispatcher console" />
    </AppFrame>
  );
}

/* --------------------------------------------------------------- Agents */

export function AgentsPreview({ compact = false }: { compact?: boolean }) {
  const counts = {
    running: agentRuns.filter((r) => r.status === 'running').length,
    waiting: agentRuns.filter((r) => r.status === 'waiting').length,
    queued: agentRuns.filter((r) => r.status === 'queued').length,
    completed: agentRuns.filter((r) => r.status === 'completed').length,
  };
  const selected = agentRuns[0]!;
  return (
    <AppFrame
      active="Agent Activity"
      title="Agent Activity"
      compact={compact}
      groups={['Workspace', 'AI', 'Quality']}
      inspector={
        <>
          <InspectorField label="Run">{selected.agent}</InspectorField>
          <InspectorField label="Task">{selected.task}</InspectorField>
          <InspectorField label="Status">
            <DemoStatus value={selected.status} />
          </InspectorField>
          <InspectorField label="Current step">{selected.step}</InspectorField>
          <InspectorField label="Progress">
            <ProgressBar value={selected.progress} label="Run progress" />
          </InspectorField>
          <InspectorField label="Started · Elapsed">
            {selected.started} · {selected.elapsed}
          </InspectorField>
          <InspectorField label="Tool calls">
            <ul className="space-y-0.5 font-mono text-2xs">
              <li>read_artifact ART-005 · 120 ms</li>
              <li>list_requirements REQ-001, REQ-005 · 48 ms</li>
              <li>read_component CMP-003 · 61 ms</li>
              <li>write_artifact ART-005 v3 (draft) · 210 ms</li>
            </ul>
          </InspectorField>
          <InspectorField label="Provider · Model">Configured provider · default model</InspectorField>
          <InspectorField label="Warnings">None</InspectorField>
        </>
      }
    >
      <div className="mb-3 grid grid-cols-4 gap-2">
        {(
          [
            ['Running', counts.running, 'running'],
            ['Waiting', counts.waiting, 'waiting'],
            ['Queued', counts.queued, 'queued'],
            ['Completed', counts.completed, 'completed'],
          ] as const
        ).map(([label, n, key]) => (
          <div key={label} className="rounded-md border border-border px-2 py-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tabular-nums">{n}</span>
              <DemoStatus value={key} />
            </div>
            <p className="text-2xs text-text-faint">{label}</p>
          </div>
        ))}
      </div>
      <MiniTable
        columns={['Agent', 'Task', 'Status', 'Current step', 'Progress', 'Elapsed', 'Tools']}
        rows={agentRuns.slice(0, compact ? 4 : 6).map((r) => [
          <span key="a" className="font-medium">
            {r.agent}
          </span>,
          <span key="t" className="text-text-muted">
            {r.task}
          </span>,
          <DemoStatus key="s" value={r.status} />,
          <span key="st" className="max-w-[220px] truncate inline-block text-text-muted">
            {r.step}
          </span>,
          <span key="p" className="inline-block w-20">
            <ProgressBar value={r.progress} label="Progress" />
          </span>,
          <span key="e" className="font-mono text-text-muted">
            {r.elapsed}
          </span>,
          <span key="tc" className="tabular-nums text-text-muted">
            {r.toolCalls}
          </span>,
        ])}
      />
      {!compact && (
        <p className="mt-2 flex items-center gap-1 text-2xs text-text-faint">
          <Clock size={10} aria-hidden /> Runs update live from execution events. Simulated runs are labelled; a run is never shown as model-backed without a configured provider.
        </p>
      )}
    </AppFrame>
  );
}

export function AgentGroupsPreview() {
  const groups = ['Software', 'Design', 'Planning', 'Quality', 'Documentation'] as const;
  return (
    <AppFrame active="Agents" title="Agents" groups={['AI']} compact>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <div key={g} className="rounded-md border border-border p-2">
            <p className="mb-1 text-2xs font-semibold uppercase tracking-wide text-text-faint">{g}</p>
            <ul className="space-y-1">
              {agents
                .filter((a) => a.group === g)
                .map((a) => (
                  <li key={a.name} className="flex items-center gap-2">
                    <span className="truncate font-medium">{a.name}</span>
                    <span className="ml-auto">
                      <DemoStatus value={a.status} />
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

/* ------------------------------------------------------------- Planning */

export function PlanningPreview({ compact = false }: { compact?: boolean }) {
  const selected = tasks.find((t) => t.ref === 'TSK-007')!;
  return (
    <AppFrame
      active="Tasks"
      title="Tasks"
      compact={compact}
      groups={['Workspace', 'Architecture']}
      inspector={
        <>
          <InspectorField label="Task">
            <span className="font-semibold">{selected.ref}</span> {selected.title}
          </InspectorField>
          <InspectorField label="Status">
            <DemoStatus value={selected.status} />
          </InspectorField>
          <InspectorField label="Priority">
            <DemoStatus value={selected.priority} />
          </InspectorField>
          <InspectorField label="Milestone">MS-002 Offline work orders</InspectorField>
          <InspectorField label="Assigned agent">{selected.agent}</InspectorField>
          <InspectorField label="Estimate">{selected.estimate} h</InspectorField>
          <InspectorField label="Requirements">REQ-001, REQ-005</InspectorField>
          <InspectorField label="Components">CMP-004 Sync API, CMP-010 Sync log</InspectorField>
          <InspectorField label="Blocked by">Open question from Backend Engineer (run-4)</InspectorField>
          <InspectorField label="Acceptance criteria">
            <ul className="list-disc pl-3">
              <li>No technician change is lost during sync</li>
              <li>Conflicts appear in the merge log with both versions</li>
              <li>Signature conflicts require explicit resolution</li>
            </ul>
          </InspectorField>
          <InspectorField label="Tests">Test plan ART-007 (draft)</InspectorField>
        </>
      }
    >
      {milestones.slice(0, compact ? 2 : 4).map((m) => {
        const rows = tasks.filter((t) => t.milestone === m.ref);
        return (
          <div key={m.ref} className="mb-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-text-faint">{m.ref}</span>
              <span className="font-semibold">{m.name}</span>
              <span className="ml-auto text-2xs text-text-faint">target {m.target}</span>
            </div>
            <MiniTable
              columns={['Ref', 'Task', 'Status', 'Priority', 'Agent', 'Est.']}
              rows={rows.map((t) => [
                <span key="r" className="font-mono text-text-faint">
                  {t.ref}
                </span>,
                <span key="t" className={t.ref === selected.ref ? 'font-medium' : ''}>
                  {t.title}
                </span>,
                <DemoStatus key="s" value={t.status} />,
                <DemoStatus key="p" value={t.priority} />,
                <span key="a" className="text-text-muted">
                  {t.agent}
                </span>,
                <span key="e" className="tabular-nums text-text-muted">
                  {t.estimate}h
                </span>,
              ])}
            />
          </div>
        );
      })}
    </AppFrame>
  );
}

export function RequirementsPreview() {
  return (
    <AppFrame active="Requirements" title="Requirements" groups={['Workspace', 'Architecture']} compact>
      <MiniTable
        columns={['Ref', 'Requirement', 'Kind', 'Priority', 'Status', 'Tasks']}
        rows={requirements.map((r) => [
          <span key="r" className="font-mono text-text-faint">
            {r.ref}
          </span>,
          <span key="t">{r.title}</span>,
          <span key="k" className="text-text-muted">
            {r.kind}
          </span>,
          <DemoStatus key="p" value={r.priority} />,
          <DemoStatus key="s" value={r.status} />,
          <span key="tk" className="font-mono text-text-muted">
            {r.tasks.join(', ') || '—'}
          </span>,
        ])}
      />
    </AppFrame>
  );
}

/* ---------------------------------------------------------------- Audit */

export function AuditPreview({ compact = false }: { compact?: boolean }) {
  const selected = auditItems[0]!;
  const open = auditItems.filter((a) => a.status === 'open');
  return (
    <AppFrame
      active="Audit"
      title="Audit"
      compact={compact}
      groups={['Workspace', 'Quality', 'Documentation']}
      inspector={
        <>
          <InspectorField label="Finding">
            <span className="font-semibold">{selected.ref}</span> {selected.title}
          </InspectorField>
          <InspectorField label="Category">{selected.category}</InspectorField>
          <InspectorField label="Severity">
            <DemoStatus value={selected.severity} />
          </InspectorField>
          <InspectorField label="Status">
            <DemoStatus value={selected.status} />
          </InspectorField>
          <InspectorField label="Evidence">Edge DFN-007 → DFN-008 carries fields customer.name and site.address (classification: personal).</InspectorField>
          <InspectorField label="Recommendation">{selected.recommendation}</InspectorField>
          <InspectorField label="Related component">{selected.component} Routing agent</InspectorField>
          <InspectorField label="Related requirement">{selected.requirement}</InspectorField>
          <InspectorField label="Actions">
            <span className="inline-flex gap-1">
              <span className="rounded-sm border border-border bg-surface px-1.5 py-0.5">Acknowledge</span>
              <span className="rounded-sm border border-border bg-surface px-1.5 py-0.5">Create task</span>
            </span>
          </InspectorField>
        </>
      }
    >
      <div className="mb-3 grid grid-cols-5 gap-2">
        {(['critical', 'high', 'medium', 'low', 'resolved'] as const).map((s) => (
          <div key={s} className="rounded-md border border-border px-2 py-1.5">
            <p className="text-sm font-semibold tabular-nums">{s === 'resolved' ? auditItems.filter((a) => a.status === 'resolved').length : open.filter((a) => a.severity === s).length}</p>
            <DemoStatus value={s} />
          </div>
        ))}
      </div>
      <MiniTable
        columns={['Ref', 'Category', 'Finding', 'Severity', 'Status', 'Component']}
        rows={auditItems.slice(0, compact ? 5 : 8).map((a) => [
          <span key="r" className="font-mono text-text-faint">
            {a.ref}
          </span>,
          <span key="c" className="text-text-muted">
            {a.category}
          </span>,
          <span key="t" className={a.ref === selected.ref ? 'font-medium' : ''}>
            {a.title}
          </span>,
          <DemoStatus key="s" value={a.severity} />,
          <DemoStatus key="st" value={a.status} />,
          <span key="cm" className="font-mono text-text-muted">
            {a.component ?? '—'}
          </span>,
        ])}
      />
    </AppFrame>
  );
}

/* ------------------------------------------------------------ Blueprint */

export function BlueprintPreview({ compact = false }: { compact?: boolean }) {
  const sections = ['Purpose', 'Requirements', 'Architecture', 'Data Flow', 'AI', 'Development', 'Testing', 'Security', 'Deployment', 'Documentation'];
  return (
    <AppFrame active="Blueprint" title="Blueprint" compact={compact} groups={['Workspace', 'Documentation', 'Quality']}>
      <div className="grid gap-3 md:grid-cols-[170px_1fr]">
        <ol className="rounded-md border border-border bg-bg-subtle p-2 text-text-muted">
          {sections.map((s, i) => (
            <li key={s} className={`flex items-center gap-2 rounded-sm px-2 py-[3px] ${i === 2 ? 'bg-surface-3 font-medium text-text' : ''}`}>
              <span className="w-4 font-mono text-2xs text-text-faint">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </li>
          ))}
        </ol>
        <article className="rounded-md border border-border p-3">
          <div className="flex items-center gap-2 text-2xs text-text-faint">
            <span>ART-008 · Blueprint v6</span>
            <span>·</span>
            <span>generated from project data {demoProject.updated}</span>
            <span className="ml-auto inline-flex gap-1">
              {['Markdown', 'JSON', 'HTML', 'PDF'].map((f) => (
                <span key={f} className="rounded-sm border border-border bg-surface px-1.5 py-0.5">
                  {f}
                </span>
              ))}
            </span>
          </div>
          <h4 className="mt-2 text-sm font-semibold">3. Architecture</h4>
          <p className="mt-1 text-text-muted">
            {components.length} components across {new Set(components.map((c) => c.section)).size} sections. {components.filter((c) => c.status === 'implemented').length} implemented, {components.filter((c) => c.status === 'in_progress').length} in progress, {components.filter((c) => c.status === 'planned').length} planned.
          </p>
          <ul className="mt-2 space-y-1">
            {components.slice(0, compact ? 4 : 7).map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <span className="font-mono text-text-faint">{c.ref}</span>
                <span className="font-medium">{c.name}</span>
                <span className="text-text-faint">— {c.technology}</span>
                <span className="ml-auto">
                  <DemoStatus value={c.status} />
                </span>
              </li>
            ))}
          </ul>
          {!compact && (
            <>
              <h4 className="mt-3 text-sm font-semibold">Decisions referenced</h4>
              <ul className="mt-1 space-y-0.5 text-text-muted">
                {decisions.slice(0, 3).map((d) => (
                  <li key={d.ref}>
                    <span className="font-mono text-text-faint">{d.ref}</span> {d.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </div>
    </AppFrame>
  );
}

export function ArtifactsPreview() {
  return (
    <AppFrame active="Documentation" title="Artifacts" groups={['Documentation', 'Quality']} compact>
      <MiniTable
        columns={['Ref', 'Artifact', 'Type', 'Version', 'Status', 'Author', 'Updated']}
        rows={artifacts.map((a) => [
          <span key="r" className="font-mono text-text-faint">
            {a.ref}
          </span>,
          <span key="t" className="font-medium">
            {a.title}
          </span>,
          <span key="ty" className="text-text-muted">
            {a.type}
          </span>,
          <span key="v" className="tabular-nums text-text-muted">
            v{a.version}
          </span>,
          <DemoStatus key="s" value={a.status} />,
          <span key="au" className="text-text-muted">
            {a.author}
          </span>,
          <span key="u" className="font-mono text-text-faint">
            {a.updated}
          </span>,
        ])}
      />
    </AppFrame>
  );
}

export function EnvironmentPreview() {
  const rows = [
    ['Windows', '11 24H2 · x64', 'available'],
    ['Node.js', '22.14.0', 'available'],
    ['npm', '10.9.7', 'available'],
    ['pnpm', '—', 'missing'],
    ['Git', '2.47.1', 'available'],
    ['Docker Desktop', '4.36', 'available'],
    ['WSL', 'Ubuntu 24.04', 'available'],
    ['Python', '3.11.9', 'outdated'],
    ['PostgreSQL client', '16.4', 'available'],
    ['Visual Studio Code', '1.98', 'available'],
  ] as const;
  const tone: Record<string, 'success' | 'danger' | 'warning'> = { available: 'success', missing: 'danger', outdated: 'warning' };
  return (
    <AppFrame active="Environment" title="Environment" groups={['Development']} compact>
      <p className="mb-2 flex items-center gap-1 text-2xs text-text-faint">
        <Wrench size={10} aria-hidden /> Detected on this machine · sample values shown in this preview
      </p>
      <MiniTable
        columns={['Tool', 'Version', 'Status']}
        rows={rows.map(([tool, version, st]) => [
          <span key="t" className="font-medium">
            {tool}
          </span>,
          <span key="v" className="font-mono text-text-muted">
            {version}
          </span>,
          <span key="s" className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-px text-2xs font-medium ${tone[st] === 'success' ? 'border-success/30 bg-success-soft text-success' : tone[st] === 'danger' ? 'border-danger/30 bg-danger-soft text-danger' : 'border-warning/30 bg-warning-soft text-warning'}`}>
            {st.charAt(0).toUpperCase() + st.slice(1)}
          </span>,
        ])}
      />
    </AppFrame>
  );
}
