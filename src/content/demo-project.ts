/**
 * Demo project used by every interface preview on the site.
 *
 * This is illustrative content describing what the desktop application will
 * show. It is labelled "Preview — demo project content" wherever it appears and
 * is not produced by a running Project Planner instance.
 */

export type Tone = 'neutral' | 'info' | 'active' | 'success' | 'warning' | 'danger';

export interface StatusInfo {
  label: string;
  tone: Tone;
}

export const status = {
  backlog: { label: 'Backlog', tone: 'neutral' },
  ready: { label: 'Ready', tone: 'info' },
  in_progress: { label: 'In progress', tone: 'active' },
  blocked: { label: 'Blocked', tone: 'danger' },
  review: { label: 'Review', tone: 'warning' },
  complete: { label: 'Complete', tone: 'success' },
  accepted: { label: 'Accepted', tone: 'active' },
  implemented: { label: 'Implemented', tone: 'success' },
  verified: { label: 'Verified', tone: 'success' },
  proposed: { label: 'Proposed', tone: 'info' },
  draft: { label: 'Draft', tone: 'neutral' },
  planned: { label: 'Planned', tone: 'neutral' },
  idle: { label: 'Idle', tone: 'neutral' },
  running: { label: 'Running', tone: 'active' },
  queued: { label: 'Queued', tone: 'info' },
  waiting: { label: 'Waiting', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
  open: { label: 'Open', tone: 'warning' },
  resolved: { label: 'Resolved', tone: 'success' },
  acknowledged: { label: 'Acknowledged', tone: 'info' },
  approved: { label: 'Approved', tone: 'success' },
  generated: { label: 'Generated', tone: 'info' },
  in_review: { label: 'In review', tone: 'warning' },
  connected: { label: 'Connected', tone: 'success' },
  not_configured: { label: 'Not configured', tone: 'neutral' },
  ready_health: { label: 'Ready', tone: 'success' },
  warning: { label: 'Warning', tone: 'warning' },
  not_evaluated: { label: 'Not evaluated', tone: 'neutral' },
  critical: { label: 'Critical', tone: 'danger' },
  high: { label: 'High', tone: 'danger' },
  medium: { label: 'Medium', tone: 'warning' },
  low: { label: 'Low', tone: 'neutral' },
} satisfies Record<string, StatusInfo>;

export type StatusKey = keyof typeof status;

export const demoProject = {
  name: 'Atlas Field Service',
  isDemo: true,
  description: 'Mobile-first work-order management for field technicians with offline sync and AI-assisted scheduling.',
  type: 'SaaS · Web + Mobile',
  phase: 'Architecture',
  statusLabel: 'Planning',
  created: '2026-08-14',
  updated: '2026-09-20',
  stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'React Native'],
};

export const requirements = [
  { ref: 'REQ-001', title: 'Technicians can view assigned work orders offline', kind: 'Functional', priority: 'critical', status: 'accepted', tasks: ['TSK-004', 'TSK-007'] },
  { ref: 'REQ-002', title: 'Dispatchers assign and reschedule jobs on a map', kind: 'Functional', priority: 'high', status: 'accepted', tasks: ['TSK-005'] },
  { ref: 'REQ-003', title: 'AI suggests optimal daily routes per technician', kind: 'Functional', priority: 'high', status: 'proposed', tasks: ['TSK-009'] },
  { ref: 'REQ-004', title: 'All customer data encrypted at rest and in transit', kind: 'Security', priority: 'critical', status: 'accepted', tasks: ['TSK-003'] },
  { ref: 'REQ-005', title: 'Sync conflicts are resolved without data loss', kind: 'Technical', priority: 'critical', status: 'accepted', tasks: ['TSK-007'] },
  { ref: 'REQ-006', title: 'Work-order list renders in under 200 ms for 5k items', kind: 'Performance', priority: 'medium', status: 'draft', tasks: [] },
  { ref: 'REQ-007', title: 'Mobile UI meets WCAG 2.2 AA', kind: 'Accessibility', priority: 'high', status: 'accepted', tasks: ['TSK-006'] },
  { ref: 'REQ-008', title: 'Customers receive arrival notifications', kind: 'User', priority: 'medium', status: 'proposed', tasks: ['TSK-010'] },
] as const;

