-- Phase 3.0: additive workspace and project foundation.
-- Does not rewrite Phase 1 auth tables, does not seed workspaces for existing users,
-- and does not create deferred tables (project_sections, artifacts, tasks, devices, billing).
-- Personal workspace creation and project UI are Phase 3.1.
--
-- Rollback (manual, only when these tables are empty or data loss is approved):
--   DROP TABLE IF EXISTS public.project_members, public.projects,
--     public.workspace_members, public.workspaces CASCADE;
--   DROP FUNCTION IF EXISTS private.can_read_project(uuid);
--   DROP FUNCTION IF EXISTS private.can_update_project(uuid);
--   DROP FUNCTION IF EXISTS private.is_project_owner(uuid);
--   DROP FUNCTION IF EXISTS private.is_workspace_owner(uuid);
--   DROP FUNCTION IF EXISTS private.is_active_workspace_member(uuid);
--   DROP FUNCTION IF EXISTS private.handle_new_project();
--   DROP FUNCTION IF EXISTS private.protect_project_owner_fields();
--   DROP FUNCTION IF EXISTS private.assert_project_member_in_workspace();
--   DROP FUNCTION IF EXISTS private.handle_new_workspace();
--   DROP FUNCTION IF EXISTS private.protect_workspace_owner_fields();

