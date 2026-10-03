import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm, Field } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to Project Planner with email, Google, or GitHub.',
};

export default function LoginPage() {
  return (
    <div className="container-x py-16 md:py-24">
      <AuthForm
        mode="login"
        title="Sign in"
        description="Use Google, GitHub, or your email and password to access your Project Planner account."
        submitLabel="Sign in"
        footer={
          <>
            No account yet?{' '}
            <Link href="/register/" className="text-accent hover:underline">
              Create one
            </Link>
            {' · '}
            <Link href="/forgot-password/" className="text-accent hover:underline">
              Forgot password
            </Link>
          </>
        }
      >
        <Field id="email" label="Email" type="email" autoComplete="username" placeholder="you@company.com" />
        <Field id="password" label="Password" type="password" autoComplete="current-password" />
      </AuthForm>
    </div>
  );
}
