'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/primitives';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const load = async () => {
      const { data, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('display_name')
          .eq('user_id', data.user.id)
          .maybeSingle();
        setProfileName(profile?.display_name ?? null);
      }
      setLoading(false);
    };

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfileName(null);
  };

  return (
    <div className="container-x py-16 md:py-24">
      <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-2 text-sm text-text-muted">
          A simple signed-in placeholder while the full workspace ships.
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-text-muted">Loading session…</p>
        ) : error ? (
          <p className="mt-6 text-sm text-text-muted" role="alert">
            {error}
          </p>
        ) : user ? (
          <div className="mt-6 space-y-3 text-sm" data-testid="account-session">
            <p>
              <span className="text-text-muted">Signed in as </span>
              <span className="font-medium text-text">{profileName ?? user.email}</span>
            </p>
            <p className="text-text-muted">{user.email}</p>
            <Button type="button" variant="secondary" className="w-full" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-3 text-sm" data-testid="account-signed-out">
            <p className="text-text-muted">You are not signed in.</p>
            <Link href="/login/" className="inline-block font-medium text-accent hover:underline">
              Sign in
            </Link>
            {' · '}
            <Link href="/register/" className="inline-block font-medium text-accent hover:underline">
              Create account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
