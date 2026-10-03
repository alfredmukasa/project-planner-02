import type { Metadata } from 'next';

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Set new password',
  description: 'Choose a new password for your Project Planner account.',
};

export default function ResetPasswordPage() {
  return (
    <AuthPageShell>
      <ResetPasswordForm />
    </AuthPageShell>
  );
}
