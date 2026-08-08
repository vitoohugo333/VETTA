import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [dashboard,main,model,policyText,serviceWorker]=await Promise.all([
  readFile(new URL('../ui/screens/dashboard.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/main.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/model.js',import.meta.url),'utf8'),
  readFile(new URL('../ci/branch-policy.json',import.meta.url),'utf8'),
  readFile(new URL('../sw.js',import.meta.url),'utf8'),
]);
const policy=JSON.parse(policyText);
assert.match(model,/vetta-driver-intelligence-v3/);
for(const id of ['r360NowHero','r1NextAction','r1NextActionTitle','r1NextActionText','r1PlanButton','r1HeaderPlanButton','targetProfitDisplay']) assert.match(dashboard,new RegExp(id),`Agora deve conter ${id}.`);
for(const label of ['Agora','Resultados','Registrar','Custos','Mais']) assert.match(dashboard,new RegExp(`'${label}'`));
assert.match(dashboard,/Sem meta|FALTA META/,'Meta zero deve ter estado explícito.');
assert.match(dashboard,/Registre seu primeiro dia|Registrar/,'Sem registros deve orientar registro.');
assert.match(main,/openPlan/,'Plano deve abrir em um toque.');
assert.match(main,/openResults/,'Ritmo deve poder aprofundar em Resultados.');
assert.doesNotMatch(dashboard,/localStorage|sessionStorage|\.save\(/,'Agora não deve gravar dados diretamente.');
assert.doesNotMatch(serviceWorker,/r1NextAction|r1PlanButton/);
assert.ok(policy.published.verifyFiles.includes('ui/screens/dashboard.js'));
console.log('Contrato Agora premium validado.');
