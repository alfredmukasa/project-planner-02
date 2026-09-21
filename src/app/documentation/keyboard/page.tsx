import type { Metadata } from 'next';

import { DocsLayout } from '@/components/docs/docs-layout';

export const metadata: Metadata = {
  title: 'Keyboard shortcuts',
  description: 'Planned keyboard shortcuts for the Project Planner Windows application.',
};

const shortcuts = [
  { keys: 'Ctrl K', action: 'Open command palette' },
  { keys: 'Ctrl P', action: 'Quick open: files and entities' },
  { keys: 'Ctrl N', action: 'New project' },
  { keys: 'Ctrl Shift P', action: 'Switch project' },
  { keys: 'Ctrl F', action: 'Find in the current view' },
  { keys: 'Ctrl /', action: 'Toggle the inspector' },
  { keys: 'Ctrl B', action: 'Toggle the sidebar' },
  { keys: 'Ctrl 1…9', action: 'Jump to a sidebar group' },
  { keys: 'Ctrl Shift A', action: 'Open Agent Activity' },
  { keys: 'Ctrl Shift M', action: 'Open System Map' },
  { keys: 'Ctrl Shift D', action: 'Open Data Flow' },
  { keys: 'Ctrl Shift E', action: 'Export / blueprint' },
  { keys: 'Ctrl ,', action: 'Settings' },
  { keys: 'Ctrl \\', action: 'Toggle Light / Midnight theme' },
  { keys: 'Esc', action: 'Close palette, dialog or inspector focus' },
  { keys: '?', action: 'Open this shortcuts reference in the app' },
];

export default function KeyboardPage() {
  return (
    <DocsLayout
      title="Keyboard shortcuts"
      description="The desktop application is designed to be driven from the keyboard. These bindings are the planned defaults for Windows; they can be remapped in Settings."
    >
      <table>
        <thead>
          <tr>
            <th>Shortcut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {shortcuts.map((s) => (
            <tr key={s.keys}>
              <td>
                {s.keys.split(' ').map((part) => (
                  <kbd key={part} className="mr-1">
                    {part}
                  </kbd>
                ))}
              </td>
              <td>{s.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>macOS is not a target for the first release. A web edition with its own bindings is planned later.</p>
    </DocsLayout>
  );
}
