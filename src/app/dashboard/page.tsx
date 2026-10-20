'use client';

import { AuthGate } from '@/components/auth/auth-gate';
import { DashboardOverview } from '@/components/app/dashboard-overview';
import type { User } from '@supabase/supabase-js';

function DashboardBody({ user }: { user: User }) {
  return <DashboardOverview user={user} />;
}

export default function DashboardPage() {
  return (
    <AuthGate requireOnboardingComplete>
      {({ user }) => <DashboardBody user={user} />}
    </AuthGate>
  );
}
