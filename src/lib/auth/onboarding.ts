import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database, Json } from '@/lib/supabase/database.types';

const FLOW_STEPS = ['account', 'verify_email', 'profile', 'workspace_intro'] as const;

function asStringArray(value: Json): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function uniqueAppend(existing: string[], additions: string[]): string[] {
  const set = new Set(existing);
  for (const item of additions) set.add(item);
  return [...set];
}

/** Mark onboarding completed after the user finishes the MVP profile step. */
export async function completeOnboarding(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<{ error: string | null }> {
  const { data: current, error: readError } = await supabase
    .from('user_onboarding')
    .select('completed_steps, skipped_steps')
    .eq('user_id', userId)
    .maybeSingle();

  if (readError) return { error: readError.message };

  const completed = uniqueAppend(asStringArray(current?.completed_steps ?? []), [
    'profile',
    'workspace_intro',
  ]);

  const { error } = await supabase
    .from('user_onboarding')
    .update({
      completion_status: 'completed',
      current_step: null,
      completed_steps: completed,
      completed_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return { error: error?.message ?? null };
}

/** Skip remaining steps; still marks completion_status=completed so the gate releases. */
export async function skipOnboarding(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<{ error: string | null }> {
  const { data: current, error: readError } = await supabase
    .from('user_onboarding')
    .select('completed_steps, skipped_steps')
    .eq('user_id', userId)
    .maybeSingle();

  if (readError) return { error: readError.message };

  const completed = asStringArray(current?.completed_steps ?? []);
  const alreadySkipped = asStringArray(current?.skipped_steps ?? []);
  const toSkip = FLOW_STEPS.filter((step) => !completed.includes(step));

  const { error } = await supabase
    .from('user_onboarding')
    .update({
      completion_status: 'completed',
      current_step: null,
      skipped_steps: uniqueAppend(alreadySkipped, toSkip),
      completed_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return { error: error?.message ?? null };
}
