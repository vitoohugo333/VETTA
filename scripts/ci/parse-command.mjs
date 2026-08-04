import { readFileSync } from 'node:fs';

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
let branch = process.env.INPUT_BRANCH || '';
let mode = (process.env.INPUT_MODE || 'full').toLowerCase();
let valid = process.env.GITHUB_EVENT_NAME === 'workflow_dispatch';
let reason = '';

if (process.env.GITHUB_EVENT_NAME === 'issue_comment') {
  const body = String(event.comment?.body || '').trim();
  const match = body.match(/^\/vetta\s+test\s+([A-Za-z0-9._/-]+)(?:\s+(auto|full|published))?$/i);
  valid = event.issue?.number === 2
    && event.comment?.author_association === 'OWNER'
    && event.comment?.user?.id === 220289104
    && Boolean(match);
  if (match) {
    branch = match[1];
    mode = (match[2] || 'full').toLowerCase();
  }
  if (!valid) reason = 'issue, autor ou formato não autorizado';
}

if (!/^[A-Za-z0-9._/-]+$/.test(branch) || branch.includes('..') || branch.startsWith('/') || branch.endsWith('/')) {
  valid = false;
  reason = 'nome de branch inválido';
}
if (!['auto', 'full', 'published'].includes(mode)) {
  valid = false;
  reason = 'modo inválido';
}

console.log(`valid=${valid}`);
console.log(`branch=${branch}`);
console.log(`mode=${mode}`);
console.log(`allow_published=${mode === 'published'}`);
console.log(`reason=${reason}`);
