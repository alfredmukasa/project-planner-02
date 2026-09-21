'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

import { nav } from '@/content/site';

import { NavLinks } from './nav-links';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        data-testid="mobile-menu-button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-muted hover:text-text"
      >
        {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
      </button>
      {open && (
        <div id={id} role="dialog" aria-label="Site menu" className="fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto border-t border-border bg-bg">
          <nav aria-label="Primary mobile" className="container-x py-3 flex flex-col gap-0.5">
            <NavLinks items={nav} vertical onNavigate={() => setOpen(false)} />
          </nav>
          <div className="container-x mt-2 flex flex-col gap-2 border-t border-border pt-4 pb-8">
            <Link href="/login/" onClick={() => setOpen(false)} className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface text-sm font-medium">
              Login
            </Link>
            <Link href="/register/" onClick={() => setOpen(false)} className="inline-flex h-9 items-center justify-center rounded-md bg-accent text-sm font-medium text-on-accent">
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
