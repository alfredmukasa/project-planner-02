import type { Metadata } from 'next';

import { DemoStatus } from '@/components/preview/demo-status';
import { DataFlowPreview, SystemMapPreview } from '@/components/preview/screens';
import { Callout, PageHero, Section, SectionHeading } from '@/components/ui/primitives';
import { components, decisions, flowEdges, flowNodes, sectionLabels } from '@/content/demo-project';

export const metadata: Metadata = {
  title: 'Architecture & Data Flow',
  description: 'How Project Planner models architecture components, dependencies and data flow — and how the desktop application itself is structured.',
};

const appLayers = [
  { name: 'UI', body: 'Application shell (sidebar, workspace, inspector), design system, screens. Consumes typed view models only.' },
  { name: 'Domain', body: 'Project, Requirement, Phase, Milestone, Task, ArchitectureComponent, DataFlowNode/Edge, Agent, AgentRun, MCPServer, Skill, Memory, Artifact, Decision, Audit, Test, Provider, Environment, GitState, Export.' },
  { name: 'Application services', body: 'Project creation and import, planning, traceability, graph building, blueprint and export generation, audits, event bus.' },
  { name: 'AI', body: 'Provider abstraction (OpenAI, Anthropic, Google, DeepSeek, compatible), model selection and fallback, cost tracking, agent runtime, skills, MCP client.' },
  { name: 'Visualization', body: 'Graph model, layered layout, filtering, grouping, highlighting, inspector integration.' },
  { name: 'Infrastructure & integrations', body: 'Local project storage, file system, file watcher, terminal (PowerShell, cmd, WSL), Git, environment detection, native notifications.' },
  { name: 'Security', body: 'Path validation, secret redaction, permission model for MCP, providers and command execution, encrypted local credential storage, audit records.' },
];

export default function ArchitecturePage() {
  return (
    <>
      <PageHero eyebrow="Architecture & data flow" title="Graphs generated from the project, not drawn by hand" description="Project Planner keeps architecture as data: components with types, technologies, dependencies, inputs, outputs and owners; flows with data types, classification and encryption. The System Map and Data Flow screens render that data — so when the project changes, the diagrams change with it." />

      <Section id="system-map">
        <SectionHeading eyebrow="System map" title="Components and dependencies" description="Fifteen components of the demo project across nine sections. Selecting the Sync API highlights its dependencies and the components that use it; the inspector shows technology, inputs, outputs, requirements and owner." />
        <div className="mt-8">
          <SystemMapPreview />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c) => (
            <div key={c.id} className="rounded-md border border-border bg-surface p-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xs text-text-faint">{c.ref}</span>
                <span className="font-medium">{c.name}</span>
                <span className="ml-auto">
                  <DemoStatus value={c.status} />
                </span>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                {sectionLabels[c.section]} · {c.technology}
              </p>
              <p className="mt-1 text-xs text-text-muted">{c.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted id="data-flow">
        <SectionHeading eyebrow="Data flow" title="How data moves — and what kind of data it is" description="User → Interface → Application logic → AI and services → Database → External services → Result. Every edge in the demo project carries a data type and a classification, which is exactly what the Security Agent audits." />
        <div className="mt-8">
          <DataFlowPreview />
        </div>
        <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-text-faint">
              <tr>
                {['From', 'To', 'Data', 'Classification', 'Encrypted'].map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flowEdges.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-3 py-2">{flowNodes.find((n) => n.id === e.from)?.name}</td>
                  <td className="px-3 py-2">{flowNodes.find((n) => n.id === e.to)?.name}</td>
                  <td className="px-3 py-2 text-text-muted">{e.data}</td>
                  <td className="px-3 py-2">
                    <DemoStatus value={e.classification === 'personal' ? 'high' : e.classification === 'credential' ? 'critical' : 'low'} />
                    <span className="ml-1 text-xs text-text-muted">{e.classification}</span>
                  </td>
                  <td className="px-3 py-2 text-text-muted">{e.encrypted ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="decisions">
        <SectionHeading eyebrow="Decision records" title="Why the architecture looks the way it does" description="Architecture decision records keep the reasoning next to the result. The demo project records five." />
        <ol className="mt-8 divide-y divide-border rounded-lg border border-border bg-surface">
          {decisions.map((d) => (
            <li key={d.ref} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
              <span className="font-mono text-xs text-text-faint">{d.ref}</span>
              <span className="font-medium">{d.title}</span>
              <span className="ml-auto flex items-center gap-3 text-xs text-text-faint">
                {d.date}
                <DemoStatus value={d.status} />
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section muted id="application-architecture">
        <SectionHeading eyebrow="The application itself" title="How the Windows application is structured" description="Project Planner is built in clearly separated layers so that a future web edition can share the domain model and design system while the desktop layer stays isolated behind a platform abstraction." />
        <ol className="mt-8 grid gap-3 md:grid-cols-2">
          {appLayers.map((l, i) => (
            <li key={l.name} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xs text-text-faint">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-semibold">{l.name}</h3>
              </div>
              <p className="mt-1.5 text-sm text-text-muted">{l.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-5 prose-pp">
            <h3 className="!mt-0">Project identity: the .pp file</h3>
            <p>Every Project Planner-managed project carries a plain-text <code>.pp</code> file in its root. It tells humans and AI development tools to read the planning directory first — identity, requirements, architecture, development instructions, agent instructions, skills, MCP configuration, memory, constraints, security, testing and deployment requirements — before acting.</p>
            <pre>
              <code>{`# Project Planner identity file
version = 1
project = Atlas Field Service
project_type = saas
planner_folder = ./project-planner
schema_version = 1
created_at = 2026-08-14`}</code>
            </pre>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5 prose-pp">
            <h3 className="!mt-0">Planning directory</h3>
            <p>Planning documentation lives beside the application source, never inside it.</p>
            <pre>
              <code>{`ProjectRoot/
├── .pp
├── application/
└── project-planner/
    ├── README.md
    ├── project-identity/   ├── requirements/
    ├── architecture/       ├── data-flow/
    ├── ui-ux/              ├── agents/
    ├── skills/             ├── mcp/
    ├── memory/             ├── development/
    ├── testing/            ├── security/
    ├── compliance/         ├── deployment/
    ├── decisions/          ├── changelog/
    ├── artifacts/          ├── presentations/
    └── blueprint/`}</code>
            </pre>
          </div>
        </div>
        <Callout className="mt-8" tone="neutral">
          Diagrams and tables on this page are rendered from demo project content and illustrate planned behaviour of the Windows application.
        </Callout>
      </Section>
    </>
  );
}
