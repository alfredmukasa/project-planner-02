'use client';

import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

const read = (): Theme => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

export function ThemeToggle({ className = '' }: { className?: string }) {
  const toggle = () => {
    const next: Theme = read() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('pp-theme', next);
    } catch {
      // Persistence is best-effort; the theme still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and midnight themes"
      title="Toggle light and midnight themes"
      data-testid="theme-toggle"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-muted hover:text-text hover:border-border-strong transition-colors ${className}`}
    >
      <Sun size={15} aria-hidden className="hidden dark:inline" />
      <Moon size={15} aria-hidden className="inline dark:hidden" />
    </button>
  );
}
