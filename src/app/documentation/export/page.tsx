import type { Metadata } from 'next';
import Link from 'next/link';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Blueprint and export',
  description: 'How the project blueprint, presentation outline and export package are generated from live project data.',
};

export default function ExportDocsPage() {
  return (
    <DocsLayout
      title="Blueprint and export"
      description="Documentation in Project Planner is generated from the live project, then versioned. You can edit the result, but you never start from a blank template that drifts away from the model."
    >
      <h2>Artifacts</h2>
      <p>
        Artifacts have a stable ID, type, version, status (draft, generated, in review, approved, deprecated), author and relationships. Types include requirements, architecture, data flow, database design, API specification, UI specification, test plan, security plan, documentation, presentation and the blueprint.
      </p>

      <h2>Blueprint</h2>
      <p>The blueprint is a complete project summary generated from current data. Planned sections:</p>
      <ol>
        <li>Purpose</li>
        <li>Requirements</li>
        <li>Architecture</li>
        <li>Data Flow</li>
        <li>AI</li>
        <li>Development</li>
        <li>Testing</li>
        <li>Security</li>
        <li>Deployment</li>
        <li>Documentation</li>
      </ol>
      <p>
        A preview of a generated Architecture section is on the <Link href="/">overview</Link> and{' '}
        <Link href="/how-it-works/">how it works</Link> pages.
      </p>

      <h2>Presentation outline</h2>
      <p>A shorter outline covering overview, architecture, flows, agents, roadmap, security, testing and deployment — intended for a walkthrough, not as a slide theme.</p>

      <h2>Export formats</h2>
      <table>
        <thead>
          <tr>
            <th>Format</th>
            <th>Contents</th>
            <th>Plans</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Markdown</td>
            <td>Blueprint and linked artifacts as files</td>
            <td>Free and above</td>
          </tr>
          <tr>
            <td>JSON</td>
            <td>Structured project model</td>
            <td>Free and above</td>
          </tr>
          <tr>
            <td>HTML</td>
            <td>Readable blueprint</td>
            <td>Builder and above</td>
          </tr>
          <tr>
            <td>PDF / ZIP</td>
            <td>Printable blueprint and bundled package</td>
            <td>Pro and Studio</td>
          </tr>
        </tbody>
      </table>
      <p>
        Plan comparison lives on <Link href="/pricing/">Pricing</Link>. Exports never include API keys, tokens or other secrets.
      </p>
    </DocsLayout>
  );
}
