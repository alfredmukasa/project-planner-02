import type { Metadata } from 'next';
import Link from 'next/link';

import { Callout, PageHero, Section } from '@/components/ui/primitives';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Security',
  description: 'How Project Planner is specified to handle secrets, permissions, audits, local storage and vulnerability reports.',
};

const practices = [
  {
    title: 'Secrets',
    body: 'API keys and tokens are stored in the operating system’s secure storage on the local machine. They are never written into source, prompts, logs, activity feeds, artifacts or exports. Redaction runs before anything is displayed or written to disk.',
  },
  {
    title: 'Permissions',
    body: 'MCP servers, providers and the terminal have explicit permission scopes (read, write, network, execute). Destructive file, Git or command actions require confirmation. Path access is validated against the open project folder.',
  },
  {
    title: 'Local by default',
    body: 'Project data lives in the project folder you choose. The public website has no backend and collects no project content. Optional account features planned for later are specified to store the minimum needed for licence checks.',
  },
  {
    title: 'Audits with evidence',
    body: 'Security, privacy, accessibility, dependency and documentation findings carry an ID, severity, evidence, recommendation and links to the component and requirement they affect. Colour is never the only indicator of status.',
  },
  {
    title: 'Provider boundary',
    body: 'When an agent calls a model, only the structured context you configured is sent. Classification on data-flow edges (public, internal, personal, credential) is what the Security Agent checks before a prompt is built.',
  },
  {
    title: 'Releases',
    body: 'Windows installers will be code-signed. Each build will publish a SHA-256 checksum and release notes on the Download page. This website does not host placeholder binaries.',
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Designed so secrets, permissions and evidence are explicit"
        description="The practices below describe the planned Windows application. This website is static HTML and does not process project data, credentials or payments."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {practices.map((p) => (
            <article key={p.title} className="rounded-lg border border-border bg-surface p-5">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{p.body}</p>
            </article>
          ))}
        </div>
        <Callout className="mt-10" tone="info" title="Report a vulnerability">
          Email <a href={`mailto:${site.securityEmail}`}>{site.securityEmail}</a> with steps, impact and, if possible, a suggested fix. Please do not file public issues that include exploit details until we have confirmed a release. We will acknowledge reports and credit researchers who want to be named.
        </Callout>
        <p className="mt-6 text-sm text-text-muted">
          Related:{' '}
          <Link href="/privacy/" className="text-accent underline">
            Privacy
          </Link>
          ,{' '}
          <Link href="/documentation/agents/" className="text-accent underline">
            agents and providers
          </Link>
          ,{' '}
          <Link href="/download/" className="text-accent underline">
            download verification
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
