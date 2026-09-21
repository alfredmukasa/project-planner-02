import Link from 'next/link';

import { ButtonLink } from '@/components/ui/primitives';

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-text-muted">That URL is not part of the Project Planner website.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Overview</ButtonLink>
        <ButtonLink href="/documentation/" variant="secondary">
          Documentation
        </ButtonLink>
      </div>
      <p className="mt-8 text-sm text-text-faint">
        Looking for the Windows app? See the{' '}
        <Link href="/download/" className="text-accent underline">
          download
        </Link>{' '}
        page.
      </p>
    </div>
  );
}
