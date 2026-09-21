import type { Metadata } from 'next';
import Link from 'next/link';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Development tools',
  description: 'Files, terminal, Git, environment detection, testing and builds in the planned Windows application.',
};

export default function DevelopmentDocsPage() {
  return (
    <DocsLayout
      title="Development tools"
      description="Project Planner is an IDE companion for Windows 11: it sees the same folder, the same Git repository and the same toolchain you will use to implement the plan."
    >
      <h2>Files</h2>
      <p>
        The Files screen is a project-tree view of the application folder and the <code>project-planner/</code> directory. It does not replace your editor. Watchers refresh the tree when files change on disk.
      </p>

      <h2>Terminal</h2>
      <p>PowerShell, Command Prompt and WSL. Command history, exit codes, stdout/stderr and cancellation. Commands that could delete files, modify Git state or change the system require confirmation before they run.</p>

      <h2>Git</h2>
      <p>
        Branch, working tree, staged changes, commits and diffs. You can associate a change with a task or requirement. Project Planner never commits, pushes or rewrites history on its own.
      </p>

      <h2>Environment</h2>
      <p>
        On first launch the application detects Windows version, CPU, RAM, GPU, Node, npm/pnpm/yarn, Python, Git, Docker, WSL, Flutter, Java, Android SDK, Visual Studio, VS Code, the Supabase CLI and related tools. Each is reported as available, missing, outdated or unknown — never guessed. See the preview on the{' '}
        <Link href="/features/#development">features</Link> page.
      </p>

      <h2>Testing and builds</h2>
      <p>
        Test suites, results, failures, coverage and run time, plus build history, are planned. They are marked as such in the product until the preview build ships those screens.
      </p>
    </DocsLayout>
  );
}
