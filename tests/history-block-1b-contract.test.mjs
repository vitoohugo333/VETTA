import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [shell, history, app, policyText] = await Promise.all([
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../history-1b.js', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
]);
const policy = JSON.parse(policyText);

assert.match(shell, /app\.js\?v=3\.5\.1[^]*planning-1a\.js\?v=1[^]*history-1b\.js\?v=1/, 'Histórico 1B deve carregar depois do aplicativo e de Planejar.');
assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');

for (const originalId of ['weekStatusTitle', 'weekStatusPill', 'weekStatusText', 'weekTarget', 'weekActual', 'weekRevenueKm']) {
  assert.match(shell, new RegExp(`id="${originalId}"`), `A análise semanal original ${originalId} deve continuar em Início.`);
}

for (const historyId of [
  'historyDaysTab', 'historyAnalysisTab', 'historyDaysPanel', 'historyAnalysisPanel',
  'historyCount', 'historyList', 'historyDays', 'historyRevenueKm', 'historyNet',
  'historyWeekStatusTitle', 'historyWeekStatusPill', 'historyWeekStatusText',
  'historyWeekTarget', 'historyWeekActual', 'historyWeekRevenueKm', 'historyChart', 'historyInsight',
]) {
  assert.match(history, new RegExp(`id="${historyId}"`), `Histórico deve conter ${historyId}.`);
}

assert.match(history, /let activeTab = 'days'/, 'Histórico deve abrir em Dias.');
assert.match(history, /Comparação entre dias/, 'A comparação deve ter destino explícito em Análise.');
assert.match(history, /análise semanal continua também em Início/, 'A transição deve declarar que a semana original permanece.');
assert.doesNotMatch(history, /localStorage|STORAGE_KEY/, 'A divisão interna não deve criar estado persistido novo.');
assert.doesNotMatch(history, /remove\(\)[^\n]*(view-dashboard|weekStatus)|display\s*:\s*none[^\n]*(view-dashboard|weekStatus)/, 'O módulo não pode remover nem ocultar a análise semanal de Início.');

const declaredIds = [...history.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(declaredIds).size, declaredIds.length, 'O módulo Histórico não pode declarar IDs duplicados.');
assert.ok(policy.published.verifyFiles.includes('history-1b.js'), 'O GitHub Pages deve provar o arquivo history-1b.js.');

console.log('Contrato do Bloco 1B validado: Dias e Análise separados, semana original preservada e sem novo estado persistido.');
