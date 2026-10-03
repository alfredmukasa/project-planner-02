# Authentication architecture (as implemented)

**Phase:** 2 — Authenticated Product Foundation  
**Date:** 2026-10-02  
**Scope:** Website only (static Next.js export + Supabase Auth). Not desktop, billing, or agents. Project create, list, and detail are Phase 3.1.

## Components

| Piece | Location |
| --- | --- |
| Browser client | `src/lib/supabase/client.ts` (`@supabase/ssr` cookies, PKCE, `detectSessionInUrl: false`) |
| Env helpers | `src/lib/supabase/env.ts` |
| Post-auth destination | `src/lib/auth/post-auth.ts` → `/onboarding/` or `/dashboard/` |
| Onboarding mutations | `src/lib/auth/onboarding.ts` (complete / skip on `user_onboarding`) |
| Chrome modes | `src/components/site/root-chrome.tsx` (marketing / auth / app) |
| Client AuthGate | `src/components/auth/auth-gate.tsx` (static export — no middleware) |
| App shell nav | `src/components/app/app-shell.tsx` — Dashboard, Projects, Account |
| Email/password + forgot UI | `src/components/auth/auth-form.tsx` |
| OAuth buttons | `src/components/auth/oauth-buttons.tsx` |
| Reset completion | `src/components/auth/reset-password-form.tsx`, `/reset-password/` |
| OAuth/email code exchange | `/auth/callback/` |
| Dashboard | `/dashboard/` |
| Account / profile | `/account/` |
| Onboarding MVP | `/onboarding/` |
| DB (users-only) | `supabase/migrations/20261002230409_users_auth_schema.sql` |

## Flows

### Registration (email)

1. `/register/` → `signUp` with optional `display_name` metadata.  
2. `emailRedirectTo` → `{origin}/auth/callback/`.  
3. If Confirm email is ON and no session: show “check email”.  
4. If session returned: `resolvePostAuthPath` → `/onboarding/` or `/dashboard/`.  
5. Trigger `private.handle_new_auth_user` creates `users`, `user_profiles`, `user_auth_identities`, `user_onboarding`.

### Login (email)

1. `/login/` → `signInWithPassword`.  
2. Optional safe `?next=` path wins; otherwise `resolvePostAuthPath`.  
3. Errors mapped via `friendlyAuthError` (no raw keys).

### Google / GitHub OAuth

1. Button → `signInWithOAuth({ redirectTo: {origin}/auth/callback/ })`.  
2. Provider → Supabase `/auth/v1/callback` → app `/auth/callback/?code=…`.  
3. Callback calls `exchangeCodeForSession` once → recovery → `/reset-password/`, else `resolvePostAuthPath`.  
4. PKCE verifier stored in **cookies** for the same origin/port.

### Password recovery

1. `/forgot-password/` → `resetPasswordForEmail` with `redirectTo: {origin}/reset-password/`.  
2. Email link → Supabase → `{origin}/reset-password/?code=…` (or via `/auth/callback/` with `type=recovery`).  
3. `/reset-password/` exchanges code if needed, requires session, `updateUser({ password })`, then `signOut` → `/login/?reset=1`.

### Onboarding

1. New rows start `completion_status = in_progress`.  
2. `/onboarding/` (AuthGate) lets the user set display name and **Complete**, or **Skip for now**.  
3. Both paths set `completion_status = completed` (skip records `skipped_steps`).  
4. Then navigate to `/dashboard/`.

### Session + route protection

- `persistSession: true`, `autoRefreshToken: true` on browser client.  
- **No middleware / proxy** — unsupported with `output: 'export'` (Next.js static exports docs).  
- `AuthGate` runs after hydrate: anonymous → `/login/?next=…`; incomplete onboarding blocked from `/dashboard/` and `/account/`.  
- Device/session inventory UI remains out of scope.

## Redirect URLs (Supabase Dashboard)

Must include (trailing slash):

```text
http://localhost:3000/auth/callback/
http://localhost:3000/reset-password/
http://localhost:3000/account/
http://localhost:3000/dashboard/
http://localhost:3000/onboarding/
```

Plus the same paths for each Vercel preview/production origin.  
Provider apps (Google/GitHub) use only:

```text
https://shbumfpebjfxzvehwrec.supabase.co/auth/v1/callback
```

## Environment

| Variable | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Prefer JWT anon key |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client optional | Fallback only |
| `NEXT_PUBLIC_SITE_URL` | Build/SSR fallback | Used when `window` unavailable |

Never put service-role or OAuth client secrets in `NEXT_PUBLIC_*`.

## Project tables (Phase 3.0)

`workspaces`, `workspace_members`, `projects`, and `project_members` exist in the live database with RLS. Phase 3.1 reads and creates personal workspaces and projects from the browser client (`src/lib/projects/access.ts`). The signup trigger still does not create a workspace. The first project create inserts the personal workspace; owner membership stays trigger-maintained. Phase 1–2 sign-in, onboarding, and account behavior are unchanged.

## Explicitly not implemented (later phases)

Requirements editor, AI agents, billing, desktop app, team-workspace behavior, device session inventory. Project list, create, and detail shipped in Phase 3.1.
