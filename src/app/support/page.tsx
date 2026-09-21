import type { Metadata } from 'next';
import Link from 'next/link';

import { FeedbackForm } from '@/components/site/feedback-form';
import { ButtonLink, Callout, PageHero, Section, SectionHeading } from '@/components/ui/primitives';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Help, FAQ, contact and feedback for Project Planner. The Windows application is in preview and not yet available to download.',
};

const faqs = [
  ['Is Project Planner available to download?', 'Not yet. The Download page lists the Windows application as coming soon. There is no installer, checksum or release note until a preview build is published.'],
  ['Does this website run the application?', 'No. This is a static marketing and documentation site. Interface previews are rendered from demo project content and labelled as such.'],
  ['Do I need an account?', 'Accounts are not available during this website preview. Login and Create Account screens exist so you can see the planned flow; submitting them does not create an account.'],
  ['Will my project leave my machine?', 'The desktop application is designed to store projects locally. Optional account features later (licence checks) are specified to collect the minimum necessary. See Privacy.'],
  ['Which AI providers will be supported?', 'OpenAI, Anthropic, Google Gemini, DeepSeek and compatible endpoints, using your own keys. Project Planner does not resell model usage.'],
  ['What does it cost?', 'Free, Builder $5, Pro $15 and Studio $20 per month. Billing is not open. See Pricing.'],
  ['Is there a macOS or Linux build?', 'The first release targets Windows 11. A web edition sharing the same domain model is planned afterwards.'],
  ['How do I report a problem with this website?', 'Use the feedback form on this page, the floating Feedback control, or email support.'],
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Help for the Project Planner preview"
        description="The Windows application is not yet released, so support today is about this website, the product specification and the planned preview programme."
      >
        <ButtonLink href={`mailto:${site.supportEmail}`} external variant="secondary">
          {site.supportEmail}
        </ButtonLink>
      </PageHero>

      <Section id="faq">
        <SectionHeading eyebrow="FAQ" title="Common questions" />
        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map(([q, a]) => (
            <div key={q} className="rounded-lg border border-border bg-surface p-5">
              <dt className="font-semibold">{q}</dt>
              <dd className="mt-2 text-sm text-text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section muted id="contact">
        <SectionHeading eyebrow="Contact" title="How to reach us" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Support', site.supportEmail, 'Product questions and preview access'],
            ['Feedback', site.feedbackEmail, 'Ideas, website issues, documentation'],
            ['Privacy', site.privacyEmail, 'Data requests and privacy questions'],
            ['Security', site.securityEmail, 'Vulnerability reports'],
          ].map(([label, email, note]) => (
            <div key={label} className="rounded-lg border border-border bg-surface p-4">
              <h3 className="text-sm font-semibold">{label}</h3>
              <a href={`mailto:${email}`} className="mt-1 block text-sm text-accent hover:underline">
                {email}
              </a>
              <p className="mt-1 text-xs text-text-faint">{note}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-text-muted">
          Company registration, postal address and business details will be published here before paid plans open. Until then, email is the only contact channel.
        </p>
      </Section>

      <Section id="feedback">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Feedback" title="Tell us what to improve" description="The floating Feedback control is always available. This form is the same idea, with a topic. During preview it does not post to a server." />
            <Callout className="mt-6" tone="neutral">
              Prefer email? Write to{' '}
              <a className="text-accent underline" href={`mailto:${site.feedbackEmail}`}>
                {site.feedbackEmail}
              </a>
              . Related pages:{' '}
              <Link href="/documentation/" className="text-accent underline">
                documentation
              </Link>
              ,{' '}
              <Link href="/download/" className="text-accent underline">
                download status
              </Link>
              .
            </Callout>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5 md:p-6">
            <FeedbackForm />
          </div>
        </div>
      </Section>
    </>
  );
}
