import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [planning,model]=await Promise.all([
  readFile(new URL('../ui/screens/planning.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/model.js',import.meta.url),'utf8'),
]);
assert.match(model,/vetta-driver-intelligence-v3/);
for(const id of ['planningTargetInput','planningDaysOff','planningFuelType','planningCostList','planningRevenueChart','planningLearningText']) assert.match(planning,new RegExp(id),`Plano deve conter ${id}.`);
assert.match(planning,/Quatro decisões formam seu plano/);
assert.match(planning,/Objetivo/);assert.match(planning,/Agenda/);assert.match(planning,/Dinheiro comprometido/);assert.match(planning,/Operação/);
assert.match(planning,/planningSecondary/,'Análises devem ficar sob demanda.');
assert.doesNotMatch(planning,/localStorage|sessionStorage|STORAGE_KEY/,'Tela de Plano não deve criar persistência financeira paralela.');
console.log('Contrato base do Plano premium validado.');
