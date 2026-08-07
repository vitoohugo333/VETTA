import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [shell, app, planning, history, today, serviceWorker] = await Promise.all([
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../planning-1a.js', import.meta.url), 'utf8'),
  readFile(new URL('../history-1b.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8'),
]);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(shell, /id="view-day"/, 'Registrar deve permanecer no HTML.');
assert.match(shell, /id="view-settings"/, 'A tela antiga de Ajustes deve permanecer como fallback interno.');
assert.match(planning, /data-block1a|dataset\.block1a/, 'Planejamento deve declarar prontidão.');
assert.match(history, /dataset\.block1b = 'ready'/, 'Resultados deve declarar prontidão.');

for (const prerequisite of [
  "dashboard.dataset.block1c === 'ready'",
  "planning.dataset.block1a === 'ready'",
  "historyView.dataset.block1b === 'ready'",
]) assert.ok(today.includes(prerequisite), `A navegação deve exigir ${prerequisite}.`);

assert.match(today, /registerNav = bottomNav\.querySelector\('\.nav-item\[data-view="day"\]'\)/, 'O destino Dia existente deve ser reaproveitado como Registrar.');
assert.doesNotMatch(today, /dayNav\.remove\(\)/, 'Registrar não pode ser removido da barra.');
assert.match(today, /labels\[0\]\.textContent = 'Agora'/, 'Primeira área: Agora.');
assert.match(today, /labels\[1\]\.textContent = 'Registrar'/, 'Segunda área: Registrar.');
assert.match(today, /labels\[2\]\.textContent = 'Resultados'/, 'Terceira área: Resultados.');
assert.match(today, /labels\[3\]\.textContent = 'Custos'/, 'Quarta área: Custos.');
assert.match(today, /labels\[4\]\.textContent = 'Mais'/, 'Quinta área: Mais.');
assert.match(today, /costsNav\.dataset\.view = 'costs'/, 'Ajustes deve virar acesso direto a Custos.');
assert.match(today, /new Set\(\['dashboard', 'day', 'history', 'costs', 'more'\]\)/, 'Somente cinco tarefas humanas devem ser primárias.');
assert.match(today, /view === 'costs'[\s\S]*planningSection: 'costs'/, 'Custos deve abrir a seção financeira correta sem etapa intermediária.');
assert.match(today, /if \(view === 'planning'\) return this\.openSecondary\('planning'\)/, 'Plano deve continuar acessível como superfície contextual, não sexto item de navegação.');
assert.match(today, /planningBack\.hidden = !isSecondaryPlanning/, 'Plano contextual deve manter retorno previsível.');
assert.match(today, /bottomNav\.dataset\.block1d = 'ready'/, 'A navegação deve expor prontidão observável.');

assert.doesNotMatch(today, /localStorage|sessionStorage|app\.state\s*=|\.save\s*\(/, 'Navegação não pode alterar dados.');
assert.doesNotMatch(today, /serviceWorker|caches\.|manifest\.webmanifest/, 'Navegação não pode alterar PWA.');
assert.doesNotMatch(serviceWorker, /r1Navigation|planningSection: 'costs'/, 'Service worker deve permanecer independente da navegação R1.');

console.log('Contrato de navegação R1 validado: Agora, Registrar, Resultados, Custos e Mais, com Plano contextual.');
