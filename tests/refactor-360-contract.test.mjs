import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [shell,main,context,model,store,css,sw,onboarding,policyText]=await Promise.all([
  readFile(new URL('../app-shell.html',import.meta.url),'utf8'),
  readFile(new URL('../ui/main.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/context.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/model.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/store.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/premium.css',import.meta.url),'utf8'),
  readFile(new URL('../sw.js',import.meta.url),'utf8'),
  readFile(new URL('../ui/screens/onboarding.js',import.meta.url),'utf8'),
  readFile(new URL('../ci/branch-policy.json',import.meta.url),'utf8'),
]);
const policy=JSON.parse(policyText);
assert.match(model,/vetta-driver-intelligence-v3/,'A Refatoração 360 não pode mudar a chave financeira.');
assert.match(model,/paidPeriods/);assert.match(main,/setPaid\(cost,\s*!wasPaid\)|setPaid\(cost,\s*!was\)/);assert.match(main,/showSnackbar/,'Pagamento deve oferecer desfazer.');
assert.match(model,/resultsPeriod/);assert.match(main,/data-r360-period|r360Period|dataset\.r360Period/);
assert.match(context,/RECORD_DRAFT_KEY/);assert.match(context,/ONBOARDING_DRAFT_KEY/);
assert.match(onboarding,/\['rental'|\['own',\s*'Próprio'[^]*\['rental'/,'Onboarding deve declarar explicitamente o perfil alugado.');
assert.match(onboarding,/data-r360-vehicle="\$\{key\}"/,'A opção de veículo deve ser renderizada pelo mesmo atributo de seleção.');
assert.match(main,/kind:\s*'weekly'/);
assert.match(main,/importCandidate/);assert.match(main,/Notification\.requestPermission/);
assert.match(sw,/SHOW_CONTEXT_NOTIFICATION/);assert.match(sw,/notificationclick/);assert.match(sw,/targetUrl/);
assert.match(main,/document\.body\.dataset\.r360\s*=\s*'r10'/);assert.match(main,/document\.body\.dataset\.uiAuthority\s*=\s*'premium-v1'/);
assert.match(store,/history\.pushState/);assert.match(store,/popstate/);
assert.match(css,/@media \(min-width:840px\)/);assert.match(css,/prefers-reduced-motion:reduce/);
assert.ok(!shell.includes('maximum-scale=1')&&!shell.includes('user-scalable=no'),'Shell premium deve liberar zoom de acessibilidade.');
assert.ok(!shell.includes('refactor-360.js')&&!shell.includes('app.js'),'Autoridade antiga não pode participar do runtime ativo.');
assert.ok(policy.published.verifyFiles.includes('ui/main.js'));
console.log('Contrato Refatoração 360 validado: autoridade única, dados preservados e fluxos R1→R10 consolidados.');