CREATE TABLE public.workspaces (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  name         VARCHAR(120) NOT NULL,
  slug         extensions.citext NOT NULL,
  kind         VARCHAR(32) NOT NULL DEFAULT 'personal'
               CHECK (kind IN ('personal', 'team', 'organization')),
  settings     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at  TIMESTAMPTZ NULL,
  deleted_at   TIMESTAMPTZ NULL,
  CONSTRAINT uq_workspaces_slug UNIQUE (slug),
  CONSTRAINT ck_workspaces_name_nonempty CHECK (char_length(btrim(name)) BETWEEN 1 AND 120),
  CONSTRAINT ck_workspaces_slug_format CHECK (
    char_length(slug::text) BETWEEN 1 AND 80
    AND slug::text = lower(slug::text)
    AND slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  CONSTRAINT ck_workspaces_settings_object CHECK (jsonb_typeof(settings) = 'object')
);

CREATE INDEX idx_workspaces_owner ON public.workspaces(owner_id);
CREATE UNIQUE INDEX uq_workspaces_one_personal
  ON public.workspaces(owner_id)
  WHERE kind = 'personal' AND deleted_at IS NULL;

CREATE TABLE public.workspace_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role          VARCHAR(32) NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by    UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  status        VARCHAR(32) NOT NULL DEFAULT 'active'
                CHECK (status IN ('invited', 'active', 'removed')),
  joined_at     TIMESTAMPTZ NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_workspace_member UNIQUE (workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_user
  ON public.workspace_members(user_id)
  WHERE status = 'active';
CREATE INDEX idx_workspace_members_invited_by
  ON public.workspace_members(invited_by);

CREATE TABLE public.projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id     UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_by       UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  name             VARCHAR(160) NOT NULL,
  slug             extensions.citext NOT NULL,
  description      TEXT NULL,
  status           VARCHAR(32) NOT NULL DEFAULT 'draft'
                   CHECK (status IN (
                     'draft', 'planning', 'plan_approved', 'in_development', 'completed', 'archived'
                   )),
  visibility       VARCHAR(32) NOT NULL DEFAULT 'workspace'
                   CHECK (visibility IN ('private', 'workspace')),
  settings         JSONB NOT NULL DEFAULT '{}',
  metadata         JSONB NOT NULL DEFAULT '{}',
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at      TIMESTAMPTZ NULL,
  deleted_at       TIMESTAMPTZ NULL,
  CONSTRAINT uq_project_slug UNIQUE (workspace_id, slug),
  CONSTRAINT ck_projects_name_nonempty CHECK (char_length(btrim(name)) BETWEEN 1 AND 160),
  CONSTRAINT ck_projects_slug_format CHECK (
    char_length(slug::text) BETWEEN 1 AND 80
    AND slug::text = lower(slug::text)
    AND slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  CONSTRAINT ck_projects_settings_object CHECK (jsonb_typeof(settings) = 'object'),
  CONSTRAINT ck_projects_metadata_object CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX idx_projects_workspace ON public.projects(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_created_by ON public.projects(created_by);

CREATE TABLE public.project_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role        VARCHAR(32) NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  added_by    UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_project_member UNIQUE (project_id, user_id)
);

CREATE INDEX idx_project_members_user ON public.project_members(user_id);
CREATE INDEX idx_project_members_added_by ON public.project_members(added_by);

CREATE TRIGGER trg_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER trg_workspace_members_updated_at
  BEFORE UPDATE ON public.workspace_members
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER trg_project_members_updated_at
  BEFORE UPDATE ON public.project_members
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

-- Membership helpers live in private so they are not Data API endpoints.
-- SECURITY DEFINER avoids RLS recursion. search_path is empty; names are qualified.

CREATE OR REPLACE FUNCTION private.is_active_workspace_member(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members AS m
    WHERE m.workspace_id = p_workspace_id
      AND m.user_id = (SELECT auth.uid())
      AND m.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION private.is_workspace_owner(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members AS m
    WHERE m.workspace_id = p_workspace_id
      AND m.user_id = (SELECT auth.uid())
      AND m.role = 'owner'
      AND m.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION private.is_project_owner(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members AS pm
    WHERE pm.project_id = p_project_id
      AND pm.user_id = (SELECT auth.uid())
      AND pm.role = 'owner'
  );
$$;

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
        OR EXISTS (
          SELECT 1
          FROM public.project_members AS pm
          WHERE pm.project_id = p.id
            AND pm.user_id = (SELECT auth.uid())
        )
      )
  );
$$;

CREATE OR REPLACE FUNCTION private.can_update_project(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.projects AS p
    JOIN public.project_members AS pm ON pm.project_id = p.id
    WHERE p.id = p_project_id
      AND p.deleted_at IS NULL
      AND pm.user_id = (SELECT auth.uid())
      AND pm.role IN ('owner', 'editor')
      AND private.is_active_workspace_member(p.workspace_id)
  );
$$;

CREATE OR REPLACE FUNCTION private.handle_new_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.workspace_members (workspace_id, user_id, role, status, joined_at)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'active', pg_catalog.now())
  ON CONFLICT ON CONSTRAINT uq_workspace_member DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_workspaces_owner_member
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_workspace();

CREATE OR REPLACE FUNCTION private.protect_workspace_owner_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    RAISE EXCEPTION 'workspace owner_id is immutable';
  END IF;
  IF NEW.kind IS DISTINCT FROM OLD.kind THEN
    RAISE EXCEPTION 'workspace kind is immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_workspaces_protect_owner
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION private.protect_workspace_owner_fields();

CREATE OR REPLACE FUNCTION private.assert_project_member_in_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.projects AS p
    JOIN public.workspace_members AS m
      ON m.workspace_id = p.workspace_id
     AND m.user_id = NEW.user_id
     AND m.status = 'active'
    WHERE p.id = NEW.project_id
  ) THEN
    RAISE EXCEPTION 'project member must be an active member of the project workspace';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_project_members_workspace_guard
  BEFORE INSERT OR UPDATE OF user_id, project_id ON public.project_members
  FOR EACH ROW EXECUTE FUNCTION private.assert_project_member_in_workspace();

CREATE OR REPLACE FUNCTION private.handle_new_project()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.workspace_members AS m
    WHERE m.workspace_id = NEW.workspace_id
      AND m.user_id = NEW.created_by
      AND m.status = 'active'
  ) THEN
    RAISE EXCEPTION 'project creator must be an active workspace member';
  END IF;

  INSERT INTO public.project_members (project_id, user_id, role, added_by)
  VALUES (NEW.id, NEW.created_by, 'owner', NEW.created_by)
  ON CONFLICT ON CONSTRAINT uq_project_member DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_projects_owner_member
  AFTER INSERT ON public.projects
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_project();

