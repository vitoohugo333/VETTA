import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [shell, app, planning, history, today, policy, serviceWorker] = await Promise.all([
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../planning-1a.js', import.meta.url), 'utf8'),
  readFile(new URL('../history-1b.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../ci/branch-policy.json', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8'),
]);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(history, /today-1c\.js\?v=1/, 'R1 deve continuar carregando no encadeamento existente.');
assert.match(policy, /"today-1c\.js"/, 'Hoje deve participar da prova publicada.');

for (const id of ['targetProfitDisplay', 'kpiGrossDaily', 'kpiNetDaily', 'kpiKmDaily', 'monthStatusTitle', 'insightTitle']) {
  assert.match(shell, new RegExp(`id="${id}"`), `A base funcional deve preservar ${id}.`);
}
for (const id of ['planningTargetInput', 'planningDaysOffInput', 'planningRevenueChart']) {
  assert.match(planning, new RegExp(`id="${id}"`), `O Plano deve manter ${id}.`);
}

assert.match(today, /targetCard\.dataset\.r1Role = 'monthly-plan'/, 'A meta deve virar Plano do mês em Agora, não ser escondida.');
assert.doesNotMatch(today, /\[targetCard,[^\]]*'Plano/, 'O card de meta não pode ser tratado como duplicação a esconder.');
assert.match(today, /id = 'r1PlanSummary'/, 'O Plano em Agora deve explicar a consequência financeira.');
assert.match(today, /id = 'r1NextAction'/, 'Agora deve possuir próxima ação contextual.');
assert.match(today, /targetMissing[\s\S]*Comece definindo sua meta/, 'Meta zero deve produzir orientação explícita.');
assert.match(today, /Montar meu plano/, 'Meta zero deve oferecer CTA para montar o plano.');
assert.match(today, /Registre seu primeiro dia/, 'Plano definido sem registros deve orientar o primeiro registro.');
assert.match(today, /Revise seu ritmo do mês/, 'Ritmo abaixo do esperado deve levar a Resultados.');
assert.match(today, /id = 'r1HeaderPlanButton'/, 'Plano deve ter acesso global de um toque.');
assert.match(today, /installButton\.dataset\.relocatedTo = 'Mais → Aplicativo'/, 'Instalação deve sair do espaço global prioritário sem ser removida do produto.');
assert.match(today, /labels\[0\]\.textContent = 'Agora'/, 'Primeiro destino deve ser Agora.');
assert.match(today, /labels\[1\]\.textContent = 'Registrar'/, 'Registrar deve ser destino primário.');
assert.match(today, /labels\[2\]\.textContent = 'Resultados'/, 'Resultados deve ser destino primário.');
assert.match(today, /labels\[3\]\.textContent = 'Custos'/, 'Custos deve ser destino primário.');
assert.match(today, /new Set\(\['dashboard', 'day', 'history', 'costs', 'more'\]\)/, 'A navegação deve manter cinco tarefas humanas.');

assert.doesNotMatch(today, /localStorage|sessionStorage|app\.state\s*=|\.save\s*\(/, 'R1 não pode criar persistência ou alterar estado financeiro diretamente.');
assert.doesNotMatch(today, /serviceWorker|caches\.|manifest\.webmanifest/, 'R1 não pode alterar o PWA como efeito visual.');
assert.doesNotMatch(serviceWorker, /r1NextAction|r1PlanButton/, 'O service worker deve permanecer independente do R1.');

console.log('Contrato R1 validado: Plano é primeira classe, meta zero orienta e a navegação usa cinco tarefas humanas.');
