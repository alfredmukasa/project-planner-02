export interface Plan {
  key: 'free' | 'builder' | 'pro' | 'studio';
  name: string;
  price: number;
  period: string;
  summary: string;
  audience: string;
  highlighted?: boolean;
  limits: { label: string; value: string }[];
  features: string[];
}

export const plans: Plan[] = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    summary: 'Plan a project end to end with the core workspace.',
    audience: 'Individuals evaluating Project Planner',
    limits: [
      { label: 'Projects', value: '1' },
      { label: 'Agents', value: 'Core Planning group' },
      { label: 'Providers', value: 'Bring your own key' },
      { label: 'Exports', value: 'Markdown, JSON' },
    ],
    features: ['Requirements, milestones and tasks', 'System Map and Data Flow', 'Blueprint generation', 'Local project storage', 'Light and Midnight themes'],
  },
  {
    key: 'builder',
    name: 'Builder',
    price: 5,
    period: 'per month',
    summary: 'For solo developers running several projects.',
    audience: 'Independent developers and freelancers',
    limits: [
      { label: 'Projects', value: '5' },
      { label: 'Agents', value: 'Software + Planning groups' },
      { label: 'Providers', value: 'Bring your own key, fallbacks' },
      { label: 'Exports', value: 'Markdown, JSON, HTML' },
    ],
    features: ['Everything in Free', 'Agent Activity HUD', 'Environment detection and Git status', 'Audit: requirements, architecture, dependencies', 'Decision records and change log'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 15,
    period: 'per month',
    summary: 'The full agent workforce, quality suite and exports.',
    audience: 'Professional developers and small teams',
    highlighted: true,
    limits: [
      { label: 'Projects', value: 'Unlimited' },
      { label: 'Agents', value: 'All 19 agents' },
      { label: 'Providers', value: 'All providers, per-agent models' },
      { label: 'Exports', value: 'Markdown, JSON, HTML, PDF, ZIP' },
    ],
    features: ['Everything in Builder', 'MCP server management and skills', 'Security, accessibility, privacy and compliance audits', 'Presentation outlines', 'Cost analysis per agent and provider', 'Terminal workspace and test tracking'],
  },
  {
    key: 'studio',
    name: 'Studio',
    price: 20,
    period: 'per month',
    summary: 'For studios that plan client work repeatedly.',
    audience: 'Agencies, studios and consultancies',
    limits: [
      { label: 'Projects', value: 'Unlimited' },
      { label: 'Agents', value: 'All 19 + custom agents' },
      { label: 'Providers', value: 'All providers, organisation defaults' },
      { label: 'Exports', value: 'All formats + branded templates' },
    ],
    features: ['Everything in Pro', 'Custom agents, skills and templates', 'Project templates and reusable blueprints', 'Priority support', 'Early access to new features'],
  },
];

export const comparison: { feature: string; values: [string, string, string, string] }[] = [
  { feature: 'Projects', values: ['1', '5', 'Unlimited', 'Unlimited'] },
  { feature: 'Requirements, milestones, tasks', values: ['Yes', 'Yes', 'Yes', 'Yes'] },
  { feature: 'System Map and Data Flow', values: ['Yes', 'Yes', 'Yes', 'Yes'] },
  { feature: 'Agents included', values: ['Planning group', 'Software + Planning', 'All 19', 'All 19 + custom'] },
  { feature: 'Agent Activity HUD', values: ['—', 'Yes', 'Yes', 'Yes'] },
  { feature: 'MCP servers and skills', values: ['—', '—', 'Yes', 'Yes'] },
  { feature: 'Provider fallbacks and per-agent models', values: ['—', 'Fallbacks', 'Yes', 'Yes'] },
  { feature: 'Audits', values: ['—', 'Core', 'Full suite', 'Full suite'] },
  { feature: 'Environment detection, Git, terminal', values: ['—', 'Environment + Git', 'Yes', 'Yes'] },
  { feature: 'Blueprint', values: ['Yes', 'Yes', 'Yes', 'Yes'] },
  { feature: 'Presentation outline', values: ['—', '—', 'Yes', 'Yes'] },
  { feature: 'Exports', values: ['MD, JSON', 'MD, JSON, HTML', 'All formats', 'All + templates'] },
  { feature: 'Cost analysis', values: ['—', 'Basic', 'Yes', 'Yes'] },
  { feature: 'Custom agents and templates', values: ['—', '—', '—', 'Yes'] },
  { feature: 'Support', values: ['Community', 'Email', 'Email', 'Priority'] },
];
