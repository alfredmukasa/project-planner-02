import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/ui/primitives';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'Terms for using the Project Planner public website. The Windows application is not released; these terms do not licence desktop software.',
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms of use"
        description="Last updated 2 October 2026. These terms apply to the public website and website accounts. They do not grant a licence to install or use the Windows application, which is not yet released."
      />
      <div className="container-x py-12 md:py-16">
        <article className="prose-pp max-w-3xl">
          <h2>1. The website</h2>
          <p>
            {site.name} provides this website so you can learn about the planned product, view interface previews, read documentation, and create a website account. The site is offered as-is during the preview stage. Company legal name, registration number and registered office will be added here before paid plans open.
          </p>

          <h2>2. Preview content</h2>
          <p>
            Screenshots, mock interfaces, demo project data (including “Atlas Field Service”), agent lists, pricing tables and documentation describe intended product behaviour. They are labelled as preview or demo content. They are not a warranty that any particular desktop feature will ship, or will ship in that form.
          </p>

          <h2>3. Accounts, installer and payment</h2>
          <p>
            Website accounts use Supabase Auth (email/password and optional Google or GitHub). You must provide accurate information and keep credentials secure. There is no Windows installer on this site yet; Download remains Coming soon. Pricing is indicative; subscription checkout buttons are disabled. Do not send payment based on this website.
          </p>

          <h2>4. Acceptable use</h2>
          <p>You may browse, link to and quote short passages with attribution. You may not:</p>
          <ul>
            <li>Present interface previews as a live desktop Project Planner application.</li>
            <li>Scrape the site in a way that degrades service for others.</li>
            <li>Abuse authentication, attempt account takeover, or probe for other users’ data.</li>
            <li>Use the Project Planner name or mark in a way that suggests partnership or endorsement without permission.</li>
          </ul>

          <h2>5. Intellectual property</h2>
          <p>
            The Project Planner name, mark, copy, layout and demo content are provided for evaluating the product. You do not acquire ownership by using the site. Third-party names (Windows, OpenAI, Anthropic and others) belong to their owners.
          </p>

          <h2>6. Disclaimer</h2>
          <p>
            The website is provided without warranties of any kind, to the extent permitted by law. Interface previews may contain inaccuracies. Documentation may change. We are not liable for decisions you make based on preview material, or for any loss arising from using or being unable to use the site, except where liability cannot be excluded.
          </p>

          <h2>7. Future software licence</h2>
          <p>
            When a Windows build is published, it will ship with its own licence. Those terms will govern installation, local data, AI providers and paid plans. They are not these terms.
          </p>

          <h2>8. Contact</h2>
          <p>
            Questions: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>. Privacy:{' '}
            <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>. See also the{' '}
            <Link href="/privacy/">privacy notice</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
