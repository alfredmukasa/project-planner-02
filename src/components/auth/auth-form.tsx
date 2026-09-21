'use client';

import Link from 'next/link';
import { useState, type FormEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/primitives';
import { site } from '@/content/site';

export function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  required = true,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm text-text placeholder:text-text-faint hover:border-border-strong focus:border-accent"
      />
    </div>
  );
}

/**
 * Demo-only authentication form. Submits locally, never contacts a server,
 * and explains that accounts are not available during the website preview.
 */
export function AuthForm({
  title,
  description,
  submitLabel,
  children,
  footer,
}: {
  title: string;
  description: string;
  submitLabel: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Preview · demo UI</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">{description}</p>
        {submitted ? (
          <div role="status" className="mt-6 rounded-md border border-border bg-surface-2 p-4 text-sm" data-testid="auth-preview-notice">
            <p className="font-semibold text-text">Accounts are not available yet</p>
            <p className="mt-1.5 text-text-muted">
              This form is a preview of the planned sign-in experience. No account was created, no email was sent, and nothing was stored. When the Windows application opens for preview, this page will connect to a real authentication service.
            </p>
            <p className="mt-3 text-text-muted">
              Questions?{' '}
              <a href={`mailto:${site.supportEmail}`} className="text-accent underline">
                {site.supportEmail}
              </a>
            </p>
            <Link href="/" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
              Return to the overview
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate={false} data-testid="auth-form">
            {children}
            <Button type="submit" className="w-full" size="lg">
              {submitLabel}
            </Button>
            <p className="text-2xs text-text-faint">Submitting this form does not create an account or send credentials anywhere.</p>
          </form>
        )}
      </div>
      <p className="mt-4 text-center text-sm text-text-muted">{footer}</p>
    </div>
  );
}
