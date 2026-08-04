import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [planningBase, planningRefinement, loader, policy, app] = await Promise.all([
  readFile(new URL('../planning-1a.js', import.meta.url), 'utf8'),
  readFile(new URL('../planning-3.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
]);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.doesNotMatch(planningRefinement, /localStorage\.|sessionStorage\./, 'O Bloco 3 não pode criar outra persistência.');
assert.doesNotMatch(planningRefinement, /\.remove\(|removeChild\(/, 'O Bloco 3 não pode remover os recursos existentes de Planejar.');

for (const originalId of [
  'planningTargetInput',
  'planningDaysOffInput',
  'planningFuelType',
  'planningCostList',
  'planningRevenueChart',
  'planningLearningText',
  'planningResetButton',
]) {
  assert.match(planningBase, new RegExp(`id="${originalId}"`), `Planejar original deve manter ${originalId}.`);
  assert.match(planningRefinement, new RegExp(`anchorId: '${originalId}'`), `O Bloco 3 deve mapear ${originalId} para uma tela própria.`);
}

for (const section of ['goals', 'agenda', 'operation', 'costs', 'distribution', 'learning', 'advanced']) {
  assert.match(planningRefinement, new RegExp(`key: '${section}'`), `A ilha ${section} deve existir.`);
}

assert.match(planningRefinement, /data-planning-section-open/, 'As ilhas devem abrir as telas por assunto.');
assert.match(planningRefinement, /data-planning-section-back/, 'Cada assunto deve oferecer retorno para o resumo de Planejar.');
assert.match(planningRefinement, /history\.pushState[\s\S]*planningSection/, 'A navegação interna deve participar do histórico do navegador.');
assert.match(planningRefinement, /Planejar original foi preservado/, 'A ausência de estrutura obrigatória deve preservar a tela anterior.');
assert.match(planningRefinement, /app\.renderPlanning\?\.\(\)/, 'A distribuição deve ser redesenhada quando sua tela ficar visível.');

assert.match(loader, /planning-3\.js\?v=1[\s\S]*record-2\.js\?v=1/, 'O refinamento de Planejar deve carregar antes do módulo de Registro.');
assert.match(policy, /"planning-3\.js"/, 'O arquivo do Bloco 3 deve participar da prova publicada.');

console.log('Contrato do Bloco 3 validado: Planejar curto, telas por assunto, dados e recursos preservados.');
