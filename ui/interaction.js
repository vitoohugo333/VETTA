import { model, ui, vibrate } from './context.js';

const STATE = {
  lastRoute: null,
  lastSavedAt: null,
  searchOpen: false,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = value => model.money(Number(value || 0), 0);

function safeVibrate(duration = 8) {
  try { vibrate(duration); } catch (_) {}
}

function ensureLiveRegion() {
  if ($('#vettaLiveRegion')) return;
  const node = document.createElement('div');
  node.id = 'vettaLiveRegion';
  node.className = 'sr-only';
  node.setAttribute('aria-live', 'polite');
  document.body.appendChild(node);
}

function announce(message) {
  ensureLiveRegion();
  const node = $('#vettaLiveRegion');
  if (!node) return;
  node.textContent = '';
  requestAnimationFrame(() => { node.textContent = message; });
}

function injectPressFeedback() {
  if (document.body.dataset.friendlyPressReady) return;
  document.body.dataset.friendlyPressReady = 'true';
  document.addEventListener('pointerdown', event => {
    const target = event.target.closest('button,.row,.choice,.surface[role="button"]');
    if (!target || target.disabled) return;
    target.classList.add('is-pressed');
    if (target.matches('.primary,.nav-item,.r360-payment,.choice')) safeVibrate(7);
  }, { passive: true });
  const clear = event => event.target.closest?.('.is-pressed')?.classList.remove('is-pressed');
  document.addEventListener('pointerup', clear, { passive: true });
  document.addEventListener('pointercancel', clear, { passive: true });
}

function routeMotion() {
  const route = ui.state.route;
  if (STATE.lastRoute === route) return;
  STATE.lastRoute = route;
  const active = $('.view-section:not(.hidden)');
  if (!active) return;
  active.classList.remove('friendly-enter');
  requestAnimationFrame(() => active.classList.add('friendly-enter'));
}

function dashboardEnhancements() {
  const hero = $('#r360NowHero');
  if (!hero || hero.dataset.friendlyReady) return;
  hero.dataset.friendlyReady = 'true';

  const calculation = model.calculations();
  const week = model.weekContext(calculation);
  const pct = week.target > 0 ? Math.max(0, Math.min(100, week.actual / week.target * 100)) : 0;
  const records = week.records.length;
  const progress = document.createElement('div');
  progress.className = 'friendly-week-progress';
  progress.innerHTML = `
    <div class="friendly-progress-copy">
      <span>${records ? `${records} ${records === 1 ? 'dia registrado' : 'dias registrados'} nesta semana` : 'Sua semana começa no primeiro registro'}</span>
      <strong>${Math.round(pct)}%</strong>
    </div>
    <div class="friendly-progress-track" role="progressbar" aria-label="Progresso da semana" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><span style="width:${pct}%"></span></div>`;
  hero.appendChild(progress);

  const metrics = $$('.hero-metric', hero);
  metrics.forEach(metric => {
    metric.tabIndex = 0;
    metric.setAttribute('role', 'button');
    metric.setAttribute('aria-label', `${metric.querySelector('small')?.textContent || 'Número'}. Toque para entender.`);
  });

  const reading = $('#r360FinancialAttention')?.nextElementSibling;
  if (reading && !reading.querySelector('.friendly-context-line')) {
    const line = document.createElement('button');
    line.type = 'button';
    line.className = 'friendly-context-line';
    line.dataset.friendExplain = 'projection';
    line.innerHTML = '<span>Como o VETTA chegou a essa leitura?</span><span>›</span>';
    reading.appendChild(line);
  }
}

function recordEnhancements() {
  const view = $('#view-day:not(.hidden)');
  if (!view) return;
  const formSurface = view.querySelector('.surface.stack');
  if (!formSurface) return;

  if (!$('#friendlyRecordStatus', view)) {
    const status = document.createElement('div');
    status.id = 'friendlyRecordStatus';
    status.className = 'friendly-save-status';
    status.setAttribute('aria-live', 'polite');
    status.innerHTML = '<span class="friendly-save-dot"></span><span>Rascunho protegido automaticamente</span>';
    const essential = view.querySelector('[data-record-role="essential-fields"]');
    essential?.insertAdjacentElement('afterend', status);
  }

  const date = $('#recordDate');
  if (date && !$('#friendlyDuplicateHint', view)) {
    const hint = document.createElement('div');
    hint.id = 'friendlyDuplicateHint';
    hint.className = 'friendly-inline-hint hidden';
    date.closest('.input-group')?.appendChild(hint);
    updateDuplicateHint();
  }

  const save = $('#saveDayButton');
  save?.classList.add('friendly-sticky-action');

  const fields = ['recordGross', 'recordKm', 'recordHours', 'recordFuel'].map(id => $('#' + id)).filter(Boolean);
  fields.forEach((field, index) => {
    field.setAttribute('inputmode', 'decimal');
    if (field.dataset.friendlyKeyReady) return;
    field.dataset.friendlyKeyReady = 'true';
    field.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const next = fields[index + 1];
      if (next) next.focus();
      else save?.focus();
    });
  });

  if (!view.dataset.friendlyAutofocus && !ui.state.recordConfirmationDate) {
    view.dataset.friendlyAutofocus = 'true';
    requestAnimationFrame(() => $('#recordGross')?.focus({ preventScroll: true }));
  }
}

