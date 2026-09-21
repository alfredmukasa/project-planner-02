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
        description="Last updated 21 September 2026. This notice covers the public website you are using now, and describes — separately — what the Windows application is specified to do when it ships. It is not legal advice and will be updated before accounts or billing open."
      />
      <div className="container-x py-12 md:py-16">
        <article className="prose-pp max-w-3xl">
          <h2>Who we are</h2>
          <p>
            Project Planner is an upcoming Windows desktop application and this static website. Company registration, postal address and a formal data-controller identity will be published on this page before paid plans or accounts are offered. Until then, contact{' '}
            <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
          </p>

          <h2>This website</h2>
          <p>The public website is static HTML, CSS and JavaScript. It is designed to be hosted on any static platform (for example Vercel).</p>
          <ul>
            <li>We do not operate an application backend for this site.</li>
            <li>Login, registration, forgot-password and feedback forms are preview UI. Submitting them does not create an account, store a message or send credentials to a server.</li>
            <li>Theme preference (<code>pp-theme</code>) is stored in your browser’s localStorage so Light / Midnight can persist. It never leaves your device unless your own tools sync that storage.</li>
            <li>Your host or CDN may collect standard server logs (IP address, user agent, requested path, time). We do not control a third-party host’s logs; see that host’s policy if you deploy a copy of this site.</li>
            <li>We do not embed advertising, analytics or social pixels in the source of this website.</li>
          </ul>

          <h2>The planned Windows application</h2>
          <p>When the desktop application ships, the following rules are specified. They are not in force on this website.</p>
          <ul>
            <li>
              <strong>Local projects.</strong> Requirements, architecture, tasks, artifacts and memory live in the project folder you choose, including the <code>.pp</code> file and <code>project-planner/</code> directory.
            </li>
            <li>
              <strong>Credentials.</strong> Provider API keys are stored in the operating system’s secure storage. They are never included in prompts, logs, activity feeds, artifacts or exports.
            </li>
            <li>
              <strong>AI providers.</strong> If you configure a provider, that provider receives only the structured context an agent is allowed to send. You pay that provider directly. Classification on data-flow edges is what the Security Agent is specified to check first.
            </li>
            <li>
              <strong>Accounts (planned).</strong> Paid plans may require an account for licence validation. That service is specified to store the minimum needed (email, plan, licence state) and not project content.
            </li>
            <li>
              <strong>Telemetry (not enabled).</strong> No usage telemetry is specified as on-by-default. If optional diagnostics are added later, they will be opt-in and documented here.
            </li>
          </ul>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have rights to access, correct, delete, restrict or export personal data, and to object to certain processing. Because this website does not keep an account database, there is usually nothing to export from it. For requests about a future account, or if you believe a host’s logs contain your data, email {site.privacyEmail}.
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
