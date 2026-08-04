import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [shell, app, planning, history, today, styles, serviceWorker] = await Promise.all([
  readFile(new URL('../app-shell.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../planning-1a.js', import.meta.url), 'utf8'),
  readFile(new URL('../history-1b.js', import.meta.url), 'utf8'),
  readFile(new URL('../today-1c.js', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8'),
]);

assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(shell, /id="view-day"/, 'O formulário de registro deve permanecer no HTML.');
assert.match(shell, /id="view-settings"/, 'A tela antiga de Ajustes deve permanecer como fallback interno.');
assert.match(shell, /data-view="day"[^>]*>[^]*Registrar meu dia/, 'Registrar meu dia deve continuar visível em Hoje.');
assert.match(planning, /data-block1a|dataset\.block1a/, 'Planejar deve continuar declarando o destino validado do Bloco 1A.');
assert.match(history, /dataset\.block1b = 'ready'/, 'Histórico deve continuar declarando o destino validado do Bloco 1B.');

for (const prerequisite of [
  "dashboard.dataset.block1c === 'ready'",
  "planning.dataset.block1a === 'ready'",
  "historyView.dataset.block1b === 'ready'",
]) {
  assert.ok(today.includes(prerequisite), `A navegação final deve exigir ${prerequisite}.`);
}

assert.match(today, /bottomNav\.querySelector\('\.nav-item\[data-view="dashboard"\]'\)/, 'Hoje deve nascer do item Início existente.');
assert.match(today, /todayLabel\.textContent = 'Hoje'/, 'A primeira área deve se chamar Hoje.');
assert.match(today, /dayNav\.dataset\.relocatedTo = 'Hoje → Registrar meu dia'/, 'A retirada de Dia deve registrar o destino aprovado.');
assert.match(today, /dayNav\.remove\(\)/, 'Somente o botão Dia deve sair estruturalmente da barra final.');
assert.match(today, /planningNav\.dataset\.view = 'planning'/, 'Ajustes deve se transformar no acesso principal a Planejar.');
assert.match(today, /planningLabel\.textContent = 'Planejar'/, 'A terceira área deve se chamar Planejar.');
assert.match(today, /new Set\(\['dashboard', 'history', 'planning', 'more'\]\)/, 'Somente as quatro áreas finais podem ser primárias.');
assert.match(today, /if \(view === 'day'\) return this\.openSecondary\('day'\)/, 'Registrar meu dia deve abrir como tela secundária de Hoje.');
assert.match(today, /view === 'settings' \? 'planning' : view/, 'Rotas antigas de Ajustes devem convergir para Planejar.');
assert.match(today, /planningBack\.hidden = !isSecondaryPlanning/, 'Voltar em Planejar deve aparecer somente quando houver uma área de origem.');
assert.match(today, /bottomNav\.dataset\.block1d = 'ready'/, 'A interface deve expor um estado observável de conclusão do Bloco 1D.');
assert.match(today, /Bloco 1D não aplicado:[^]*navegação anterior foi preservada/, 'A falha de pré-requisito deve preservar a navegação anterior.');

assert.doesNotMatch(today, /document\.getElementById\('view-day'\)\.remove|registerButton\.remove/, 'A tela e o botão de registro não podem ser apagados.');
assert.doesNotMatch(today, /localStorage|sessionStorage|app\.state\s*=|\.save\s*\(/, 'O Bloco 1D não pode alterar dados ou armazenamento.');
assert.doesNotMatch(today, /serviceWorker|caches\.|manifest\.webmanifest/, 'O Bloco 1D não pode alterar o PWA.');
assert.doesNotMatch(styles, /block1d|navigation-1d/, 'A navegação final não deve depender de remendo específico no CSS.');
assert.doesNotMatch(serviceWorker, /block1d|navigation-1d/, 'O service worker deve permanecer independente do Bloco 1D.');

console.log('Contrato do Bloco 1D validado: quatro áreas estruturais, registro preservado e retorno seguro.');