export const milestones = [
  { ref: 'MS-001', name: 'Foundations', target: '2026-10-03' },
  { ref: 'MS-002', name: 'Offline work orders', target: '2026-10-31' },
  { ref: 'MS-003', name: 'Dispatch & routing', target: '2026-11-28' },
  { ref: 'MS-004', name: 'Notifications & launch prep', target: '2026-12-19' },
] as const;

export const tasks = [
  { ref: 'TSK-001', title: 'Set up monorepo, CI and environments', status: 'complete', priority: 'high', milestone: 'MS-001', agent: 'Software Architect', estimate: 6 },
  { ref: 'TSK-002', title: 'Design PostgreSQL schema for work orders and sync log', status: 'complete', priority: 'critical', milestone: 'MS-001', agent: 'Database Engineer', estimate: 10 },
  { ref: 'TSK-003', title: 'Implement field-level encryption for customer PII', status: 'in_progress', priority: 'critical', milestone: 'MS-001', agent: 'Security Agent', estimate: 12 },
  { ref: 'TSK-004', title: 'Build offline work-order store (SQLite) in the mobile app', status: 'in_progress', priority: 'critical', milestone: 'MS-002', agent: 'Frontend Engineer', estimate: 16 },
  { ref: 'TSK-005', title: 'Dispatcher map view with drag-to-reschedule', status: 'ready', priority: 'high', milestone: 'MS-003', agent: 'Frontend Engineer', estimate: 20 },
  { ref: 'TSK-006', title: 'Accessibility review of mobile navigation', status: 'review', priority: 'high', milestone: 'MS-002', agent: 'Accessibility Reviewer', estimate: 4 },
  { ref: 'TSK-007', title: 'Conflict-resolution strategy for sync (last-writer-wins + merge log)', status: 'blocked', priority: 'critical', milestone: 'MS-002', agent: 'Backend Engineer', estimate: 14 },
  { ref: 'TSK-008', title: 'Sync API: delta endpoints with cursor pagination', status: 'ready', priority: 'critical', milestone: 'MS-002', agent: 'API Engineer', estimate: 12 },
  { ref: 'TSK-009', title: 'Routing agent: evaluate provider models and cost ceiling', status: 'backlog', priority: 'high', milestone: 'MS-003', agent: 'Technical Planner', estimate: 8 },
  { ref: 'TSK-010', title: 'Arrival notification pipeline (SMS + push)', status: 'backlog', priority: 'medium', milestone: 'MS-004', agent: 'Backend Engineer', estimate: 10 },
] as const;

export type ComponentSection = 'frontend' | 'backend' | 'database' | 'api' | 'authentication' | 'storage' | 'ai' | 'external' | 'infrastructure';

export interface DemoComponent {
  id: string;
  ref: string;
  name: string;
  section: ComponentSection;
  technology: string;
  status: 'planned' | 'in_progress' | 'implemented';
  dependsOn: string[];
  description: string;
  owner: string;
  inputs: string[];
  outputs: string[];
  requirements: string[];
}

