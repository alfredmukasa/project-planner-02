'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { AuthGate } from '@/components/auth/auth-gate';
import { ProjectDetail } from '@/components/projects/project-detail';

function OpenProject() {
  const params = useSearchParams();
  return (
    <AuthGate requireOnboardingComplete>
      {() => (
        <div className="container-x py-10 md:py-12">
          <div className="max-w-3xl">
            <ProjectDetail key={params.get('id') ?? 'missing'} projectId={params.get('id')} />
          </div>
        </div>
      )}
    </AuthGate>
  );
}

export default function OpenProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Project</h1>
          <p className="mt-2 text-sm text-text-muted">Loading project…</p>
        </div>
      }
    >
      <OpenProject />
    </Suspense>
  );
}
