import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [dashboard,main,store,model,serviceWorker]=await Promise.all([
  readFile(new URL('../ui/screens/dashboard.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/main.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/store.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/model.js',import.meta.url),'utf8'),
  readFile(new URL('../sw.js',import.meta.url),'utf8'),
]);
assert.match(model,/vetta-driver-intelligence-v3/);
for(const label of ['Agora','Resultados','Registrar','Custos','Mais']) assert.match(dashboard,new RegExp(`'${label}'`),`Navegação deve conter ${label}.`);
assert.match(dashboard,/r360-register-action/,'Registrar deve ter tratamento transversal central.');
assert.match(main,/view==='costs'/,'Custos deve abrir diretamente sua área financeira.');
assert.match(main,/openPlan/,'Plano deve permanecer contextual, não sexto destino.');
assert.match(store,/history\.pushState/);assert.match(store,/popstate/);
assert.doesNotMatch(dashboard,/localStorage|sessionStorage|\.save\(/,'Navegação visual não pode escrever dados.');
assert.doesNotMatch(serviceWorker,/r1NextAction|planningSection/,'Service worker deve permanecer independente da navegação.');
console.log('Contrato de navegação premium validado: quatro destinos + Registrar central.');
