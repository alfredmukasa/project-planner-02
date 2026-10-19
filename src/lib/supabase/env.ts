import { isSafeNextPath } from '@/lib/auth/paths';

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

export function getAuthCallbackUrl(nextPath?: string): string {
  const callbackPath = '/auth/callback/';
  const nextQuery = isSafeNextPath(nextPath) ? `?next=${encodeURIComponent(nextPath)}` : '';
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${callbackPath}${nextQuery}`;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return `${siteUrl.replace(/\/$/, '')}${callbackPath}${nextQuery}`;
}

export function getAuthRedirectUrl(path = '/auth/callback/', nextPath?: string): string {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const nextQuery = isSafeNextPath(nextPath) ? `?next=${encodeURIComponent(nextPath)}` : '';
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${safePath}${nextQuery}`;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return `${siteUrl.replace(/\/$/, '')}${safePath}${nextQuery}`;
}
