import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const policyPath = resolve(root, 'ci/branch-policy.json');
let policy = {
  schema: 1,
  app: false,
  branch: '',
  role: 'unknown',
  published: null,
};

if (existsSync(policyPath)) {
  policy = JSON.parse(readFileSync(policyPath, 'utf8'));
}

const output = {
  app: Boolean(policy.app),
  branch: String(policy.branch || ''),
  role: String(policy.role || 'unknown'),
  published_url: String(policy.published?.url || ''),
  published_type: String(policy.published?.type || ''),
  published_auth: String(policy.published?.authentication || 'none'),
  verify_files: JSON.stringify(policy.published?.verifyFiles || []),
};

for (const [key, value] of Object.entries(output)) {
  process.stdout.write(`${key}=${String(value)}\n`);
}
