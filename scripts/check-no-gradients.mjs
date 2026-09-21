#!/usr/bin/env node
/** Absolute colour rule: no gradients anywhere. Scans source and built CSS. */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const SKIP = new Set(['node_modules', '.next', 'playwright-report', 'test-results', 'scripts', 'tests']);
const EXT = new Set(['.css', '.tsx', '.ts', '.mdx', '.html']);
const PATTERN = /(linear|radial|conic|repeating-linear|repeating-radial)-gradient\s*\(|bg-gradient-to|bg-linear-|bg-radial|bg-conic/;
const hits = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXT.has(name.slice(name.lastIndexOf('.')))) {
      readFileSync(full, 'utf8').split('\n').forEach((line, i) => {
        if (PATTERN.test(line)) hits.push(`${relative(root, full)}:${i + 1}: ${line.trim().slice(0, 120)}`);
      });
    }
  }
};
walk(join(root, 'src'));
if (existsSync(join(root, 'out'))) walk(join(root, 'out'));
if (hits.length) {
  console.error(`Gradient rule violated (${hits.length}):\n${hits.join('\n')}`);
  process.exit(1);
}
console.log('No gradients found in src/ or out/.');
