import type { Metadata } from 'next';
import Link from 'next/link';

import { ButtonLink, PageHero, Section } from '@/components/ui/primitives';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Project Planner is an upcoming AI-powered planning workspace for Windows. This page is the company and product overview for the public website.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A planning workspace that treats architecture as data"
        description="Project Planner exists because most software projects fail on misunderstanding — of requirements, of how the parts connect, of who owns each piece — not on the speed of typing code."
      >
        <ButtonLink href="/how-it-works/" variant="secondary">
          How it works
        </ButtonLink>
        <ButtonLink href="/download/">Windows preview</ButtonLink>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="prose-pp">
            <h2 className="!mt-0">The product</h2>
            <p>
              Project Planner is an upcoming Windows desktop application that connects requirements, architecture, AI agents, development planning, testing and documentation in one workspace. It is designed as an IDE companion: local folders, Git, a terminal, environment detection and a <code>.pp</code> identity file that other AI tools can read before they generate code.
            </p>
            <p>
              Agents propose. You decide. Graphs are generated from the project, not drawn by hand. Audits carry evidence. Secrets never appear in prompts, logs or exports.
            </p>
            <h2>This website</h2>
            <p>
              The site you are reading is a static, independently deployable representation of that product. Interface previews are built from a single demo project so they stay consistent with each other. They are labelled as previews. There is no live application behind them.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-faint">At a glance</h2>
            <dl className="mt-4 divide-y divide-border text-sm">
              {[
                ['Product', site.name],
                ['Stage', `${site.stage} · Windows desktop coming soon`],
                ['Platform', site.desktop.platform],
                ['Pricing', 'Free, Builder $5, Pro $15, Studio $20'],
                ['Company details', 'To be published before paid plans open'],
                ['Contact', site.supportEmail],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-text-faint">{k}</dt>
                  <dd className="text-text sm:text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="mt-10 text-sm text-text-muted">
          Legal:{' '}
          <Link href="/privacy/" className="text-accent underline">
            Privacy
          </Link>
          ,{' '}
          <Link href="/terms/" className="text-accent underline">
            Terms
          </Link>
          ,{' '}
          <Link href="/security/" className="text-accent underline">
            Security
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