export const components: DemoComponent[] = [
  { id: 'mobile', ref: 'CMP-001', name: 'Technician mobile app', section: 'frontend', technology: 'React Native', status: 'in_progress', dependsOn: ['sync-api', 'auth', 'local-db'], description: 'Offline-first client used by technicians in the field.', owner: 'Frontend Engineer', inputs: ['Work orders', 'Route plan', 'Session token'], outputs: ['Status updates', 'Photos', 'Signatures'], requirements: ['REQ-001', 'REQ-007'] },
  { id: 'dispatch-web', ref: 'CMP-002', name: 'Dispatcher web console', section: 'frontend', technology: 'React', status: 'planned', dependsOn: ['core-api', 'auth', 'maps'], description: 'Map-centric console for assigning and rescheduling jobs.', owner: 'Frontend Engineer', inputs: ['Job list', 'Technician locations'], outputs: ['Assignments', 'Schedule changes'], requirements: ['REQ-002'] },
  { id: 'local-db', ref: 'CMP-003', name: 'On-device store', section: 'storage', technology: 'SQLite', status: 'in_progress', dependsOn: [], description: 'Encrypted local cache of assigned work orders and pending changes.', owner: 'Frontend Engineer', inputs: ['Delta batches'], outputs: ['Pending change queue'], requirements: ['REQ-001', 'REQ-004'] },
  { id: 'sync-api', ref: 'CMP-004', name: 'Sync API', section: 'api', technology: 'Node.js · Fastify', status: 'planned', dependsOn: ['core-service', 'sync-log'], description: 'Delta endpoints with cursor pagination and conflict merge.', owner: 'API Engineer', inputs: ['Change batches', 'Cursor'], outputs: ['Delta batches', 'Conflict records'], requirements: ['REQ-001', 'REQ-005'] },
  { id: 'core-api', ref: 'CMP-005', name: 'Core REST API', section: 'api', technology: 'Node.js · Fastify', status: 'in_progress', dependsOn: ['core-service', 'auth'], description: 'Work orders, customers, technicians and schedules.', owner: 'API Engineer', inputs: ['HTTP requests'], outputs: ['JSON responses'], requirements: ['REQ-002'] },
  { id: 'core-service', ref: 'CMP-006', name: 'Domain services', section: 'backend', technology: 'TypeScript', status: 'in_progress', dependsOn: ['postgres', 'events'], description: 'Business rules for scheduling, status transitions and validation.', owner: 'Backend Engineer', inputs: ['Commands'], outputs: ['Domain events'], requirements: ['REQ-002', 'REQ-005'] },
  { id: 'routing-agent', ref: 'CMP-007', name: 'Routing agent', section: 'ai', technology: 'Provider abstraction', status: 'planned', dependsOn: ['ai-provider', 'core-service', 'maps'], description: 'Proposes daily routes; suggestions are reviewed by dispatchers before applying.', owner: 'Technical Planner', inputs: ['Jobs', 'Constraints', 'Travel times'], outputs: ['Route proposals', 'Confidence'], requirements: ['REQ-003'] },
  { id: 'ai-provider', ref: 'CMP-008', name: 'AI provider gateway', section: 'ai', technology: 'OpenAI / Anthropic compatible', status: 'planned', dependsOn: [], description: 'Selects model and provider, tracks tokens and cost, applies fallbacks.', owner: 'Software Architect', inputs: ['Prompts', 'Structured context'], outputs: ['Completions', 'Usage'], requirements: ['REQ-003'] },
  { id: 'postgres', ref: 'CMP-009', name: 'PostgreSQL', section: 'database', technology: 'PostgreSQL 16', status: 'implemented', dependsOn: [], description: 'System of record with row-level security per tenant.', owner: 'Database Engineer', inputs: ['SQL'], outputs: ['Rows', 'Change feed'], requirements: ['REQ-004', 'REQ-005'] },
  { id: 'sync-log', ref: 'CMP-010', name: 'Sync log', section: 'database', technology: 'PostgreSQL table', status: 'implemented', dependsOn: ['postgres'], description: 'Append-only change log used to compute deltas and resolve conflicts.', owner: 'Database Engineer', inputs: ['Domain events'], outputs: ['Ordered changes'], requirements: ['REQ-005'] },
  { id: 'auth', ref: 'CMP-011', name: 'Authentication', section: 'authentication', technology: 'OIDC · short-lived tokens', status: 'in_progress', dependsOn: ['postgres'], description: 'Sign-in, device binding and role claims.', owner: 'Security Agent', inputs: ['Credentials'], outputs: ['Access tokens', 'Refresh tokens'], requirements: ['REQ-004'] },
  { id: 'events', ref: 'CMP-012', name: 'Event bus', section: 'infrastructure', technology: 'Redis Streams', status: 'planned', dependsOn: [], description: 'Publishes domain events to notifications and sync.', owner: 'Backend Engineer', inputs: ['Domain events'], outputs: ['Streams'], requirements: ['REQ-008'] },
  { id: 'notify', ref: 'CMP-013', name: 'Notification worker', section: 'backend', technology: 'Node.js worker', status: 'planned', dependsOn: ['events', 'sms'], description: 'Sends arrival notifications by SMS and push.', owner: 'Backend Engineer', inputs: ['Arrival events'], outputs: ['Messages'], requirements: ['REQ-008'] },
  { id: 'sms', ref: 'CMP-014', name: 'SMS gateway', section: 'external', technology: 'External service', status: 'planned', dependsOn: [], description: 'Third-party messaging provider.', owner: 'Backend Engineer', inputs: ['Message requests'], outputs: ['Delivery receipts'], requirements: ['REQ-008'] },
  { id: 'maps', ref: 'CMP-015', name: 'Maps & travel time', section: 'external', technology: 'External service', status: 'planned', dependsOn: [], description: 'Geocoding, tiles and travel-time matrix.', owner: 'Frontend Engineer', inputs: ['Addresses'], outputs: ['Coordinates', 'Durations'], requirements: ['REQ-002', 'REQ-003'] },
];

