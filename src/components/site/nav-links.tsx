'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Item {
  readonly href: string;
  readonly label: string;
}

const isActive = (pathname: string, href: string): boolean => {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href.replace(/\/$/, ''));
};

export function NavLinks({ items, onNavigate, vertical = false }: { items: readonly Item[]; onNavigate?: () => void; vertical?: boolean }) {
  const pathname = usePathname() ?? '/';
  return (
    <>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={
              vertical
                ? `block rounded-md px-3 py-2 text-sm font-medium ${active ? 'bg-surface-2 text-text' : 'text-text-muted hover:bg-surface-2 hover:text-text'}`
                : `rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors ${active ? 'bg-surface-2 text-text' : 'text-text-muted hover:text-text hover:bg-surface-2'}`
            }
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
