import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

const root = resolve(process.argv[2] || '.');
const output = resolve(root, '_site');
const excluded = new Set(['.git', '.github', 'node_modules', '_site', 'playwright-report', 'test-results']);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (excluded.has(entry.name)) continue;
  await cp(resolve(root, entry.name), resolve(output, entry.name), { recursive: true });
}

const commit = process.env.VETTA_EXPECTED_COMMIT || process.env.GITHUB_SHA || '';
const branch = process.env.VETTA_TARGET_BRANCH || process.env.GITHUB_REF_NAME || '';
await mkdir(resolve(output, '.well-known'), { recursive: true });
await writeFile(
  resolve(output, '.well-known/vetta-deploy.json'),
  `${JSON.stringify({ commit, branch, generatedAt: new Date().toISOString() })}\n`,
  'utf8',
);

console.log(`Site temporário preparado em ${basename(output)} para ${branch || 'branch não informada'}.`);