export const sectionLabels: Record<ComponentSection, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  api: 'APIs',
  authentication: 'Authentication',
  storage: 'Storage',
  ai: 'AI',
  external: 'External services',
  infrastructure: 'Infrastructure',
};

export interface FlowNode {
  id: string;
  ref: string;
  name: string;
  type: 'user' | 'interface' | 'logic' | 'ai' | 'service' | 'database' | 'external' | 'result';
  description: string;
  component: string | null;
}

export const flowNodes: FlowNode[] = [
  { id: 'tech', ref: 'DFN-001', name: 'Technician', type: 'user', description: 'Completes work orders in the field, often without connectivity.', component: null },
  { id: 'app', ref: 'DFN-002', name: 'Mobile app', type: 'interface', description: 'Captures status changes, photos and signatures.', component: 'mobile' },
  { id: 'queue', ref: 'DFN-003', name: 'Pending change queue', type: 'logic', description: 'Local, encrypted queue of changes awaiting sync.', component: 'local-db' },
  { id: 'syncapi', ref: 'DFN-004', name: 'Sync API', type: 'service', description: 'Accepts change batches and returns deltas.', component: 'sync-api' },
  { id: 'domain', ref: 'DFN-005', name: 'Domain services', type: 'logic', description: 'Validates transitions and records events.', component: 'core-service' },
  { id: 'db', ref: 'DFN-006', name: 'PostgreSQL', type: 'database', description: 'System of record and sync log.', component: 'postgres' },
  { id: 'router', ref: 'DFN-007', name: 'Routing agent', type: 'ai', description: 'Proposes routes from open jobs and travel times.', component: 'routing-agent' },
  { id: 'provider', ref: 'DFN-008', name: 'AI provider', type: 'external', description: 'Model completion; receives only structured job data, never PII.', component: 'ai-provider' },
  { id: 'dispatch', ref: 'DFN-009', name: 'Dispatcher console', type: 'result', description: 'Reviews proposals and applies the schedule.', component: 'dispatch-web' },
  { id: 'notif', ref: 'DFN-010', name: 'Customer notification', type: 'external', description: 'Arrival message sent through the SMS gateway.', component: 'sms' },
];

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  data: string;
  classification: 'public' | 'internal' | 'personal' | 'credential' | 'project_content';
  encrypted: boolean;
}

export const flowEdges: FlowEdge[] = [
  { id: 'e1', from: 'tech', to: 'app', data: 'Status, photos, signature', classification: 'personal', encrypted: true },
  { id: 'e2', from: 'app', to: 'queue', data: 'Change records', classification: 'personal', encrypted: true },
  { id: 'e3', from: 'queue', to: 'syncapi', data: 'Change batch + cursor', classification: 'personal', encrypted: true },
  { id: 'e4', from: 'syncapi', to: 'domain', data: 'Commands', classification: 'internal', encrypted: true },
  { id: 'e5', from: 'domain', to: 'db', data: 'Rows + sync log', classification: 'personal', encrypted: true },
  { id: 'e6', from: 'db', to: 'syncapi', data: 'Delta batch', classification: 'personal', encrypted: true },
  { id: 'e7', from: 'db', to: 'router', data: 'Open jobs (anonymised)', classification: 'internal', encrypted: true },
  { id: 'e8', from: 'router', to: 'provider', data: 'Structured prompt', classification: 'internal', encrypted: true },
  { id: 'e9', from: 'provider', to: 'router', data: 'Route proposal', classification: 'internal', encrypted: true },
  { id: 'e10', from: 'router', to: 'dispatch', data: 'Proposals + confidence', classification: 'internal', encrypted: true },
  { id: 'e11', from: 'domain', to: 'notif', data: 'Arrival event', classification: 'personal', encrypted: true },
];

