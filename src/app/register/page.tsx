import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm, Field } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create a Project Planner account. Registration is not available during the website preview.',
};

export default function RegisterPage() {
  return (
    <div className="container-x py-16 md:py-24">
      <AuthForm
        title="Create account"
        description="Preview of the planned registration screen. Submitting does not create an account, send email or store a password."
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
        <Field id="password" label="Password" type="password" autoComplete="new-password" />
        <p className="text-xs text-text-faint">
          By creating an account you will agree to the{' '}
          <Link href="/terms/" className="text-accent underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy/" className="text-accent underline">
            Privacy notice
          </Link>
          . Those agreements are not in effect for this preview form.
        </p>
      </AuthForm>
    </div>
  );
}
