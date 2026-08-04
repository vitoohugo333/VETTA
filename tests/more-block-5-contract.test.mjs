import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, shell, more5, today, policyText] = await Promise.all([
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../more-5.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
]);
const policy = JSON.parse(policyText);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(app, /id="appVersionLabel"/, 'O aplicativo deve continuar criando a etiqueta original de versão.');
assert.match(today, /more-5\.js\?v=1/, 'O Bloco 5 deve carregar pela cadeia validada da interface.');
assert.ok(policy.published.verifyFiles.includes('more-5.js'), 'O GitHub Pages deve provar o arquivo more-5.js.');

for (const legacyId of [
  'compareDetails', 'compareGasPrice', 'compareGasEff', 'compareGnvPrice', 'compareGnvEff',
  'compareChart', 'applyGasButton', 'applyGnvButton', 'projectedSaving',
  'reportButton', 'exportButton', 'importInput', 'addEventButton', 'eventList',
  'installCardButton', 'installModal',
]) {
  assert.match(shell, new RegExp(`id="${legacyId}"`), `A interface anterior deve preservar ${legacyId}.`);
}

for (const consumer of [
  'compareDetails', 'reportButton', 'exportButton', 'importInput',
  'addEventButton', 'eventList', 'installCardButton', 'appVersionLabel',
]) {
  assert.ok(
    more5.includes(`$('${consumer}')`) || more5.includes(`getElementById('${consumer}')`),
    `O Bloco 5 deve localizar o recurso original ${consumer}.`,
  );
}

for (const key of ['tools', 'reports', 'data', 'radar', 'app']) {
  assert.match(more5, new RegExp(`key: '${key}'`), `Mais deve declarar a área ${key}.`);
}

assert.match(more5, /id = 'moreHub'/, 'Mais deve ter um resumo curto.');
assert.match(more5, /O que você quer fazer\?/, 'O resumo deve orientar a escolha do usuário.');
assert.match(more5, /morePage-\$\{definition\.key\}/, 'As áreas devem abrir em páginas próprias.');
assert.match(more5, /Voltar para Mais/, 'Cada área deve oferecer retorno visível.');
assert.match(more5, /moreSection: key/, 'O histórico do navegador deve registrar a área aberta.');
assert.match(more5, /history\.state\?\.moreSection/, 'O botão Voltar deve restaurar o resumo.');
assert.match(more5, /Mais anterior foi preservado/, 'A ausência de um destino deve preservar a interface anterior.');
assert.doesNotMatch(more5, /id="appVersionLabel"/, 'O Bloco 5 não pode duplicar a etiqueta original da versão.');
assert.doesNotMatch(more5, /localStorage|sessionStorage|STORAGE_KEY|app\.state\s*=|\.save\s*\(/, 'O Bloco 5 não pode criar armazenamento nem alterar dados diretamente.');
assert.doesNotMatch(more5, /\.remove\s*\(/, 'O Bloco 5 não pode apagar os recursos anteriores.');

const declaredIds = [...more5.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(declaredIds).size, declaredIds.length, 'O módulo Mais 5 não pode declarar IDs estáticos duplicados.');

console.log('Contrato do Bloco 5 validado: Mais curto, cinco destinos, mesmos recursos e fallback preservado.');
