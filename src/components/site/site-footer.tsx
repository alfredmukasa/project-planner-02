import Link from 'next/link';

import { footerColumns, site } from '@/content/site';

import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-bg-subtle">
      <div className="container-x py-12 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-text-muted">{site.tagline} A structured workspace for turning ideas into development-ready projects.</p>
          <p className="mt-3 text-xs text-text-faint">
            Windows desktop application — <span className="text-text-muted">{site.desktop.version.toLowerCase()}</span>. Site content describes a product in preview.
          </p>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-text-faint">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-text-muted hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col gap-2 py-4 text-xs text-text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {site.copyrightYear} {site.name}. All rights reserved.</span>
          <span>
            Company registration and business details: <span className="text-text-muted">to be published</span>.
          </span>
        </div>
      </div>
    </footer>
  );
}
