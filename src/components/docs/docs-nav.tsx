'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { docsNav } from '@/content/docs';

export function DocsNav() {
  const pathname = usePathname() ?? '/';
  const current = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return (
    <nav aria-label="Documentation" className="space-y-5">
      {docsNav.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-text-faint">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = current === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-md px-2 py-1 text-[13px] ${active ? 'bg-surface-2 font-medium text-text' : 'text-text-muted hover:bg-surface-2 hover:text-text'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
