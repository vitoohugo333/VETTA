import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(process.argv[2] || '.');
const canonicalRoot = process.argv[3] ? resolve(process.argv[3]) : null;
const excludedDirectories = new Set(['.git', 'node_modules', '_site', 'playwright-report', 'test-results']);
const canonicalFiles = ['AGENTS.md', 'SKILLS.md', 'TESTING_RULES.md', 'PWA_RULES.md', 'LEARNING_RULES.md', 'START_HERE.md'];

function walk(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(absolute));
    else result.push(absolute);
  }
  return result;
}

function run(command, args, cwd = root) {
  console.log(`> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: process.env });
  if (result.status !== 0) {
    throw new Error(`Comando falhou com código ${result.status}: ${command} ${args.join(' ')}`);
  }
}

for (const file of canonicalFiles) {
  const target = resolve(root, file);
  assert.ok(existsSync(target), `Arquivo canônico ausente: ${file}`);
  const content = readFileSync(target, 'utf8');
  assert.ok(content.includes('VETTA_GOVERNANCE_VERSION: 2026-08-03.2'), `Versão de governança inválida em ${file}`);
  if (canonicalRoot) {
    const canonical = resolve(canonicalRoot, file);
    assert.ok(existsSync(canonical), `Arquivo canônico ausente na main: ${file}`);
    assert.equal(content, readFileSync(canonical, 'utf8'), `${file} divergiu da versão canônica da main`);
  }
}

const projectState = resolve(root, 'PROJECT_STATE.md');
assert.ok(existsSync(projectState), 'PROJECT_STATE.md ausente');
for (const heading of ['Estado', 'Próximo passo']) {
  assert.ok(readFileSync(projectState, 'utf8').includes(heading), `PROJECT_STATE.md não contém ${heading}`);
}

const policyPath = resolve(root, 'ci/branch-policy.json');
assert.ok(existsSync(policyPath), 'ci/branch-policy.json ausente');
const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
assert.equal(policy.schema, 1, 'schema de ci/branch-policy.json inválido');
assert.equal(typeof policy.app, 'boolean', 'policy.app deve ser booleano');
assert.match(String(policy.branch || ''), /^[A-Za-z0-9._/-]+$/, 'branch inválida na política');

if (policy.app) {
  assert.ok(existsSync(resolve(root, '.github/workflows/ci-autonomous.yml')), 'workflow autônomo ausente');
  assert.ok(existsSync(resolve(root, 'package.json')), 'package.json ausente em branch de aplicativo');
}

const files = walk(root);
for (const file of files.filter(file => /\.(?:js|mjs)$/.test(file))) {
  run(process.execPath, ['--check', file]);
}
for (const file of files.filter(file => /\.json$/.test(file))) {
  JSON.parse(readFileSync(file, 'utf8'));
}

const tests = files
  .filter(file => /tests\/.*\.test\.mjs$/.test(relative(root, file).replaceAll('\\', '/')))
  .sort();
for (const test of tests) {
  run(process.execPath, [test]);
}

const forbiddenSecretPatterns = [
  /gh[pousr]_[A-Za-z0-9]{20,}/g,
  /github_pat_[A-Za-z0-9_]{20,}/g,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g,
];
for (const file of files.filter(file => /\.(?:md|yml|yaml|js|mjs|json|toml)$/.test(file))) {
  const content = readFileSync(file, 'utf8');
  for (const pattern of forbiddenSecretPatterns) {
    assert.equal(pattern.test(content), false, `Possível segredo em texto claro: ${relative(root, file)}`);
    pattern.lastIndex = 0;
  }
}

console.log(`Verificação determinística concluída: ${tests.length} testes encontrados e executados.`);
