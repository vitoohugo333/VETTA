import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');

assert.match(css, /button\[data-view="day"\]\{display:none!important\}/, 'A aba Dia deve sair da navegação principal.');
assert.match(css, /content:"Hoje"/, 'A área inicial deve ser apresentada como Hoje.');
assert.match(css, /content:"Planejar"/, 'A área de ajustes deve ser apresentada como Planejar.');
assert.match(css, /:has\(#weekStatusTitle\)/, 'O detalhamento semanal não deve competir na tela Hoje.');
assert.match(css, /:has\(#revenueChart\)/, 'O gráfico detalhado não deve competir na tela Hoje.');
assert.match(app, /const STORAGE_KEY = 'vetta-driver-intelligence-v3'/, 'A chave dos dados locais deve permanecer intacta.');
assert.match(app, /currentView: 'dashboard'/, 'A tela inicial interna deve continuar compatível com a navegação existente.');

console.log('Contrato do Bloco 1 validado: Hoje | Histórico | Planejar | Mais, sem mudança da chave de dados.');
