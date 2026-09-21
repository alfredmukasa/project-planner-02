import type { Metadata } from 'next';
import Link from 'next/link';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Overview, requirements, phases, milestones, tasks and the inspector in the planned Project Planner workspace.',
};

export default function WorkspaceDocsPage() {
  return (
    <DocsLayout
      title="Overview, requirements and planning"
      description="The workspace is the command centre of the desktop application: a grouped sidebar, a dense main pane and a context inspector. Status is always icon + label + colour, never colour alone."
    >
      <h2>Shell</h2>
      <p>
        The planned Windows shell has a title bar, a top bar (project switcher, command palette, agent activity, notifications, account), a grouped left sidebar, the workspace and an inspector on the right. The sidebar groups are Workspace, Architecture, AI, Development, Documentation, Quality and Settings.
      </p>
      <p>
        See the <Link href="/">product overview</Link> for a labelled preview of this shell using the Atlas Field Service demo project.
      </p>

      <h2>Overview</h2>
      <p>Overview shows:</p>
      <ul>
        <li>Project summary — name, type, status, current phase, created and updated dates.</li>
        <li>Progress per phase, computed from requirements, tasks, components, tests, artifacts and audits. If there is not enough data, the bar is labelled “Not evaluated”, never invented.</li>
        <li>Health — unresolved issues, missing requirements, architecture and dependency warnings, security findings, documentation gaps.</li>
        <li>Activity — a chronological stream of agent, user and system events.</li>
      </ul>

      <h2>Requirements</h2>
      <p>
        Each requirement has a stable ID (<code>REQ-001</code>), a kind (functional, non-functional, user, technical, security, accessibility, performance, business), priority, status, source, dependencies, acceptance criteria and links to tasks and components. Status values are draft, proposed, accepted, implemented, verified, deprecated or rejected.
      </p>

      <h2>Planning</h2>
      <p>
        Phases contain milestones; milestones contain tasks and subtasks. Tasks carry estimate, assigned agent, priority, status (backlog, ready, in progress, blocked, review, complete, cancelled), acceptance criteria, related requirements and components. Progress on Overview is derived from this tree.
      </p>

      <h2>Inspector</h2>
      <p>
        Selecting any entity opens the inspector: type, status, owner, related items, recent activity and available actions. The inspector is the same component on every screen, filled from the selected entity.
      </p>

      <h2>Command palette and search</h2>
      <p>
        <kbd>Ctrl</kbd> <kbd>K</kbd> opens navigation, projects, commands, agents, files and settings. Global search covers requirements, tasks, architecture, agents, artifacts, documentation and decisions.
      </p>
    </DocsLayout>
  );
}
