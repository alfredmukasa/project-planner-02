import type { Metadata } from 'next';
import Link from 'next/link';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Getting started',
  description: 'How a first project is created in Project Planner: identity file, planning folder, idea, requirements and the first architecture map.',
};

export default function GettingStartedPage() {
  return (
    <DocsLayout
      title="Getting started"
      description="The first session in Project Planner is designed to produce a real project model — not a blank canvas. This is the planned flow for the Windows application."
    >
      <h2>What you need</h2>
      <ul>
        <li>Windows 11, 64-bit (Windows 10 21H2+ is a legacy target).</li>
        <li>A folder for the project. Planning files live beside application source, never inside it.</li>
        <li>Optionally, Git and an AI provider account. Neither is required to inspect or edit a project locally.</li>
      </ul>

      <h2>Create a project</h2>
      <p>
        File → New Project asks for a name, description, type (web, desktop, mobile, API, AI application, SaaS, library or other), target platforms and an optional stack. Project Planner then writes two things at the chosen location:
      </p>
      <ol>
        <li>
          A <code>.pp</code> identity file in the project root. See{' '}
          <Link href="/documentation/identity/">Project identity</Link>.
        </li>
        <li>
          A <code>project-planner/</code> directory with canonical sections for requirements, architecture, agents, development, security, testing, decisions and the blueprint.
        </li>
      </ol>
      <p>If you open an existing folder that already has a <code>.pp</code> file, Project Planner loads that identity and does not create a second one.</p>

      <h2>Describe the idea</h2>
      <p>
        The Overview screen starts with the description you typed. The Product Planner and Requirements Analyst can propose a first set of phases and candidate requirements. Every proposal is a draft until you accept it. Nothing is written into the plan automatically.
      </p>

      <h2>Work through the lifecycle</h2>
      <ol>
        <li>Accept, edit or reject proposed requirements. Each one gets a stable ID such as <code>REQ-001</code>.</li>
        <li>Turn accepted requirements into phases, milestones, tasks and subtasks.</li>
        <li>Add architecture components and the data that moves between them.</li>
        <li>Open the System Map and Data Flow screens — they are generated from that data, not drawn by hand.</li>
        <li>Assign agents, skills and MCP servers if you want AI assistance. Configure a provider first if you want model-backed runs.</li>
        <li>Run audits. Findings carry evidence, severity and a recommendation.</li>
        <li>Generate the blueprint and export it as Markdown, JSON, HTML or PDF.</li>
      </ol>

      <h2>Where to go next</h2>
      <ul>
        <li>
          <Link href="/how-it-works/">How it works</Link> — the ten-step product walkthrough.
        </li>
        <li>
          <Link href="/documentation/workspace/">Workspace</Link> — Overview, requirements and planning.
        </li>
        <li>
          <Link href="/download/">Download</Link> — preview status for the Windows installer.
        </li>
      </ul>
    </DocsLayout>
  );
}
