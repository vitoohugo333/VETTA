import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, history1b, history4, today, policyText] = await Promise.all([
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../history-1b.js', import.meta.url), 'utf8'),
  readFile(new URL('../history-4.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
]);
const policy = JSON.parse(policyText);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(today, /history-4\.js\?v=1/, 'O Bloco 4 deve carregar pela cadeia validada da interface.');
assert.ok(policy.published.verifyFiles.includes('history-4.js'), 'O GitHub Pages deve provar o arquivo history-4.js.');

for (const legacyId of [
  'historyDaysTab', 'historyAnalysisTab', 'historyDaysPanel', 'historyAnalysisPanel',
  'historyCount', 'historyList', 'historyDays', 'historyRevenueKm', 'historyNet',
  'historyWeekStatusTitle', 'historyWeekStatusPill', 'historyWeekStatusText',
  'historyWeekTarget', 'historyWeekActual', 'historyWeekRevenueKm', 'historyChart', 'historyInsight',
]) {
  assert.match(history1b, new RegExp(`id="${legacyId}"`), `O fallback anterior deve preservar ${legacyId}.`);
  assert.ok(history4.includes(`$('${legacyId}')`) || history4.includes(`getElementById('${legacyId}')`), `O Bloco 4 deve reutilizar ${legacyId}.`);
}

for (const key of ['days', 'summary', 'week', 'comparison']) {
  assert.match(history4, new RegExp(`key: '${key}'`), `Histórico deve declarar a área ${key}.`);
  assert.match(history4, new RegExp(`historyPage-\\$\\{definition\\.key\\}`), 'As áreas devem abrir em páginas próprias.');
}

assert.match(history4, /id = 'historyHub'/, 'Histórico deve ter um resumo curto.');
assert.match(history4, /O que você quer consultar\?/, 'O resumo deve orientar a escolha do usuário.');
assert.match(history4, /Voltar para Histórico/, 'Cada área deve oferecer retorno visível.');
assert.match(history4, /historySection: key/, 'O histórico do navegador deve registrar a área aberta.');
assert.match(history4, /history\.state\?\.historySection/, 'O botão Voltar deve restaurar o resumo.');
assert.match(history4, /Histórico anterior foi preservado/, 'A ausência de um destino deve preservar a interface anterior.');
assert.doesNotMatch(history4, /localStorage|sessionStorage|STORAGE_KEY|app\.state\s*=|\.save\s*\(/, 'O Bloco 4 não pode criar armazenamento nem alterar dados.');
assert.doesNotMatch(history4, /\.remove\s*\(/, 'O Bloco 4 não pode apagar as abas ou elementos anteriores.');

const declaredIds = [...history4.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(declaredIds).size, declaredIds.length, 'O módulo Histórico 4 não pode declarar IDs estáticos duplicados.');

console.log('Contrato do Bloco 4 validado: Histórico curto, quatro destinos, mesmos elementos e fallback preservado.');
