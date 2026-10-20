'use client';

import { Activity, ArrowRight, CheckCircle2, FolderKanban, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ButtonLink, StatusPill, type Tone } from '@/components/ui/primitives';
import { listAuthorizedProjects, type ProjectRecord } from '@/lib/projects/access';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const statusStyle: Record<ProjectRecord['status'], { label: string; tone: Tone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  planning: { label: 'Planning', tone: 'info' },
  plan_approved: { label: 'Plan approved', tone: 'active' },
  in_development: { label: 'In development', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
  archived: { label: 'Archived', tone: 'warning' },
};

function formatActivity(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently updated';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  loading,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: number | null;
  detail: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4" aria-busy={loading}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-text-muted">{label}</p>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg text-accent">
          <Icon size={15} aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value ?? '—'}</p>
      <p className="mt-1 text-xs text-text-faint">{detail}</p>
    </div>
  );
}

export function DashboardOverview({ user }: { user: User }) {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectRecord[] | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createBrowserSupabaseClient();

    const load = async () => {
      const [profileResult, projectResult] = await Promise.all([
        supabase.from('user_profiles').select('display_name').eq('user_id', user.id).maybeSingle(),
        listAuthorizedProjects(supabase),
      ]);
      if (cancelled) return;

      if (!profileResult.error) setDisplayName(profileResult.data?.display_name ?? null);
      if ('error' in projectResult) {
        setProjectError(projectResult.error);
        setProjects([]);
      } else {
        setProjects(projectResult.projects);
      }
    };

    void load().catch((error: unknown) => {
      if (cancelled) return;
      setProjectError(error instanceof Error ? error.message : 'Could not load your projects.');
      setProjects([]);
    });

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const name = displayName || user.email?.split('@')[0] || 'there';
  const activeCount = projects?.filter((project) => ['planning', 'plan_approved', 'in_development'].includes(project.status)).length ?? null;
  const completedCount = projects?.filter((project) => project.status === 'completed').length ?? null;
  const recentProjects = projects?.slice(0, 4) ?? [];

  return (
    <div className="container-x py-8 md:py-10" data-testid="dashboard-overview">
      <div className="mx-auto max-w-6xl">
        <section className="flex flex-col justify-between gap-5 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Your workspace</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl" data-testid="dashboard-heading">
              Welcome back, {name}
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Keep your project plans together and pick up where you left off.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/projects/new/" icon>
              <Plus size={15} aria-hidden />
              New project
            </ButtonLink>
            <ButtonLink href="/projects/" variant="secondary">
              All projects
            </ButtonLink>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Workspace summary">
          <Metric icon={FolderKanban} label="Projects" value={projectError ? null : projects?.length ?? null} detail="In your workspace" loading={projects === null} />
          <Metric icon={Activity} label="In progress" value={projectError ? null : activeCount} detail="Planning or development" loading={projects === null} />
          <Metric icon={CheckCircle2} label="Completed" value={projectError ? null : completedCount} detail="Marked complete" loading={projects === null} />
        </section>

        <section className="mt-8" aria-labelledby="recent-projects-title" aria-busy={projects === null}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="recent-projects-title" className="text-lg font-semibold tracking-tight">Recent projects</h2>
              <p className="mt-1 text-sm text-text-muted">Your latest project activity.</p>
            </div>
            {projects && projects.length > 0 ? (
              <Link href="/projects/" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                View all <ArrowRight size={14} aria-hidden />
              </Link>
            ) : null}
          </div>

          {projects === null ? (
            <div className="mt-4 rounded-lg border border-border bg-surface p-5 text-sm text-text-muted" role="status">
              Loading your projects…
            </div>
          ) : projectError ? (
            <div className="mt-4 rounded-lg border border-danger/40 bg-danger/5 p-4 text-sm text-danger" role="alert">
              {projectError}
            </div>
          ) : projects.length === 0 ? (
            <div className="mt-4 flex flex-col items-start gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-accent">
                  <Sparkles size={17} aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Start with your first project</h3>
                  <p className="mt-1 max-w-xl text-sm text-text-muted">
                    Create a project to give your plans a home. You can add a name and description now, then update them later.
                  </p>
                </div>
              </div>
              <ButtonLink href="/projects/new/" icon>Create project</ButtonLink>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface" data-testid="dashboard-project-list">
              {recentProjects.map((project) => {
                const status = statusStyle[project.status];
                return (
                  <li key={project.id}>
                    <Link
                      href={`/projects/open/?id=${encodeURIComponent(project.id)}`}
                      className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-text">{project.name}</span>
                        <span className="mt-1 block truncate text-xs text-text-muted">
                          {project.description?.trim() || 'No description'}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <span className="hidden items-center gap-1 text-xs text-text-faint sm:inline-flex">
                          <span className="sr-only">Updated </span>{formatActivity(project.last_activity_at)}
                        </span>
                        <StatusPill label={status.label} tone={status.tone} />
                        <ArrowRight size={14} className="text-text-faint" aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-2" aria-label="Next steps">
          <Link href="/projects/new/" className="group rounded-lg border border-border bg-surface p-4 hover:border-border-strong">
            <span className="flex items-center gap-2 text-sm font-semibold text-text">
              <Plus size={15} className="text-accent" aria-hidden /> Create a project
              <ArrowRight size={14} className="ml-auto text-text-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className="mt-1 block text-sm text-text-muted">Capture what you are planning to build.</span>
          </Link>
          <Link href="/account/" className="group rounded-lg border border-border bg-surface p-4 hover:border-border-strong">
            <span className="flex items-center gap-2 text-sm font-semibold text-text">
              <CheckCircle2 size={15} className="text-accent" aria-hidden /> Review your account
              <ArrowRight size={14} className="ml-auto text-text-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className="mt-1 block text-sm text-text-muted">Manage your profile and sign-in methods.</span>
          </Link>
        </section>

        <p className="mt-6 text-xs text-text-faint">Signed in as {user.email}</p>
      </div>
    </div>
  );
}
