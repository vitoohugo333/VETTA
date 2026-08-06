import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, shell, onboarding6, today, policyText] = await Promise.all([
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../onboarding-6.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
]);
const policy = JSON.parse(policyText);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(app, /onboardingComplete: false/, 'O estado novo deve continuar iniciando com onboarding pendente.');
assert.match(app, /if \(this\.state\.onboardingComplete\) return;/, 'Usuários existentes não podem receber o onboarding novamente.');
assert.match(app, /this\.state\.onboardingComplete = true/, 'A conclusão deve continuar usando o estado original.');
assert.match(today, /onboarding-6\.js\?v=1/, 'O Bloco 6 deve carregar pela cadeia modular validada.');
assert.ok(policy.published.verifyFiles.includes('onboarding-6.js'), 'O GitHub Pages deve provar o arquivo onboarding-6.js.');

for (const id of [
  'onboardingModal', 'onboardingTitle', 'onboardingProgress', 'onboardingBar',
  'onboardingStep1', 'onboardingStep2', 'onboardingStep3', 'onboardingTarget',
  'onboardingFuelType', 'onboardingFuelPrice', 'onboardingFuelEff',
  'onboardingRevenue', 'onboardingFixed', 'onboardingBack', 'onboardingNext',
]) {
  assert.match(shell, new RegExp(`id="${id}"`), `O onboarding anterior deve preservar ${id}.`);
  assert.ok(
    onboarding6.includes(`$('${id}')`) || onboarding6.includes(`getElementById('${id}')`),
    `O Bloco 6 deve reutilizar o elemento original ${id}.`,
  );
}

for (const text of [
  'Qual é sua meta líquida?',
  'Qual combustível entra nas metas?',
  'Vamos conferir seu planejamento',
  'Quanto costuma faturar por km',
  'Montar minha meta',
  'Contas mensais serão adicionadas depois em Planejar',
  'Depois, adicione contas e outras reservas em Planejar',
]) {
  assert.ok(onboarding6.includes(text), `O Bloco 6 deve conter a orientação: ${text}`);
}

assert.match(onboarding6, /const INITIAL_REVENUE_PER_KM = 1\.75/, 'A estimativa inicial deve ser R$ 1,75 por km.');
assert.match(onboarding6, /fixedInput\.value = '0'/, 'O onboarding deve zerar o custo mensal antigo.');
assert.match(onboarding6, /fixedWrap\.hidden = true/, 'O campo de contas mensais não deve aparecer no onboarding.');
assert.match(onboarding6, /Planejar → Custos e reservas/, 'O destino das contas deve ficar documentado no próprio módulo.');
assert.doesNotMatch(onboarding6, /Contas mensais iniciais:/, 'O resumo não pode apresentar contas mensais iniciais.');
assert.doesNotMatch(onboarding6, /Contas mensais pagas com o trabalho/, 'O onboarding não deve pedir contas mensais.');

assert.match(onboarding6, /onboarding anterior preservado/, 'A ausência de elementos obrigatórios deve preservar o fluxo anterior.');
assert.match(onboarding6, /baseRenderOnboardingStep/, 'O Bloco 6 deve estender a renderização existente, não criar uma segunda lógica de etapas.');
assert.match(onboarding6, /basePrepareOnboarding/, 'O Bloco 6 deve preservar a decisão original de quando abrir o onboarding.');
assert.doesNotMatch(onboarding6, /localStorage|sessionStorage|STORAGE_KEY/, 'O Bloco 6 não pode criar outra persistência.');
assert.doesNotMatch(onboarding6, /app\.state\s*=|\.save\s*\(|\.remove\s*\(/, 'O Bloco 6 não pode salvar, substituir estado ou apagar elementos diretamente.');
assert.doesNotMatch(onboarding6, /onboardingComplete\s*=/, 'O módulo de linguagem não pode controlar a conclusão do onboarding.');

const staticIds = [...onboarding6.matchAll(/\.id = '([^']+)'/g)].map(match => match[1]);
assert.equal(new Set(staticIds).size, staticIds.length, 'O Bloco 6 não pode declarar IDs estáticos duplicados.');

console.log('Contrato do Bloco 6 validado: meta inicial simples, R$ 1,75/km, contas em Planejar e origem única preservada.');
