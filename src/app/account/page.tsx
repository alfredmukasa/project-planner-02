'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';

import { AuthGate } from '@/components/auth/auth-gate';
import { Button, StatusPill } from '@/components/ui/primitives';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { User } from '@supabase/supabase-js';

type ProfileRow = Pick<
  Database['public']['Tables']['user_profiles']['Row'],
  'display_name' | 'username' | 'locale' | 'timezone' | 'avatar_url'
>;

type IdentityRow = Pick<
  Database['public']['Tables']['user_auth_identities']['Row'],
  'id' | 'provider' | 'provider_email' | 'is_primary' | 'linked_at'
>;

type UserRow = Pick<Database['public']['Tables']['users']['Row'], 'primary_email' | 'status' | 'email_verified_at'>;

function AccountBody({ user }: { user: User }) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [identities, setIdentities] = useState<IdentityRow[]>([]);
  const [account, setAccount] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [locale, setLocale] = useState('');
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    let cancelled = false;
    const supabase = createBrowserSupabaseClient();

    const load = async () => {
      const [profileRes, identityRes, userRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('display_name, username, locale, timezone, avatar_url')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('user_auth_identities')
          .select('id, provider, provider_email, is_primary, linked_at')
          .eq('user_id', user.id)
          .order('linked_at', { ascending: true }),
        supabase
          .from('users')
          .select('primary_email, status, email_verified_at')
          .eq('id', user.id)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      if (profileRes.error || identityRes.error || userRes.error) {
        setError(profileRes.error?.message ?? identityRes.error?.message ?? userRes.error?.message ?? 'Load failed');
        setLoading(false);
        return;
      }

      setProfile(profileRes.data);
      setIdentities(identityRes.data ?? []);
      setAccount(userRes.data);
      setDisplayName(profileRes.data?.display_name ?? '');
      setUsername(profileRes.data?.username ?? '');
      setLocale(profileRes.data?.locale ?? '');
      setTimezone(profileRes.data?.timezone ?? '');
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);

    const name = displayName.trim();
    if (!name) {
      setError('Display name is required.');
      setBusy(false);
      return;
    }
    if (name.length > 100) {
      setError('Display name must be 100 characters or fewer.');
      setBusy(false);
      return;
    }

    const usernameValue = username.trim();
    if (usernameValue && usernameValue.length > 64) {
      setError('Username must be 64 characters or fewer.');
      setBusy(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          display_name: name,
          username: usernameValue || null,
          locale: locale.trim() || null,
          timezone: timezone.trim() || null,
        })
        .eq('user_id', user.id)
        .select('display_name, username, locale, timezone, avatar_url')
        .maybeSingle();

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setProfile(data);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="container-x py-10">
        <p className="text-sm text-text-muted">Loading account…</p>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-12">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Account</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight" data-testid="account-heading">
            Your account
          </h1>
          <p className="mt-2 text-sm text-text-muted">Identity from Supabase Auth and your editable profile.</p>
        </div>

        <section className="rounded-lg border border-border bg-surface p-5" data-testid="account-session">
          <h2 className="text-sm font-semibold text-text">Identity</h2>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-text-muted">Email</dt>
              <dd className="mt-0.5 font-medium text-text">{account?.primary_email ?? user.email}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Status</dt>
              <dd className="mt-0.5">
                <StatusPill
                  label={account?.status ?? 'unknown'}
                  tone={account?.status === 'active' ? 'success' : account?.status === 'pending_verification' ? 'warning' : 'neutral'}
                />
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Email verified</dt>
              <dd className="mt-0.5 text-text">
                {account?.email_verified_at ? new Date(account.email_verified_at).toLocaleString() : 'Not verified'}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Auth user id</dt>
              <dd className="mt-0.5 break-all font-mono text-2xs text-text-muted">{user.id}</dd>
            </div>
          </dl>

          <h3 className="mt-5 text-sm font-semibold text-text">Linked providers</h3>
          {identities.length === 0 ? (
            <p className="mt-2 text-sm text-text-muted">No identity rows found.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border rounded-md border border-border" data-testid="account-identities">
              {identities.map((identity) => (
                <li key={identity.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm">
                  <div>
                    <p className="font-medium capitalize text-text">{identity.provider}</p>
                    <p className="text-text-muted">{identity.provider_email ?? '—'}</p>
                  </div>
                  {identity.is_primary ? <StatusPill label="Primary" tone="active" /> : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-text">Profile</h2>
          <p className="mt-1 text-sm text-text-muted">Updates go to user_profiles under your RLS policy.</p>

          <form onSubmit={(e) => void onSave(e)} className="mt-4 space-y-3" data-testid="account-profile-form">
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-text">
                Display name
              </label>
              <input
                id="display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                maxLength={100}
                className="mt-1 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text">
                Username <span className="font-normal text-text-faint">(optional)</span>
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={64}
                className="mt-1 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="locale" className="block text-sm font-medium text-text">
                  Locale <span className="font-normal text-text-faint">(optional)</span>
                </label>
                <input
                  id="locale"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  placeholder="en-US"
                  maxLength={16}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm"
                />
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-text">
                  Timezone <span className="font-normal text-text-faint">(optional)</span>
                </label>
                <input
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="America/New_York"
                  maxLength={64}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm"
                />
              </div>
            </div>

            {profile?.avatar_url ? (
              <p className="text-2xs text-text-faint">
                Avatar URL from provider (read-only here): {profile.avatar_url}
              </p>
            ) : null}

            {error ? (
              <p className="text-sm text-danger" role="alert" data-testid="account-error">
                {error}
              </p>
            ) : null}
            {saved ? (
              <p className="text-sm text-success" role="status" data-testid="account-saved">
                Profile saved.
              </p>
            ) : null}

            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save profile'}
            </Button>
          </form>
        </section>

        <p className="text-sm text-text-muted">
          <Link href="/dashboard/" className="font-medium text-accent hover:underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGate requireOnboardingComplete>
      {({ user }) => <AccountBody user={user} />}
    </AuthGate>
  );
}
