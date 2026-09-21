import { Check } from 'lucide-react';
import type { Metadata } from 'next';

import { Badge, Button, Callout, PageHero, Section, SectionHeading } from '@/components/ui/primitives';
import { comparison, plans } from '@/content/pricing';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Project Planner plans: Free, Builder $5, Pro $15 and Studio $20 per month. Billing is not yet available during the preview.',
};

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Simple plans for every kind of builder" description="Prices are in USD per month. All plans use your own AI provider credentials; Project Planner never resells model usage. Billing opens with the public release.">
        <Badge tone="warning">Billing not yet available</Badge>
      </PageHero>

      <Section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => (
            <article key={p.key} className={`flex flex-col rounded-lg border bg-surface p-5 ${p.highlighted ? 'border-accent' : 'border-border'}`} data-testid={`plan-${p.key}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                {p.highlighted && <Badge tone="active">Most complete</Badge>}
              </div>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">${p.price}</span>
                <span className="text-sm text-text-muted">/ {p.period}</span>
              </p>
              <p className="mt-2 text-sm text-text-muted">{p.summary}</p>
              <p className="mt-1 text-xs text-text-faint">{p.audience}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-border py-3 text-xs">
                {p.limits.map((l) => (
                  <div key={l.label}>
                    <dt className="uppercase tracking-wide text-text-faint">{l.label}</dt>
                    <dd className="text-text">{l.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    <span className="text-text-muted">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Button variant={p.highlighted ? 'primary' : 'secondary'} className="w-full" disabled ariaDescribedBy="billing-note">
                  {p.price === 0 ? 'Included at launch' : 'Available at launch'}
                </Button>
              </div>
            </article>
          ))}
        </div>
        <p id="billing-note" className="mt-4 text-xs text-text-faint">
          Plan buttons are disabled: accounts and payments are not available during the preview. Prices and limits may change before public release.
        </p>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Compare" title="What each plan includes" />
        <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-text-faint">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Feature</th>
                {plans.map((p) => (
                  <th key={p.key} className="px-4 py-2.5 font-semibold">
                    {p.name} <span className="font-normal text-text-faint">${p.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{row.feature}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className={`px-4 py-2 ${v === '—' ? 'text-text-faint' : 'text-text-muted'}`}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="faq">
        <SectionHeading eyebrow="Pricing FAQ" title="Common questions" />
        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            ['Do plans include AI usage?', 'No. Project Planner is provider-agnostic: you connect your own OpenAI, Anthropic, Google, DeepSeek or compatible account and pay that provider directly. The app tracks tokens and estimated cost so you can see what agents spend.'],
            ['Is my project data stored on your servers?', 'Projects are stored locally on your Windows machine. Optional account features planned for later (such as licence management) are designed to store the minimum necessary — see the Privacy page.'],
            ['Can I use Project Planner without an account?', 'Yes for the Free plan at launch. Paid plans will require an account for licence validation.'],
            ['Will prices change?', 'Preview pricing is indicative. Any change before launch will be published here first.'],
            ['Is there a trial for Pro or Studio?', 'A trial period is planned for the public release; details will be announced on the Download page.'],
            ['What about teams?', 'Studio covers studios and agencies planning client work. Larger team and organisation features are on the roadmap.'],
          ].map(([q, a]) => (
            <div key={q} className="rounded-lg border border-border bg-surface p-5">
              <dt className="font-semibold">{q}</dt>
              <dd className="mt-2 text-sm text-text-muted">{a}</dd>
            </div>
          ))}
        </dl>
        <Callout className="mt-10" tone="info" title="Preview status">
          Pricing describes the planned commercial model for the Windows application. No subscription can be purchased yet.
        </Callout>
      </Section>
    </>
  );
}
