-- Users-only schema for Supabase Auth (email + OAuth).
-- Managed auth: email verification / password reset stay in Supabase Auth
-- (no email_verification_records / password_reset_records tables).
-- users.id mirrors auth.users.id (D-02).

CREATE SCHEMA IF NOT EXISTS private;
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA extensions;

CREATE TABLE public.users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_email     extensions.citext NOT NULL UNIQUE,
  email_verified_at TIMESTAMPTZ NULL,
  status            VARCHAR(32) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('pending_verification','active','suspended','deactivated','deleted')),
  last_login_at     TIMESTAMPTZ NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ NULL
);

CREATE INDEX idx_users_status ON public.users(status) WHERE deleted_at IS NULL;

CREATE TABLE public.user_auth_identities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider            VARCHAR(32) NOT NULL
                      CHECK (provider IN ('email','google','apple','github','facebook')),
  provider_user_id    VARCHAR(255) NOT NULL,
  provider_email      extensions.citext NULL,
  password_hash       TEXT NULL,
  password_updated_at TIMESTAMPTZ NULL,
  is_primary          BOOLEAN NOT NULL DEFAULT false,
  linked_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at        TIMESTAMPTZ NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_auth_identity_provider UNIQUE (provider, provider_user_id),
  CONSTRAINT uq_auth_identity_user_provider UNIQUE (user_id, provider),
  CONSTRAINT ck_password_only_for_email CHECK (provider = 'email' OR password_hash IS NULL)
);

CREATE INDEX idx_auth_identities_user ON public.user_auth_identities(user_id);

CREATE TABLE public.user_profiles (
  user_id        UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  display_name   VARCHAR(100) NOT NULL,
  username       extensions.citext NULL UNIQUE,
  avatar_file_id UUID NULL,
  avatar_url     TEXT NULL,
  locale         VARCHAR(16) NULL,
  timezone       VARCHAR(64) NULL,
  preferences    JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_onboarding (
  user_id           UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  current_step      VARCHAR(64) NULL,
  completed_steps   JSONB NOT NULL DEFAULT '[]',
  skipped_steps     JSONB NOT NULL DEFAULT '[]',
  completion_status VARCHAR(32) NOT NULL DEFAULT 'not_started'
                    CHECK (completion_status IN ('not_started','in_progress','completed')),
  flow_version      VARCHAR(16) NOT NULL DEFAULT '1',
  started_at        TIMESTAMPTZ NULL,
  completed_at      TIMESTAMPTZ NULL,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE VIEW public.user_auth_identities_public
WITH (security_invoker = true) AS
  SELECT id, user_id, provider, provider_email, is_primary, linked_at, last_used_at, created_at
  FROM public.user_auth_identities;

CREATE OR REPLACE VIEW public.user_profiles_public
WITH (security_invoker = true) AS
  SELECT user_id, display_name, avatar_file_id, avatar_url
  FROM public.user_profiles;

CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER trg_user_auth_identities_updated_at
  BEFORE UPDATE ON public.user_auth_identities
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER trg_user_onboarding_updated_at
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

-- Create application shadow rows when Supabase Auth creates a user.
CREATE OR REPLACE FUNCTION private.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_provider TEXT;
  v_provider_user_id TEXT;
  v_provider_email TEXT;
  v_display_name TEXT;
  v_avatar_url TEXT;
  v_email_verified_at TIMESTAMPTZ;
  v_status TEXT;
  v_onboarding_step TEXT;
  v_completed_steps JSONB;
BEGIN
  SELECT
    i.provider,
    COALESCE(i.provider_id, lower(NEW.email), NEW.id::text),
    COALESCE(i.email, NEW.email)
  INTO v_provider, v_provider_user_id, v_provider_email
  FROM auth.identities i
  WHERE i.user_id = NEW.id
  ORDER BY i.created_at ASC NULLS FIRST
  LIMIT 1;

  IF v_provider IS NULL THEN
    v_provider := COALESCE(NEW.raw_app_meta_data->>'provider', 'email');
    v_provider_user_id := COALESCE(
      NEW.raw_user_meta_data->>'sub',
      NEW.raw_user_meta_data->>'provider_id',
      lower(NEW.email),
      NEW.id::text
    );
    v_provider_email := NEW.email;
  END IF;

  IF v_provider NOT IN ('email', 'google', 'apple', 'github', 'facebook') THEN
    v_provider := 'email';
  END IF;

  IF v_provider = 'email' THEN
    v_provider_user_id := lower(COALESCE(NEW.email, v_provider_user_id));
  END IF;

  v_display_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'display_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'name', ''),
    split_part(COALESCE(NEW.email, 'user'), '@', 1)
  );
  v_avatar_url := NULLIF(NEW.raw_user_meta_data->>'avatar_url', '');
  v_email_verified_at := NEW.email_confirmed_at;

  IF v_email_verified_at IS NOT NULL THEN
    v_status := 'active';
    v_onboarding_step := 'profile';
    v_completed_steps := '["account","verify_email"]'::jsonb;
  ELSE
    v_status := 'pending_verification';
    v_onboarding_step := 'verify_email';
    v_completed_steps := '["account"]'::jsonb;
  END IF;

  INSERT INTO public.users (id, primary_email, email_verified_at, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, v_provider_email, NEW.id::text || '@users.invalid'),
    v_email_verified_at,
    v_status
  );

  INSERT INTO public.user_auth_identities (
    user_id, provider, provider_user_id, provider_email, is_primary
  ) VALUES (
    NEW.id, v_provider, v_provider_user_id, v_provider_email, true
  );

  INSERT INTO public.user_profiles (user_id, display_name, avatar_url)
  VALUES (NEW.id, left(v_display_name, 100), v_avatar_url);

  INSERT INTO public.user_onboarding (
    user_id, current_step, completed_steps, completion_status, started_at
  ) VALUES (
    NEW.id, v_onboarding_step, v_completed_steps, 'in_progress', now()
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_auth_user();

CREATE OR REPLACE FUNCTION private.handle_auth_user_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET
    primary_email = COALESCE(NEW.email, primary_email),
    email_verified_at = COALESCE(NEW.email_confirmed_at, email_verified_at),
    status = CASE
      WHEN NEW.email_confirmed_at IS NOT NULL AND status = 'pending_verification' THEN 'active'
      ELSE status
    END,
    last_login_at = COALESCE(NEW.last_sign_in_at, last_login_at),
    updated_at = now()
  WHERE id = NEW.id;

  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.user_onboarding
    SET
      completed_steps = CASE
        WHEN completed_steps ? 'verify_email' THEN completed_steps
        ELSE completed_steps || '["verify_email"]'::jsonb
      END,
      current_step = CASE
        WHEN current_step = 'verify_email' THEN 'profile'
        ELSE current_step
      END,
      updated_at = now()
    WHERE user_id = NEW.id
      AND completion_status <> 'completed';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_auth_user_updated();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_auth_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_own ON public.users
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY users_update_own ON public.users
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY user_auth_identities_select_own ON public.user_auth_identities
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY user_profiles_select_own ON public.user_profiles
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY user_profiles_update_own ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY user_onboarding_select_own ON public.user_onboarding
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY user_onboarding_update_own ON public.user_onboarding
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.user_auth_identities TO authenticated;
GRANT SELECT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, UPDATE ON public.user_onboarding TO authenticated;
GRANT SELECT ON public.user_auth_identities_public TO authenticated;
GRANT SELECT ON public.user_profiles_public TO authenticated;

REVOKE ALL ON public.user_auth_identities FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.user_auth_identities FROM authenticated;
