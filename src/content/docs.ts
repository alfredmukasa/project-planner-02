export interface DocLink {
  href: string;
  label: string;
}

export const docsNav: { title: string; items: DocLink[] }[] = [
  {
    title: 'Start here',
    items: [
      { href: '/documentation/', label: 'Documentation home' },
      { href: '/documentation/getting-started/', label: 'Getting started' },
      { href: '/documentation/identity/', label: 'Project identity (.pp)' },
    ],
  },
  {
    title: 'The workspace',
    items: [
      { href: '/documentation/workspace/', label: 'Overview, requirements, planning' },
      { href: '/documentation/architecture/', label: 'Architecture and data flow' },
      { href: '/documentation/agents/', label: 'Agents, MCP and providers' },
      { href: '/documentation/development/', label: 'Development tools' },
      { href: '/documentation/export/', label: 'Blueprint and export' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { href: '/documentation/keyboard/', label: 'Keyboard shortcuts' },
      { href: '/documentation/changelog/', label: 'Website changelog' },
    ],
  },
];

export const docsIndex: DocLink[] = docsNav.flatMap((g) => g.items);
