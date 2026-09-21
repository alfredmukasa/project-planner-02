import type { Metadata } from 'next';
import Link from 'next/link';

import { Callout, PageHero, Section } from '@/components/ui/primitives';
import { docsNav } from '@/content/docs';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Guides to the planned Project Planner Windows workspace: getting started, project identity, architecture, agents, development tools and export.',
};

export default function DocumentationPage() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Guides for the planned Windows workspace"
        description="These pages describe how Project Planner is designed to work. They are written against the product specification, not a shipped installer. Interface examples throughout the site use a demo project and are labelled as previews."
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {docsNav.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-text-faint">{group.title}</h2>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[15px] font-medium text-text hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Callout className="mt-10" tone="info" title="No application is running here">
          This website is independently deployable static HTML. It does not connect to a desktop app, database, AI provider or authentication service. When the Windows preview is published, the{' '}
          <Link href="/download/" className="text-accent underline">
            Download
          </Link>{' '}
          page will list the installer, checksums and release notes.
        </Callout>
      </Section>
    </>
  );
}
