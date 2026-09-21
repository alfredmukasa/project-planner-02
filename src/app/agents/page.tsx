import { Brain, Cpu, KeyRound, Plug, ShieldCheck, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

import { DemoStatus } from '@/components/preview/demo-status';
import { AgentGroupsPreview, AgentsPreview } from '@/components/preview/screens';
import { Badge, Callout, FeatureItem, PageHero, Section, SectionHeading } from '@/components/ui/primitives';
import { agents } from '@/content/demo-project';

export const metadata: Metadata = {
  title: 'AI Agents',
  description: 'Nineteen specialised agents in five groups, a live activity HUD, provider-agnostic AI, MCP connections, skills and inspectable memory — how AI works inside Project Planner.',
};

const groups = [
  { name: 'Software', body: 'Architecture, frontend, backend, database and API specialists that turn requirements into components, contracts and schemas.' },
  { name: 'Design', body: 'UI and UX designers and an accessibility reviewer that produce specifications and check flows against WCAG.' },
  { name: 'Planning', body: 'Product planner, requirements analyst and technical planner that scope, trace and sequence the work.' },
  { name: 'Quality', body: 'Error, testing, security, compliance and performance agents that audit with evidence and derive test plans.' },
  { name: 'Documentation', body: 'Documentation, blueprint and change-log agents that keep the written record current and generate the final blueprint.' },
];

const providers = ['OpenAI', 'Anthropic', 'Google Gemini', 'DeepSeek', 'Compatible endpoints', 'Local models (planned)'];

export default function AgentsPage() {
  return (
    <>
      <PageHero eyebrow="AI agents" title="A specialised AI workforce that proposes — and never silently decides" description="Agents in Project Planner have roles, tools, skills, MCP connections, memory scope and permissions. They produce artifacts and findings for you to review. Destructive actions always require confirmation, and a run is never shown as model-backed unless a provider is actually configured.">
        <Badge tone="active">19 agents</Badge>
        <Badge tone="active">5 groups</Badge>
        <Badge>Provider-agnostic</Badge>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="Agent groups" title="Five groups, nineteen roles" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {groups.map((g) => (
            <div key={g.name} className="rounded-lg border border-border bg-surface p-4">
              <h3 className="font-semibold">{g.name}</h3>
              <p className="mt-1.5 text-sm text-text-muted">{g.body}</p>
              <ul className="mt-3 space-y-1.5">
                {agents
                  .filter((a) => a.group === g.name)
                  .map((a) => (
                    <li key={a.name} className="text-sm">
                      <span className="font-medium">{a.name}</span>
                      <p className="text-xs text-text-muted">{a.role}</p>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <AgentGroupsPreview />
        </div>
      </Section>

      <Section muted id="hud">
        <SectionHeading eyebrow="Agent activity" title="A live HUD for every run" description="Running, waiting, queued, completed and failed runs with the current task, step, progress, execution time, tool calls, artifacts and warnings. Select a run to inspect its log, provider and model." />
        <div className="mt-8">
          <AgentsPreview />
        </div>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          <FeatureItem icon={Sparkles} title="Execution records">
            Every run stores agent, task, status, start and end time, model, provider, tool calls, artifacts, warnings, tokens and estimated cost — never credentials.
          </FeatureItem>
          <FeatureItem icon={Brain} title="Questions, not guesses">
            When an agent needs a decision it asks, with context, options and why it matters. Approved answers are recorded in decision memory.
          </FeatureItem>
          <FeatureItem icon={ShieldCheck} title="Simulated runs are labelled">
            Without a configured provider the desktop app can demonstrate agent flow using clearly labelled simulated runs. It never pretends a model was called.
          </FeatureItem>
        </ul>
      </Section>

      <Section id="providers">
        <SectionHeading eyebrow="AI providers" title="One abstraction, any provider" description="Agents request capabilities through a provider layer. Configure provider and model per agent, define fallback chains, and track tokens, cost, request history and provider health. Keys are stored in secure local storage and never hard-coded." />
        <div className="mt-8 flex flex-wrap gap-2">
          {providers.map((p) => (
            <span key={p} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm">
              <Cpu size={14} className="text-text-faint" aria-hidden /> {p}
            </span>
          ))}
        </div>
        <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-text-faint">
              <tr>
                {['Capability', 'Status', 'Notes'].map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Provider and model selection per agent', 'planned', 'Configured in AI Providers and per-agent settings'],
                ['Fallback providers', 'planned', 'Primary → Fallback 1 → Fallback 2; each switch is logged'],
                ['Token and cost tracking', 'planned', 'Per run, per provider, per project; shown in Cost Analysis'],
                ['Request history', 'planned', 'Redacted request metadata, never prompt secrets'],
                ['Provider health', 'planned', 'Connected, disconnected, error, not configured'],
              ].map(([c, s, n]) => (
                <tr key={c} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{c}</td>
                  <td className="px-3 py-2">
                    <DemoStatus value={s!} />
                  </td>
                  <td className="px-3 py-2 text-text-muted">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section muted id="mcp-skills-memory">
        <SectionHeading eyebrow="MCP, skills and memory" title="Tools and knowledge, kept explicit" />
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          <FeatureItem icon={Plug} title="MCP servers">
            Connected servers, available tools, status, permissions (read, write, network, execute), configuration, errors and usage. Add, remove and configure connections; assign servers to agents.
          </FeatureItem>
          <FeatureItem icon={KeyRound} title="Skills">
            Versioned instruction sets with a source, capabilities and required tools. Enable per project and assign to agents. Skills are reusable across projects.
          </FeatureItem>
          <FeatureItem icon={Brain} title="Memory you can read">
            Project memory, decision memory, user preferences, agent memory and technical memory are separate, inspectable and editable. Each item records its source and confidence. No hidden state.
          </FeatureItem>
        </ul>
        <Callout className="mt-10" tone="neutral" title="Preview content">
          Agent lists and runs on this page come from the demo project. The Windows application is in preview; model-backed execution requires your own provider credentials.
        </Callout>
      </Section>
    </>
  );
}
