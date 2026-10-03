'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';

import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { Button } from '@/components/ui/primitives';
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
        className="mt-1.5 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm text-text placeholder:text-text-faint hover:border-border-strong focus:border-accent"
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
    <div role="status" className={`mt-6 rounded-md border p-4 text-sm ${toneClass}`} data-testid={testId}>
      <p className="font-semibold text-text">{title}</p>
      <div className="mt-1.5 text-text-muted">{children}</div>
    </div>
  );
}

/**
 * Authentication form wired to Supabase Auth (email/password + OAuth).
 */
export function AuthForm({
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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
        router.push('/account/');
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
            emailRedirectTo: getAuthRedirectUrl('/account/'),
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
        router.push('/account/');
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthRedirectUrl('/login/'),
      });
      if (resetError) {
        setError(friendlyAuthError(resetError));
        return;
      }
      setInfo('If an account exists for that email, a reset link has been sent.');
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">{description}</p>

        {mode !== 'forgot' && (
          <div className="mt-6 space-y-4">
            <OAuthButtons
              disabled={busy}
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
            <Link href="/" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              Return to the overview
            </Link>
          </StatusBox>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4" data-testid="auth-form">
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
      <p className="mt-4 text-center text-sm text-text-muted">{footer}</p>
    </div>
  );
}
