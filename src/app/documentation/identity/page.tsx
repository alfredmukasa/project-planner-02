import type { Metadata } from 'next';
import Link from 'next/link';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Project identity (.pp)',
  description: 'The .pp identity file tells humans and AI tools that a folder is a Project Planner project and where the planning directory lives.',
};

export default function IdentityPage() {
  return (
    <DocsLayout
      title="Project identity (.pp)"
      description="A Project Planner project is a folder with a .pp file in its root. The file is plain text, versioned, and intended to be read by people and by other development tools before they act."
    >
      <h2>Purpose</h2>
      <p>
        The identity file answers three questions: what is this project, where is the planning documentation, and which schema version does it use. It does not contain secrets, source code or generated artifacts.
      </p>

      <h2>Example</h2>
      <pre>
        <code>{`# Project Planner identity file
version = 1
project = Atlas Field Service
project_type = saas
planner_folder = ./project-planner
schema_version = 1
created_at = 2026-08-14
updated_at = 2026-09-20`}</code>
      </pre>

      <h2>Fields</h2>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>version</code>
            </td>
            <td>Identity-file format version.</td>
          </tr>
          <tr>
            <td>
              <code>project</code>
            </td>
            <td>Human-readable name.</td>
          </tr>
          <tr>
            <td>
              <code>project_type</code>
            </td>
            <td>web, desktop, mobile, api, ai, saas, library or other.</td>
          </tr>
          <tr>
            <td>
              <code>planner_folder</code>
            </td>
            <td>Relative path to the planning directory. Default <code>./project-planner</code>.</td>
          </tr>
          <tr>
            <td>
              <code>schema_version</code>
            </td>
            <td>Version of the planning-directory schema.</td>
          </tr>
        </tbody>
      </table>

      <h2>Planning directory</h2>
      <p>Planning documentation lives beside application source so that AI coding tools can read it first:</p>
      <pre>
        <code>{`ProjectRoot/
├── .pp
├── application/
└── project-planner/
    ├── README.md
    ├── project-identity/   ├── requirements/
    ├── architecture/       ├── data-flow/
    ├── ui-ux/              ├── agents/
    ├── skills/             ├── mcp/
    ├── memory/             ├── development/
    ├── testing/            ├── security/
    ├── compliance/         ├── deployment/
    ├── decisions/          ├── changelog/
    ├── artifacts/          ├── presentations/
    └── blueprint/`}</code>
      </pre>
      <p>
        The Windows application is designed to keep these folders in sync with the live project model. This website does not write files.
      </p>

      <h2>What other tools should do</h2>
      <p>
        If an AI development tool finds a <code>.pp</code> file, it should read the planning directory — identity, requirements, architecture, agent instructions, constraints and security notes — before generating or modifying code. That is the point of the identity file.
      </p>
      <p>
        Related: <Link href="/architecture/#application-architecture">application architecture</Link> and{' '}
        <Link href="/documentation/getting-started/">getting started</Link>.
      </p>
    </DocsLayout>
  );
}
