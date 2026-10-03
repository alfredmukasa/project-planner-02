# Supabase Auth setup (email + Google + GitHub)

Apply the users-only migration, then enable OAuth providers and redirect URLs in the Supabase Dashboard for project `shbumfpebjfxzvehwrec`.

## 1. Apply users schema

In **SQL Editor**, paste and run:

`supabase/migrations/20261002230409_users_auth_schema.sql`

Or, after CLI login/link:

```bash
npx supabase db push --linked
```

Creates: `users`, `user_auth_identities`, `user_profiles`, `user_onboarding`, public views, RLS, and signup triggers on `auth.users`.

If Auth users already exist (created before the migration), backfill once:

```sql
INSERT INTO public.users (id, primary_email, email_verified_at, status)
SELECT id, email, email_confirmed_at,
  CASE WHEN email_confirmed_at IS NULL THEN 'pending_verification' ELSE 'active' END
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Then create matching profiles/identities/onboarding rows as needed, or re-register test accounts.
```

## 2. Redirect URLs

**Authentication → URL configuration**

These must match the app **exactly** (scheme, host, port, and trailing slash).
The site uses Next.js `trailingSlash: true`, and OAuth `redirectTo` is:

`{origin}/auth/callback/`

Site URL (local):

```text
http://localhost:3000
```

Additional Redirect URLs:

```text
http://localhost:3000/auth/callback/
http://localhost:3000/account/
```

If `next dev` binds to another port (e.g. `3001` when `3000` is busy), either free
port `3000` or also add that origin’s callback URL:

```text
http://localhost:3001/auth/callback/
```

PKCE stores the code verifier in **this browser’s cookies for that origin**. Starting
OAuth on `:3001` and landing on `:3000` (or another device/browser) will fail with
“PKCE code verifier not found”.

Add your production origin the same way when you deploy (e.g. `https://your-domain/auth/callback/`).

## 3. Google (Gmail) provider

1. **Authentication → Providers → Google** → Enable
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Application type: Web application
   - Authorized redirect URI (Supabase callback):

```text
https://shbumfpebjfxzvehwrec.supabase.co/auth/v1/callback
```

3. Paste Client ID and Client Secret into the Supabase Google provider settings
4. Save

## 4. GitHub provider

1. **Authentication → Providers → GitHub** → Enable
2. Create an OAuth App at [GitHub Developer Settings](https://github.com/settings/developers)
   - Homepage URL: `http://localhost:3000` (or your production URL)
   - Authorization callback URL:

```text
https://shbumfpebjfxzvehwrec.supabase.co/auth/v1/callback
```

3. Paste Client ID and Client Secret into the Supabase GitHub provider settings
4. Save

## 5. Email confirmation (local testing) — required to avoid rate limits

Hosted Supabase enforces a low **email send rate limit**. Repeated signups with
**Confirm email** enabled quickly return `email rate limit exceeded`.

**Authentication → Providers → Email** (project `shbumfpebjfxzvehwrec`):

1. Turn **Confirm email** **OFF** while developing locally.
2. Save. New `signUp` calls should return a session immediately (no confirmation email).
3. Turn it back **ON** before production if you want verified emails.

Alternatives while confirmation stays enabled:

- Wait ~1 hour after the rate-limit error, then try once.
- Use **Continue with Google** / **Continue with GitHub** (no confirmation email).

## 6. App env (already gitignored)

`project-planner-website/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://shbumfpebjfxzvehwrec.supabase.co
# Prefer the legacy JWT anon key from Project Settings → API (anon / public).
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…
# Optional fallback (new publishable key). Client prefers a JWT-shaped anon key.
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit service-role / secret keys. Restart `npm run dev` after changing env.
