'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { Field } from '@/components/auth/auth-form';
import { Button } from '@/components/ui/primitives';
import { friendlyAuthError } from '@/lib/supabase/auth-errors';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type Gate = 'loading' | 'ready' | 'missing' | 'done';

/**
 * Completes Supabase password recovery: exchanges ?code= if present,
 * then updates the password for the recovery session.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [gate, setGate] = useState<Gate>('loading');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const prepare = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const oauthError = params.get('error_description') ?? params.get('error');

        if (oauthError) {
          if (!cancelled) {
            setError(oauthError);
            setGate('missing');
          }
          return;
        }

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            const { data: existing } = await supabase.auth.getSession();
            if (!existing.session) {
              if (!cancelled) {
                setError(
                  friendlyAuthError(
                    exchangeError,
                    'This reset link is invalid or has expired. Request a new one.',
                  ),
                );
                setGate('missing');
              }
              return;
            }
          }
          // Drop the code from the URL after a successful exchange.
          window.history.replaceState({}, '', '/reset-password/');
        }

        const { data, error: userError } = await supabase.auth.getUser();
        if (userError || !data.user) {
          if (!cancelled) {
            setError('Open the link from your email on this device to set a new password.');
            setGate('missing');
          }
          return;
        }

        if (!cancelled) setGate('ready');
      } catch (err) {
        if (!cancelled) {
          setError(friendlyAuthError(err, 'This reset link could not be opened.'));
          setGate('missing');
        }
      }
    };

    void prepare();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');

    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      setBusy(false);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      setBusy(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(friendlyAuthError(updateError, 'Could not update password.'));
        return;
      }
      await supabase.auth.signOut();
      setGate('done');
      router.replace('/login/?reset=1');
    } catch (err) {
      setError(friendlyAuthError(err, 'Could not update password.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Account</p>
        <h1 className="mt-1.5 text-xl font-semibold tracking-tight">Set a new password</h1>
        <p className="mt-1.5 text-sm text-text-muted">
          Choose a password with at least 12 characters. You will sign in again after updating.
        </p>

        {gate === 'loading' ? (
          <p className="mt-5 text-sm text-text-muted" data-testid="reset-loading">
            Checking reset link…
          </p>
        ) : null}

        {gate === 'missing' ? (
          <div
            role="alert"
            className="mt-5 rounded-md border border-danger/40 bg-danger/5 p-3 text-sm"
            data-testid="reset-missing"
          >
            <p className="font-semibold text-text">Reset link unavailable</p>
            <p className="mt-1 text-text-muted">{error}</p>
            <Link
              href="/forgot-password/"
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        ) : null}

        {gate === 'ready' ? (
          <>
            {error ? (
              <div
                role="alert"
                className="mt-5 rounded-md border border-danger/40 bg-danger/5 p-3 text-sm"
                data-testid="reset-error"
              >
                <p>{error}</p>
              </div>
            ) : null}
            <form onSubmit={onSubmit} className="mt-5 space-y-3" data-testid="reset-password-form">
              <Field
                id="password"
                label="New password"
                type="password"
                autoComplete="new-password"
                minLength={12}
                placeholder="At least 12 characters"
              />
              <Field
                id="confirm"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                minLength={12}
                placeholder="Repeat password"
              />
              <Button type="submit" className="w-full" size="lg" disabled={busy}>
                {busy ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          </>
        ) : null}

        {gate === 'done' ? (
          <p className="mt-5 text-sm text-text-muted" data-testid="reset-done">
            Password updated. Redirecting to sign in…
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-center text-sm text-text-muted">
        <Link href="/login/" className="text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
