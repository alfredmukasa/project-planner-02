'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { StatusPill, type Tone } from '@/components/ui/primitives';
import { getAuthorizedProject, type ProjectRecord, type WorkspaceRecord } from '@/lib/projects/access';
import { isProjectId } from '@/lib/projects/validation';
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

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function MissingProject() {
  return (
    <div data-testid="project-not-found">
      <h1 className="text-2xl font-semibold tracking-tight">Project</h1>
      <div className="mt-4 rounded-lg border border-border bg-surface p-5">
        <p className="text-sm font-medium text-text">Project not found</p>
        <p className="mt-1.5 text-sm text-text-muted">
          This project does not exist, or you do not have access to it.
        </p>
        <Link href="/projects/" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
          Back to projects
        </Link>
      </div>
    </div>
  );
}

export function ProjectDetail({ projectId }: { projectId: string | null }) {
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  const validId = isProjectId(projectId) ? projectId : null;

  useEffect(() => {
    if (!validId) return;

    let cancelled = false;
    const supabase = createBrowserSupabaseClient();
    const load = async () => {
      const result = await getAuthorizedProject(supabase, validId);
      if (cancelled) return;
      if ('error' in result) {
        setError(result.error);
        setLoading(false);
        return;
      }
      if ('missing' in result) {
        setMissing(true);
        setLoading(false);
        return;
      }
      setProject(result.project);
      setWorkspace(result.workspace);
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [validId]);

  if (!validId) {
    return <MissingProject />;
  }

  if (loading) {
    return (
      <div data-testid="project-detail-loading">
        <h1 className="text-2xl font-semibold tracking-tight">Project</h1>
        <p className="mt-2 text-sm text-text-muted">Loading project…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Project</h1>
        <p className="mt-4 text-sm text-danger" role="alert" data-testid="project-detail-error">
          {error}
        </p>
      </div>
    );
  }

  if (missing || !project) {
    return <MissingProject />;
  }

  return (
    <div data-testid="project-detail">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Project</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight" data-testid="project-detail-name">
          {project.name}
        </h1>
        <StatusPill label={STATUS_LABEL[project.status]} tone={STATUS_TONE[project.status]} />
      </div>
      <p className="mt-3 max-w-2xl text-sm text-text-muted" data-testid="project-detail-description">
        {project.description?.trim() || 'No description'}
      </p>

      <dl className="mt-6 grid gap-4 rounded-lg border border-border bg-surface p-5 text-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-text-muted">Project id</dt>
          <dd className="mt-0.5 break-all font-mono text-xs text-text" data-testid="project-detail-id">
            {project.id}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Slug</dt>
          <dd className="mt-0.5 break-all font-medium text-text">{project.slug}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Visibility</dt>
          <dd className="mt-0.5 font-medium capitalize text-text">{project.visibility}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Workspace</dt>
          <dd className="mt-0.5 font-medium text-text">{workspace?.name ?? 'Workspace'}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Workspace id</dt>
          <dd className="mt-0.5 break-all font-mono text-xs text-text">{project.workspace_id}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Created</dt>
          <dd className="mt-0.5 text-text">{formatWhen(project.created_at)}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Updated</dt>
          <dd className="mt-0.5 text-text">{formatWhen(project.updated_at)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-text-muted">
        Requirements, planning, and development tools are not on this page yet.
      </p>

      <Link href="/projects/" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
        Back to projects
      </Link>
    </div>
  );
}