function updateDuplicateHint() {
  const date = $('#recordDate');
  const hint = $('#friendlyDuplicateHint');
  if (!date || !hint) return;
  const existing = model.state.records.find(record => record.date === date.value);
  if (existing && ui.state.recordEditingDate !== date.value) {
    hint.classList.remove('hidden');
    hint.textContent = 'Já existe um registro nesta data. Ao salvar, o VETTA atualizará aquele dia em vez de duplicar.';
  } else {
    hint.classList.add('hidden');
    hint.textContent = '';
  }
}

function pulseRecordDraft() {
  const status = $('#friendlyRecordStatus');
  if (!status) return;
  STATE.lastSavedAt = Date.now();
  status.classList.add('is-saving');
  status.innerHTML = '<span class="friendly-save-dot"></span><span>Salvando rascunho…</span>';
  clearTimeout(pulseRecordDraft.timer);
  pulseRecordDraft.timer = setTimeout(() => {
    status.classList.remove('is-saving');
    status.classList.add('is-saved');
    status.innerHTML = '<span class="friendly-save-dot"></span><span>Rascunho salvo · pode sair e voltar</span>';
    announce('Rascunho salvo automaticamente.');
  }, 280);
}

function resultsEnhancements() {
  const overview = $('#r360ResultsOverview');
  if (!overview || overview.dataset.friendlyReady) return;
  overview.dataset.friendlyReady = 'true';

  const calculation = model.calculations();
  const records = (model.state.r360.resultsPeriod || 'week') === 'week'
    ? model.weekContext(calculation).records
    : calculation.records;

  if (records.length) {
    const best = [...records].sort((a, b) => b.net - a.net)[0];
    const efficient = [...records].filter(r => r.km > 0).sort((a, b) => (b.gross / b.km) - (a.gross / a.km))[0];
    const insight = document.createElement('div');
    insight.className = 'friendly-insight-grid section-gap';
    insight.innerHTML = `
      <button type="button" class="friendly-insight" data-friendly-result-date="${best.date}"><small>Melhor líquido</small><strong>${money(best.net)}</strong><span>Ver o dia ›</span></button>
      ${efficient ? `<button type="button" class="friendly-insight" data-friendly-result-date="${efficient.date}"><small>Melhor eficiência</small><strong>${model.money(efficient.gross / efficient.km)}/km</strong><span>Ver o dia ›</span></button>` : ''}`;
    const reading = $('#r360ResultsReading');
    reading?.insertAdjacentElement('beforebegin', insight);
  }

  $$('.chart span', overview).forEach((bar, index) => {
    bar.tabIndex = 0;
    bar.setAttribute('role', 'button');
    bar.dataset.friendlyBarIndex = String(index);
  });
}

function costsEnhancements() {
  const page = $('#planningPage-costs');
  if (!page || page.dataset.friendlyReady) return;
  page.dataset.friendlyReady = 'true';
  const active = model.state.costs.filter(cost => cost.active);
  const items = active.map(cost => ({ cost, meta: model.dueMeta(cost) })).sort((a, b) => a.meta.rank - b.meta.rank);
  const strip = document.createElement('div');
  strip.className = 'friendly-due-strip section-gap';
  const top = items.slice(0, 4);
  strip.innerHTML = top.length
    ? top.map(({ cost, meta }) => `<button type="button" data-friendly-cost="${cost.id}" class="friendly-due-chip"><small>${meta.label}</small><strong>${cost.name}</strong></button>`).join('')
    : '<div class="friendly-empty-chip">Nenhum compromisso ativo.</div>';
  $('#r360CostAttention')?.insertAdjacentElement('afterend', strip);
}

