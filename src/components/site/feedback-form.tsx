'use client';

import { useState, type FormEvent } from 'react';

import { Field } from '@/components/auth/auth-form';
import { Button } from '@/components/ui/primitives';
import { site } from '@/content/site';

function TextArea({ id, label, rows = 5 }: { id: string; label: string; rows?: number }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        required
        rows={rows}
        className="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-faint hover:border-border-strong focus:border-accent"
      />
    </div>
  );
}

/**
 * Client-only feedback form. Does not persist or send data; it shows a preview
 * notice and offers a mailto: fallback so the user can still reach us.
 */
export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('General');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div role="status" className="rounded-md border border-border bg-surface-2 p-4 text-sm" data-testid="feedback-preview-notice">
        <p className="font-semibold">This form is a preview</p>
        <p className="mt-1.5 text-text-muted">
          Nothing was stored or emailed from this page. To send feedback now, write to{' '}
          <a className="text-accent underline" href={`mailto:${site.feedbackEmail}?subject=${encodeURIComponent(`Project Planner feedback (${subject})`)}`}>
            {site.feedbackEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="feedback-form">
      <Field id="name" label="Name" autoComplete="name" />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-text">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1.5 h-9 w-full rounded-md border border-border bg-bg px-3 text-sm text-text hover:border-border-strong focus:border-accent"
        >
          <option>General</option>
          <option>Product idea</option>
          <option>Website</option>
          <option>Documentation</option>
          <option>Pricing</option>
          <option>Bug in a preview</option>
        </select>
      </div>
      <TextArea id="message" label="Message" />
      <Button type="submit">Submit feedback</Button>
      <p className="text-2xs text-text-faint">
        During preview this form does not send a message. Use the floating Feedback control or email {site.feedbackEmail} to reach us.
      </p>
    </form>
  );
}
