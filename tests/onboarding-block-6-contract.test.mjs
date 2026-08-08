import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [onboarding,main,model,policyText]=await Promise.all([
  readFile(new URL('../ui/screens/onboarding.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/main.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/model.js',import.meta.url),'utf8'),
  readFile(new URL('../ci/branch-policy.json',import.meta.url),'utf8'),
]);
const policy=JSON.parse(policyText);
assert.match(model,/vetta-driver-intelligence-v3/);
assert.match(model,/onboardingComplete:\s*false/);
assert.match(onboarding,/1 de 3|\$\{step\} de 3/,'Onboarding deve comunicar três etapas.');
for(const vehicle of ['own','financed','rental']) assert.match(onboarding,new RegExp(`'${vehicle}'`),`Onboarding deve tratar ${vehicle}.`);
for(const id of ['onboardingModal','onboardingProgress','onboardingTarget','onboardingFuelType','onboardingFuelPrice','onboardingFuelEff','onboardingRevenue','onboardingBack','onboardingNext']) assert.match(onboarding,new RegExp(id),`Onboarding deve conter ${id}.`);
assert.match(main,/model\.state\.onboardingComplete\s*=\s*true/,'Conclusão deve usar o estado financeiro único.');
assert.match(main,/id:\s*'r360-rental'[^]*kind:\s*'weekly'/,'Carro alugado deve criar obrigação semanal explícita.');
assert.match(main,/saveOnboardingDraft|clearOnboardingDraft/,'Interrupção deve preservar rascunho sem criar outra base financeira.');
assert.ok(policy.published.verifyFiles.includes('ui/screens/onboarding.js'));
console.log('Contrato de onboarding premium validado.');
