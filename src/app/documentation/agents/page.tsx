import type { Metadata } from 'next';
import Link from 'next/link';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Agents, MCP and providers',
  description: 'How agents, skills, MCP servers, memory and AI providers are designed to work in Project Planner.',
};

export default function AgentsDocsPage() {
  return (
    <DocsLayout
      title="Agents, MCP and providers"
      description="Agents propose work. They do not silently decide, they do not run without a configured provider unless the run is labelled as simulated, and they never receive API keys in prompts."
    >
      <h2>Agent groups</h2>
      <p>
        Nineteen agents in five groups: Software, Design, Planning, Quality and Documentation. Each agent has a role, capabilities, tools, skills, MCP connections, memory scope, permissions and status. The full roster is on the{' '}
        <Link href="/agents/">AI Agents</Link> page.
      </p>

      <h2>Runs</h2>
      <p>A run records agent, task, status (queued, running, waiting, completed, failed, cancelled), current step, progress, start and elapsed time, tool calls, artifacts, warnings, tokens and estimated cost. Credentials are never stored on a run.</p>
      <p>
        If no provider is configured, the desktop app may demonstrate the HUD with clearly labelled simulated runs. A run is never shown as model-backed unless a provider was actually called.
      </p>

      <h2>Human in the loop</h2>
      <p>When an agent needs a decision it asks, with context, options and why it matters. Approved answers are written into decision memory. Destructive file, Git or terminal actions always require confirmation.</p>

      <h2>Providers</h2>
      <p>
        OpenAI, Anthropic, Google Gemini, DeepSeek and compatible endpoints sit behind one abstraction. Configure provider and model per agent, define fallbacks, and inspect health, request history (redacted) and cost. Keys live in secure local storage, never in source, logs, activity feeds or exports.
      </p>

      <h2>MCP and skills</h2>
      <ul>
        <li>MCP servers expose tools with explicit permissions: read, write, network, execute.</li>
        <li>Skills are versioned instruction sets with required tools, enabled per project and assigned to agents.</li>
      </ul>

      <h2>Memory</h2>
      <p>
        Project, decision, preference, agent and technical memory are separate, inspectable and editable. Each item has a source and a confidence. There is no hidden agent state.
      </p>
    </DocsLayout>
  );
}
