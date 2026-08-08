import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [more,main,model,policyText]=await Promise.all([
  readFile(new URL('../ui/screens/more.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/main.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/model.js',import.meta.url),'utf8'),
  readFile(new URL('../ci/branch-policy.json',import.meta.url),'utf8'),
]);
const policy=JSON.parse(policyText);
assert.match(model,/vetta-driver-intelligence-v3/);
for(const key of ['tools','reports','data','radar','app']) assert.match(more,new RegExp(`moreSection==='${key}'`),`Mais deve declarar ${key}.`);
for(const id of ['compareDetails','reportButton','exportButton','importInput','addEventButton','eventList','installCardButton','installModal']) assert.match(more,new RegExp(id),`Mais deve preservar ${id}.`);
assert.match(more,/Tudo que não precisa disputar sua rotina/);
assert.match(main,/data-more-section-open/);
assert.match(main,/data-more-section-back/);
assert.match(main,/importCandidate/,'Importação deve possuir etapa de revisão antes de substituir dados.');
assert.doesNotMatch(more,/localStorage|sessionStorage|STORAGE_KEY/,'A tela Mais não deve criar persistência financeira paralela.');
assert.ok(policy.published.verifyFiles.includes('ui/screens/more.js'));
console.log('Contrato Mais validado na autoridade premium.');
