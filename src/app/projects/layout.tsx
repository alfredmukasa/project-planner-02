import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects in your Project Planner workspace.',
  robots: { index: false, follow: false },
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return children;
}
