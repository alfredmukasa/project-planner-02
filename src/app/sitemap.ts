import type { MetadataRoute } from 'next';

import { docsIndex } from '@/content/docs';
import { nav, site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const extra = ['/about/', '/security/', '/privacy/', '/terms/', '/login/', '/register/', '/forgot-password/'];
  const paths = new Set<string>([...nav.map((n) => n.href), ...docsIndex.map((d) => d.href), ...extra]);
  const lastModified = new Date('2026-09-21');
  return [...paths].map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.6,
  }));
}
