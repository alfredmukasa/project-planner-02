import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { FeedbackButton } from '@/components/site/feedback-button';
import { SidebarProvider } from '@/components/site/sidebar-context';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { SiteSidebar } from '@/components/site/site-sidebar';
import { site } from '@/content/site';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: 'website',
    siteName: site.name,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d12' },
  ],
};

/**
 * Applies the persisted theme before first paint to avoid a flash. Runs inline
 * because it must execute before React hydrates.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('pp-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);var s=localStorage.getItem('pp-sidebar');if(s!=='expanded'&&s!=='collapsed')s='expanded';document.documentElement.setAttribute('data-sidebar',s);}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.setAttribute('data-sidebar','expanded');}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-surface focus:text-text focus:px-3 focus:py-2 focus:border focus:border-border-strong focus:rounded-md"
        >
          Skip to content
        </a>
        <SidebarProvider>
          <SiteHeader />
          <div className="flex flex-1 min-h-0">
            <SiteSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </div>
          </div>
          <FeedbackButton />
        </SidebarProvider>
      </body>
    </html>
  );
}
