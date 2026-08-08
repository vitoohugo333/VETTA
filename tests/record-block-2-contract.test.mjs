import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [record, main, modelSource, sw, policyText] = await Promise.all([
  readFile(new URL('../ui/screens/record.js', import.meta.url), 'utf8'),
  readFile(new URL('../ui/main.js', import.meta.url), 'utf8'),
  readFile(new URL('../ui/model.js', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
]);
const policy = JSON.parse(policyText);
for (const id of ['recordDate','recordGross','recordKm','recordHours','recordFuel','previewCost','previewNet','saveDayButton']) assert.match(record,new RegExp(id),`${id} deve permanecer disponível.`);
assert.match(record,/recordOptionalDetails/);assert.match(record,/Você pode salvar sem preencher esta parte/);assert.match(record,/recordConfirmation/);assert.match(record,/recordDoneButton/);assert.match(record,/recordEditButton/);assert.match(record,/Prévia antes de salvar/);
assert.match(modelSource,/vetta-driver-intelligence-v3/);assert.match(modelSource,/findIndex\(record => record\.date === draft\.date\)/);assert.match(modelSource,/this\.state\.records\[index\]/);assert.match(main,/saveRecord\(recordValuesFromDom\(\)\)/);
assert.match(main,/saveRecordDraft/,'Rascunho deve sobreviver a interrupção.');
assert.doesNotMatch(record,/localStorage|sessionStorage/,'Tela Registrar não deve criar base financeira paralela.');
assert.ok(sw.includes("'./ui/screens/record.js'"));assert.doesNotMatch(sw,/recordGross|state\.records|findIndex\(record/);
assert.ok(policy.published.verifyFiles.includes('ui/screens/record.js'));
console.log('Contrato Registrar premium validado.');
