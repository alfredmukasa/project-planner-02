import { primaryNav, site } from '@/content/site';

import { AuthHeaderActions } from './auth-header-actions';
import { Logo } from './logo';
import { NavLinks } from './nav-links';
import { SidebarMenuButton } from './site-sidebar';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[90] border-b border-border bg-bg">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
        <SidebarMenuButton />
        <Logo />
        <span className="hidden sm:inline-flex items-center rounded-sm border border-border px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wide text-text-faint">
          {site.stage}
        </span>
        <nav aria-label="Primary" className="ml-2 hidden md:flex items-center gap-0.5 min-w-0">
          <NavLinks items={primaryNav} />
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <AuthHeaderActions />
        </div>
      </div>
    </header>
  );
}