function planningEnhancements() {
  const hub = $('#planningHub');
  if (!hub || hub.dataset.friendlyReady) return;
  hub.dataset.friendlyReady = 'true';
  const ready = [
    model.state.targetProfit > 0,
    model.state.workWeekdays.length > 0,
    model.state.costs.some(cost => cost.active),
    Number(model.state.fuel?.price) > 0 && Number(model.state.fuel?.efficiency) > 0,
  ];
  const completed = ready.filter(Boolean).length;
  const next = ['goals', 'agenda', 'costs', 'operation'][Math.max(0, ready.findIndex(value => !value))] || 'goals';
  const card = document.createElement('div');
  card.className = 'friendly-plan-progress section-gap';
  card.innerHTML = `
    <div class="friendly-progress-copy"><span>Seu plano</span><strong>${completed} de 4 partes</strong></div>
    <div class="friendly-progress-track"><span style="width:${completed / 4 * 100}%"></span></div>
    <button type="button" class="primary full section-gap" data-friendly-plan-next="${completed === 4 ? 'goals' : next}">${completed === 4 ? 'Revisar meu plano' : 'Continuar meu plano'}</button>`;
  hub.firstElementChild?.insertAdjacentElement('afterend', card);
}

function moreEnhancements() {
  const hub = $('#moreHub');
  if (!hub || hub.dataset.friendlyReady) return;
  hub.dataset.friendlyReady = 'true';
  const search = document.createElement('div');
  search.className = 'friendly-search section-gap';
  search.innerHTML = `
    <label for="friendlyGlobalSearch">Encontrar no VETTA</label>
    <div class="friendly-search-box"><span aria-hidden="true">⌕</span><input id="friendlyGlobalSearch" type="search" placeholder="Ex.: meta, backup, GNV, relatório"></div>
    <div id="friendlySearchResults" class="friendly-search-results hidden"></div>`;
  hub.firstElementChild?.insertAdjacentElement('afterend', search);
}

function onboardingEnhancements() {
  const card = $('.onboarding-card');
  if (!card || card.dataset.friendlyReady) return;
  card.dataset.friendlyReady = 'true';
  const stepText = $('#onboardingProgress')?.textContent || '';
  const step = Number(stepText.split(' ')[0]) || 1;
  const labels = ['Seu carro', 'Seu objetivo', 'Sua operação'];
  const helper = document.createElement('div');
  helper.className = 'friendly-onboarding-roadmap';
  helper.innerHTML = labels.map((label, index) => `<span class="${index + 1 <= step ? 'active' : ''}">${index + 1 < step ? '✓' : index + 1}<small>${label}</small></span>`).join('');
  $('#onboardingProgress')?.parentElement?.insertAdjacentElement('afterend', helper);
}

function openFriendSheet(title, text, action = null) {
  $('#friendlySheet')?.remove();
  const modal = document.createElement('div');
  modal.id = 'friendlySheet';
  modal.className = 'modal friendly-modal';
  modal.innerHTML = `<div class="sheet friendly-sheet"><div class="sheet-head"><div><span class="eyebrow">Entenda rápido</span><h3 class="section-title">${title}</h3></div><button type="button" class="icon-button" data-friendly-close aria-label="Fechar">×</button></div><p class="friendly-sheet-copy">${text}</p>${action ? `<button type="button" class="primary full section-gap" ${action.attr}>${action.label}</button>` : ''}</div>`;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));
  modal.querySelector('[data-friendly-close]')?.focus();
}

function explainDashboardMetric(metric) {
  const label = metric.querySelector('small')?.textContent?.trim();
  const calculation = model.calculations();
  if (label === 'Mês') {
    openFriendSheet('Resultado do mês', `É o líquido estimado dos dias que você já registrou neste mês, depois dos custos que fazem parte do seu modelo. Hoje ele está em ${money(calculation.actualNet)}.`);
  } else {
    openFriendSheet('Projeção', `O VETTA usa seus registros atuais, sua agenda e os custos cadastrados para estimar onde o mês tende a terminar. A projeção atual é ${money(calculation.projectedNet)} e muda conforme novos dias entram.`);
  }
}

const SEARCH_ITEMS = [
  { terms: ['meta', 'objetivo', 'plano'], label: 'Objetivo e meta', route: 'planning', section: 'goals' },
  { terms: ['agenda', 'dias', 'trabalho'], label: 'Agenda de trabalho', route: 'planning', section: 'agenda' },
  { terms: ['custo', 'conta', 'pneu', 'seguro', 'aluguel'], label: 'Custos e compromissos', primary: 'costs' },
  { terms: ['gnv', 'gasolina', 'combustível', 'combustivel'], label: 'Operação e combustível', route: 'planning', section: 'operation' },
  { terms: ['backup', 'dados', 'exportar', 'importar'], label: 'Meus dados e backup', primary: 'more', more: 'data' },
  { terms: ['relatório', 'relatorio', 'imprimir'], label: 'Relatórios', primary: 'more', more: 'reports' },
  { terms: ['resultado', 'histórico', 'historico', 'semana', 'mês', 'mes'], label: 'Resultados', primary: 'history' },
  { terms: ['registrar', 'dia', 'faturamento', 'km'], label: 'Registrar meu dia', route: 'day' },
  { terms: ['notificação', 'notificacao', 'alerta'], label: 'Notificações', primary: 'more', notifications: true },
];

