import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [shell, planning, app] = await Promise.all([
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../planning-1a.js', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
]);

assert.match(shell, /app\.js\?v=3\.5\.1[^]*planning-1a\.js\?v=1/, 'Planejar deve carregar depois do aplicativo principal.');
assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');

for (const originalId of ['revenueChart', 'targetProfitDisplay', 'weekStatusTitle', 'fuelType', 'costList', 'learningCard', 'resetButton']) {
  assert.match(shell, new RegExp(`id="${originalId}"`), `O elemento original ${originalId} deve continuar disponível.`);
}

for (const planningId of ['planningTargetInput', 'planningDaysOffInput', 'planningFuelType', 'planningCostList', 'planningRevenueChart', 'planningLearningActions', 'planningResetButton']) {
  assert.match(planning, new RegExp(`id="${planningId}"`), `Planejar deve conter ${planningId}.`);
}

assert.match(planning, /Início e Ajustes continuam completos/, 'A transição deve declarar que os destinos antigos permanecem.');
assert.doesNotMatch(planning, /display\s*:\s*none[^\n]*(view-dashboard|view-settings)|remove\(\)[^\n]*(view-dashboard|view-settings)/, 'O módulo não pode ocultar ou remover Início e Ajustes.');

const declaredIds = [...planning.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(declaredIds).size, declaredIds.length, 'O módulo Planejar não pode declarar IDs duplicados.');

console.log('Contrato do Bloco 1A validado: Planejar completo, gráfico visível e áreas originais preservadas.');
