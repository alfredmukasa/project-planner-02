'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ButtonLink, StatusPill, type Tone } from '@/components/ui/primitives';
import { listAuthorizedProjects, type ProjectRecord } from '@/lib/projects/access';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const STATUS_TONE: Record<ProjectRecord['status'], Tone> = {
  draft: 'neutral',
  planning: 'info',
  plan_approved: 'active',
  in_development: 'info',
  completed: 'success',
  archived: 'warning',
};

const STATUS_LABEL: Record<ProjectRecord['status'], string> = {
  draft: 'Draft',
  planning: 'Planning',
  plan_approved: 'Plan approved',
  in_development: 'In development',
  completed: 'Completed',
  archived: 'Archived',
};

function projectHref(id: string): string {
  return `/projects/open/?id=${encodeURIComponent(id)}`;
}

export function ProjectPanel() {
  const [projects, setProjects] = useState<ProjectRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createBrowserSupabaseClient();

    const load = async () => {
      const result = await listAuthorizedProjects(supabase);
      if (cancelled) return;
      if ('error' in result) {
        setError(result.error);
        setProjects(null);
        return;
      }
      setProjects(result.projects);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-8" data-testid="project-panel" aria-busy={projects === null && !error}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text">Projects</h2>
        <ButtonLink href="/projects/new/" size="sm">
          Create project
        </ButtonLink>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-danger" role="alert" data-testid="project-list-error">
          {error}
        </p>
      ) : null}

      {projects === null && !error ? (
        <p className="mt-3 text-sm text-text-muted" data-testid="project-list-loading">
          Loading projects…
        </p>
      ) : null}

      {projects && projects.length === 0 ? (
        <div className="mt-3 rounded-lg border border-border bg-surface p-5" data-testid="project-list-empty">
          <p className="text-sm font-medium text-text">No projects yet</p>
          <p className="mt-1.5 text-sm text-text-muted">
            Create a project to keep its name, description, and identity in your workspace. Nothing is listed until
            you do.
          </p>
        </div>
      ) : null}

      {projects && projects.length > 0 ? (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface" data-testid="project-list">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={projectHref(project.id)}
                className="flex flex-col gap-1 px-4 py-3 hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-text">{project.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-text-muted">
                    {project.description?.trim() || 'No description'}
                  </span>
                </span>
                <StatusPill label={STATUS_LABEL[project.status]} tone={STATUS_TONE[project.status]} />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
