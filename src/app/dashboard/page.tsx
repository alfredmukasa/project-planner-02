'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AuthGate } from '@/components/auth/auth-gate';
import { ButtonLink, Callout } from '@/components/ui/primitives';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type ProfileSummary = {
  display_name: string;
};

function DashboardBody({ user }: { user: User }) {
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
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
      setProfile(data);
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const name = profile?.display_name ?? user.email ?? 'there';

  return (
    <div className="container-x py-10 md:py-12">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Dashboard</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight" data-testid="dashboard-heading">
          {loading ? 'Welcome' : `Welcome, ${name}`}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Signed in as <span className="font-medium text-text">{user.email}</span>
        </p>

        {error ? (
          <p className="mt-4 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <section className="mt-8" data-testid="dashboard-projects-empty">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold text-text">Projects</h2>
          </div>
          <div className="mt-3 rounded-lg border border-border bg-surface p-5">
            <p className="text-sm font-medium text-text">No projects yet</p>
            <p className="mt-1.5 text-sm text-text-muted">
              Project workspaces are not available in this phase. This empty state is intentional — there are
              no demo or placeholder projects.
            </p>
            <Callout tone="neutral" className="mt-4" title="What you can do now">
              <p>
                Manage your profile on{' '}
                <Link href="/account/" className="font-medium text-accent hover:underline">
                  Account
                </Link>
                . Planning projects, agents, and billing arrive in later phases.
              </p>
            </Callout>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/account/" variant="secondary">
            Account settings
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGate requireOnboardingComplete>
      {({ user }) => <DashboardBody user={user} />}
    </AuthGate>
  );
}
