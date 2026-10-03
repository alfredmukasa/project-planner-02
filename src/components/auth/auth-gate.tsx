'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { isOnboardingComplete } from '@/lib/auth/post-auth';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type GateState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'ready'; user: User }
  | { status: 'error'; message: string };

function hardRedirect(path: string) {
  // Prefer a full navigation on the static export so query strings are reliable.
  window.location.replace(path);
}

/**
 * Client route gate for the static export.
 * Middleware/proxy is unsupported with `output: 'export'`; this gate runs after hydrate.
 */
export function AuthGate({
  children,
  requireOnboardingComplete = false,
  redirectCompletedOnboarding = false,
}: {
  children: (ctx: { user: User }) => ReactNode;
  /** When true, incomplete onboarding redirects to /onboarding/. */
  requireOnboardingComplete?: boolean;
  /** When true (onboarding page), completed users go to /dashboard/. */
  redirectCompletedOnboarding?: boolean;
}) {
  const pathname = usePathname() ?? '/';
  const [state, setState] = useState<GateState>({ status: 'loading' });
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.auth.getUser();
        if (cancelled) return;

        const user = data.user;
        // Anonymous browsers often get AuthApiError "Auth session missing!" — treat as signed out.
        const missingSession =
          !user ||
          (error && /session missing|not authenticated|invalid claim|jwt/i.test(error.message));

        if (missingSession) {
          setState({ status: 'anonymous' });
          const next = pathname.endsWith('/') ? pathname : `${pathname}/`;
          hardRedirect(`/login/?next=${encodeURIComponent(next)}`);
          return;
        }

        if (error) {
          setState({ status: 'error', message: error.message });
          return;
        }

        const { data: onboarding, error: onboardingError } = await supabase
          .from('user_onboarding')
          .select('completion_status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (cancelled) return;

        if (onboardingError) {
          setState({ status: 'error', message: onboardingError.message });
          return;
        }

        const complete = isOnboardingComplete(onboarding);

        if (requireOnboardingComplete && !complete) {
          hardRedirect('/onboarding/');
          return;
        }

        if (redirectCompletedOnboarding && complete) {
          hardRedirect('/dashboard/');
          return;
        }

        readyRef.current = true;
        setState({ status: 'ready', user });
      } catch (err) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Unable to verify session.',
          });
        }
      }
    };

    void run();

    let supabase: ReturnType<typeof createBrowserSupabaseClient>;
    try {
      supabase = createBrowserSupabaseClient();
    } catch {
      return () => {
        cancelled = true;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only bounce after a signed-in page was shown (avoid racing the initial gate).
      if (!readyRef.current) return;
      if (!session?.user) {
        readyRef.current = false;
        setState({ status: 'anonymous' });
        const next = pathname.endsWith('/') ? pathname : `${pathname}/`;
        hardRedirect(`/login/?next=${encodeURIComponent(next)}`);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [pathname, redirectCompletedOnboarding, requireOnboardingComplete]);

  if (state.status === 'loading' || state.status === 'anonymous') {
    return (
      <div className="container-x py-16" data-testid="auth-gate-loading">
        <h1 className="text-xl font-semibold tracking-tight">Workspace</h1>
        <p className="mt-2 text-sm text-text-muted">Checking your session…</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="container-x py-16" data-testid="auth-gate-error" role="alert">
        <h1 className="text-xl font-semibold tracking-tight">Workspace</h1>
        <p className="mt-2 text-sm text-text-muted">{state.message}</p>
        <Link href="/login/" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  return <>{children({ user: state.user })}</>;
}
