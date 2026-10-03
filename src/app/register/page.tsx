import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm, Field } from '@/components/auth/auth-form';
import { AuthPageShell } from '@/components/auth/auth-page-shell';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create a Project Planner account with email, Google, or GitHub.',
};

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <AuthForm
        mode="register"
        title="Create account"
        description="Continue with Google or GitHub, or register with email (password ≥ 12 characters)."
        submitLabel="Create account"
        footer={
          <>
            Already have an account?{' '}
            <Link href="/login/" className="text-accent hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <Field id="name" label="Name" autoComplete="name" placeholder="Your name" />
        <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@company.com" />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          placeholder="At least 12 characters"
        />
        <p className="text-xs text-text-faint">
          By creating an account you agree to the{' '}
          <Link href="/terms/" className="text-accent underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy/" className="text-accent underline">
            Privacy notice
          </Link>
          .
        </p>
      </AuthForm>
    </AuthPageShell>
  );
}
