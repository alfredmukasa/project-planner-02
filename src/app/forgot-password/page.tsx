import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm, Field } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset a Project Planner password. Password reset is not available during the website preview.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container-x py-16 md:py-24">
      <AuthForm
        title="Reset password"
        description="Preview of the planned reset flow. Submitting does not send email or change any password."
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
