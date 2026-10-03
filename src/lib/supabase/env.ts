/** Public Supabase env used by the static website client. */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  return url;
}

/**
 * Browser/API key for Supabase.
 * Prefer the legacy JWT anon key for Auth compatibility; fall back to the
 * new publishable key if anon is not configured.
 */
export function getSupabaseAnonKey(): string {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  // Prefer a JWT-shaped anon key when both are present.
  if (anon && looksLikeJwt(anon)) return anon;
  if (publishable) return publishable;
  if (anon) return anon;

  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)',
  );
}

/** @deprecated Use getSupabaseAnonKey — kept for existing imports. */
export function getSupabasePublishableKey(): string {
  return getSupabaseAnonKey();
}

function looksLikeJwt(value: string): boolean {
  return value.startsWith('eyJ') && value.split('.').length === 3;
}

export function getAuthCallbackUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback/`;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return `${siteUrl.replace(/\/$/, '')}/auth/callback/`;
}

export function getAuthRedirectUrl(path = '/auth/callback/'): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
