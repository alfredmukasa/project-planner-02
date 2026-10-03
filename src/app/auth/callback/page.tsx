'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { friendlyAuthError } from '@/lib/supabase/auth-errors';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

/**
 * Client-side PKCE callback for the static export site.
 * Supabase redirects here with ?code=… after Google/GitHub OAuth.
 *
 * The shared browser client keeps detectSessionInUrl off so this page is the
 * only place that calls exchangeCodeForSession (once), after cookies/storage
 * are available in the browser.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const finish = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const oauthError = params.get('error_description') ?? params.get('error');

        if (oauthError) {
          if (!cancelled) setError(oauthError);
          return;
        }

        const supabase = createBrowserSupabaseClient();

        const nextRaw = params.get('next') ?? '';
        const type = params.get('type') ?? '';
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const hashType = hashParams.get('type') ?? '';
        const isRecovery =
          type === 'recovery' ||
          hashType === 'recovery' ||
          nextRaw === '/reset-password/' ||
          nextRaw === '/reset-password';
        const destination = isRecovery ? '/reset-password/' : '/account/';

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            // If a previous attempt already created a session, continue.
            const { data: existing } = await supabase.auth.getSession();
            if (existing.session) {
              router.replace(destination);
              return;
            }
            if (!cancelled) {
              setError(
                friendlyAuthError(
                  exchangeError,
                  'Sign-in could not be completed. Start again from this same browser (same origin and port), then return here.',
                ),
              );
            }
            return;
          }
          router.replace(destination);
          return;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          if (!cancelled) setError(friendlyAuthError(sessionError));
          return;
        }
        if (data.session) {
          router.replace(destination);
          return;
        }
        if (!cancelled) setError('No authentication code was returned. Try signing in again.');
      } catch (err) {
        if (!cancelled) setError(friendlyAuthError(err));
      }
    };

    void finish();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="container-x py-16 md:py-24">
      <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {error ? 'Sign-in incomplete' : 'Completing sign-in…'}
        </h1>
        {error ? (
          <div role="alert" className="mt-6 rounded-md border border-danger/40 bg-danger/5 p-4 text-sm" data-testid="auth-callback-error">
            <p className="text-text-muted">{error}</p>
            <Link href="/login/" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-text-muted" data-testid="auth-callback-loading">
            Finishing your Google or GitHub sign-in. You will be redirected shortly.
          </p>
        )}
      </div>
    </div>
  );
}
