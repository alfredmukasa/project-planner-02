/** Client-side project field rules. Database checks remain the persistence boundary. */

export const PROJECT_NAME_MAX = 160;
export const PROJECT_DESCRIPTION_MAX = 4000;
export const PROJECT_SLUG_MAX = 80;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateProjectName(raw: string): { ok: true; value: string } | { ok: false; error: string } {
  const value = raw.trim();
  if (!value) {
    return { ok: false, error: 'Enter a project name.' };
  }
  if (value.length > PROJECT_NAME_MAX) {
    return {
      ok: false,
      error: `Project name must be ${PROJECT_NAME_MAX} characters or fewer.`,
    };
  }
  return { ok: true, value };
}

export function validateProjectDescription(
  raw: string,
): { ok: true; value: string | null } | { ok: false; error: string } {
  const value = raw.trim();
  if (!value) return { ok: true, value: null };
  if (value.length > PROJECT_DESCRIPTION_MAX) {
    return {
      ok: false,
      error: `Description must be ${PROJECT_DESCRIPTION_MAX.toLocaleString('en-US')} characters or fewer.`,
    };
  }
  return { ok: true, value };
}

/** Stable slug stem from a validated project name. Does not silently shorten the name itself. */
export function projectSlugBase(name: string): string {
  const stem = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, PROJECT_SLUG_MAX)
    .replace(/-+$/g, '');
  const base = stem || 'project';
  return SLUG_PATTERN.test(base) ? base : 'project';
}

export function allocateProjectSlug(base: string, taken: ReadonlySet<string>): string {
  const root = projectSlugBase(base);
  if (!taken.has(root)) return root;
  for (let n = 2; n < 1000; n += 1) {
    const suffix = `-${n}`;
    const candidate = `${root.slice(0, PROJECT_SLUG_MAX - suffix.length)}${suffix}`;
    if (SLUG_PATTERN.test(candidate) && !taken.has(candidate)) return candidate;
  }
  throw new Error('Could not allocate a unique project slug.');
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isProjectId(value: string | null | undefined): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}
