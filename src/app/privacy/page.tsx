import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/ui/primitives';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What the Project Planner public website collects, what the planned Windows application is specified to collect, and how to contact us about personal data.',
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy notice"
        description="Last updated 2 October 2026. This notice covers the public website you are using now, including account authentication via Supabase, and describes — separately — what the Windows application is specified to do when it ships. It is not legal advice."
      />
      <div className="container-x py-12 md:py-16">
        <article className="prose-pp max-w-3xl">
          <h2>Who we are</h2>
          <p>
            Project Planner is an upcoming Windows desktop application and this public website. Company registration, postal address and a formal data-controller identity will be published on this page before paid plans are offered. Until then, contact{' '}
            <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
          </p>

          <h2>This website</h2>
          <p>
            The marketing and documentation pages are a static Next.js export hosted on a platform such as Vercel. Account sign-in is provided by{' '}
            <strong>Supabase Auth</strong> (email/password and optional Google or GitHub OAuth). Session cookies for authentication are stored in your browser.
          </p>
          <ul>
            <li>
              <strong>Accounts.</strong> Creating an account or signing in sends your email (and password hash handling) to Supabase Auth. Password-reset emails are sent by Supabase when you use Forgot password; completing reset uses a one-time link to set a new password. Application profile rows linked to your user id may be stored in the project database (for example display name and auth provider identity). Passwords are not stored in our application tables.
            </li>
            <li>
              <strong>Feedback form.</strong> The feedback form on Support is still preview-only and does not submit messages to a server.
            </li>
            <li>Theme preference (<code>pp-theme</code>) is stored in your browser’s localStorage so Light / Midnight can persist.</li>
            <li>Your host or CDN may collect standard server logs (IP address, user agent, requested path, time).</li>
            <li>We do not embed advertising, analytics or social pixels in the source of this website.</li>
            <li>This website does not collect desktop project contents, AI prompts, or provider API keys.</li>
          </ul>

          <h2>The planned Windows application</h2>
          <p>When the desktop application ships, the following rules are specified. They are not in force for project files on this website.</p>
          <ul>
            <li>
              <strong>Local projects.</strong> Requirements, architecture, tasks, artifacts and memory live in the project folder you choose, including the <code>.pp</code> file and <code>project-planner/</code> directory.
            </li>
            <li>
              <strong>Credentials.</strong> Provider API keys are stored in the operating system’s secure storage. They are never included in prompts, logs, activity feeds, artifacts or exports.
            </li>
            <li>
              <strong>AI providers.</strong> If you configure a provider, that provider receives only the structured context an agent is allowed to send. You pay that provider directly.
            </li>
            <li>
              <strong>Licence accounts (planned).</strong> Paid plans may later use the same account for licence validation and are specified to avoid storing project content for that purpose.
            </li>
            <li>
              <strong>Telemetry (not enabled).</strong> No usage telemetry is specified as on-by-default. If optional diagnostics are added later, they will be opt-in and documented here.
            </li>
          </ul>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have rights to access, correct, delete, restrict or export personal data, and to object to certain processing. For account-related requests, email {site.privacyEmail}. Account deletion workflows on the website are not yet fully productized; we will handle verified requests manually until then.
          </p>

          <h2>Children</h2>
          <p>Project Planner is intended for adults building software. The website and the planned application are not directed at children under 16.</p>

          <h2>Changes</h2>
          <p>
            We will update this notice when accounts, billing or hosting arrangements change, and will change the date at the top of the page. The{' '}
            <Link href="/documentation/changelog/">website changelog</Link> records what the site itself includes.
          </p>

          <h2>Related</h2>
          <p>
            <Link href="/terms/">Terms of use</Link>
            {' · '}
            <Link href="/security/">Security</Link>
            {' · '}
            <Link href="/support/">Support</Link>
          </p>
        </article>
      </div>
    </>
  );
}
