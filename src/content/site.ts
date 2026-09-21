/** Single place for names, contacts and placeholders so they are easy to replace later. */

export const site = {
  name: 'Project Planner',
  tagline: 'Plan before you build.',
  description:
    'Project Planner is an upcoming AI-powered planning workspace for Windows that connects requirements, architecture, AI agents, development planning, testing and documentation in one place.',
  url: 'https://projectplanner.app',
  supportEmail: 'support@projectplanner.app',
  feedbackEmail: 'feedback@projectplanner.app',
  privacyEmail: 'privacy@projectplanner.app',
  securityEmail: 'security@projectplanner.app',
  /** Product stage shown across the site. */
  stage: 'Preview',
  desktop: {
    platform: 'Windows 11',
    version: 'Coming soon',
    /** No installer exists yet; this deliberately has no download URL. */
    downloadUrl: null as string | null,
    requirements: [
      'Windows 11 (22H2 or later recommended); Windows 10 21H2+ supported as a legacy target',
      '64-bit (x64) processor',
      '8 GB RAM minimum, 16 GB recommended for large projects',
      '500 MB free disk space plus space for project planning folders',
      'Git 2.30 or later for Git integration (optional)',
      'An AI provider account (OpenAI, Anthropic, Google, DeepSeek or compatible) for model-backed agents (optional)',
    ],
  },
  copyrightYear: 2026,
} as const;

export const nav = [
  { href: '/', label: 'Overview' },
  { href: '/how-it-works/', label: 'How It Works' },
  { href: '/features/', label: 'Features' },
  { href: '/architecture/', label: 'Architecture' },
  { href: '/agents/', label: 'AI Agents' },
  { href: '/pricing/', label: 'Pricing' },
  { href: '/documentation/', label: 'Documentation' },
  { href: '/download/', label: 'Download' },
  { href: '/support/', label: 'Support' },
] as const;

export const footerColumns = [
  {
    title: 'Product',
    links: [
      { href: '/how-it-works/', label: 'How It Works' },
      { href: '/features/', label: 'Features' },
      { href: '/architecture/', label: 'Architecture' },
      { href: '/agents/', label: 'AI Agents' },
      { href: '/pricing/', label: 'Pricing' },
      { href: '/documentation/', label: 'Documentation' },
      { href: '/download/', label: 'Download' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about/', label: 'About' },
      { href: '/support/', label: 'Support' },
      { href: '/support/#contact', label: 'Contact' },
      { href: '/support/#feedback', label: 'Feedback' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy/', label: 'Privacy' },
      { href: '/terms/', label: 'Terms' },
      { href: '/security/', label: 'Security' },
    ],
  },
] as const;
