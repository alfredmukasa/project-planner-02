'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent, type ReactNode } from 'react';

import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { Button } from '@/components/ui/primitives';
import { isSafeNextPath } from '@/lib/auth/paths';
import { resolvePostAuthPath } from '@/lib/auth/post-auth';
import { friendlyAuthError } from '@/lib/supabase/auth-errors';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { getAuthRedirectUrl } from '@/lib/supabase/env';
import { site } from '@/content/site';

export function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  required = true,
  placeholder,
  minLength,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        className="mt-1 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm text-text placeholder:text-text-faint hover:border-border-strong focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      />
    </div>
  );
}

type AuthMode = 'login' | 'register' | 'forgot';

function StatusBox({
  tone,
  title,
  children,
  testId,
}: {
  tone: 'ok' | 'error' | 'info';
  title: string;
  children: ReactNode;
  testId?: string;
}) {
  const toneClass =
    tone === 'error'
      ? 'border-danger/40 bg-danger/5'
      : tone === 'ok'
        ? 'border-success/40 bg-success/5'
        : 'border-border bg-surface-2';

  return (
    <div role="status" className={`mt-4 rounded-md border p-3 text-sm ${toneClass}`} data-testid={testId}>
      <p className="font-semibold text-text">{title}</p>
      <div className="mt-1 text-text-muted">{children}</div>
    </div>
  );
}

function AuthFormInner({
  mode,
  title,
  description,
  submitLabel,
  children,
  footer,
}: {
  mode: AuthMode;
  title: string;
  description: string;
  submitLabel: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const resetNotice = mode === 'login' && searchParams.get('reset') === '1';
  const nextParam = searchParams.get('next');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();
    const password = String(form.get('password') ?? '');
    const name = String(form.get('name') ?? '').trim();

    try {
      const supabase = createBrowserSupabaseClient();

      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(friendlyAuthError(signInError));
          return;
        }
        if (isSafeNextPath(nextParam)) {
          router.push(nextParam);
          return;
        }
        router.push(await resolvePostAuthPath(supabase));
        return;
      }

      if (mode === 'register') {
        if (password.length < 12) {
          setError('Password must be at least 12 characters.');
          return;
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name || undefined,
              full_name: name || undefined,
            },
            emailRedirectTo: getAuthRedirectUrl(
              '/auth/callback/',
              isSafeNextPath(nextParam) ? nextParam : undefined,
            ),
          },
        });
        if (signUpError) {
          setError(friendlyAuthError(signUpError));
          return;
        }
        if (!data.session) {
          setInfo(
            'Check your email to confirm your account, then sign in. If you do not get an email, try Google / GitHub, or ask an admin to disable “Confirm email” for local testing.',
          );
          return;
        }
        router.push(isSafeNextPath(nextParam) ? nextParam : await resolvePostAuthPath(supabase));
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthRedirectUrl('/reset-password/'),
      });
      if (resetError) {
        setError(friendlyAuthError(resetError));
        return;
      }
      setInfo('If an account exists for that email, a reset link has been sent. Open it on this device to choose a new password.');
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Account</p>
        <h1 className="mt-1.5 text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-text-muted">{description}</p>

        {resetNotice ? (
          <StatusBox tone="ok" title="Password updated" testId="auth-reset-ok">
            <p>Sign in with your new password.</p>
          </StatusBox>
        ) : null}

        {mode !== 'forgot' && (
          <div className="mt-4 space-y-3">
            <OAuthButtons
              disabled={busy}
              nextPath={isSafeNextPath(nextParam) ? nextParam : undefined}
              onError={(message) => {
                setError(message ? message : null);
              }}
            />
            <div className="flex items-center gap-3 text-2xs uppercase tracking-wide text-text-faint">
              <span className="h-px flex-1 bg-border" aria-hidden />
              <span>or email</span>
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>
          </div>
        )}

        {error ? (
          <StatusBox
            tone="error"
            title={/rate limit|too many/i.test(error) ? 'Please wait a moment' : 'Could not continue'}
            testId="auth-error"
          >
            <p>{error}</p>
          </StatusBox>
        ) : null}

        {info ? (
          <StatusBox tone="info" title="Check your email" testId="auth-info">
            <p>{info}</p>
            <Link href="/login/" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
              Back to sign in
            </Link>
          </StatusBox>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-3" data-testid="auth-form">
            {children}
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? 'Please wait…' : submitLabel}
            </Button>
            <p className="text-2xs text-text-faint">
              Authentication is provided by Supabase. Questions?{' '}
              <a href={`mailto:${site.supportEmail}`} className="text-accent underline">
                {site.supportEmail}
              </a>
            </p>
          </form>
        )}
      </div>
      <p className="mt-3 text-center text-sm text-text-muted">{footer}</p>
    </div>
  );
}

/**
 * Authentication form wired to Supabase Auth (email/password + OAuth).
 */
export function AuthForm(props: {
  mode: AuthMode;
  title: string;
  description: string;
  submitLabel: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <Suspense fallback={<div className="mx-auto h-64 w-full max-w-sm animate-pulse rounded-lg border border-border bg-surface" />}>
      <AuthFormInner {...props} />
    </Suspense>
  );
}
