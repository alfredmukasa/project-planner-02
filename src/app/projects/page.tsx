'use client';

import { AuthGate } from '@/components/auth/auth-gate';
import { ProjectPanel } from '@/components/projects/project-panel';

export default function ProjectsPage() {
  return (
    <AuthGate requireOnboardingComplete>
      {() => (
        <div className="container-x py-10 md:py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Workspace</p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight" data-testid="projects-heading">
              Projects
            </h1>
            <p className="mt-2 text-sm text-text-muted">Projects you are allowed to open.</p>
            <ProjectPanel />
          </div>
        </div>
      )}
    </AuthGate>
  );
}
