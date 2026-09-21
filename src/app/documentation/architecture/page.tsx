import type { Metadata } from 'next';
import Link from 'next/link';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Architecture and data flow',
  description: 'How Project Planner stores architecture as data and renders System Map and Data Flow graphs from it.',
};

export default function ArchitectureDocsPage() {
  return (
    <DocsLayout
      title="Architecture and data flow"
      description="Architecture in Project Planner is a model, not a picture. Components, dependencies and flows are stored as data; the System Map and Data Flow screens render that data with a deterministic layered layout."
    >
      <h2>Components</h2>
      <p>
        A component has a stable ID, name, section (frontend, backend, database, APIs, authentication, storage, AI, external, infrastructure, deployment, security), technology, status, inputs, outputs, dependencies, owner agent and linked requirements. See the{' '}
        <Link href="/architecture/">architecture page</Link> for the Atlas Field Service demo inventory.
      </p>

      <h2>System Map</h2>
      <ul>
        <li>Views: System, Frontend, Backend, Database, AI, APIs, Infrastructure.</li>
        <li>Zoom, pan, search, filter and group.</li>
        <li>Selecting a node highlights its dependencies and dependents and fills the inspector.</li>
        <li>Layout is a longest-path layered graph so the same project always draws the same way.</li>
      </ul>

      <h2>Data Flow</h2>
      <p>Nodes represent users, interfaces, application logic, AI, services, databases, external systems and results. Edges record:</p>
      <ul>
        <li>The data that moves.</li>
        <li>Classification: public, internal, personal, credential or project content.</li>
        <li>Whether the channel is encrypted.</li>
      </ul>
      <p>
        That classification is what the Security Agent audits. A high-severity finding in the demo project (AUD-001) is a routing-agent prompt that still includes customer names — visible because the edge is classified as personal.
      </p>

      <h2>Decision records</h2>
      <p>
        Architecture Decision Records (<code>ADR-001</code>…) keep the reasoning next to the result: decision, reason, alternatives, consequences and status, linked to the components they affect.
      </p>

      <h2>Application layers</h2>
      <p>
        The Windows application itself is specified as UI → domain → application services → AI → visualization → infrastructure → security. The public website shares the visual language of that UI but does not include those layers. Details:{' '}
        <Link href="/architecture/#application-architecture">application architecture</Link>.
      </p>
    </DocsLayout>
  );
}
