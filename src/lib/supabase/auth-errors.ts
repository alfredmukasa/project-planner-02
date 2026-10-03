/** Map Supabase Auth / network errors to user-safe copy. */

type AuthLikeError = {
  message?: string;
  code?: string;
  status?: number;
};

function looksLikeSecret(value: string): boolean {
  return (
    value.startsWith('sb_publishable_') ||
    value.startsWith('sb_secret_') ||
    value.startsWith('eyJ') ||
    /supabaseKey|apikey|anon key/i.test(value)
  );
}

/**
 * Returns a friendly message suitable for the auth UI.
 * Never surfaces API keys or raw opaque blobs.
 */
export function friendlyAuthError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error) return fallback;

  const err = error as AuthLikeError;
  const code = (err.code ?? '').toLowerCase();
  const message = (err.message ?? '').trim();
  const status = err.status;
  const haystack = `${code} ${message}`.toLowerCase();

  if (
    code === 'over_email_send_rate_limit' ||
    haystack.includes('email rate limit') ||
    haystack.includes('over_email_send_rate_limit')
  ) {
    return (
      'Too many confirmation emails were sent recently. Wait about an hour, ' +
      'or sign in with Google / GitHub instead. For local development, disable ' +
      '“Confirm email” in the Supabase Dashboard (Authentication → Providers → Email).'
    );
  }

  if (haystack.includes('rate limit') || status === 429) {
    return 'Too many attempts right now. Please wait a few minutes and try again, or use Google / GitHub.';
  }

  if (
    haystack.includes('invalid api key') ||
    haystack.includes('invalid jwt') ||
    (haystack.includes('jwt') && haystack.includes('invalid'))
  ) {
    return 'Authentication is misconfigured (API key). Ask the site admin to check Supabase env keys.';
  }

  if (haystack.includes('user already registered') || code === 'user_already_exists') {
    return 'An account with this email already exists. Try signing in instead.';
  }

  if (haystack.includes('invalid login credentials') || code === 'invalid_credentials') {
    return 'Incorrect email or password.';
  }

  if (haystack.includes('email not confirmed')) {
    return 'Please confirm your email before signing in (check your inbox), or use Google / GitHub.';
  }

  if (
    code === 'pkce_code_verifier_not_found' ||
    haystack.includes('pkce code verifier not found')
  ) {
    return (
      'Sign-in could not finish in this browser tab. Start Google/GitHub again from this same site ' +
      '(same origin and port, e.g. http://localhost:3000), and keep the tab open through the redirect. ' +
      'Also confirm the Supabase redirect URL is exactly http://localhost:3000/auth/callback/ (trailing slash).'
    );
  }

  if (!message || looksLikeSecret(message)) {
    return fallback;
  }

  // Keep short provider messages; strip anything that looks like a key fragment.
  if (looksLikeSecret(message) || message.length > 280) {
    return fallback;
  }

  return message;
}
