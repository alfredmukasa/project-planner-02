import type { Metadata } from 'next';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Website changelog',
  description: 'What this public website currently includes, and what it deliberately does not.',
};

export default function ChangelogPage() {
  return (
    <DocsLayout
      title="Website changelog"
      description="This log covers the public website only. The Windows application has not been released."
    >
      <h2>0.3.0 — 2 October 2026</h2>
      <ul>
        <li>Authenticated product shell: <code>/dashboard/</code>, enhanced <code>/account/</code>, <code>/onboarding/</code>.</li>
        <li>Post-login routing resolves onboarding, then lands on the dashboard.</li>
        <li>Auth and app chrome hide the marketing sidebar; workspace nav is Dashboard and Account only.</li>
        <li>Honest empty projects state — no placeholder project data.</li>
      </ul>
      <h2>0.2.0 — 2 October 2026</h2>
      <ul>
        <li>Supabase Auth on the website: email/password, Google and GitHub OAuth, PKCE callback.</li>
        <li>Password recovery completes on <code>/reset-password/</code>.</li>
        <li>Compact authentication layouts; Privacy, Terms, Security and Support FAQ updated for live accounts.</li>
        <li>Minimal <code>/account/</code> session page (sign-out) before the authenticated foundation.</li>
      </ul>
      <h2>0.1.1 — 28 September 2026</h2>
      <ul>
        <li>Top navigation now has four primary items: Overview, Features, Pricing, Download.</li>
        <li>Remaining destinations moved to a collapsible sidebar: icons when collapsed, icons and labels when expanded.</li>
      </ul>
      <h2>0.1.0 — 21 September 2026</h2>
      <p>Initial public website.</p>
      <ul>
        <li>Product overview, how it works, features, architecture, agents, pricing, download, support, about, security, privacy, terms.</li>
        <li>Documentation hub and guides for getting started, identity, workspace, architecture, agents, development, export and keyboard shortcuts.</li>
        <li>Login, create account and forgot-password screens (later wired to Supabase in 0.2.0).</li>
        <li>Light and Midnight themes. No gradients.</li>
        <li>Interface previews rendered from a single demo project (Atlas Field Service), labelled as preview content.</li>
        <li>Download page shows the Windows application as coming soon. No installer is published.</li>
        <li>Pricing: Free, Builder $5, Pro $15, Studio $20. Billing is not available.</li>
      </ul>
      <h2>Deliberately not included</h2>
      <ul>
        <li>Desktop application, installer or auto-update.</li>
        <li>Projects product, AI agents runtime, billing checkout, teams/workspaces.</li>
        <li>Live AI agents, MCP execution, terminal, Git or local filesystem access.</li>
      </ul>
    </DocsLayout>
  );
}
