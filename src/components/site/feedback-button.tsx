import { MessageSquare } from 'lucide-react';

import { site } from '@/content/site';

/**
 * Small floating feedback control, bottom-left (spec §34). Deliberately
 * simple: it links to the feedback address until a feedback destination exists.
 */
export function FeedbackButton() {
  return (
    <a
      href={`mailto:${site.feedbackEmail}?subject=${encodeURIComponent('Project Planner feedback')}`}
      className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text-muted shadow-[var(--shadow)] hover:text-text hover:border-border-strong transition-colors"
      aria-label="Send feedback by email"
      data-testid="feedback-button"
    >
      <MessageSquare size={13} aria-hidden />
      Feedback
    </a>
  );
}
