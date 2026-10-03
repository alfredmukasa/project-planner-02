'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { AuthGate } from '@/components/auth/auth-gate';
import { Button } from '@/components/ui/primitives';
import { completeOnboarding, skipOnboarding } from '@/lib/auth/onboarding';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

function OnboardingBody({ user }: { user: User }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createBrowserSupabaseClient();

    const load = async () => {
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;
      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
      setDisplayName(data?.display_name ?? '');
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const saveProfileAndComplete = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const name = displayName.trim();
    if (!name) {
      setError('Display name is required to finish onboarding.');
      setBusy(false);
      return;
    }
    if (name.length > 100) {
      setError('Display name must be 100 characters or fewer.');
      setBusy(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ display_name: name })
        .eq('user_id', user.id);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      const { error: onboardingError } = await completeOnboarding(supabase, user.id);
      if (onboardingError) {
        setError(onboardingError);
        return;
      }

      router.replace('/dashboard/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete onboarding.');
    } finally {
      setBusy(false);
    }
  };

  const onSkip = async () => {
    setBusy(true);
    setError(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: skipError } = await skipOnboarding(supabase, user.id);
      if (skipError) {
        setError(skipError);
        return;
      }
      router.replace('/dashboard/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not skip onboarding.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-x py-10 md:py-12">
      <div className="mx-auto w-full max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Onboarding</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight" data-testid="onboarding-heading">
          Set up your account
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Confirm how your name appears. You can skip and change this later under Account.
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-text-muted">Loading profile…</p>
        ) : (
          <form
            onSubmit={(e) => void saveProfileAndComplete(e)}
            className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-5"
            data-testid="onboarding-form"
          >
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-text">
                Display name
              </label>
              <input
                id="display_name"
                name="display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                maxLength={100}
                className="mt-1 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm text-text placeholder:text-text-faint hover:border-border-strong focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
              <p className="mt-1 text-2xs text-text-faint">Shown on your dashboard and account page.</p>
            </div>

            <p className="text-sm text-text-muted">
              Signed in as <span className="font-medium text-text">{user.email}</span>
            </p>

            {error ? (
              <p className="text-sm text-danger" role="alert" data-testid="onboarding-error">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" className="sm:flex-1" size="lg" disabled={busy}>
                {busy ? 'Saving…' : 'Complete setup'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="sm:flex-1"
                size="lg"
                disabled={busy}
                onClick={() => void onSkip()}
              >
                Skip for now
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AuthGate redirectCompletedOnboarding>
      {({ user }) => <OnboardingBody user={user} />}
    </AuthGate>
  );
}
