import Link from 'next/link';
import type { ReactNode } from 'react';

import { Callout, PageHero } from '@/components/ui/primitives';

import { DocsNav } from './docs-nav';

export function DocsLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Documentation" title={title} description={description} />
      <div className="container-x py-10 md:py-14 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-faint">On this site</p>
          <DocsNav />
        </aside>
        <article className="prose-pp max-w-3xl min-w-0">
          <Callout tone="neutral" className="!mt-0 mb-8 not-prose">
            Documentation describes the planned Windows application. Interface examples use demo project content and are labelled as previews.
          </Callout>
          {children}
          <p className="mt-12 text-sm text-text-faint">
            Something missing?{' '}
            <Link href="/support/#feedback" className="text-accent underline">
              Send feedback
            </Link>
            .
          </p>
        </article>
      </div>
    </>
  );
}
