# Authentication architecture (as implemented)

**Phase:** 1 — Authentication Foundation  
**Date:** 2026-10-02  
**Scope:** Website only (static Next.js export + Supabase Auth). Not desktop, billing, or dashboard.

## Components

| Piece | Location |
| --- | --- |
| Browser client | `src/lib/supabase/client.ts` (`@supabase/ssr` cookies, PKCE, `detectSessionInUrl: false`) |
| Env helpers | `src/lib/supabase/env.ts` |
| Email/password + forgot UI | `src/components/auth/auth-form.tsx` |
| OAuth buttons | `src/components/auth/oauth-buttons.tsx` |
| Reset completion | `src/components/auth/reset-password-form.tsx`, `/reset-password/` |
| OAuth/email code exchange | `/auth/callback/` |
| Signed-in stub | `/account/` |
| DB (users-only) | `supabase/migrations/20261002230409_users_auth_schema.sql` |

## Flows

### Registration (email)

1. `/register/` → `signUp` with optional `display_name` metadata.  
2. `emailRedirectTo` → `{origin}/account/`.  
3. If Confirm email is ON and no session: show “check email”.  
4. If session returned: navigate to `/account/`.  
5. Trigger `private.handle_new_auth_user` creates `users`, `user_profiles`, `user_auth_identities`, `user_onboarding`.

### Login (email)

1. `/login/` → `signInWithPassword`.  
2. On success → `/account/`.  
3. Errors mapped via `friendlyAuthError` (no raw keys).

### Google / GitHub OAuth

1. Button → `signInWithOAuth({ redirectTo: {origin}/auth/callback/ })`.  
2. Provider → Supabase `/auth/v1/callback` → app `/auth/callback/?code=…`.  
3. Callback calls `exchangeCodeForSession` once → `/account/` (or `/reset-password/` if recovery).  
4. PKCE verifier stored in **cookies** for the same origin/port.

### Password recovery

1. `/forgot-password/` → `resetPasswordForEmail` with `redirectTo: {origin}/reset-password/`.  
2. Email link → Supabase → `{origin}/reset-password/?code=…` (or via `/auth/callback/` with `type=recovery`).  
3. `/reset-password/` exchanges code if needed, requires session, `updateUser({ password })`, then `signOut` → `/login/?reset=1`.

### Session

- `persistSession: true`, `autoRefreshToken: true` on browser client.  
- `/account/` uses `getUser` + `onAuthStateChange`; Sign out calls `signOut`.  
- No middleware route guard (static export); `/account/` shows signed-out UI when anonymous.  
- Device/session inventory UI is **out of scope** for Phase 1.

## Redirect URLs (Supabase Dashboard)

Must include (trailing slash):

```text
http://localhost:3000/auth/callback/
http://localhost:3000/reset-password/
http://localhost:3000/account/
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

## Explicitly not implemented (Phase 2+)

Dashboard, full profile editor, onboarding UI, account security devices page, billing, desktop app.