CREATE OR REPLACE FUNCTION private.protect_project_owner_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_owner BOOLEAN;
BEGIN
  IF NEW.workspace_id IS DISTINCT FROM OLD.workspace_id THEN
    RAISE EXCEPTION 'project workspace_id is immutable';
  END IF;
  IF NEW.created_by IS DISTINCT FROM OLD.created_by THEN
    RAISE EXCEPTION 'project created_by is immutable';
  END IF;

  v_is_owner := private.is_project_owner(OLD.id);
  -- Authenticated sessions must be the project owner for these fields.
  -- A session with no auth.uid() is a privileged SQL path (service role / migration).
  IF (SELECT auth.uid()) IS NOT NULL
     AND NOT v_is_owner
     AND (
       NEW.visibility IS DISTINCT FROM OLD.visibility
       OR NEW.deleted_at IS DISTINCT FROM OLD.deleted_at
       OR NEW.archived_at IS DISTINCT FROM OLD.archived_at
       OR (
         NEW.status IS DISTINCT FROM OLD.status
         AND (NEW.status = 'archived' OR OLD.status = 'archived')
       )
     ) THEN
    RAISE EXCEPTION 'only the project owner can change visibility, archive, or delete';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_projects_protect_owner_fields
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION private.protect_project_owner_fields();

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY workspaces_select_member ON public.workspaces
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND private.is_active_workspace_member(id)
  );

CREATE POLICY workspaces_insert_personal ON public.workspaces
  FOR INSERT TO authenticated
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND kind = 'personal'
    AND deleted_at IS NULL
    AND archived_at IS NULL
  );

CREATE POLICY workspaces_update_owner ON public.workspaces
  FOR UPDATE TO authenticated
  USING (
    deleted_at IS NULL
    AND private.is_workspace_owner(id)
  )
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND kind = 'personal'
  );

CREATE POLICY workspace_members_select_member ON public.workspace_members
  FOR SELECT TO authenticated
  USING (private.is_active_workspace_member(workspace_id));

CREATE POLICY projects_select_authorized ON public.projects
  FOR SELECT TO authenticated
  USING (private.can_read_project(id));

CREATE POLICY projects_insert_member ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = (SELECT auth.uid())
    AND deleted_at IS NULL
    AND archived_at IS NULL
    AND private.is_active_workspace_member(workspace_id)
  );

CREATE POLICY projects_update_editor ON public.projects
  FOR UPDATE TO authenticated
  USING (private.can_update_project(id))
  WITH CHECK (private.can_update_project(id) OR private.is_project_owner(id));

CREATE POLICY project_members_select_authorized ON public.project_members
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR private.can_read_project(project_id)
  );

-- Lock private helpers. Trigger functions stay owner-only.
REVOKE ALL ON FUNCTION private.handle_new_auth_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.handle_auth_user_updated() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.handle_new_workspace() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.protect_workspace_owner_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.assert_project_member_in_workspace() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.handle_new_project() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.protect_project_owner_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_active_workspace_member(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_workspace_owner(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_project_owner(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.can_read_project(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.can_update_project(UUID) FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_active_workspace_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_workspace_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_project_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_read_project(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_update_project(UUID) TO authenticated;

REVOKE ALL ON TABLE public.workspaces FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.workspace_members FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.projects FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.project_members FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON TABLE public.workspaces TO authenticated;
GRANT SELECT ON TABLE public.workspace_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.projects TO authenticated;
GRANT SELECT ON TABLE public.project_members TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.workspaces TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.workspace_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.project_members TO service_role;

COMMENT ON TABLE public.workspaces IS
  'Phase 3.0 tenant container. Client inserts are personal workspaces only. Team behavior is deferred.';
COMMENT ON TABLE public.workspace_members IS
  'Explicit workspace access. Owner row is trigger-maintained. Client cannot insert memberships in Phase 3.0.';
COMMENT ON TABLE public.projects IS
  'Cloud project record. metadata is not the local-folder link and must not store credentials.';
COMMENT ON TABLE public.project_members IS
  'Explicit project access. Creator owner row is trigger-maintained. Client cannot insert memberships in Phase 3.0.';
