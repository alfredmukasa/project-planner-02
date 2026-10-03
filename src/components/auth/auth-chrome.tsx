import Link from 'next/link';
import type { ReactNode } from 'react';

import { Logo } from '@/components/site/logo';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { site } from '@/content/site';

/** Minimal chrome for login/register/recovery — no marketing sidebar. */
export function AuthChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text" data-testid="auth-chrome">
      <header className="border-b border-border">
        <div className="flex h-12 items-center justify-between px-3 sm:px-5">
          <Logo />
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-3 text-center text-2xs text-text-faint">
        <p>
          © {site.copyrightYear} {site.name}
          {' · '}
          <Link href="/privacy/" className="hover:text-text-muted">
            Privacy
          </Link>
          {' · '}
          <Link href="/terms/" className="hover:text-text-muted">
            Terms
          </Link>
        </p>
      </footer>
    </div>
  );
}
