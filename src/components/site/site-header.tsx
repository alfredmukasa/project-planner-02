import Link from 'next/link';

import { nav, site } from '@/content/site';

import { Logo } from './logo';
import { MobileNav } from './mobile-nav';
import { NavLinks } from './nav-links';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-[2px]">
      <div className="container-x flex h-14 items-center gap-4">
        <Logo />
        <span className="hidden sm:inline-flex items-center rounded-sm border border-border px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wide text-text-faint">
          {site.stage}
        </span>
        <nav aria-label="Primary" className="ml-4 hidden lg:flex items-center gap-0.5">
          <NavLinks items={nav} />
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login/"
            className="hidden md:inline-flex h-8 items-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-text hover:border-border-strong transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register/"
            className="hidden md:inline-flex h-8 items-center rounded-md bg-accent px-3 text-sm font-medium text-on-accent hover:bg-accent-strong transition-colors"
          >
            Create Account
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
