import { Bell, Bot, Boxes, Brain, ClipboardList, Cpu, Database, Download, FileText, GitBranch, KeyRound, Layers3, ListChecks, Network, Plug, Search, ShieldCheck, Sparkles, SquareTerminal, Workflow } from 'lucide-react';
import type { Metadata } from 'next';

import { ArtifactsPreview, AuditPreview, EnvironmentPreview, PlanningPreview } from '@/components/preview/screens';
import { Badge, Callout, FeatureItem, PageHero, Section, SectionHeading } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Requirements, planning, architecture, data flow, AI agents, MCP, skills, memory, artifacts, development workspace, audits, blueprint and export — the planned feature set of Project Planner for Windows.',
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero eyebrow="Features" title="Everything a project needs before the first commit" description="The feature set below describes the planned Windows application. Items marked Planned are designed but not yet available in the preview build.">
        <Badge tone="active">Preview scope</Badge>
        <Badge>Planned</Badge>
      </PageHero>

      <Section id="workspace">
        <SectionHeading eyebrow="Workspace" title="Overview, requirements and planning" />
        <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureItem icon={Layers3} title="Overview command centre">
            Project summary, computed progress per phase, health signals, unresolved issues and a live activity stream — one screen that explains the state of the project.
          </FeatureItem>
          <FeatureItem icon={ClipboardList} title="Requirements with stable IDs">
            Functional, non-functional, user, technical, security, accessibility, performance and business requirements, each with priority, status, source, dependencies and acceptance criteria.
          </FeatureItem>
          <FeatureItem icon={ListChecks} title="Phases, milestones, tasks, subtasks">
            A plan tree with estimates, dependencies and acceptance criteria. Task status feeds the Overview automatically.
          </FeatureItem>
          <FeatureItem icon={Workflow} title="Traceability in both directions">
            Requirement → Task → Component → Implementation → Test → Documentation. Every entity page shows what it depends on and what depends on it.
          </FeatureItem>
          <FeatureItem icon={Search} title="Command palette and global search">
            <kbd>Ctrl</kbd> <kbd>K</kbd> opens navigation, projects, commands, agents, files and settings. Search covers requirements, tasks, architecture, agents, artifacts, documentation and decisions.
          </FeatureItem>
          <FeatureItem icon={Bell} title="Notifications and change history">
            Agent completion, errors, audit warnings, exports and builds surface as notifications; every change to a requirement, architecture or decision is recorded.
          </FeatureItem>
        </ul>
        <div id="planning" className="mt-10">
          <PlanningPreview compact />
        </div>
      </Section>

      <Section muted id="architecture">
        <SectionHeading eyebrow="Architecture" title="Components, system map, data flow, dependencies" />
        <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureItem icon={Boxes} title="Architecture components">
            Frontend, backend, database, APIs, authentication, storage, AI, external services, infrastructure, deployment and security — each with technology, inputs, outputs, owner and status.
          </FeatureItem>
          <FeatureItem icon={Network} title="Interactive system map">
            Zoom, pan, select, filter, group and search; highlight dependencies of the selected node; switch between System, Frontend, Backend, Database, AI, APIs and Infrastructure views.
          </FeatureItem>
          <FeatureItem icon={Workflow} title="Data flow with classification">
            Every edge records the data type, classification (public, internal, personal, credential) and whether it is encrypted — so security review has something concrete to check.
          </FeatureItem>
          <FeatureItem icon={Database} title="Database and API sections">
            Schema and endpoint designs are first-class artifacts linked to the components that implement them.
          </FeatureItem>
          <FeatureItem icon={Plug} title="Integrations">
            AI providers, version control, hosting, databases, authentication, analytics and billing tracked with connection status.
          </FeatureItem>
          <FeatureItem icon={FileText} title="Architecture decision records">
            ADR-001… with decision, reason, alternatives, consequences and status, linked to the components and requirements they affect.
          </FeatureItem>
        </ul>
      </Section>

      <Section id="ai">
        <SectionHeading eyebrow="AI" title="Agents, MCP, skills, memory and providers" />
        <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureItem icon={Bot} title="Nineteen specialised agents">
            Software, Design, Planning, Quality and Documentation groups. Each agent has a role, capabilities, tools, skills, MCP connections, memory scope, permissions and status.
          </FeatureItem>
          <FeatureItem icon={Sparkles} title="Agent activity HUD">
            Active, queued, completed and failed runs with current task, progress, execution time, tool calls, artifacts produced and warnings. Inspect any run in detail.
          </FeatureItem>
          <FeatureItem icon={Plug} title="MCP management">
            Connected servers, available tools, status, permissions, configuration, errors and usage. Add, remove and configure connections.
          </FeatureItem>
          <FeatureItem icon={Boxes} title="Skills">
            Reusable, versioned instruction sets with capabilities and required tools, assignable to any agent and enabled per project.
          </FeatureItem>
          <FeatureItem icon={Brain} title="Inspectable memory">
            Project, decision, preference, agent and technical memory kept separate, with source and confidence. Nothing hidden, nothing uncontrollable.
          </FeatureItem>
          <FeatureItem icon={KeyRound} title="Provider abstraction">
            OpenAI, Anthropic, Google Gemini, DeepSeek and compatible endpoints. Provider and model selection, fallbacks, token and cost tracking, request history and health. Keys are never hard-coded.
          </FeatureItem>
        </ul>
      </Section>

      <Section muted id="development">
        <SectionHeading eyebrow="Development" title="Files, terminal, Git, environment, testing, builds" description="Designed for Windows 11: local file system access, PowerShell and WSL, Git, native notifications, multiple windows and multi-monitor layouts." />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <ul className="grid gap-6">
            <FeatureItem icon={GitBranch} title="Git status and history">
              Branch, changes, commits and diffs. Associate changes with tasks and requirements. Nothing is committed or pushed automatically.
            </FeatureItem>
            <FeatureItem icon={SquareTerminal} title="Terminal workspace">
              PowerShell, Command Prompt and WSL. Command history, exit codes, stdout/stderr, cancellation — and confirmation before destructive commands.
            </FeatureItem>
            <FeatureItem icon={Cpu} title="Environment detection">
              Windows version, CPU, RAM, GPU, Node, npm/pnpm/yarn, Python, Git, Docker, WSL, Flutter, Java, Android SDK, Visual Studio, VS Code, Supabase CLI and more — reported as available, missing, outdated or unknown.
            </FeatureItem>
            <FeatureItem icon={ListChecks} title="Testing and builds">
              Test suites, results, failures, coverage and run time; build history with status. <Badge className="ml-1">Planned</Badge>
            </FeatureItem>
          </ul>
          <EnvironmentPreview />
        </div>
      </Section>

      <Section id="quality">
        <SectionHeading eyebrow="Quality" title="Audits with evidence, not opinions" description="Requirements, architecture, security, accessibility, dependencies, performance, documentation, privacy, compliance, deployment and cost. Each finding has an ID, severity, evidence, recommendation, related component and requirement." />
        <div className="mt-8">
          <AuditPreview compact />
        </div>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          <FeatureItem icon={ShieldCheck} title="Security">
            Authentication, authorisation, secrets, API keys, file-system permissions, MCP and provider permissions, command execution, encryption, logging and audit trails.
          </FeatureItem>
          <FeatureItem icon={ClipboardList} title="Compliance and accessibility">
            Unnecessary data collection, third-party SDK inventory, dark patterns, contrast, keyboard navigation, consent, unsubscribe, licensing, deletion and privacy controls.
          </FeatureItem>
          <FeatureItem icon={Cpu} title="Cost analysis">
            Tokens and estimated spend per provider, model and agent run, aggregated per project.
          </FeatureItem>
        </ul>
      </Section>

      <Section muted id="documentation">
        <SectionHeading eyebrow="Documentation" title="Artifacts, blueprint, decisions, change log, export" />
        <div className="mt-8">
          <ArtifactsPreview />
        </div>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          <FeatureItem icon={FileText} title="Versioned artifacts">
            Requirements, diagrams, flow maps, technical plans, API and database designs, UI specs, test and security plans, documentation, presentations and the blueprint — with author, version, status and relationships.
          </FeatureItem>
          <FeatureItem icon={Layers3} title="Blueprint and presentation">
            A complete project summary generated from live data, plus a presentation outline covering overview, architecture, flows, agents, roadmap, security, testing and deployment.
          </FeatureItem>
          <FeatureItem icon={Download} title="Export">
            Markdown, JSON, HTML, ZIP and PDF exports including identity, requirements, architecture, data flow, tasks, agents, skills, MCP, memory, testing, security, deployment, documentation and decisions.
          </FeatureItem>
        </ul>
        <Callout className="mt-10" tone="neutral" title="Preview content">
          Screens on this page are static previews rendered from a demo project. They represent the planned interface of the Windows application and are not a running instance.
        </Callout>
      </Section>
    </>
  );
}
