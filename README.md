# Project Planner website

Public marketing and documentation site for **Project Planner**, an upcoming AI-powered planning workspace for Windows.

This directory is the whole product for now. It is a static site. It does not include a desktop application, backend, database, authentication service, billing, AI agents, MCP execution, local filesystem access, a terminal or Git integration.

Interface screens on the site are **previews** rendered from a demo project (`Atlas Field Service`). They are labelled as preview / demo content.

## Stack

- Next.js (App Router) with `output: 'export'`
- React 19 and TypeScript
- Tailwind CSS v4
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

## Deploy to Vercel

The site is static. This repository also has a root `vercel.json` that builds `project-planner-website/` when the Vercel project root is the repo root.

To make preview URLs public, turn off **Deployment Protection → Vercel Authentication** on the Vercel project. Otherwise the preview asks visitors to log in to Vercel.

Optional dashboard settings if you prefer a subdirectory root:

| Setting | Value |
| --- | --- |
| Root Directory | `project-planner-website` |
| Framework | Next.js (or Other) |
| Build command | `npm run build` |
| Output directory | `out` |

Or from the CLI, from this folder:

```bash
npx vercel --yes
```

Any other static host (Netlify, GitHub Pages, S3, `npx serve out`) works the same way: publish the `out/` directory.

## Pages

Overview, How it works, Features, Architecture, AI Agents, Documentation (and guides), Pricing, Download, Support (FAQ, contact, feedback), About, Security, Privacy, Terms, Login, Create account, Forgot password.

Pricing: **Free**, **Builder $5**, **Pro $15**, **Studio $20**. Billing is not available; plan buttons are disabled.

Download: Windows application is **Coming soon**. There is no installer.

## Design

Foglamp-inspired developer-tool density: compact header, grouped information, structured panels, original Project Planner mark and colour. Light (white) and Midnight (near-black) only. Solid colour, no gradients.

## Isolation

All website source lives in `project-planner-website/`. It does not import or modify `PROJECT_PLANNER_AUDIT/`, `PROJECT_PLANNER_DOCS/` or any other project in this repository.
