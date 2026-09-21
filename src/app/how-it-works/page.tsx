import type { Metadata } from 'next';

import { AgentsPreview, BlueprintPreview, DataFlowPreview, PlanningPreview, RequirementsPreview, SystemMapPreview } from '@/components/preview/screens';
import { ButtonLink, Callout, PageHero, Section, SectionHeading } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Ten steps from idea to exported blueprint: create a project, describe the idea, define requirements, plan, design the architecture, visualise the system, configure agents, prepare development, test and audit, export.',
};

const steps = [
  { n: 1, title: 'Create a project', body: 'Start from a name, description and project type (web, desktop, mobile, API, AI application, SaaS, library). Choose target platforms, stack, database and where the project lives on disk. Project Planner writes a .pp identity file and a project-planner/ documentation directory next to your source.' },
  { n: 2, title: 'Describe your idea', body: 'Write the idea in plain language. The Product Planner and Requirements Analyst agents propose scope, phases and candidate requirements — every proposal is reviewed by you before it becomes part of the project.' },
  { n: 3, title: 'Define requirements', body: 'Requirements get stable IDs (REQ-001…), a kind, priority, status, source and acceptance criteria. Dependencies between requirements are explicit, and each one links forward to tasks, components and the agent responsible.', preview: <RequirementsPreview /> },
  { n: 4, title: 'Build the plan', body: 'Phases contain milestones; milestones contain tasks and subtasks with estimates, dependencies and acceptance criteria. Progress on the Overview is computed from this plan, never typed in.', preview: <PlanningPreview compact /> },
  { n: 5, title: 'Design the architecture', body: 'Describe components across frontend, backend, database, APIs, authentication, storage, AI, external services, infrastructure, deployment and security. Each component has a type, technology, inputs, outputs, dependencies, owner agent and status.' },
  { n: 6, title: 'Visualise the system', body: 'The System Map and Data Flow screens are generated from those components and flows. Zoom, pan, filter by view, select a node and inspect its dependencies, related requirements and tasks in the inspector.', preview: <SystemMapPreview compact /> },
  { n: 7, title: 'Configure AI agents', body: 'Nineteen agents in five groups come pre-configured. Assign skills and MCP servers, pick a provider and model per agent, and decide what memory each agent may read. Agent runs are recorded with tool calls, artifacts and warnings.', preview: <AgentsPreview compact /> },
  { n: 8, title: 'Prepare development', body: 'The Development section detects your environment (Node, Python, Git, Docker, WSL, editors), shows Git status and history, offers a terminal workspace and tracks tests and builds — so the plan meets the machine it will be built on.' },
  { n: 9, title: 'Test and audit', body: 'Testing plans are derived from acceptance criteria. Audits check requirements, architecture, security, accessibility, dependencies, performance, documentation, privacy, compliance and deployment, each finding carrying evidence, severity and a recommendation.' },
  { n: 10, title: 'Export the project blueprint', body: 'Generate the blueprint, presentation outline and export package from live data as Markdown, JSON, HTML or PDF. Decisions, versions and relationships are preserved so another team — or another tool — can pick up exactly where you left off.', preview: <DataFlowPreview compact /> },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero eyebrow="How it works" title="Ten steps from an idea to a development-ready blueprint" description="Project Planner guides a project through a fixed sequence of phases, but never locks you in: you can revisit any step, and every change is traced to the requirement, task or decision it affects.">
        <ButtonLink href="/features/" variant="secondary">
          Explore the features
        </ButtonLink>
        <ButtonLink href="/download/">Windows preview status</ButtonLink>
      </PageHero>

      <Section>
        <ol className="space-y-14">
          {steps.map((s) => (
            <li key={s.n} className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface font-mono text-sm font-semibold text-accent">{String(s.n).padStart(2, '0')}</span>
                  <h2 className="text-lg font-semibold tracking-tight">{s.title}</h2>
                </div>
                <p className="mt-3 text-sm text-text-muted">{s.body}</p>
              </div>
              <div className="min-w-0">{s.preview ?? <div className="hidden lg:block h-px" />}</div>
            </li>
          ))}
        </ol>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Why use Project Planner?" title="Understand the project before implementation begins" description="Most projects fail on misunderstanding, not on typing speed. Project Planner makes the understanding explicit: what is being built, why, how the parts connect, which agent or person owns each piece, and what is still unknown." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['For solo developers', 'Turn a rough idea into a plan you can actually execute, with an AI workforce that proposes rather than decides.'],
            ['For teams', 'Share one traceable model of requirements, architecture and tasks instead of five disconnected documents.'],
            ['For AI development tools', 'The .pp identity file and planning directory tell any coding assistant what the project is, how it is structured and what rules apply — before it writes a line.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-border bg-surface p-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-text-muted">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <BlueprintPreview compact />
        </div>
        <Callout className="mt-8" tone="neutral">
          Previews on this page use demo project content and represent planned functionality of the Windows application.
        </Callout>
      </Section>
    </>
  );
}
