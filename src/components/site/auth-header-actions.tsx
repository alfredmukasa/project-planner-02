'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { createBrowserSupabaseClient } from '@/lib/supabase/client';

/** Marketing header CTAs: Login/Register or Dashboard when a session exists. */
export function AuthHeaderActions() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      setSignedIn(Boolean(data.session));
    };
    void sync();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  if (signedIn) {
    return (
      <Link
        href="/dashboard/"
        className="hidden md:inline-flex h-8 items-center rounded-md bg-accent px-3 text-sm font-medium text-on-accent hover:bg-accent-strong transition-colors"
        data-testid="header-dashboard"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login/"
        className="hidden md:inline-flex h-8 items-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-text hover:border-border-strong transition-colors"
      >
        Login
      </Link>
      <Link
        href="/register/"
        className="hidden md:inline-flex h-8 items-center rounded-md bg-accent px-3 text-sm font-medium text-on-accent hover:bg-accent-strong transition-colors"
      >
        Create Account
      </Link>
    </>
  );
}
