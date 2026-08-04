import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [shell, app, planning, history, today, policy, styles] = await Promise.all([
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../planning-1a.js', import.meta.url), 'utf8'),
  readFile(new URL('../history-1b.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8'),
]);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(history, /today-1c\.js\?v=1/, 'O Bloco 1C deve carregar somente depois de Histórico e Planejar.');
assert.match(policy, /"today-1c\.js"/, 'O módulo do Bloco 1C deve participar da prova publicada.');

for (const retainedId of ['kpiGrossDaily', 'kpiNetDaily', 'kpiKmDaily', 'monthStatusTitle', 'monthProgress', 'insightTitle']) {
  assert.match(shell, new RegExp(`id="${retainedId}"`), `Hoje deve preservar ${retainedId}.`);
}
assert.match(shell, /data-view="day"[^>]*>[^]*Registrar meu dia/, 'Registrar meu dia deve continuar acessível em Hoje.');
assert.match(shell, /data-secondary-view="planning"/, 'O atalho para Planejar deve continuar acessível.');

for (const sourceId of ['targetProfitDisplay', 'weekStatusTitle', 'revenueChart']) {
  assert.match(shell, new RegExp(`id="${sourceId}"`), `O fallback ${sourceId} deve permanecer no HTML.`);
  assert.match(today, new RegExp(`getElementById\('${sourceId}'\)`), `O Bloco 1C deve tratar somente a duplicação ${sourceId}.`);
}

for (const planningId of ['planningTargetInput', 'planningDaysOffInput', 'planningRevenueChart', 'planningDreGross']) {
  assert.match(planning, new RegExp(`id="${planningId}"`), `Planejar deve manter o destino ${planningId}.`);
  assert.match(today, new RegExp(`getElementById\('${planningId}'\)`), `O Bloco 1C deve validar o destino ${planningId}.`);
}
for (const historyId of ['historyAnalysisPanel', 'historyWeekStatusTitle', 'historyWeekTarget']) {
  assert.match(history, new RegExp(`id="${historyId}"`), `Histórico deve manter o destino ${historyId}.`);
  assert.match(today, new RegExp(`getElementById\('${historyId}'\)`), `O Bloco 1C deve validar o destino ${historyId}.`);
}

assert.match(today, /item\.source\.hidden = true/, 'As duplicações devem sair visualmente por atributo nativo e reversível.');
assert.match(today, /requiredDestinations\.some\(item => !item\)/, 'A retirada deve falhar de forma segura quando faltar destino.');
assert.match(today, /relocations\.some\(item => !item\.source\)/, 'A retirada deve ser atômica quando faltar uma origem.');
assert.doesNotMatch(today, /\.remove\s*\(/, 'O Bloco 1C não pode apagar fisicamente os cartões de fallback.');
assert.doesNotMatch(today, /style\.display|display\s*:\s*none|classList\.(?:add|toggle)\(['"]hidden/, 'O Bloco 1C não pode usar CSS ou classes para esconder cartões.');
assert.doesNotMatch(today, /localStorage|sessionStorage|app\.state\s*=|\.save\s*\(/, 'O Bloco 1C não pode alterar dados ou armazenamento.');
assert.doesNotMatch(styles, /block1c|today-1c|relocatedTo/, 'Nenhuma regra específica do Bloco 1C deve ser criada no CSS.');

console.log('Contrato do Bloco 1C validado: Hoje consolidado somente após destinos confirmados e com fallback preservado.');
