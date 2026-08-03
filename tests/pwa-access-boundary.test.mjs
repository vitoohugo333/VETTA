import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const netlify = readFileSync('netlify.toml', 'utf8');
const manifest = JSON.parse(readFileSync('manifest.webmanifest', 'utf8'));
const worker = readFileSync('sw.js', 'utf8');

const publicPwaPaths = [
  '/manifest.webmanifest',
  '/sw.js',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

assert.ok(netlify.includes('path = "/*"'), 'a barreira deve continuar protegendo o restante do site');
assert.ok(netlify.includes('function = "calculaae-access-gate"'), 'a barreira de acesso deve continuar ativa');
for (const path of publicPwaPaths) {
  assert.ok(netlify.includes(`"${path}"`), `${path} deve ficar fora da barreira de senha`);
}

assert.equal(manifest.id, './');
assert.equal(manifest.start_url, './app-shell.html');
assert.equal(manifest.scope, './');
assert.equal(manifest.display, 'standalone');
for (const asset of ['./manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png']) {
  assert.ok(worker.includes(`'${asset}'`), `${asset} deve permanecer no cache do PWA`);
}

assert.ok(existsSync('SKILLS.md'), 'SKILLS.md deve existir');
const skills = readFileSync('SKILLS.md', 'utf8');
assert.ok(skills.includes('PWA_RULES.md'));
assert.ok(skills.includes('Sincronização remota'));

assert.ok(existsSync('PWA_RULES.md'), 'PWA_RULES.md deve existir');
const pwaRules = readFileSync('PWA_RULES.md', 'utf8');
assert.ok(pwaRules.includes('PWA protegido por acesso'));
assert.ok(pwaRules.includes('/manifest.webmanifest'));
assert.ok(pwaRules.includes('/sw.js'));

console.log('PWA access boundary contract passed');
