import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [overlay, css, sw, onboarding, shell, app] = await Promise.all([
  readFile(new URL('../refactor-360.js', import.meta.url), 'utf8'),
  readFile(new URL('../refactor-360.css', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8'),
  readFile(new URL('../onboarding-6.js', import.meta.url), 'utf8'),
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
]);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A Refatoração 360 não pode mudar a chave de dados.');
assert.match(onboarding, /refactor-360\.js\?v=1/, 'A camada 360 deve entrar no final da cadeia modular existente.');
assert.match(overlay, /STATE_VERSION = 11/, 'A camada 360 deve possuir versão de dados explícita.');
assert.match(overlay, /paidPeriods/, 'Pagamento administrativo deve existir separado do custo financeiro.');
assert.match(overlay, /setPaid\(cost, !wasPaid\)/, 'Marcar como pago deve usar estado administrativo próprio.');
assert.match(overlay, /showSnackbar\([^]*Pagamento marcado[^]*=>/, 'Pagamento deve oferecer desfazer.');
assert.match(overlay, /resultsPeriod/, 'Resultados deve lembrar Semana ou Mês.');
assert.match(overlay, /data-r360-period="week"/, 'Resultados deve oferecer Semana.');
assert.match(overlay, /data-r360-period="month"/, 'Resultados deve oferecer Mês.');
assert.match(overlay, /RECORD_DRAFT_KEY/, 'Registrar deve preservar rascunho durante interrupções.');
assert.match(overlay, /Atualizar dia/, 'Mesma data deve comunicar atualização, não duplicação.');
assert.match(overlay, /ONBOARDING_DRAFT_KEY/, 'Onboarding deve retomar a etapa interrompida.');
assert.match(overlay, /data-r360-vehicle="rental"/, 'Onboarding deve tratar carro alugado.');
assert.match(overlay, /kind:'weekly'/, 'Aluguel deve virar obrigação semanal.');
assert.match(overlay, /r360ImportPreview/, 'Importação deve possuir prévia antes de aplicar.');
assert.match(overlay, /Arquivo inválido\. Seus dados atuais não foram alterados\./, 'Falha de importação deve preservar os dados atuais.');
assert.match(overlay, /Notification\.requestPermission/, 'Permissão de notificação deve ser pedida somente após ativação explícita.');
assert.match(overlay, /SHOW_CONTEXT_NOTIFICATION/, 'Notificações contextuais devem passar pelo service worker.');
assert.match(sw, /notificationclick/, 'Notificação contextual deve possuir retorno ao aplicativo.');
assert.match(sw, /targetUrl/, 'Clique da notificação deve transportar um destino contextual.');
assert.match(overlay, /scrollByView/, 'Navegação deve preservar contexto de rolagem.');
assert.match(overlay, /document\.body\.dataset\.r360='r10'/, 'R10 deve deixar um marcador observável de fechamento.');
assert.match(css, /@media \(min-width:600px\) and \(max-width:839px\)/, 'Layout médio deve possuir regra própria.');
assert.match(css, /@media \(min-width:840px\)/, 'Layout expandido deve possuir navigation rail.');
assert.match(css, /prefers-reduced-motion:reduce/, 'Movimento reduzido deve ser respeitado.');
assert.match(css, /:focus-visible/, 'Foco por teclado deve ser visível.');
assert.doesNotMatch(overlay, /const STORAGE_KEY\s*=\s*['"](?!vetta-driver-intelligence-v3)/, 'A camada 360 não pode criar outra chave financeira.');
assert.ok(shell.includes('maximum-scale=1') && shell.includes('user-scalable=no'), 'A fonte ainda contém o bloqueio legado; a camada 360 deve removê-lo em runtime até a migração estrutural do shell.');
assert.match(overlay, /metaViewport\.setAttribute\('content', 'width=device-width,initial-scale=1,viewport-fit=cover'\)/, 'A experiência 360 deve retirar o bloqueio de zoom ao iniciar.');

console.log('Contrato Refatoração 360 validado: R2→R10 possuem trilhas observáveis sem trocar a fonte financeira.');
