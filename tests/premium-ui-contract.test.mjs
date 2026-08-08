import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const shell = readFileSync('app-shell.html','utf8');
const main = readFileSync('ui/main.js','utf8');
const context = readFileSync('ui/context.js','utf8');
const store = readFileSync('ui/store.js','utf8');
const css = readFileSync('ui/premium.css','utf8');
const sw = readFileSync('sw.js','utf8');
const manifest = JSON.parse(readFileSync('manifest.webmanifest','utf8'));
const dashboard = readFileSync('ui/screens/dashboard.js','utf8');
const planning = readFileSync('ui/screens/planning.js','utf8');
const record = readFileSync('ui/screens/record.js','utf8');
const results = readFileSync('ui/screens/results.js','utf8');
const more = readFileSync('ui/screens/more.js','utf8');
const onboarding = readFileSync('ui/screens/onboarding.js','utf8');

assert.ok(shell.includes('./ui/main.js'));
assert.ok(shell.includes('./ui/premium.css'));
for (const legacy of ['app.js','refactor-360.js','planning-1a.js','today-1c.js','record-2.js']) assert.ok(!shell.includes(legacy), `shell ativo não pode carregar ${legacy}`);
assert.ok(!shell.includes('tailwindcss.com'), 'shell premium não depende de Tailwind runtime');
assert.ok(!shell.includes('chart.js'), 'shell premium não depende de Chart.js');
assert.ok(main.includes("document.body.dataset.uiAuthority='premium-v1'"));
assert.ok(main.includes('setRenderCallback(render)'));
assert.ok(!main.includes('MutationObserver'));
assert.ok(!main.includes('setInterval('));
assert.ok(context.includes("vetta-driver-intelligence-v3"));
assert.ok(store.includes('history.pushState'));
assert.ok(store.includes('popstate'));
assert.ok(dashboard.includes('Agora |') || dashboard.includes('r360NowHero'));
assert.ok(planning.includes('Quatro decisões formam seu plano'));
assert.ok(planning.includes('A matemática do custo'));
assert.ok(record.includes('Prévia antes de salvar'));
assert.ok(results.includes('O que formou este resultado'));
assert.ok(more.includes('Tudo que não precisa disputar sua rotina'));
assert.ok(onboarding.includes('1') && onboarding.includes('3'));
assert.ok(css.includes('@media (min-width:840px)'));
assert.ok(css.includes('prefers-reduced-motion'));
assert.equal(manifest.short_name,'VETTA');
assert.equal(manifest.start_url,'./app-shell.html');
assert.ok(sw.includes("vetta-premium-ui-1"));
assert.ok(sw.includes("'./ui/main.js'"));
assert.ok(!sw.includes('refactor-360.js'));
assert.ok(sw.includes('HAD_ACTIVE_WORKER'));

const memory = new Map();
globalThis.localStorage = {
  getItem:key => memory.has(key) ? memory.get(key) : null,
  setItem:(key,value) => memory.set(key,String(value)),
  removeItem:key => memory.delete(key),
};
const { VettaModel, STORAGE_KEY } = await import('../ui/model.js');
const model = new VettaModel();
model.state.onboardingComplete = true;
model.state.targetProfit = 4000;
model.state.costs = [{id:'rent',name:'Aluguel',kind:'monthly',category:'obligation',value:650,active:true,paidPeriods:[]}];
model.save();
const before = { monthly:model.costContext().monthlyFixed, projected:model.calculations().projectedNet };
model.setPaid(model.state.costs[0],true);
const paid = { monthly:model.costContext().monthlyFixed, projected:model.calculations().projectedNet };
assert.deepEqual(paid,before,'marcar pago não pode retirar custo da matemática');
let saved=model.saveRecord({date:'2026-08-08',gross:450,km:180,hours:8,fuelSpend:50});
assert.equal(saved.ok,true);assert.equal(model.state.records.length,1);
saved=model.saveRecord({date:'2026-08-08',gross:500,km:185,hours:8,fuelSpend:52});
assert.equal(saved.updated,true);assert.equal(model.state.records.length,1,'mesma data atualiza, não duplica');
model.state.targetProfit=0;model.save();
const restored=new VettaModel();
assert.equal(restored.state.targetProfit,0,'meta zero deve continuar não configurada');
assert.ok(memory.get(STORAGE_KEY));

console.log('Premium UI contract passed');
