'use client';

import { useState } from 'react';

import { friendlyAuthError } from '@/lib/supabase/auth-errors';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { getAuthCallbackUrl } from '@/lib/supabase/env';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-.9 2.4-1.9 3.1l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.1-2.4c-.9.6-2 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H3.1v2.5C4.8 19.9 8.1 22 12 22z"
      />
      <path
        fill="#4A90E2"
        d="M6.3 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.5H3.1C2.4 8.9 2 10.4 2 12s.4 3.1 1.1 4.5L6.3 14z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.9 14.7 2 12 2 8.1 2 4.8 4.1 3.1 7.5l3.2 2.5C7.1 7.6 9.3 5.8 12 5.8z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

const providers = [
  {
    id: 'google' as const,
    label: 'Continue with Google',
    icon: GoogleIcon,
  },
  {
    id: 'github' as const,
    label: 'Continue with GitHub',
    icon: GitHubIcon,
  },
];

export function OAuthButtons({
  disabled = false,
  onError,
  nextPath,
}: {
  disabled?: boolean;
  onError?: (message: string) => void;
  nextPath?: string;
}) {
  const [busyProvider, setBusyProvider] = useState<'google' | 'github' | null>(null);

  const startOAuth = async (provider: 'google' | 'github') => {
    setBusyProvider(provider);
    onError?.('');
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getAuthCallbackUrl(nextPath),
          queryParams:
            provider === 'google'
              ? {
                  access_type: 'offline',
                  prompt: 'consent',
                }
              : undefined,
        },
      });
      if (error) {
        onError?.(friendlyAuthError(error, 'Unable to start sign-in.'));
        setBusyProvider(null);
      }
    } catch (err) {
      onError?.(friendlyAuthError(err, 'Unable to start sign-in.'));
      setBusyProvider(null);
    }
  };

  return (
    <div className="space-y-2" data-testid="oauth-buttons">
      {providers.map(({ id, label, icon: Icon }) => {
        const isBusy = busyProvider === id;
        return (
          <button
            key={id}
            type="button"
            disabled={disabled || busyProvider !== null}
            onClick={() => void startOAuth(id)}
            aria-label={label}
            className="inline-flex h-10 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:border-border-strong hover:bg-surface-2 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-muted"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{isBusy ? 'Redirecting…' : label}</span>
          </button>
        );
      })}
    </div>
  );
}
