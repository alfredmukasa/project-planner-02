import { Bot, Boxes, ClipboardList, FileCheck2, GitBranch, Layers3, Network, ShieldCheck, Workflow } from 'lucide-react';
import Link from 'next/link';

import { AgentsPreview, AuditPreview, BlueprintPreview, DataFlowPreview, OverviewPreview, PlanningPreview, SystemMapPreview } from '@/components/preview/screens';
import { Badge, ButtonLink, Callout, FeatureItem, Section, SectionHeading } from '@/components/ui/primitives';
import { site } from '@/content/site';

const lifecycle = ['Idea', 'Requirements', 'Planning', 'Architecture', 'Data Flow', 'AI Agents', 'Implementation Plan', 'Development', 'Testing', 'Audit', 'Documentation', 'Export'];

const previews = [
  { key: 'architecture', title: 'Architecture', blurb: 'Every component, its technology, dependencies and owner — rendered as a navigable system map generated from project data.', href: '/architecture/', element: <SystemMapPreview compact /> },
  { key: 'data-flow', title: 'Data Flow', blurb: 'See how data moves between users, interfaces, services, AI providers and storage, with classification and encryption on every edge.', href: '/architecture/#data-flow', element: <DataFlowPreview compact /> },
  { key: 'agents', title: 'Agents', blurb: 'A live view of which agents are running, waiting or queued, what they are doing right now and what they produced.', href: '/agents/', element: <AgentsPreview compact /> },
  { key: 'planning', title: 'Planning', blurb: 'Phases, milestones, tasks and subtasks with estimates, acceptance criteria and links back to requirements.', href: '/features/#planning', element: <PlanningPreview compact /> },
  { key: 'audit', title: 'Audit', blurb: 'Evidence-based findings across security, accessibility, dependencies, performance and documentation.', href: '/features/#quality', element: <AuditPreview compact /> },
  { key: 'blueprint', title: 'Blueprint', blurb: 'One generated document that explains the whole project — purpose, requirements, architecture, agents, tests and decisions.', href: '/features/#documentation', element: <BlueprintPreview compact /> },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="container-x pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge tone="active">Windows desktop · {site.stage}</Badge>
              <Badge>Coming soon</Badge>
            </div>
            <h1 className="mt-5 text-4xl md:text-[52px] leading-[1.08] font-semibold tracking-tight text-text">Plan before you build.</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-text-muted">A structured workspace for turning ideas into development-ready projects.</p>
            <p className="mt-3 max-w-2xl text-[15px] text-text-muted">
              Project Planner connects requirements, architecture, AI agents, development planning, testing and documentation in one workspace — so you understand what you are building, why, and what could go wrong, before implementation begins.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/download/" size="lg" icon>
                Get notified about the Windows preview
              </ButtonLink>
              <ButtonLink href="/how-it-works/" variant="secondary" size="lg">
                See how it works
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs text-text-faint">No installer is available yet. Interface previews on this site show demo project content.</p>
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="bg-bg-subtle border-b border-border">
        <div className="container-x py-12 md:py-16">
          <OverviewPreview />
          <p className="mt-3 text-center text-xs text-text-faint">The Overview screen: project summary, progress, health and activity in a single command centre.</p>
        </div>
      </section>

      {/* Lifecycle */}
      <Section>
        <SectionHeading eyebrow="One connected lifecycle" title="From idea to export, every step stays linked" description="Project Planner is not a task manager. It keeps requirements, plans, architecture, data flow, agents, tests, audits and documentation in one traceable model so nothing gets lost between phases." />
        <ol className="mt-8 flex flex-wrap gap-2" aria-label="Project lifecycle">
          {lifecycle.map((step, i) => (
            <li key={step} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm">
              <span className="font-mono text-2xs text-text-faint">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-medium">{step}</span>
            </li>
          ))}
        </ol>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          <FeatureItem icon={ClipboardList} title="Understand what you are building">
            Requirements with stable IDs, priorities, sources and acceptance criteria — functional, security, accessibility, performance and business.
          </FeatureItem>
          <FeatureItem icon={Network} title="See how the system works">
            Architecture components, dependencies and data flow as interactive graphs generated from the project itself, never from a static picture.
          </FeatureItem>
          <FeatureItem icon={Bot} title="Know which agent is responsible">
            Nineteen specialised agents in five groups, each with a role, tools, skills, MCP connections, memory scope and permissions.
          </FeatureItem>
          <FeatureItem icon={Layers3} title="Plan the implementation">
            Phases, milestones, tasks and subtasks with dependencies and estimates, traceable back to the requirement that motivated them.
          </FeatureItem>
          <FeatureItem icon={ShieldCheck} title="Find out what could go wrong">
            Evidence-based audits across security, privacy, dependencies, accessibility, performance and documentation gaps.
          </FeatureItem>
          <FeatureItem icon={FileCheck2} title="Document and export">
            A blueprint, presentation outline and export package generated from the live project — Markdown, JSON, HTML and PDF.
          </FeatureItem>
        </ul>
      </Section>

      {/* Screen previews */}
      <Section muted id="previews">
        <SectionHeading eyebrow="Interface preview" title="The workspace, screen by screen" description="Each preview is rendered from a single demo project so the screens stay consistent with each other. Layout, density and behaviour reflect the planned Windows application." />
        <div className="mt-10 space-y-14">
          {previews.map((p, i) => {
            const copy = (
              <div className="min-w-0 lg:sticky lg:top-20">
                <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{p.blurb}</p>
                <Link href={p.href} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                  Learn more →
                </Link>
              </div>
            );
            const visual = <div className="min-w-0 w-full max-w-full">{p.element}</div>;
            const flipped = i % 2 === 1;
            return (
              <div key={p.key} className={`grid items-start gap-6 ${flipped ? 'lg:grid-cols-[minmax(0,1fr)_280px]' : 'lg:grid-cols-[280px_minmax(0,1fr)]'}`}>
                {flipped ? visual : copy}
                {flipped ? copy : visual}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Developer tool */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Built for Windows developers" title="An IDE companion, not another dashboard" description="The desktop application is designed for Windows 11 first: local project folders, environment detection, Git status, a terminal workspace and file watching — with explicit confirmation before anything destructive." />
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              <FeatureItem icon={GitBranch} title="Local by default">
                Open a project folder, read its .pp identity file and keep planning documentation next to the code without uploading it.
              </FeatureItem>
              <FeatureItem icon={Workflow} title="Provider-agnostic AI">
                OpenAI, Anthropic, Google, DeepSeek or compatible endpoints through one abstraction, with fallbacks and cost tracking.
              </FeatureItem>
              <FeatureItem icon={Boxes} title="MCP and skills">
                Connect MCP servers and reusable skills, then assign them to the agents that need them — with per-server permissions.
              </FeatureItem>
              <FeatureItem icon={ShieldCheck} title="Secrets stay secrets">
                API keys live in secure storage, never in prompts, logs, activity feeds or exports.
              </FeatureItem>
            </ul>
          </div>
          <Callout tone="neutral" title="What this website shows">
            The Windows application is in preview and not yet available to download. Everything on this site — including interface previews and the demo project — describes the planned product. Nothing here is a live instance of the application.{' '}
            <Link href="/download/" className="text-accent underline">
              Download status
            </Link>
            .
          </Callout>
        </div>
      </Section>

      {/* CTA */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="container-x py-14 md:py-16 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Project Planner for Windows</h2>
            <p className="mt-1 text-text-muted">Preview release coming soon. Free plan available at launch.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/download/" size="lg">
              Download page
            </ButtonLink>
            <ButtonLink href="/pricing/" variant="secondary" size="lg">
              View pricing
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
