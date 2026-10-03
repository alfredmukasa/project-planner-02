# Project Planner website

Public marketing, documentation, and **website account authentication** for **Project Planner**, an upcoming AI-powered planning workspace for Windows.

This directory is the website product for now. It does **not** include the Windows desktop application, billing checkout, AI agent execution, MCP tools, local filesystem access, a terminal, or Git integration.

Interface screens on marketing pages are **previews** rendered from a demo project (`Atlas Field Service`). They are labelled as preview / demo content.

## What is live

- Static Next.js marketing/docs site (`output: 'export'`)
- Supabase Auth: email/password, Google OAuth, GitHub OAuth
- Password recovery → `/reset-password/`
- Minimal `/account/` session page (sign-out). Full dashboard/profile is **not** in this phase.
- Users-only schema in Supabase (`users`, `user_auth_identities`, `user_profiles`, `user_onboarding`) with RLS

## Stack

- Next.js (App Router) with `output: 'export'`
- React 19 and TypeScript
- Tailwind CSS v4
- `@supabase/ssr` + `@supabase/supabase-js` (browser client, cookie PKCE)
- Two themes only: Light and Midnight (`data-theme`)
- No gradients (enforced by `npm run check:gradients`)

## Scripts

```bash
cd project-planner-website
npm install
npm run dev          # local development
npm run build        # static export to ./out
npm run start        # serve ./out
npm run typecheck
npm run lint
npm run check:gradients
npm run test:e2e     # Playwright, requires a prior build
npm run verify       # typecheck + lint + gradient scan + build
```

## Environment

See `supabase/OAUTH_SETUP.md` and `.env.local` (gitignored):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (prefer JWT anon key)
- `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000` or your deployment origin)

Never commit service-role keys or OAuth client secrets.

## Deploy to Vercel

Root `vercel.json` builds `project-planner-website/`. Set the same `NEXT_PUBLIC_*` vars for Preview and Production.

To make preview URLs public, turn off **Deployment Protection → Vercel Authentication** on the Vercel project. Otherwise the preview asks visitors to log in to Vercel.

Add each deployment origin’s `/auth/callback/` and `/reset-password/` to Supabase **Redirect URLs**.

## Pages

Marketing: Overview, How it works, Features, Architecture, AI Agents, Documentation, Pricing, Download, Support, About, Security, Privacy, Terms.

Auth: Login, Create account, Forgot password, Reset password, Auth callback, Account (stub).

Pricing: **Free**, **Builder $5**, **Pro $15**, **Studio $20**. Billing checkout is not available; plan buttons are disabled.

Download: Windows application is **Coming soon**. There is no installer.

## Design

Foglamp-inspired developer-tool density: compact header, grouped information, structured panels, original Project Planner mark and colour. Light (white) and Midnight (near-black) only. Solid colour, no gradients.

## Docs

- `supabase/OAUTH_SETUP.md` — providers and redirects
- `supabase/AUTH_ARCHITECTURE.md` — actual auth flows
- `PROJECT_PLANNER_DOCS/` (repo root) — product specification (not all implemented)
