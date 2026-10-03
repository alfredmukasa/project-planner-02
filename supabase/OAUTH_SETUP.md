# Supabase Auth setup (email + Google + GitHub)

Apply the users-only migration (if not already applied), then enable OAuth providers and redirect URLs in the Supabase Dashboard for project `shbumfpebjfxzvehwrec`.

## 1. Apply users schema

In **SQL Editor**, paste and run (only if tables are missing):

`supabase/migrations/20261002230409_users_auth_schema.sql`

Phase 1 security hardening (search_path + revoke `rls_auto_enable`):

`supabase/migrations/20261003010000_phase1_auth_security.sql`

## 2. Redirect URLs

**Authentication → URL configuration**

These must match the app **exactly** (scheme, host, port, and trailing slash).

Site URL (local):

```text
http://localhost:3000
```

Additional Redirect URLs:

```text
http://localhost:3000/auth/callback/
http://localhost:3000/reset-password/
http://localhost:3000/account/
http://localhost:3000/dashboard/
http://localhost:3000/onboarding/
```

For each Vercel preview or production origin, add the same paths, for example:

```text
https://<your-deployment>.vercel.app/auth/callback/
https://<your-deployment>.vercel.app/reset-password/
https://<your-deployment>.vercel.app/account/
https://<your-deployment>.vercel.app/dashboard/
https://<your-deployment>.vercel.app/onboarding/
```

Also set Vercel env `NEXT_PUBLIC_SITE_URL` to that origin for the matching environment.

**Status (2026-10-02 audit):** Vercel currently has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for preview/production/development. `NEXT_PUBLIC_SITE_URL` is still **missing** on Vercel — add it per environment (production origin and, when using fixed preview URLs, that preview origin). Browser OAuth/forgot flows use `window.location.origin` when available; `NEXT_PUBLIC_SITE_URL` matters for email redirect fallbacks at build/SSR time.

PKCE stores the code verifier in **this browser’s cookies for that origin**. Starting OAuth on `:3001` and landing on `:3000` fails with “PKCE code verifier not found”.

## 3. Google provider (required for Google sign-in)

Google failures are almost always **Dashboard configuration**, not missing app code.

1. **Authentication → Providers → Google** → Enable  
2. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth Web client  
   - Authorized JavaScript origins: `http://localhost:3000` and your Vercel origin  
   - Authorized redirect URI (Supabase only):

```text
https://shbumfpebjfxzvehwrec.supabase.co/auth/v1/callback
```

3. Paste **Client ID** and **Client Secret** into Supabase Google provider settings (never into the Next.js repo).  
4. Save and retry **Continue with Google** from `http://localhost:3000/login/`.

## 4. GitHub provider

1. **Authentication → Providers → GitHub** → Enable  
2. GitHub OAuth App: Homepage `http://localhost:3000` (or production); Callback:

```text
https://shbumfpebjfxzvehwrec.supabase.co/auth/v1/callback
```

3. Paste Client ID/Secret into Supabase GitHub settings.

## 5. Email confirmation (local testing)

Hosted Supabase rate-limits confirmation emails. For local testing:

**Authentication → Providers → Email** → **Confirm email OFF** → Save.

Turn back ON before production if you require verified emails.

Password recovery emails also count toward email rate limits.

## 6. Leaked-password protection (Dashboard)

Supabase advisor may report leaked-password protection disabled. Enable under Auth password security in the Dashboard when ready (not configurable via SQL migrations).

## 7. App env (gitignored)

```env
NEXT_PUBLIC_SUPABASE_URL=https://shbumfpebjfxzvehwrec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…   # JWT anon from Project Settings → API
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit service-role / OAuth secrets. Restart `npm run dev` after changing env.

See also `AUTH_ARCHITECTURE.md`.
