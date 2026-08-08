import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const planning = await readFile(new URL('../ui/screens/planning.js', import.meta.url), 'utf8');
const main = await readFile(new URL('../ui/main.js', import.meta.url), 'utf8');
const store = await readFile(new URL('../ui/store.js', import.meta.url), 'utf8');
const model = await readFile(new URL('../ui/model.js', import.meta.url), 'utf8');
const policy = JSON.parse(await readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'));

assert.match(model, /vetta-driver-intelligence-v3/);
for (const section of ['goals','agenda','costs','operation']) assert.match(planning, new RegExp(`planningSection\\s*===\\s*'${section}'`), `Plano deve possuir ${section}.`);
for (const section of ['distribution','learning','advanced']) assert.match(planning, new RegExp(`planningSection\\s*===\\s*'${section}'`), `${section} deve existir sob demanda.`);
assert.ok(planning.includes('Quatro decisões formam seu plano'));
assert.ok(planning.includes('data-planning-core'));
assert.ok(planning.includes('planningSecondary'));
assert.ok(planning.includes('planningStatus-'));
assert.ok(main.includes("view==='costs'"));
assert.ok(store.includes('history.pushState'));
assert.ok(policy.published.verifyFiles.includes('ui/screens/planning.js'));
console.log('Contrato de Planejamento premium validado.');
