/** Route helpers for authenticated product chrome (static export, client-gated). */

export const APP_ROUTES = ['/dashboard/', '/account/', '/onboarding/'] as const;
export const AUTH_ROUTES = [
  '/login/',
  '/register/',
  '/forgot-password/',
  '/reset-password/',
  '/auth/callback/',
] as const;

export type ChromeMode = 'marketing' | 'auth' | 'app';

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function getChromeMode(pathname: string): ChromeMode {
  const path = normalizePath(pathname);
  if ((AUTH_ROUTES as readonly string[]).includes(path)) return 'auth';
  if ((APP_ROUTES as readonly string[]).includes(path)) return 'app';
  return 'marketing';
}

export function isSafeNextPath(path: string | null | undefined): path is string {
  if (!path) return false;
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  if (path.includes('://')) return false;
  return true;
}
