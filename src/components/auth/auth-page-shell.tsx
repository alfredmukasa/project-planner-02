import type { ReactNode } from 'react';

/** Compact page chrome for authentication screens (login, register, reset). */
export function AuthPageShell({ children }: { children: ReactNode }) {
  return <div className="container-x py-8 md:py-10">{children}</div>;
}