export interface DemoAgent {
  name: string;
  role: string;
  group: 'Software' | 'Design' | 'Planning' | 'Quality' | 'Documentation';
  status: 'idle' | 'running' | 'waiting' | 'queued';
}

export const agents: DemoAgent[] = [
  { name: 'Software Architect', role: 'Owns system boundaries, component contracts and technology decisions.', group: 'Software', status: 'idle' },
  { name: 'Frontend Engineer', role: 'Plans screens, state and offline behaviour for the clients.', group: 'Software', status: 'running' },
  { name: 'Backend Engineer', role: 'Designs domain services, workers and event handling.', group: 'Software', status: 'waiting' },
  { name: 'Database Engineer', role: 'Designs schema, indexes, migrations and sync log.', group: 'Software', status: 'idle' },
  { name: 'API Engineer', role: 'Specifies endpoints, pagination, errors and versioning.', group: 'Software', status: 'queued' },
  { name: 'UI Designer', role: 'Produces UI specifications and component inventories.', group: 'Design', status: 'idle' },
  { name: 'UX Designer', role: 'Maps user flows and validates task completion paths.', group: 'Design', status: 'idle' },
  { name: 'Accessibility Reviewer', role: 'Checks contrast, keyboard paths and semantics.', group: 'Design', status: 'running' },
  { name: 'Product Planner', role: 'Turns the idea into scoped phases and milestones.', group: 'Planning', status: 'idle' },
  { name: 'Requirements Analyst', role: 'Extracts, de-duplicates and traces requirements.', group: 'Planning', status: 'idle' },
  { name: 'Technical Planner', role: 'Estimates tasks and sequences dependencies.', group: 'Planning', status: 'idle' },
  { name: 'Error Analyst', role: 'Classifies failures and proposes remediations.', group: 'Quality', status: 'idle' },
  { name: 'Testing Agent', role: 'Derives test plans from acceptance criteria.', group: 'Quality', status: 'idle' },
  { name: 'Security Agent', role: 'Reviews data flows, secrets and permissions.', group: 'Quality', status: 'running' },
  { name: 'Compliance Agent', role: 'Checks privacy, consent and accessibility obligations.', group: 'Quality', status: 'idle' },
  { name: 'Performance Agent', role: 'Flags hot paths and sets budgets.', group: 'Quality', status: 'idle' },
  { name: 'Documentation Agent', role: 'Keeps architecture and setup docs current.', group: 'Documentation', status: 'idle' },
  { name: 'Blueprint Agent', role: 'Assembles the end-to-end project blueprint.', group: 'Documentation', status: 'idle' },
  { name: 'Change Log Agent', role: 'Summarises what changed and why.', group: 'Documentation', status: 'idle' },
];

export const agentRuns = [
  { id: 'run-1', agent: 'Frontend Engineer', task: 'TSK-004 Offline work-order store', status: 'running', step: 'Drafting sync-state machine for pending changes', progress: 0.62, started: '21:37', elapsed: '4m 12s', toolCalls: 7, artifacts: 1 },
  { id: 'run-2', agent: 'Security Agent', task: 'Data-flow review (REQ-004)', status: 'running', step: 'Checking classification of edges leaving the tenant boundary', progress: 0.35, started: '21:39', elapsed: '2m 03s', toolCalls: 3, artifacts: 0 },
  { id: 'run-3', agent: 'Accessibility Reviewer', task: 'TSK-006 Mobile navigation review', status: 'running', step: 'Evaluating focus order on the work-order list', progress: 0.81, started: '21:31', elapsed: '9m 48s', toolCalls: 12, artifacts: 1 },
  { id: 'run-4', agent: 'Backend Engineer', task: 'TSK-007 Conflict-resolution strategy', status: 'waiting', step: 'Question: prefer last-writer-wins for signatures, or block and ask the technician?', progress: 0.4, started: '21:22', elapsed: '—', toolCalls: 5, artifacts: 0 },
  { id: 'run-5', agent: 'API Engineer', task: 'TSK-008 Sync API delta endpoints', status: 'queued', step: 'Waiting for TSK-007 decision', progress: 0, started: '—', elapsed: '—', toolCalls: 0, artifacts: 0 },
  { id: 'run-6', agent: 'Database Engineer', task: 'TSK-002 Schema design', status: 'completed', step: 'Produced ART-003 Database design v2', progress: 1, started: '20:48', elapsed: '11m 30s', toolCalls: 9, artifacts: 1 },
] as const;

