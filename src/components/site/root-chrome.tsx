'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppShell } from '@/components/app/app-shell';
import { AuthChrome } from '@/components/auth/auth-chrome';
import { FeedbackButton } from '@/components/site/feedback-button';
import { SidebarProvider } from '@/components/site/sidebar-context';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { SiteSidebar } from '@/components/site/site-sidebar';
import { getChromeMode } from '@/lib/auth/paths';

/**
 * Selects marketing / auth / app chrome from the pathname.
 * Required because static export has a single root layout and no middleware.
 */
export function RootChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const mode = getChromeMode(pathname);

  if (mode === 'auth') {
    return <AuthChrome>{children}</AuthChrome>;
  }

  if (mode === 'app') {
    return <AppShell>{children}</AppShell>;
  }

  return (
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
  );
}
