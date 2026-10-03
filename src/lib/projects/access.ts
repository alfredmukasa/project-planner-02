import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/database.types';
import {
  allocateProjectSlug,
  projectSlugBase,
  validateProjectDescription,
  validateProjectName,
} from '@/lib/projects/validation';

type Db = SupabaseClient<Database>;

export type ProjectRecord = Pick<
  Database['public']['Tables']['projects']['Row'],
  | 'id'
  | 'workspace_id'
  | 'created_by'
  | 'name'
  | 'slug'
  | 'description'
  | 'status'
  | 'visibility'
  | 'last_activity_at'
  | 'created_at'
  | 'updated_at'
>;

export type WorkspaceRecord = Pick<
  Database['public']['Tables']['workspaces']['Row'],
  'id' | 'owner_id' | 'name' | 'slug' | 'kind'
>;

const PROJECT_COLUMNS =
  'id, workspace_id, created_by, name, slug, description, status, visibility, last_activity_at, created_at, updated_at' as const;

export function friendlyProjectError(code: string | undefined, message: string): string {
  if (code === '42501') return 'You do not have permission to do that.';
  if (code === '23514') return 'That project could not be saved. Check the name and try again.';
  if (code === '23505') return 'A project with that address already exists in this workspace.';
  if (/jwt|session|not authenticated/i.test(message)) return 'Sign in again to continue.';
  return message;
}

async function currentUserId(supabase: Db): Promise<{ userId: string } | { error: string }> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { error: 'Sign in again to continue.' };
  }
  return { userId: data.user.id };
}

/**
 * Personal workspace is created on first project create, not during signup.
 * Owner membership is inserted by the database trigger. The client never writes membership rows.
 */
export async function ensurePersonalWorkspace(
  supabase: Db,
): Promise<{ workspace: WorkspaceRecord } | { error: string }> {
  const actor = await currentUserId(supabase);
  if ('error' in actor) return actor;

  const read = async () =>
    supabase
      .from('workspaces')
      .select('id, owner_id, name, slug, kind')
      .eq('owner_id', actor.userId)
      .eq('kind', 'personal')
      .is('deleted_at', null)
      .maybeSingle();

  const existing = await read();
  if (existing.error) return { error: friendlyProjectError(existing.error.code, existing.error.message) };
  if (existing.data) return { workspace: existing.data };

  const slug = `personal-${actor.userId.replace(/-/g, '')}`;
  const inserted = await supabase
    .from('workspaces')
    .insert({
      owner_id: actor.userId,
      name: 'Personal',
      slug,
      kind: 'personal',
    })
    .select('id, owner_id, name, slug, kind')
    .single();

  if (!inserted.error && inserted.data) return { workspace: inserted.data };

  if (inserted.error?.code === '23505') {
    const again = await read();
    if (again.data) return { workspace: again.data };
    if (again.error) return { error: friendlyProjectError(again.error.code, again.error.message) };
  }

  return {
    error: friendlyProjectError(inserted.error?.code, inserted.error?.message ?? 'Could not open your workspace.'),
  };
}

export async function listAuthorizedProjects(
  supabase: Db,
): Promise<{ projects: ProjectRecord[] } | { error: string }> {
  const actor = await currentUserId(supabase);
  if ('error' in actor) return actor;

  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_COLUMNS)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) return { error: friendlyProjectError(error.code, error.message) };
  return { projects: data ?? [] };
}

export async function getAuthorizedProject(
  supabase: Db,
  projectId: string,
): Promise<{ project: ProjectRecord; workspace: WorkspaceRecord | null } | { error: string } | { missing: true }> {
  const actor = await currentUserId(supabase);
  if ('error' in actor) return actor;

  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_COLUMNS)
    .eq('id', projectId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) return { error: friendlyProjectError(error.code, error.message) };
  if (!data) return { missing: true };

  const workspace = await supabase
    .from('workspaces')
    .select('id, owner_id, name, slug, kind')
    .eq('id', data.workspace_id)
    .is('deleted_at', null)
    .maybeSingle();

  if (workspace.error) return { error: friendlyProjectError(workspace.error.code, workspace.error.message) };
  return { project: data, workspace: workspace.data };
}

export async function createProject(
  supabase: Db,
  input: { name: string; description: string },
): Promise<{ project: ProjectRecord } | { error: string }> {
  const name = validateProjectName(input.name);
  if (!name.ok) return { error: name.error };
  const description = validateProjectDescription(input.description);
  if (!description.ok) return { error: description.error };

  const actor = await currentUserId(supabase);
  if ('error' in actor) return actor;

  const workspaceResult = await ensurePersonalWorkspace(supabase);
  if ('error' in workspaceResult) return workspaceResult;

  const slugRows = await supabase.from('projects').select('slug').eq('workspace_id', workspaceResult.workspace.id);
  if (slugRows.error) return { error: friendlyProjectError(slugRows.error.code, slugRows.error.message) };

  const taken = new Set((slugRows.data ?? []).map((row) => row.slug.toLowerCase()));
  let slug = allocateProjectSlug(projectSlugBase(name.value), taken);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const inserted = await supabase
      .from('projects')
      .insert({
        workspace_id: workspaceResult.workspace.id,
        created_by: actor.userId,
        name: name.value,
        slug,
        description: description.value,
      })
      .select(PROJECT_COLUMNS)
      .single();

    if (!inserted.error && inserted.data) return { project: inserted.data };

    if (inserted.error?.code === '23505' && attempt < 2) {
      const suffix = `-${attempt + 2}-${Math.random().toString(36).slice(2, 6)}`;
      slug = `${projectSlugBase(name.value).slice(0, 80 - suffix.length)}${suffix}`;
      continue;
    }

    return {
      error: friendlyProjectError(inserted.error?.code, inserted.error?.message ?? 'Could not create the project.'),
    };
  }

  return { error: 'Could not create the project.' };
}
