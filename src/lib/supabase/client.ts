import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env';
import type { Database } from '@/lib/supabase/database.types';

let browserClient: SupabaseClient<Database> | undefined;

/**
 * Browser Supabase client for the static export site.
 *
 * Uses `@supabase/ssr` `createBrowserClient` so PKCE code verifiers (and the
 * session) are stored in cookies via `document.cookie`. That survives the
 * OAuth round-trip without a Next.js server/middleware cookie bridge.
 *
 * Call only from the browser (event handlers / `useEffect`), never during SSR.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    throw new Error('createBrowserSupabaseClient() must run in the browser');
  }

  if (browserClient) return browserClient;

  browserClient = createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    isSingleton: true,
    auth: {
      flowType: 'pkce',
      // Callback page completes the exchange; avoid a second auto-exchange
      // that would clear the PKCE verifier before our handler runs.
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
}
