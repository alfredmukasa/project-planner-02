'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/primitives';
import { createProject } from '@/lib/projects/access';
import { PROJECT_DESCRIPTION_MAX, PROJECT_NAME_MAX, validateProjectDescription, validateProjectName } from '@/lib/projects/validation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const fieldClass =
  'mt-1 w-full rounded-md border border-border bg-bg px-3 text-sm text-text placeholder:text-text-faint hover:border-border-strong focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

export function CreateProjectForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const nameResult = validateProjectName(name);
    if (!nameResult.ok) {
      setError(nameResult.error);
      return;
    }
    const descriptionResult = validateProjectDescription(description);
    if (!descriptionResult.ok) {
      setError(descriptionResult.error);
      return;
    }

    setBusy(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const result = await createProject(supabase, { name, description });
      if ('error' in result) {
        setError(result.error);
        return;
      }
      router.push(`/projects/open/?id=${encodeURIComponent(result.project.id)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the project.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(event) => void onSubmit(event)} noValidate className="mt-6 space-y-4" data-testid="create-project-form">
      <div>
        <label htmlFor="project-name" className="block text-sm font-medium text-text">
          Project name
        </label>
        <input
          id="project-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
          aria-invalid={error?.toLowerCase().includes('name') ? true : undefined}
          aria-describedby="project-name-hint"
          className={`${fieldClass} h-9`}
        />
        <p id="project-name-hint" className="mt-1 text-xs text-text-muted">
          Required. Up to {PROJECT_NAME_MAX} characters. Blank names are not saved.
        </p>
      </div>

      <div>
        <label htmlFor="project-description" className="block text-sm font-medium text-text">
          Description <span className="font-normal text-text-faint">(optional)</span>
        </label>
        <textarea
          id="project-description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          aria-describedby="project-description-hint"
          className={`${fieldClass} py-2`}
        />
        <p id="project-description-hint" className="mt-1 text-xs text-text-muted">
          Optional. Up to {PROJECT_DESCRIPTION_MAX.toLocaleString('en-US')} characters.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-danger" role="alert" data-testid="create-project-error">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create project'}
        </Button>
        <Link href="/projects/" className="text-sm font-medium text-accent hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
