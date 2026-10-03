'use client';

import { LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { Logo } from '@/components/site/logo';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const appNav = [
  { href: '/dashboard/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/', label: 'Account', icon: UserRound },
] as const;

function isActive(pathname: string, href: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return path === href;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createBrowserSupabaseClient();

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('user_id', data.user.id)
        .maybeSingle();
      if (!cancelled) {
        setLabel(profile?.display_name ?? data.user.email ?? null);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const signOut = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/login/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text" data-testid="app-shell">
      <header className="sticky top-0 z-[90] border-b border-border bg-bg">
        <div className="flex h-12 items-center gap-3 px-3 sm:px-5">
          <Logo />
          <nav aria-label="Workspace" className="ml-2 flex items-center gap-0.5">
            {appNav.map(({ href, label: itemLabel, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors ${
                    active ? 'bg-surface-2 text-text' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                  }`}
                >
                  <Icon size={14} aria-hidden />
                  {itemLabel}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {label ? (
              <span className="hidden max-w-[12rem] truncate text-xs text-text-muted sm:inline" data-testid="app-shell-user">
                {label}
              </span>
            ) : null}
            <ThemeToggle />
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-sm font-medium text-text hover:border-border-strong"
              data-testid="app-shell-sign-out"
            >
              <LogOut size={14} aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-3 text-center text-2xs text-text-faint">
        <p>Project Planner workspace · preview</p>
      </footer>
    </div>
  );
}
