import { calculateMonth, calculateRecord, createInitialState, dateKey, fuelOptions } from './domain/finance.js';
import { exportBackup, importBackup, loadState, saveState } from './data/storage.js';

const app = document.querySelector('#app');
const toastElement = document.querySelector('#toast');
let state = loadState();
let view = 'home';

const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const number = (value) => Number(String(value || '').replace(',', '.')) || 0;
const today = () => dateKey(new Date());
const escape = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[char]);

function persist() { saveState(state); }
function notify(message) {
  toastElement.textContent = message;
  toastElement.classList.add('visible');
  clearTimeout(notify.timeout);
  notify.timeout = setTimeout(() => toastElement.classList.remove('visible'), 2600);
}
function setView(next) { view = next; render(); }
function card(content) { return `<section class="card">${content}</section>`; }
function activeNav() { document.querySelectorAll('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === view)); }

function home() {
  const summary = calculateMonth(state);
  return `
    <span class="eyebrow">VETTA</span><h1>Seu trabalho precisa sobrar.</h1>
    <p class="muted">Veja o que falta para a sua meta sem confundir faturamento com lucro.</p>
    <section class="hero"><span>Meta líquida do mês</span><h2>${money(state.targetProfit)}</h2><p class="muted">${summary.records.length ? `${summary.progress.toFixed(0)}% já realizado.` : 'Comece fechando o primeiro dia.'}</p></section>
    ${card(`<div class="metric"><span>Líquido realizado</span><strong>${money(summary.net)}</strong></div><div class="metric"><span>Meta para cada dia restante</span><strong>${money(summary.dailyGross)}</strong></div><div class="metric"><span>Quilômetros estimados por dia</span><strong>${summary.dailyKm.toFixed(0)} km</strong></div>`)}
    ${card(`<h2>Leitura do momento</h2><p class="muted">${summary.records.length ? `Você registrou ${summary.records.length} dia(s). A meta considera combustível, custos por km e custos mensais ativos.` : 'Configure seus números e registre um dia. O VETTA calcula a partir dos valores que você informou.'}</p>`)}
  `;
}

function day() {
  const draft = calculateRecord({ date: today(), gross: 0, km: 0 }, state, new Date());
  return `<span class="eyebrow">Fechamento diário</span><h1>Como foi seu dia?</h1><p class="muted">Combustível é opcional. Sem ele, usamos sua estimativa por km.</p>
    ${card(`<form id="day-form"><label class="field">Data<input name="date" type="date" value="${today()}" required></label><div class="grid"><label class="field">Faturamento (R$)<input name="gross" type="number" step="0.01" min="0" required></label><label class="field">Quilômetros<input name="km" type="number" step="0.1" min="0" required></label></div><label class="field">Combustível gasto (R$, opcional)<input name="fuelSpend" type="number" step="0.01" min="0"></label><p class="notice">Com os parâmetros atuais, o custo fixo estimado por dia é ${money(draft.fixedShare)}.</p><button class="button">Salvar dia</button></form>`)}
  `;
}

function history() {
  const summary = calculateMonth(state);
  const records = [...summary.records].sort((a, b) => b.date.localeCompare(a.date));
  return `<span class="eyebrow">Histórico</span><h1>Resultado de verdade.</h1>
    ${card(`<div class="metric"><span>Dias no mês</span><strong>${records.length}</strong></div><div class="metric"><span>Faturamento</span><strong>${money(summary.totals.gross)}</strong></div><div class="metric"><span>Líquido</span><strong>${money(summary.net)}</strong></div>`)}
    ${card(records.length ? records.map((record) => `<div class="metric"><span><strong>${new Date(`${record.date}T12:00:00`).toLocaleDateString('pt-BR')}</strong><br><small>${record.km.toFixed(1)} km · ${money(record.gross)} bruto</small></span><strong>${money(record.net)}</strong><button data-delete-record="${record.date}" aria-label="Excluir registro de ${record.date}">Excluir</button></div>`).join('') : '<div class="empty">Nenhum dia registrado neste mês.</div>')}`;
}

function settings() {
  const costs = state.costs.map((cost) => `<div class="metric"><span><strong>${escape(cost.name)}</strong><br><small>${cost.kind === 'per_km' ? `${money(cost.value)}/km` : `${money(cost.value)} ${cost.kind === 'weekly' ? 'por semana' : cost.kind === 'one_time' ? 'neste mês' : 'por mês'}`}</small></span><button data-delete-cost="${cost.id}">Excluir</button></div>`).join('');
  return `<span class="eyebrow">Ajustes</span><h1>Seus números.</h1>
    ${card(`<form id="settings-form"><label class="field">Meta líquida mensal (R$)<input name="targetProfit" type="number" min="0" step="0.01" value="${state.targetProfit}"></label><label class="field">Receita média por km (R$)<input name="revenuePerKm" type="number" min="0" step="0.01" value="${state.revenuePerKm}"></label><label class="field">Combustível<select name="fuelType">${Object.entries(fuelOptions).map(([key, fuel]) => `<option value="${key}" ${state.fuel.type === key ? 'selected' : ''}>${fuel.name}</option>`).join('')}</select></label><div class="grid"><label class="field">Preço (R$)<input name="fuelPrice" type="number" min="0" step="0.01" value="${state.fuel.price}"></label><label class="field">Rendimento (${state.fuel.unit}/km)<input name="fuelEfficiency" type="number" min="0" step="0.1" value="${state.fuel.efficiency}"></label></div><button class="button">Salvar ajustes</button></form>`)}
    ${card(`<h2>Custos e reservas</h2><form id="cost-form"><label class="field">Nome<input name="name" required placeholder="Ex.: seguro ou pneus"></label><div class="grid"><label class="field">Frequência<select name="kind"><option value="monthly">Mensal</option><option value="weekly">Semanal</option><option value="per_km">Por km</option><option value="one_time">Somente este mês</option></select></label><label class="field">Valor (R$)<input name="value" type="number" min="0.01" step="0.01" required></label></div><button class="button secondary">Adicionar custo</button></form>${costs || '<div class="empty">Nenhum custo cadastrado.</div>'}`)}
  `;
}

function more() {
  return `<span class="eyebrow">Dados locais</span><h1>Seu histórico fica no aparelho.</h1><p class="muted">Faça backup antes de trocar de celular. A importação soma segurança sem depender de conta.</p>
    ${card(`<button class="row-button" id="export">Baixar backup <span>›</span></button><label class="row-button">Importar backup <span>›</span><input id="import" type="file" accept="application/json" hidden></label><button class="row-button" id="install">Instalar o VETTA <span>›</span></button><button class="row-button" id="reset">Restaurar apenas ajustes <span>›</span></button>`)}
  `;
}

function render() {
  app.innerHTML = ({ home: home(), day: day(), history: history(), settings: settings(), more: more() })[view];
  activeNav();
  bindView();
}

function bindView() {
  document.querySelector('#day-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); const values = new FormData(event.currentTarget); const record = { date: values.get('date'), gross: number(values.get('gross')), km: number(values.get('km')), fuelSpend: number(values.get('fuelSpend')) };
    if (record.gross <= 0 || record.km <= 0) return notify('Informe faturamento e quilômetros maiores que zero.');
    const index = state.records.findIndex((item) => item.date === record.date);
    if (index >= 0) state.records[index] = record; else state.records.push(record);
    persist(); notify(index >= 0 ? 'Dia atualizado.' : 'Dia salvo.'); setView('home');
  });
  document.querySelector('#settings-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); const values = new FormData(event.currentTarget); const type = values.get('fuelType'); const preset = fuelOptions[type];
    state = { ...state, configured: true, targetProfit: number(values.get('targetProfit')), revenuePerKm: number(values.get('revenuePerKm')), fuel: { type, name: preset.name, unit: preset.unit, price: number(values.get('fuelPrice')), efficiency: number(values.get('fuelEfficiency')) } };
    persist(); notify('Ajustes salvos.'); render();
  });
  document.querySelector('#cost-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); const values = new FormData(event.currentTarget); const kind = values.get('kind'); state.costs.push({ id: crypto.randomUUID(), name: values.get('name').trim(), kind, value: number(values.get('value')), month: kind === 'one_time' ? new Date().toISOString().slice(0, 7) : undefined, active: true }); persist(); notify('Custo adicionado.'); render();
  });
  document.querySelectorAll('[data-delete-cost]').forEach((button) => button.addEventListener('click', () => { state.costs = state.costs.filter((cost) => cost.id !== button.dataset.deleteCost); persist(); notify('Custo excluído.'); render(); }));
  document.querySelectorAll('[data-delete-record]').forEach((button) => button.addEventListener('click', () => { if (!confirm('Excluir este dia?')) return; state.records = state.records.filter((record) => record.date !== button.dataset.deleteRecord); persist(); notify('Dia excluído.'); render(); }));
  document.querySelector('#export')?.addEventListener('click', () => { const blob = new Blob([exportBackup(state)], { type: 'application/json' }); const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `vetta-backup-${today()}.json` }); link.click(); URL.revokeObjectURL(link.href); });
  document.querySelector('#import')?.addEventListener('change', async (event) => { try { state = importBackup(await event.target.files[0].text()); persist(); notify('Backup importado.'); render(); } catch (error) { notify(error.message); } });
  document.querySelector('#install')?.addEventListener('click', () => notify('Use o menu do navegador e escolha “Instalar app” ou “Adicionar à tela inicial”.'));
  document.querySelector('#reset')?.addEventListener('click', () => { if (!confirm('Restaurar ajustes e manter os dias registrados?')) return; const records = state.records; state = { ...createInitialState(), records, configured: true }; persist(); notify('Ajustes restaurados.'); render(); });
}

document.querySelector('.bottom-nav').addEventListener('click', (event) => { const button = event.target.closest('[data-view]'); if (button) setView(button.dataset.view); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
render();
