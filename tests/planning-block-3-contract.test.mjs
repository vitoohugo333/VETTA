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
assert.doesNotMatch(planningRefinement, /localStorage\.|sessionStorage\./, 'O Plano não pode criar outra persistência.');
assert.doesNotMatch(planningRefinement, /\.remove\(|removeChild\(/, 'O Plano não pode apagar os recursos funcionais existentes.');

for (const originalId of ['planningTargetInput','planningDaysOffInput','planningFuelType','planningCostList','planningRevenueChart','planningLearningText','planningResetButton']) {
  assert.match(planningBase, new RegExp(`id="${originalId}"`), `A base deve manter ${originalId}.`);
  assert.match(planningRefinement, new RegExp(`anchorId: '${originalId}'`), `R1 deve reaproveitar ${originalId}.`);
}

for (const section of ['goals', 'agenda', 'costs', 'operation']) {
  assert.match(planningRefinement, new RegExp(`key: '${section}'[^\n]*core: true`), `A decisão essencial ${section} deve fazer parte da sequência principal.`);
}
for (const section of ['distribution', 'learning', 'advanced']) {
  assert.match(planningRefinement, new RegExp(`key: '${section}'[^\n]*core: false`), `${section} deve existir sem competir com o essencial.`);
}

assert.match(planningRefinement, /Quatro decisões formam seu plano/, 'Planejamento deve explicar a sequência, não perguntar por um menu de assuntos.');
assert.doesNotMatch(planningRefinement, /O que você quer planejar\?/, 'O diretório antigo não pode continuar sendo a arquitetura principal.');
assert.doesNotMatch(planningRefinement, />BLOCO 3</, 'Linguagem técnica de implementação não pode aparecer ao motorista.');
assert.match(planningRefinement, /data-planning-core/, 'As quatro decisões essenciais devem formar uma lista contínua.');
assert.match(planningRefinement, /id="planningSecondary"/, 'Análises e opções devem ficar disponíveis sob demanda.');
assert.match(planningRefinement, /planningStatus-goals/, 'O Plano deve informar se a meta está definida.');
assert.match(planningRefinement, /target <= 0 \? 'missing-target' : 'active'/, 'O Plano deve expor estado incompleto de meta.');
assert.match(planningRefinement, /view === 'costs'[\s\S]*planningSection: 'costs'/, 'Custos deve abrir diretamente sua seção.');
assert.match(planningRefinement, /history\.pushState[\s\S]*planningSection/, 'Navegação interna deve participar do histórico do navegador.');
assert.match(planningRefinement, /app\.renderPlanning\?\.\(\)/, 'Conteúdo calculado deve ser atualizado quando a seção abre.');
assert.match(loader, /planning-3\.js\?v=1[\s\S]*record-2\.js\?v=1/, 'O Plano guiado deve carregar antes do módulo de Registro.');
assert.match(policy, /"planning-3\.js"/, 'O Plano deve participar da prova publicada.');

console.log('Contrato R1 Planejamento validado: quatro decisões essenciais, análises secundárias e Custos direto.');
