import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [shell, app, today, record, styles, serviceWorker, policy] = await Promise.all([
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../record-2.js', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
]);

for (const id of ['recordDate', 'recordGross', 'recordKm', 'recordHours', 'recordFuel', 'previewCost', 'previewNet', 'saveDayButton', 'clearDayButton']) {
  assert.match(shell, new RegExp(`id="${id}"`), `${id} deve permanecer no HTML original.`);
}

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(app, /findIndex\(record => record\.date === draft\.date\)/, 'A gravação deve continuar procurando um registro pela data.');
assert.match(app, /this\.state\.records\[index\] = \{ \.\.\.this\.state\.records\[index\], \.\.\.draft \}/, 'Uma data existente deve continuar sendo atualizada.');
assert.match(app, /else this\.state\.records\.push\(\{ \.\.\.draft, createdAt:/, 'Uma data nova deve continuar criando somente um registro.');

assert.match(today, /recordScript\.src = '\.\/record-2\.js\?v=1'/, 'O Bloco 2 deve usar a cadeia modular existente.');
assert.match(record, /root\.dataset\.block2 = 'ready'/, 'O formulário deve expor um estado observável de conclusão.');
assert.match(record, /recordOptionalDetails/, 'Os detalhes opcionais devem possuir um controle acessível.');
assert.match(record, /appendChild\(optionalGrid\)/, 'Os campos opcionais existentes devem ser movidos, não recriados ou apagados.');
assert.match(record, /Você pode salvar sem preencher esta parte/, 'A interface deve explicar que os opcionais não são obrigatórios.');
assert.match(record, /recordConfirmation/, 'O salvamento deve possuir uma confirmação dedicada.');
assert.match(record, /recordDoneButton/, 'A confirmação deve permitir concluir o fluxo.');
assert.match(record, /recordEditButton/, 'A confirmação deve permitir editar o mesmo dia.');
assert.match(record, /const baseSaveDay = app\.saveDay/, 'O módulo deve preservar a gravação canônica do aplicativo.');
assert.match(record, /baseSaveDay\.call\(this\)/, 'O módulo deve delegar a gravação ao comportamento validado.');
assert.match(record, /this\.state\.records\.some\(record => record\.date === draft\.date\)/, 'A confirmação deve distinguir criação de atualização pela data.');
assert.match(record, /app\.state\.records\.find\(item => item\.date === date\)/, 'Editar após salvar deve recuperar o registro existente.');
assert.match(record, /Bloco 2 não aplicado:[^]*formulário original foi preservado/, 'A falta de pré-requisito deve manter o formulário anterior como retorno seguro.');

assert.match(record, /const hero = root\.firstElementChild/, 'O cabeçalho deve ser localizado pela estrutura estável da própria tela.');
assert.match(record, /heroTitle\.textContent\.trim\(\) !== 'Como foi seu dia\?'/, 'A reorganização deve confirmar o título real antes de agir.');
assert.doesNotMatch(record, /querySelector\([^\n]*rounded-\[/, 'Classes Tailwind com colchetes não podem ser usadas diretamente como seletor CSS.');

assert.doesNotMatch(record, /localStorage|sessionStorage/, 'O módulo visual não pode criar outra persistência.');
assert.doesNotMatch(record, /state\.records\.push|state\.records\s*=|splice\(/, 'O módulo visual não pode implementar uma segunda gravação.');
assert.doesNotMatch(record, /\.remove\(\)/, 'Nenhum campo ou botão original pode ser removido.');
assert.doesNotMatch(styles, /record-block-2|block2-record/, 'O Bloco 2 não deve depender de remendo específico em CSS.');
assert.doesNotMatch(serviceWorker, /record-2|block2/, 'O service worker deve permanecer independente do Bloco 2.');
assert.match(policy, /"record-2\.js"/, 'O arquivo publicado do Bloco 2 deve entrar na prova de paridade.');

console.log('Contrato do Bloco 2 validado: essenciais prioritários, opcionais preservados, confirmação e uma data por registro.');