export const auditItems = [
  { ref: 'AUD-001', category: 'Security', title: 'Route proposals include customer names in the prompt', severity: 'high', status: 'open', component: 'CMP-007', requirement: 'REQ-004', recommendation: 'Anonymise job records before sending to the provider; add a redaction step in the gateway.' },
  { ref: 'AUD-002', category: 'Architecture', title: 'Notification worker has no dead-letter handling', severity: 'medium', status: 'open', component: 'CMP-013', requirement: 'REQ-008', recommendation: 'Add a retry policy and a dead-letter stream with alerting.' },
  { ref: 'AUD-003', category: 'Requirements', title: 'REQ-006 has no acceptance criteria or linked tasks', severity: 'medium', status: 'open', component: null, requirement: 'REQ-006', recommendation: 'Define the measurement method and a benchmark task.' },
  { ref: 'AUD-004', category: 'Dependencies', title: 'Two HTTP clients declared across packages', severity: 'low', status: 'acknowledged', component: 'CMP-005', requirement: null, recommendation: 'Consolidate on one client to reduce bundle size and audit surface.' },
  { ref: 'AUD-005', category: 'Accessibility', title: 'Status conveyed by colour only in the dispatcher map legend', severity: 'high', status: 'resolved', component: 'CMP-002', requirement: 'REQ-007', recommendation: 'Add icons and text labels to each legend item.' },
  { ref: 'AUD-006', category: 'Privacy', title: 'Photo metadata (GPS EXIF) retained indefinitely', severity: 'medium', status: 'open', component: 'CMP-003', requirement: 'REQ-004', recommendation: 'Strip EXIF on capture; document retention in the privacy notes.' },
  { ref: 'AUD-007', category: 'Performance', title: 'Work-order list re-renders whole dataset on each sync', severity: 'medium', status: 'open', component: 'CMP-001', requirement: 'REQ-006', recommendation: 'Apply deltas to a keyed store and virtualise the list.' },
  { ref: 'AUD-008', category: 'Documentation', title: 'Sync log format undocumented', severity: 'low', status: 'open', component: 'CMP-010', requirement: 'REQ-005', recommendation: 'Generate a database design artifact for the sync log table.' },
] as const;

export const artifacts = [
  { ref: 'ART-001', title: 'Requirements baseline', type: 'Requirements', version: 3, status: 'approved', author: 'Requirements Analyst', updated: '2026-09-12' },
  { ref: 'ART-002', title: 'System architecture overview', type: 'Architecture', version: 4, status: 'in_review', author: 'Software Architect', updated: '2026-09-19' },
  { ref: 'ART-003', title: 'Database design v2', type: 'Database design', version: 2, status: 'approved', author: 'Database Engineer', updated: '2026-09-20' },
  { ref: 'ART-004', title: 'Sync API specification', type: 'API specification', version: 1, status: 'generated', author: 'API Engineer', updated: '2026-09-18' },
  { ref: 'ART-005', title: 'Mobile UI specification', type: 'UI specification', version: 2, status: 'in_review', author: 'UI Designer', updated: '2026-09-17' },
  { ref: 'ART-006', title: 'Data-flow security review', type: 'Security plan', version: 1, status: 'generated', author: 'Security Agent', updated: '2026-09-20' },
  { ref: 'ART-007', title: 'Test plan — offline sync', type: 'Testing plan', version: 1, status: 'draft', author: 'Testing Agent', updated: '2026-09-15' },
  { ref: 'ART-008', title: 'Project blueprint', type: 'Blueprint', version: 6, status: 'generated', author: 'Blueprint Agent', updated: '2026-09-20' },
] as const;

