import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [results,model,store,policyText]=await Promise.all([
  readFile(new URL('../ui/screens/results.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/model.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/store.js',import.meta.url),'utf8'),
  readFile(new URL('../ci/branch-policy.json',import.meta.url),'utf8'),
]);
const policy=JSON.parse(policyText);
assert.match(model,/vetta-driver-intelligence-v3/);
for(const key of ['days','summary','week','comparison']) assert.match(results,new RegExp(`historySection==='${key}'`),`Histórico deve declarar ${key}.`);
assert.match(results,/id="historyHub"/);
assert.match(results,/O que formou este resultado/);
assert.match(results,/data-history-section-back/);
assert.match(store,/popstate/,'Voltar do navegador deve restaurar contexto.');
assert.doesNotMatch(results,/localStorage|sessionStorage|\.save\(/,'A apresentação de Resultados não deve escrever dados.');
assert.ok(policy.published.verifyFiles.includes('ui/screens/results.js'));
console.log('Contrato de aprofundamento de Resultados validado.');
