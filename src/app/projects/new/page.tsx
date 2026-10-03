'use client';

import { AuthGate } from '@/components/auth/auth-gate';
import { CreateProjectForm } from '@/components/projects/create-project-form';

export default function NewProjectPage() {
  return (
    <AuthGate requireOnboardingComplete>
      {() => (
        <div className="container-x py-10 md:py-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Projects</p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight" data-testid="create-project-heading">
              Create project
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              The project is saved to your personal workspace. You can open it again after you sign out.
            </p>
            <CreateProjectForm />
          </div>
        </div>
      )}
    </AuthGate>
  );
}
