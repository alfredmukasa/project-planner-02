import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm, Field } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your Project Planner password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container-x py-16 md:py-24">
      <AuthForm
        mode="forgot"
        title="Reset password"
        description="Enter the email for your account and we will send a reset link if it exists."
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
    </div>
  );
}
