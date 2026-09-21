import { Clock, Download, MonitorSmartphone, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

import { EnvironmentPreview } from '@/components/preview/screens';
import { Badge, Button, ButtonLink, Callout, PageHero, Section, SectionHeading } from '@/components/ui/primitives';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Download',
  description: 'Project Planner for Windows is coming soon. System requirements, release status and how to be notified when the preview is available.',
};

const milestones = [
  { label: 'Website and product preview', status: 'Now', tone: 'success' as const },
  { label: 'Windows preview build (invite)', status: 'Coming soon', tone: 'active' as const },
  { label: 'Public preview download', status: 'Planned', tone: 'neutral' as const },
  { label: 'Web edition', status: 'Later', tone: 'neutral' as const },
];

export default function DownloadPage() {
  return (
    <>
      <PageHero eyebrow="Download" title="Project Planner for Windows — coming soon" description="The desktop application is in preview and there is no installer to download yet. This page will host the signed Windows installer, checksums and release notes when the preview build is ready.">
        <Badge tone="active">Windows 11 · x64</Badge>
        <Badge>{site.desktop.version}</Badge>
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-lg border border-border bg-surface p-6" data-testid="download-card">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-text-muted">
                <Download size={20} aria-hidden />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Project Planner for {site.desktop.platform}</h2>
                <p className="mt-1 text-sm text-text-muted">Preview build · not yet published</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              {[
                ['Version', 'Coming soon'],
                ['Installer', 'Not yet published'],
                ['Size', '—'],
                ['SHA-256', '—'],
                ['Release notes', '—'],
                ['Signed', 'Yes, at release'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-text-faint">{k}</dt>
                  <dd className="mt-0.5 text-text">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button disabled ariaDescribedBy="download-note" size="lg">
                <Download size={15} aria-hidden /> Download for Windows — coming soon
              </Button>
              <ButtonLink href={`mailto:${site.supportEmail}?subject=${encodeURIComponent('Notify me about the Project Planner Windows preview')}`} external variant="secondary" size="lg">
                Get notified by email
              </ButtonLink>
            </div>
            <p id="download-note" className="mt-3 text-xs text-text-faint">
              The download button is intentionally disabled. We do not publish placeholder installers. When a build is released, this page will list its version, size, SHA-256 checksum and release notes.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-faint">Release timeline</h2>
            <ol className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
              {milestones.map((m) => (
                <li key={m.label} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <Clock size={14} className="text-text-faint" aria-hidden />
                  <span className="font-medium">{m.label}</span>
                  <Badge tone={m.tone} className="ml-auto">
                    {m.status}
                  </Badge>
                </li>
              ))}
            </ol>
            <Callout className="mt-4" tone="neutral" title="Windows first">
              Project Planner targets Windows 11 first because the planning workflow relies on local file-system access, PowerShell and WSL terminals, Git and environment detection. A web edition sharing the same domain model is planned afterwards.
            </Callout>
          </div>
        </div>
      </Section>

      <Section muted id="requirements">
        <SectionHeading eyebrow="System requirements" title="What the preview build will need" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
          <ul className="space-y-2.5">
            {site.desktop.requirements.map((r) => (
              <li key={r} className="flex gap-3 text-sm">
                <MonitorSmartphone size={15} className="mt-0.5 shrink-0 text-text-faint" aria-hidden />
                <span className="text-text-muted">{r}</span>
              </li>
            ))}
          </ul>
          <div>
            <EnvironmentPreview />
            <p className="mt-2 text-xs text-text-faint">The application detects installed tooling on first launch and reports what is missing or outdated.</p>
          </div>
        </div>
      </Section>

      <Section id="verify">
        <SectionHeading eyebrow="Installation and verification" title="How releases will be distributed" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            [ShieldCheck, 'Signed installer', 'Windows installers will be code-signed. The publisher name shown by Windows must match the name published on this page.'],
            [Download, 'Checksums', 'Each release lists its SHA-256 checksum here. Verify with `Get-FileHash .\\ProjectPlanner-Setup.exe -Algorithm SHA256` in PowerShell before installing.'],
            [Clock, 'Release notes', 'Every build ships with notes describing what changed, known issues and any migration steps for the project-planner/ directory.'],
          ].map(([Icon, title, body]) => {
            const I = Icon as typeof ShieldCheck;
            return (
              <div key={title as string} className="rounded-lg border border-border bg-surface p-5">
                <I size={18} className="text-accent" aria-hidden />
                <h3 className="mt-3 font-semibold">{title as string}</h3>
                <p className="mt-1.5 text-sm text-text-muted">{body as string}</p>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
