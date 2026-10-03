import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm, Field } from '@/components/auth/auth-form';
import { AuthPageShell } from '@/components/auth/auth-page-shell';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your Project Planner password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <AuthForm
        mode="forgot"
        title="Reset password"
        description="Enter your account email. If it exists, we will send a reset link."
        submitLabel="Send reset link"
        footer={
          <>
            Remembered it?{' '}
            <Link href="/login/" className="text-accent hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@company.com" />
      </AuthForm>
    </AuthPageShell>
  );
}