function runSearch(value) {
  const box = $('#friendlySearchResults');
  if (!box) return;
  const query = value.trim().toLocaleLowerCase('pt-BR');
  if (query.length < 2) { box.classList.add('hidden'); box.innerHTML = ''; return; }
  const results = SEARCH_ITEMS.filter(item => item.terms.some(term => term.includes(query) || query.includes(term))).slice(0, 5);
  box.innerHTML = results.length
    ? results.map((item, index) => `<button type="button" data-friendly-search-index="${SEARCH_ITEMS.indexOf(item)}"><span>${item.label}</span><span>›</span></button>`).join('')
    : '<div class="friendly-search-empty">Não encontrei uma função com esse nome.</div>';
  box.classList.remove('hidden');
}

function activateSearchItem(index) {
  const item = SEARCH_ITEMS[index];
  if (!item) return;
  if (item.route === 'day') {
    document.querySelector('[data-view="day"]')?.click();
    return;
  }
  if (item.route === 'planning') {
    ui.secondary('planning', { planningSection: item.section, primary: ui.state.primary });
    return;
  }
  if (item.primary === 'costs') { ui.primary('costs'); return; }
  if (item.primary === 'history') { ui.primary('history'); return; }
  if (item.primary === 'more') {
    ui.primary('more');
    queueMicrotask(() => {
      if (item.more) ui.secondary('more', { moreSection: item.more, primary: 'more' });
      if (item.notifications) ui.set({ notificationsOpen: true });
    });
  }
}

function bindDelegatedEvents() {
  if (document.body.dataset.friendlyEventsReady) return;
  document.body.dataset.friendlyEventsReady = 'true';

  document.addEventListener('click', event => {
    const heroMetric = event.target.closest('#r360NowHero .hero-metric');
    if (heroMetric) { explainDashboardMetric(heroMetric); return; }

    const explain = event.target.closest('[data-friend-explain="projection"]');
    if (explain) {
      const calculation = model.calculations();
      openFriendSheet('Leitura VETTA', calculation.records.length < 2 ? 'Ainda há poucos dias reais. O VETTA prefere dizer que a evidência está começando a fingir certeza.' : `A leitura cruza seus registros com a meta, a agenda e os custos ativos. A projeção atual é ${money(calculation.projectedNet)}.`);
      return;
    }

    const result = event.target.closest('[data-friendly-result-date]');
    if (result) { ui.set({ resultDetail: result.dataset.friendlyResultDate }); return; }

    const cost = event.target.closest('[data-friendly-cost]');
    if (cost) {
      const original = document.querySelector(`[data-cost-edit="${CSS.escape(cost.dataset.friendlyCost)}"]`);
      original?.click();
      return;
    }

    const planNext = event.target.closest('[data-friendly-plan-next]');
    if (planNext) { ui.secondary('planning', { planningSection: planNext.dataset.friendlyPlanNext }); return; }

    const search = event.target.closest('[data-friendly-search-index]');
    if (search) { activateSearchItem(Number(search.dataset.friendlySearchIndex)); return; }

    if (event.target.closest('[data-friendly-close]') || (event.target.id === 'friendlySheet')) $('#friendlySheet')?.remove();
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'friendlyGlobalSearch') runSearch(event.target.value);
    if (['recordDate', 'recordGross', 'recordKm', 'recordHours', 'recordFuel'].includes(event.target.id)) {
      pulseRecordDraft();
      if (event.target.id === 'recordDate') updateDuplicateHint();
    }
  });

  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('#r360NowHero .hero-metric')) {
      event.preventDefault(); explainDashboardMetric(event.target);
    }
    if (event.key === 'Escape') $('#friendlySheet')?.remove();
  });
}

function enhance() {
  injectPressFeedback();
  bindDelegatedEvents();
  routeMotion();
  dashboardEnhancements();
  recordEnhancements();
  resultsEnhancements();
  costsEnhancements();
  planningEnhancements();
  moreEnhancements();
  onboardingEnhancements();
  document.body.dataset.friendlyUx = 'v1';
}

let queued = false;
const observer = new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; enhance(); });
});

export function startFriendlyUx() {
  enhance();
  observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
}

startFriendlyUx();
