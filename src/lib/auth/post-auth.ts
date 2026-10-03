import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/database.types';

export type OnboardingRow = Database['public']['Tables']['user_onboarding']['Row'];

/**
 * After a successful auth session, send incomplete onboarding to /onboarding/,
 * otherwise to /dashboard/. Falls back to /dashboard/ if the row is missing
 * (trigger lag) — AuthGate will re-check.
 */
export async function resolvePostAuthPath(
  supabase: SupabaseClient<Database>,
): Promise<'/onboarding/' | '/dashboard/'> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return '/dashboard/';
  }

  const { data: onboarding } = await supabase
    .from('user_onboarding')
    .select('completion_status')
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (!onboarding || onboarding.completion_status !== 'completed') {
    return '/onboarding/';
  }

  return '/dashboard/';
}

export function isOnboardingComplete(row: Pick<OnboardingRow, 'completion_status'> | null): boolean {
  return row?.completion_status === 'completed';
}
