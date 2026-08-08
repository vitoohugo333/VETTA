import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [shell, results, model, store, policyText] = await Promise.all([
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../ui/screens/results.js', import.meta.url), 'utf8'),
  readFile(new URL('../ui/model.js', import.meta.url), 'utf8'),
  readFile(new URL('../ui/store.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
]);
const policy = JSON.parse(policyText);

assert.match(shell, /\.\/ui\/main\.js/, 'O shell deve carregar uma única autoridade premium.');
assert.match(model, /vetta-driver-intelligence-v3/, 'A chave dos dados locais deve permanecer intacta.');
for (const id of ['r360ResultsOverview','r360ResultsHero','r360ResultsMetrics','r360ResultsReading','r360ResultsDeepDive','historyCount','historyList','historyWeekStatusTitle','historyWeekTarget','historyChart','historyInsight']) assert.match(results,new RegExp(id),`Resultados deve preservar a capacidade ${id}.`);
assert.match(results,/data-r360-period="week"/);assert.match(results,/data-r360-period="month"/);
for (const key of ['days','summary','week','comparison']) assert.match(results,new RegExp(`historySection==='${key}'`),`Resultados deve possuir ${key}.`);
assert.match(store,/history\.pushState/,'A navegação aprofundada deve participar do histórico do navegador.');
assert.doesNotMatch(results,/localStorage|STORAGE_KEY/,'A tela não deve criar outra persistência financeira.');
assert.ok(policy.published.verifyFiles.includes('ui/screens/results.js'));
console.log('Contrato Histórico validado na autoridade premium.');
