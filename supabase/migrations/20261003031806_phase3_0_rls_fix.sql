-- Phase 3.0 corrective RLS.
-- INSERT ... RETURNING evaluates SELECT policies before AFTER INSERT triggers.
-- Measured: INSERT without RETURNING created the owner membership and the row
-- was visible afterwards; INSERT RETURNING failed with 42501 while auth.uid()
-- was already the owner. A BEFORE INSERT membership trigger still failed the
-- SELECT check (42501), so visibility cannot depend only on that trigger row.
-- Workspace owners match owner_id. Project creators match created_by so a
-- private insert can return. Workspace admins still do not see private projects.

DROP POLICY workspaces_select_member ON public.workspaces;
CREATE POLICY workspaces_select_member ON public.workspaces
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND (
      owner_id = (SELECT auth.uid())
      OR private.is_active_workspace_member(id)
    )
  );

DROP POLICY projects_select_authorized ON public.projects;
CREATE POLICY projects_select_authorized ON public.projects
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND private.is_active_workspace_member(workspace_id)
    AND (
      visibility = 'workspace'
      OR created_by = (SELECT auth.uid())
      OR EXISTS (
        SELECT 1
        FROM public.project_members AS pm
        WHERE pm.project_id = id
          AND pm.user_id = (SELECT auth.uid())
      )
    )
  );

CREATE OR REPLACE FUNCTION private.can_read_project(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.projects AS p
    WHERE p.id = p_project_id
      AND p.deleted_at IS NULL
      AND private.is_active_workspace_member(p.workspace_id)
      AND (
        p.visibility = 'workspace'
        OR p.created_by = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1
          FROM public.project_members AS pm
          WHERE pm.project_id = p.id
            AND pm.user_id = (SELECT auth.uid())
        )
      )
  );
$$;

REVOKE ALL ON FUNCTION private.can_read_project(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.can_read_project(UUID) TO authenticated;
