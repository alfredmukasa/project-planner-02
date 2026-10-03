import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your Project Planner account and profile.',
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children;
}