export const activity = [
  { time: '21:42', actor: 'Frontend Engineer', text: 'updated ART-005 Mobile UI specification (v2 → v3 draft)' },
  { time: '21:39', actor: 'Security Agent', text: 'started data-flow review for REQ-004' },
  { time: '21:37', actor: 'Frontend Engineer', text: 'started TSK-004 Offline work-order store' },
  { time: '21:31', actor: 'Accessibility Reviewer', text: 'started TSK-006 Mobile navigation review' },
  { time: '21:22', actor: 'Backend Engineer', text: 'asked a question on TSK-007 Conflict-resolution strategy' },
  { time: '21:04', actor: 'You', text: 'changed REQ-003 priority medium → high' },
  { time: '20:59', actor: 'Database Engineer', text: 'completed TSK-002 and produced ART-003 Database design v2' },
  { time: '20:41', actor: 'You', text: 'recorded ADR-004 Use an append-only sync log for conflict resolution' },
] as const;

export const decisions = [
  { ref: 'ADR-001', title: 'Offline-first mobile client with local SQLite store', status: 'accepted', date: '2026-08-21' },
  { ref: 'ADR-002', title: 'PostgreSQL with row-level security per tenant', status: 'accepted', date: '2026-08-26' },
  { ref: 'ADR-003', title: 'Provider-agnostic AI gateway; no vendor lock-in in agents', status: 'accepted', date: '2026-09-02' },
  { ref: 'ADR-004', title: 'Append-only sync log for conflict resolution', status: 'accepted', date: '2026-09-20' },
  { ref: 'ADR-005', title: 'Route proposals require dispatcher approval before applying', status: 'proposed', date: '2026-09-20' },
] as const;

/* ------------------------------------------------ derived values (computed) */

const settled = requirements.filter((r) => ['accepted', 'implemented', 'verified'].includes(r.status)).length;
const tasksDone = tasks.filter((t) => t.status === 'complete').length;
const compImpl = components.filter((c) => c.status === 'implemented').length;
const openAudits = auditItems.filter((a) => a.status === 'open').length;
const docsApproved = artifacts.filter((a) => a.status === 'approved').length;

export const progress = [
  { label: 'Requirements', value: settled / requirements.length, detail: `${settled} of ${requirements.length} accepted` },
  { label: 'Planning', value: tasks.filter((t) => t.estimate).length / tasks.length, detail: `${tasks.length} tasks estimated` },
  { label: 'Architecture', value: compImpl / components.length, detail: `${compImpl} of ${components.length} components implemented` },
  { label: 'Implementation', value: tasksDone / tasks.length, detail: `${tasksDone} of ${tasks.length} tasks complete` },
  { label: 'Testing', value: null, detail: 'No test suites recorded yet' },
  { label: 'Documentation', value: docsApproved / artifacts.length, detail: `${docsApproved} of ${artifacts.length} artifacts approved` },
  { label: 'Audit', value: (auditItems.length - openAudits) / auditItems.length, detail: `${openAudits} open of ${auditItems.length} findings` },
] as const;

export const health = [
  { label: 'Project health', state: 'warning', detail: `${openAudits} open findings · 1 blocked task` },
  { label: 'Unresolved issues', state: 'warning', detail: `${openAudits} open, 1 high severity` },
  { label: 'Missing requirements', state: 'warning', detail: '1 requirement without acceptance criteria' },
  { label: 'Architecture warnings', state: 'ready_health', detail: 'All components connected' },
  { label: 'Dependency warnings', state: 'ready_health', detail: '1 low finding acknowledged' },
  { label: 'Security warnings', state: 'critical', detail: 'AUD-001 high: PII in prompts' },
  { label: 'Documentation gaps', state: 'warning', detail: '4 components without documentation' },
] as const;

export const metrics = [
  { label: 'Requirements', value: requirements.length },
  { label: 'Tasks', value: tasks.length },
  { label: 'Components', value: components.length },
  { label: 'Flow nodes', value: flowNodes.length },
  { label: 'Agents', value: agents.length },
  { label: 'Artifacts', value: artifacts.length },
  { label: 'Decisions', value: decisions.length },
  { label: 'Open findings', value: openAudits },
] as const;
