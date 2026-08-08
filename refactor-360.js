(() => {
  const app = window.__vettaApp;
  if (!app || document.documentElement.dataset.r360 === 'ready') return;

  const STORAGE_KEY = 'vetta-driver-intelligence-v3';
  const RECORD_DRAFT_KEY = 'vetta-r360-record-draft-v1';
  const ONBOARDING_DRAFT_KEY = 'vetta-r360-onboarding-draft-v1';
  const NOTIFICATION_DEDUPE_KEY = 'vetta-r360-notification-dedupe-v1';
  const STATE_VERSION = 11;
  const $ = id => document.getElementById(id);
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const fuelMeta = {
    gnv: { label: 'GNV', unit: 'm³' },
    gasoline: { label: 'Gasolina', unit: 'L' },
    ethanol: { label: 'Etanol', unit: 'L' },
    diesel: { label: 'Diesel', unit: 'L' },
    custom: { label: 'Personalizado', unit: 'un.' },
  };

  const defaultR360 = () => ({
    resultsPeriod: 'week',
    vehicleOwnership: 'unknown',
    notifications: {
      dueCosts: false,
      weeklySummary: false,
      pace: false,
      missingRecords: false,
      incompletePlan: false,
    },
  });

  const vibrate = pattern => {
    if (navigator.vibrate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try { navigator.vibrate(pattern); } catch {}
    }
  };

  const normalizeR360 = state => {
    state.r360 = { ...defaultR360(), ...(state.r360 || {}) };
    state.r360.notifications = { ...defaultR360().notifications, ...(state.r360.notifications || {}) };
    state.costs = (state.costs || []).map(cost => ({
      ...cost,
      paidPeriods: Array.isArray(cost.paidPeriods) ? cost.paidPeriods : [],
      dueWeekday: Number.isInteger(cost.dueWeekday) ? cost.dueWeekday : undefined,
    }));
    state.version = Math.max(Number(state.version || 0), STATE_VERSION);
    return state;
  };

  const baseNormalizeState = app.normalizeState.bind(app);
  app.normalizeState = function(value) {
    return normalizeR360(baseNormalizeState(value));
  };
  app.state = normalizeR360(app.state || app.cloneDefaults());
  app.save();

  const metaViewport = q('meta[name="viewport"]');
  if (metaViewport) metaViewport.setAttribute('content', 'width=device-width,initial-scale=1,viewport-fit=cover');
  document.documentElement.dataset.r360 = 'ready';
  document.body.classList.add('r360-ready');

  if (!q('link[data-r360-style]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './refactor-360.css?v=1';
    link.dataset.r360Style = '1';
    document.head.appendChild(link);
  }

  const snackbar = document.createElement('div');
  snackbar.id = 'r360Snackbar';
  snackbar.className = 'r360-snackbar';
  snackbar.hidden = true;
  snackbar.innerHTML = '<span></span><button type="button">DESFAZER</button>';
  document.body.appendChild(snackbar);
  let snackbarTimer = null;
  let snackbarUndo = null;
  const showSnackbar = (message, undo = null) => {
    clearTimeout(snackbarTimer);
    snackbarUndo = undo;
    q('span', snackbar).textContent = message;
    q('button', snackbar).hidden = typeof undo !== 'function';
    snackbar.hidden = false;
    snackbarTimer = setTimeout(() => { snackbar.hidden = true; snackbarUndo = null; }, 5200);
  };
  q('button', snackbar).addEventListener('click', () => {
    if (snackbarUndo) snackbarUndo();
    snackbar.hidden = true;
    snackbarUndo = null;
  });

  const mondayFor = (date = new Date()) => {
    const monday = new Date(date);
    monday.setHours(12, 0, 0, 0);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return monday;
  };
  const paymentPeriodKey = (cost, date = new Date()) => {
    if (cost.kind === 'weekly') return `week:${app.dateKey(mondayFor(date))}`;
    return `month:${app.monthKey(date)}`;
  };
  const isPaid = (cost, date = new Date()) => (cost.paidPeriods || []).includes(paymentPeriodKey(cost, date));
  const setPaid = (cost, paid, date = new Date()) => {
    const key = paymentPeriodKey(cost, date);
    const set = new Set(cost.paidPeriods || []);
    if (paid) set.add(key); else set.delete(key);
    cost.paidPeriods = [...set];
  };

  const weeklyDueDate = (cost, date = new Date()) => {
    if (!Number.isInteger(cost.dueWeekday)) return null;
    const monday = mondayFor(date);
    const offset = cost.dueWeekday === 0 ? 6 : cost.dueWeekday - 1;
    const due = new Date(monday);
    due.setDate(monday.getDate() + offset);
    return due;
  };
  const dueMeta = (cost, date = new Date()) => {
    if (cost.category !== 'obligation' || !cost.active || cost.kind === 'per_km') return { group: 'operational', label: 'Operacional', rank: 90 };
    if (isPaid(cost, date)) return { group: 'paid', label: 'Pago', rank: 80 };
    const today = new Date(date); today.setHours(12, 0, 0, 0);
    let due = null;
    if ((cost.kind === 'monthly' || cost.kind === 'one_time') && cost.dueDay) {
      due = new Date(today.getFullYear(), today.getMonth(), Math.min(Number(cost.dueDay), new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()), 12);
    } else if (cost.kind === 'weekly') due = weeklyDueDate(cost, today);
    if (!due) return { group: 'upcoming', label: 'Sem vencimento definido', rank: 50 };
    const diff = Math.round((due - today) / 86400000);
    if (diff < 0) return { group: 'urgent', label: `Vencida há ${Math.abs(diff)} dia(s)`, rank: 0 };
    if (diff === 0) return { group: 'urgent', label: 'Vence hoje', rank: 1 };
    if (diff === 1) return { group: 'upcoming', label: 'Vence amanhã', rank: 10 };
    return { group: 'upcoming', label: `Vence em ${diff} dias`, rank: 20 + diff };
  };

  const costCadence = cost => {
    if (cost.kind === 'weekly') return `${app.money(cost.value)}/semana`;
    if (cost.kind === 'per_km') return `${app.money(cost.value)}/km`;
    if (cost.kind === 'one_time') return `${app.money(cost.value)} neste mês`;
    return `${app.money(cost.value)}/mês`;
  };

  // R2 — Administração do mês
  const costsPage = $('planningPage-costs');
  let r360Costs = null;
  let costsLegacyHost = null;
  if (costsPage && !$('r360Costs')) {
    costsLegacyHost = $('planningCostList')?.closest('details, .card-vetta');
    r360Costs = document.createElement('section');
    r360Costs.id = 'r360Costs';
    r360Costs.className = 'r360-section';
    r360Costs.innerHTML = `
      <div class="r360-surface">
        <span class="r360-eyebrow">Administração do mês</span>
        <h3 class="r360-title">Para onde seu dinheiro precisa ir</h3>
        <p id="r360CostsHeadline" class="r360-copy"></p>
      </div>
      <div id="r360CostAttention"></div>
      <div id="r360CostAddSlot"></div>
      <div id="r360CostMetrics" class="r360-metric-grid"></div>
      <div><div class="r360-group-title">Vencidas e hoje</div><div id="r360CostUrgent" class="r360-list"></div></div>
      <div><div class="r360-group-title">Próximas</div><div id="r360CostUpcoming" class="r360-list"></div></div>
      <details id="r360PaidDetails" class="r360-surface !p-0 overflow-hidden"><summary class="details-summary"><div><span class="r360-eyebrow">Concluídas</span><strong>Pagas neste período</strong></div><i class="fas fa-chevron-down"></i></summary><div id="r360CostPaid" class="px-5 pb-4"></div></details>
      <div><div class="r360-group-title">Reservas e custos operacionais</div><div id="r360CostOperational" class="r360-list"></div></div>`;
    if (costsLegacyHost) costsLegacyHost.before(r360Costs); else costsPage.appendChild(r360Costs);

    const addButton = $('planningAddCostButton');
    if (addButton) {
      addButton.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i><span>Adicionar custo</span>';
      addButton.className = 'r360-primary blue';
      $('r360CostAddSlot').appendChild(addButton);
    }
  } else r360Costs = $('r360Costs');

  const ensureCostModalFields = () => {
    const modal = $('costModal');
    if (!modal || $('r360CostActive')) return;
    const body = q('.space-y-4', modal);
    if (!body) return;
    const weekly = document.createElement('div');
    weekly.id = 'r360CostWeekdayWrap';
    weekly.className = 'hidden';
    weekly.innerHTML = `<label class="label-micro">Dia habitual do pagamento semanal</label><select id="r360CostWeekday" class="input-vetta"><option value="1">Segunda</option><option value="2">Terça</option><option value="3">Quarta</option><option value="4">Quinta</option><option value="5">Sexta</option><option value="6">Sábado</option><option value="0">Domingo</option></select>`;
    const active = document.createElement('label');
    active.className = 'r360-toggle';
    active.innerHTML = `<input id="r360CostActive" type="checkbox" checked><span><strong>Considerar este custo no plano</strong><small>Desativar tira o custo da matemática. Marcar como pago não tira.</small></span>`;
    body.append(weekly, active);
  };
  ensureCostModalFields();

  const baseOpenCostModal = app.openCostModal.bind(app);
  app.openCostModal = function(cost = null) {
    ensureCostModalFields();
    baseOpenCostModal(cost);
    const active = $('r360CostActive');
    const weekday = $('r360CostWeekday');
    if (active) active.checked = cost?.active ?? true;
    if (weekday) weekday.value = String(Number.isInteger(cost?.dueWeekday) ? cost.dueWeekday : 1);
    const due = $('costDueDayWrap');
    if (due) due.classList.toggle('hidden', !['monthly', 'one_time'].includes($('costKind').value));
    $('r360CostWeekdayWrap')?.classList.toggle('hidden', $('costKind').value !== 'weekly');
  };
  const baseSyncCostModal = app.syncCostModal.bind(app);
  app.syncCostModal = function() {
    baseSyncCostModal();
    const kind = $('costKind')?.value;
    $('r360CostWeekdayWrap')?.classList.toggle('hidden', kind !== 'weekly');
    $('costDueDayWrap')?.classList.toggle('hidden', !['monthly', 'one_time'].includes(kind));
  };

  const baseSaveCost = app.saveCost.bind(app);
  app.saveCost = function() {
    const requestedId = $('costId')?.value || '';
    const existing = requestedId ? this.state.costs.find(cost => cost.id === requestedId) : null;
    const preservedPaid = [...(existing?.paidPeriods || [])];
    const active = $('r360CostActive')?.checked ?? existing?.active ?? true;
    const weekday = $('costKind')?.value === 'weekly' ? Number($('r360CostWeekday')?.value ?? 1) : undefined;
    const dueDay = ['monthly', 'one_time'].includes($('costKind')?.value) ? (Number($('costDueDay')?.value) || undefined) : undefined;
    baseSaveCost();
    const name = $('costName')?.value?.trim();
    const saved = requestedId
      ? this.state.costs.find(cost => cost.id === requestedId)
      : [...this.state.costs].reverse().find(cost => cost.name === name);
    if (saved) {
      saved.paidPeriods = preservedPaid;
      saved.active = active;
      saved.dueWeekday = weekday;
      saved.dueDay = dueDay;
      this.save();
      this.render();
    }
    vibrate(18);
  };

  const costLine = (cost, meta, payment = false) => {
    const paid = isPaid(cost);
    const statusClass = paid ? 'paid' : meta.group === 'urgent' ? (meta.label.includes('hoje') ? 'today' : 'overdue') : 'upcoming';
    const paymentButton = payment ? `<button type="button" class="r360-payment ${paid ? 'is-paid' : ''}" data-r360-payment="${app.escape(cost.id)}" aria-label="${paid ? 'Desfazer pagamento' : 'Marcar como pago'}"><i class="fas ${paid ? 'fa-check' : 'fa-circle'}" aria-hidden="true"></i></button>` : '';
    return `<div class="r360-cost-line">${paymentButton}<button type="button" data-r360-cost-edit="${app.escape(cost.id)}" class="r360-cost-main text-left"><strong>${app.escape(cost.name)}</strong><small>${costCadence(cost)} · ${cost.category === 'reserve' ? 'reserva' : 'obrigação'}${cost.active ? '' : ' · desativado'}</small></button><span class="r360-status ${statusClass}">${app.escape(meta.label)}</span></div>`;
  };

  const renderR360Costs = () => {
    if (!r360Costs) return;
    const active = app.state.costs.filter(cost => cost.active);
    const monthly = app.costContext().monthlyFixed;
    const reserveMonthly = active.filter(cost => cost.category === 'reserve' && cost.kind !== 'per_km').reduce((sum, cost) => sum + app.monthlyEquivalent(cost), 0);
    const perKm = active.filter(cost => cost.kind === 'per_km').reduce((sum, cost) => sum + app.number(cost.value), 0);
    const obligations = active.filter(cost => cost.category === 'obligation' && cost.kind !== 'per_km');
    const classified = obligations.map(cost => ({ cost, meta: dueMeta(cost) })).sort((a, b) => a.meta.rank - b.meta.rank);
    const urgent = classified.filter(item => item.meta.group === 'urgent');
    const upcoming = classified.filter(item => item.meta.group === 'upcoming');
    const paid = classified.filter(item => item.meta.group === 'paid');
    const operational = app.state.costs.filter(cost => cost.category === 'reserve' || cost.kind === 'per_km');

    $('r360CostsHeadline').textContent = `${active.length} item(ns) ativos sustentam ${app.money(monthly)} por mês, além dos custos por quilômetro.`;
    $('r360CostMetrics').innerHTML = `
      <div class="r360-metric"><small>Contas/mês</small><strong>${app.money(Math.max(0, monthly - reserveMonthly))}</strong></div>
      <div class="r360-metric"><small>Reservas/mês</small><strong>${app.money(reserveMonthly)}</strong></div>
      <div class="r360-metric"><small>Custo/km</small><strong>${app.money(perKm)}</strong></div>
      <div class="r360-metric"><small>Itens ativos</small><strong>${active.length}</strong></div>`;

    const attention = $('r360CostAttention');
    if (urgent.length) attention.innerHTML = `<div class="r360-attention"><strong>${urgent.length === 1 ? 'Há uma obrigação que pede ação agora' : `Há ${urgent.length} obrigações que pedem ação agora`}</strong><small>${urgent.slice(0, 2).map(item => `${app.escape(item.cost.name)} — ${app.escape(item.meta.label)}`).join(' · ')}</small></div>`;
    else attention.innerHTML = `<div class="r360-positive"><strong>Nenhuma conta crítica agora</strong><small>Os próximos compromissos continuam organizados abaixo.</small></div>`;

    const renderGroup = (id, items, empty, payment = true) => {
      const node = $(id); if (!node) return;
      node.innerHTML = items.length ? items.map(item => costLine(item.cost || item, item.meta || dueMeta(item), payment)).join('') : `<div class="r360-empty">${empty}</div>`;
    };
    renderGroup('r360CostUrgent', urgent, 'Nada vencido ou com vencimento hoje.');
    renderGroup('r360CostUpcoming', upcoming, 'Cadastre o vencimento das suas obrigações para ver o que vem pela frente.');
    renderGroup('r360CostPaid', paid, 'Nenhum pagamento marcado neste período.');
    renderGroup('r360CostOperational', operational, 'Nenhuma reserva ou custo operacional cadastrado.', false);
    $('r360PaidDetails').open = false;
  };

  if (r360Costs) {
    r360Costs.addEventListener('click', event => {
      const payment = event.target.closest('[data-r360-payment]');
      if (payment) {
        const cost = app.state.costs.find(item => item.id === payment.dataset.r360Payment);
        if (!cost) return;
        const wasPaid = isPaid(cost);
        setPaid(cost, !wasPaid);
        app.save(); app.render(); vibrate(20);
        showSnackbar(wasPaid ? 'Pagamento reaberto.' : 'Pagamento marcado. A matemática do custo foi preservada.', () => {
          setPaid(cost, wasPaid); app.save(); app.render(); vibrate(12);
        });
        return;
      }
      const edit = event.target.closest('[data-r360-cost-edit]');
      if (edit) {
        const cost = app.state.costs.find(item => item.id === edit.dataset.r360CostEdit);
        if (cost) app.openCostModal(cost);
      }
    });
  }

  // R3.0 — Agora orientado por semana + mês.
  const dashboard = $('view-dashboard');
  let r360NowHero = null;
  let r360WeekSummary = null;
  let r360FinancialAttention = null;
  if (dashboard && !$('r360NowHero')) {
    const hero = dashboard.firstElementChild;
    const legacyHeroBody = q('.relative.z-10', hero);
    if (legacyHeroBody) legacyHeroBody.classList.add('r360-hidden');
    r360NowHero = document.createElement('div');
    r360NowHero.id = 'r360NowHero';
    r360NowHero.className = 'r360-section';
    hero.appendChild(r360NowHero);

    r360WeekSummary = document.createElement('button');
    r360WeekSummary.id = 'r360WeekSummary';
    r360WeekSummary.type = 'button';
    r360WeekSummary.className = 'r360-surface text-left w-full';
    r360WeekSummary.addEventListener('click', () => openResults('week'));

    r360FinancialAttention = document.createElement('section');
    r360FinancialAttention.id = 'r360FinancialAttention';
    r360FinancialAttention.className = 'r360-section';

    const targetCard = $('targetProfitDisplay')?.closest('.card-vetta');
    const nextAction = $('r1NextAction');
    const monthCard = $('monthStatusTitle')?.closest('.card-vetta');
    const insight = $('insightTitle')?.closest('.card-vetta');
    const oldRegister = q(':scope > button[data-view="day"]', dashboard);
    if (monthCard) monthCard.classList.add('r360-hidden');
    if (oldRegister) oldRegister.classList.add('r360-hidden');
    if (targetCard) {
      qa('input, .day-button', targetCard).forEach(node => node.classList.add('r360-hidden'));
      const dayWrap = q('.bg-slate-50', targetCard); if (dayWrap) dayWrap.classList.add('r360-hidden');
    }
    if (nextAction) {
      hero.after(nextAction);
      nextAction.after(r360WeekSummary);
      if (targetCard) r360WeekSummary.after(targetCard);
      if (targetCard) targetCard.after(r360FinancialAttention); else r360WeekSummary.after(r360FinancialAttention);
      if (insight) r360FinancialAttention.after(insight);
    }
  } else {
    r360NowHero = $('r360NowHero');
    r360WeekSummary = $('r360WeekSummary');
    r360FinancialAttention = $('r360FinancialAttention');
  }

  let nextActionMode = 'record';
  const nextActionButton = $('r1NextActionButton');
  if (nextActionButton && !nextActionButton.dataset.r360) {
    const clone = nextActionButton.cloneNode(true);
    clone.dataset.r360 = '1';
    nextActionButton.replaceWith(clone);
    clone.addEventListener('click', () => {
      if (nextActionMode === 'plan') return app.openSecondary('planning');
      if (nextActionMode === 'costs') return app.navigateToPrimary('costs');
      if (nextActionMode === 'results') return openResults('week');
      app.navigateToPrimary('day');
    });
  }

  const renderNow = () => {
    if (!r360NowHero) return;
    const c = app.calculations();
    const week = app.weekContext(c);
    const delta = week.actual - week.target;
    const hasWeek = week.records.length > 0;
    const weekLabel = !hasWeek ? 'Sua semana ainda não começou no VETTA' : delta >= 0 ? 'Sua semana está no ritmo' : `Faltam ${app.money(Math.abs(delta), 0)} para o ritmo da semana`;
    const monthRemaining = Math.max(0, app.state.targetProfit - c.actualNet);
    r360NowHero.innerHTML = `
      <span class="r360-eyebrow">Agora · ${new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'short'}).format(new Date())}</span>
      <strong class="r360-hero-value">${weekLabel}</strong>
      <p class="r360-hero-note">${hasWeek ? `${app.money(week.actual,0)} líquidos nesta semana de ${app.money(week.target,0)} planejados.` : 'Registre o primeiro dia para transformar o plano em acompanhamento real.'}</p>
      <div class="grid grid-cols-2 gap-3 mt-5">
        <div class="bg-white/10 rounded-2xl p-4"><span class="r360-eyebrow !text-slate-300">Mês</span><strong class="block mt-1">${app.money(c.actualNet,0)}</strong><small class="block mt-1 text-[10px] text-slate-300">${monthRemaining ? `${app.money(monthRemaining,0)} ainda faltam` : 'meta líquida alcançada'}</small></div>
        <div class="bg-white/10 rounded-2xl p-4"><span class="r360-eyebrow !text-slate-300">Projeção</span><strong class="block mt-1">${app.money(c.projectedNet,0)}</strong><small class="block mt-1 text-[10px] text-slate-300">com os dados atuais</small></div>
      </div>`;

    r360WeekSummary.innerHTML = `<span class="r360-eyebrow">Resumo semanal</span><div class="r360-metric-grid mt-3"><div class="r360-metric"><small>Realizado</small><strong>${app.money(week.actual,0)}</strong></div><div class="r360-metric"><small>Falta</small><strong>${app.money(Math.max(0,week.target-week.actual),0)}</strong></div><div class="r360-metric"><small>Dias</small><strong>${week.records.length}/${week.dates.length}</strong></div><div class="r360-metric"><small>Média/km</small><strong>${app.money(week.revenueKm)}</strong></div></div><span class="block mt-3 text-xs font-extrabold text-blue-600">Ver resultados da semana <i class="fas fa-arrow-right ml-1"></i></span>`;

    const critical = app.state.costs.filter(cost => cost.category === 'obligation' && cost.active && !isPaid(cost)).map(cost => ({ cost, meta: dueMeta(cost) })).filter(item => item.meta.rank < 22).sort((a,b)=>a.meta.rank-b.meta.rank).slice(0,2);
    r360FinancialAttention.innerHTML = critical.length
      ? `<div><span class="r360-eyebrow">Atenção financeira</span>${critical.map(item => `<button type="button" data-r360-now-cost="${app.escape(item.cost.id)}" class="r360-row mt-2"><span class="r360-row-icon"><i class="fas fa-receipt"></i></span><span class="r360-row-copy"><strong>${app.escape(item.cost.name)}</strong><small>${app.escape(item.meta.label)} · ${costCadence(item.cost)}</small></span><i class="fas fa-chevron-right text-slate-300"></i></button>`).join('')}</div>`
      : `<div class="r360-positive"><strong>Sem atenção financeira crítica agora</strong><small>Contas, reservas e custos continuam disponíveis em Custos.</small></div>`;

    const title = $('r1NextActionTitle');
    const text = $('r1NextActionText');
    const icon = $('r1NextActionIcon');
    const wrap = $('r1NextActionIconWrap');
    if (app.number(app.state.targetProfit) <= 0) {
      nextActionMode = 'plan'; if (title) title.textContent = 'Complete o objetivo do seu plano'; if (text) text.textContent = 'Sem meta líquida, o VETTA não consegue dizer se a semana está no ritmo.'; if (icon) icon.className = 'fas fa-bullseye';
    } else if (critical.length) {
      nextActionMode = 'costs'; if (title) title.textContent = 'Resolva a atenção financeira mais próxima'; if (text) text.textContent = `${critical[0].cost.name}: ${critical[0].meta.label.toLowerCase()}.`; if (icon) icon.className = 'fas fa-receipt';
    } else if (!c.records.length) {
      nextActionMode = 'record'; if (title) title.textContent = 'Registre seu primeiro dia'; if (text) text.textContent = 'O primeiro registro conecta planejamento e realidade.'; if (icon) icon.className = 'fas fa-plus';
    } else if (delta < 0) {
      nextActionMode = 'results'; if (title) title.textContent = 'Entenda o ritmo antes de mudar o plano'; if (text) text.textContent = 'Veja a semana e decida a próxima ação com base no realizado.'; if (icon) icon.className = 'fas fa-chart-line';
    } else {
      nextActionMode = 'record'; if (title) title.textContent = 'Continue alimentando o mês'; if (text) text.textContent = 'Seu ritmo está coerente. Registre o próximo dia quando terminar.'; if (icon) icon.className = 'fas fa-plus';
    }
    if (wrap) wrap.className = 'w-12 h-12 shrink-0 rounded-2xl bg-vetta-900 text-white grid place-items-center';
  };
  r360FinancialAttention?.addEventListener('click', event => {
    const button = event.target.closest('[data-r360-now-cost]');
    if (button) app.navigateToPrimary('costs');
  });

  // R3.2 — Resultados: interpretação principal em Semana | Mês.
  const historyRoot = $('view-history');
  const historyHub = $('historyHub');
  let resultsOverview = null;
  let resultDetail = null;
  let resultsChart = null;
  let activeResultDetail = null;
  if (historyHub && !$('r360ResultsOverview')) {
    resultsOverview = document.createElement('section');
    resultsOverview.id = 'r360ResultsOverview';
    resultsOverview.className = 'r360-section mb-6';
    resultsOverview.innerHTML = `
      <div class="r360-segment" aria-label="Período dos resultados"><button type="button" data-r360-period="week">Semana</button><button type="button" data-r360-period="month">Mês</button></div>
      <div id="r360ResultsHero" class="r360-hero"></div>
      <div id="r360ResultsMetrics" class="r360-metric-grid"></div>
      <div id="r360ResultsChartCard" class="r360-surface"><span class="r360-eyebrow">Evolução do líquido</span><div class="r360-chart mt-3"><canvas id="r360ResultsChart"></canvas></div></div>
      <div id="r360ResultsReading" class="r360-surface"></div>
      <div class="r360-surface"><div class="flex justify-between items-end gap-3"><div><span class="r360-eyebrow">Dias recentes</span><strong class="block mt-1">O que formou este resultado</strong></div><button id="r360ResultsAll" type="button" class="r360-link">Ver todos</button></div><div id="r360ResultsRecent" class="mt-3"></div></div>
      <div id="r360WeeklyRitual" class="r360-surface"></div>`;
    historyHub.prepend(resultsOverview);
    const oldHeader = q(':scope > div:not(#r360ResultsOverview)', historyHub);
    const oldIntro = oldHeader?.nextElementSibling;
    const oldIslands = q('[data-history-islands]', historyHub);
    if (oldHeader && oldIslands) {
      const details = document.createElement('details');
      details.id = 'r360ResultsDeepDive';
      details.className = 'r360-surface !p-0 overflow-hidden';
      details.innerHTML = '<summary class="details-summary"><div><span class="r360-eyebrow">Aprofundar</span><strong>Dias, evolução e comparações</strong></div><i class="fas fa-chevron-down"></i></summary><div class="p-4" data-r360-deep-body></div>';
      const body = q('[data-r360-deep-body]', details);
      historyHub.appendChild(details);
      body.append(oldHeader);
      if (oldIntro) body.append(oldIntro);
      body.append(oldIslands);
    }

    resultDetail = document.createElement('section');
    resultDetail.id = 'r360ResultDetail';
    resultDetail.className = 'r360-result-detail r360-section';
    resultDetail.hidden = true;
    historyRoot.appendChild(resultDetail);
  } else { resultsOverview = $('r360ResultsOverview'); resultDetail = $('r360ResultDetail'); }

  const periodData = period => {
    const c = app.calculations();
    if (period === 'month') {
      return { label:'Mês', records:c.records, target:app.state.targetProfit, net:c.actualNet, gross:c.actualGross, km:c.actualKm, revenueKm:c.avgRevenueKm, projected:c.projectedNet };
    }
    const week = app.weekContext(c);
    const gross = week.records.reduce((s,r)=>s+r.gross,0), km = week.records.reduce((s,r)=>s+r.km,0);
    return { label:'Semana', records:week.records, target:week.target, net:week.actual, gross, km, revenueKm:week.revenueKm, projected:null };
  };

  const previousWeekNet = () => {
    const currentMonday = mondayFor(new Date());
    const previousMonday = new Date(currentMonday); previousMonday.setDate(currentMonday.getDate()-7);
    const previousSunday = new Date(previousMonday); previousSunday.setDate(previousMonday.getDate()+6);
    return app.state.records.filter(record => {
      const date = app.parseDate(record.date); return date >= previousMonday && date <= previousSunday;
    }).map(record => app.recordNumbers(record)).reduce((sum,record)=>sum+record.net,0);
  };

  const renderResults = () => {
    if (!resultsOverview) return;
    const period = app.state.r360.resultsPeriod === 'month' ? 'month' : 'week';
    const data = periodData(period);
    const delta = data.net - data.target;
    qa('[data-r360-period]', resultsOverview).forEach(button => button.classList.toggle('active', button.dataset.r360Period === period));
    $('r360ResultsHero').innerHTML = `<span class="r360-eyebrow">${data.label}</span><strong class="r360-hero-value">${data.records.length ? app.money(data.net,0) : 'Ainda sem resultado'}</strong><p class="r360-hero-note">${data.records.length ? (delta >= 0 ? `${app.money(delta,0)} acima do ritmo planejado.` : `${app.money(Math.abs(delta),0)} abaixo do ritmo planejado.`) : 'Registre um dia para começar a interpretar sua performance.'}</p>`;
    const costs = Math.max(0, data.gross - data.net);
    $('r360ResultsMetrics').innerHTML = `<div class="r360-metric"><small>Bruto</small><strong>${app.money(data.gross,0)}</strong></div><div class="r360-metric"><small>Custos</small><strong>${app.money(costs,0)}</strong></div><div class="r360-metric"><small>Km</small><strong>${app.integer(data.km)}</strong></div><div class="r360-metric"><small>Média/km</small><strong>${app.money(data.revenueKm)}</strong></div>`;

    const chartCard = $('r360ResultsChartCard');
    if (!data.records.length || typeof Chart === 'undefined') {
      chartCard.classList.add('r360-hidden');
      if (resultsChart) { resultsChart.destroy(); resultsChart = null; }
    } else {
      chartCard.classList.remove('r360-hidden');
      const records = [...data.records].sort((a,b)=>a.date.localeCompare(b.date));
      if (resultsChart) resultsChart.destroy();
      resultsChart = new Chart($('r360ResultsChart'), { type:'line', data:{ labels:records.map(r=>app.parseDate(r.date).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})), datasets:[{ label:'Líquido', data:records.map(r=>r.net), borderColor:'#2563EB', backgroundColor:'rgba(37,99,235,.08)', fill:true, tension:.32, pointRadius:3 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}},y:{grid:{color:'#f1f5f9'},ticks:{callback:v=>`R$ ${Math.round(v)}`}}} } });
    }

    const reading = $('r360ResultsReading');
    if (!data.records.length) reading.innerHTML = `<span class="r360-eyebrow">Leitura VETTA</span><h3 class="r360-title !text-lg">Ainda não existe resultado para interpretar</h3><p class="r360-copy">Um registro já é suficiente para começar.</p><button type="button" data-r360-reading-action="record" class="r360-primary blue mt-4">Registrar primeiro dia</button>`;
    else if (delta < 0) reading.innerHTML = `<span class="r360-eyebrow">Leitura VETTA</span><h3 class="r360-title !text-lg">O ritmo pede atenção, não uma mudança automática de meta</h3><p class="r360-copy">Veja quais dias puxaram o resultado para baixo antes de alterar o planejamento.</p><button type="button" data-r360-reading-action="days" class="r360-secondary mt-4">Ver os dias deste período</button>`;
    else reading.innerHTML = `<span class="r360-eyebrow">Leitura VETTA</span><h3 class="r360-title !text-lg">O realizado sustenta o plano atual</h3><p class="r360-copy">Continue registrando para manter a projeção confiável.</p><button type="button" data-r360-reading-action="record" class="r360-secondary mt-4">Registrar próximo dia</button>`;

    const recent = [...data.records].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
    $('r360ResultsRecent').innerHTML = recent.length ? `<div class="r360-list">${recent.map(record => `<button type="button" class="r360-row" data-r360-result-date="${record.date}"><span class="r360-row-icon"><i class="fas fa-calendar-day"></i></span><span class="r360-row-copy"><strong>${app.parseDate(record.date).toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'})}</strong><small>${app.money(record.net,0)} líquidos · ${app.integer(record.km)} km</small></span><i class="fas fa-chevron-right text-slate-300"></i></button>`).join('')}</div>` : '<div class="r360-empty">Nenhum dia registrado neste período.</div>';

    const ritual = $('r360WeeklyRitual');
    const week = periodData('week');
    if (week.records.length >= 2) {
      const best = [...week.records].sort((a,b)=>b.net-a.net)[0];
      const hours = week.records.reduce((sum,r)=>sum+app.number(r.hours),0);
      const previous = previousWeekNet();
      const comparison = previous > 0 ? `${week.net >= previous ? '+' : '-'}${app.money(Math.abs(week.net-previous),0)} vs. semana anterior` : 'A comparação com a semana anterior aparece quando houver dados.';
      ritual.classList.remove('r360-hidden');
      ritual.innerHTML = `<span class="r360-eyebrow">Resumo semanal</span><h3 class="r360-title !text-lg">O que levar para a próxima semana</h3><div class="r360-metric-grid mt-4"><div class="r360-metric"><small>Melhor dia</small><strong>${app.money(best.net,0)}</strong></div><div class="r360-metric"><small>Ganho/h</small><strong>${hours>0?app.money(week.net/hours):'—'}</strong></div><div class="r360-metric"><small>Ganho/km</small><strong>${week.km>0?app.money(week.net/week.km):'—'}</strong></div><div class="r360-metric"><small>Comparação</small><strong class="!text-xs">${comparison}</strong></div></div><p class="r360-copy">${week.net >= week.target ? 'Mantenha o plano e preserve a frequência dos registros.' : 'Priorize os próximos dias planejados antes de aumentar a meta.'}</p>`;
    } else ritual.classList.add('r360-hidden');
  };

  function openResults(period = 'week') {
    app.state.r360.resultsPeriod = period === 'month' ? 'month' : 'week'; app.save();
    app.navigateToPrimary('history');
    requestAnimationFrame(() => { showResultsOverview(); renderResults(); });
  }
  const showResultsOverview = () => {
    if (!historyHub || !resultDetail) return;
    activeResultDetail = null;
    resultDetail.hidden = true;
    historyHub.hidden = false; historyHub.classList.remove('hidden'); historyHub.setAttribute('aria-hidden','false');
    const hero = historyRoot.firstElementChild; if (hero) { hero.hidden=false; hero.classList.remove('hidden'); }
    renderResults();
  };
  const openResultDetail = date => {
    const raw = app.state.records.find(item => item.date === date); if (!raw || !resultDetail) return;
    const record = app.recordNumbers(raw); activeResultDetail = date;
    const costs = record.fuel + record.variable + record.percentCost + record.fixedShare;
    resultDetail.innerHTML = `<div class="r360-result-head"><button type="button" data-r360-result-back aria-label="Voltar"><i class="fas fa-arrow-left"></i></button><div><span class="r360-eyebrow">Detalhe do dia</span><h2 class="r360-title !mt-1">${app.parseDate(date).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h2></div></div><div class="r360-hero"><span class="r360-eyebrow">Líquido</span><strong class="r360-hero-value">${app.money(record.net,0)}</strong><p class="r360-hero-note">${app.money(record.gross,0)} de faturamento em ${app.integer(record.km)} km.</p></div><div class="r360-metric-grid"><div class="r360-metric"><small>Custos</small><strong>${app.money(costs,0)}</strong></div><div class="r360-metric"><small>Receita/km</small><strong>${app.money(record.revenuePerKm)}</strong></div><div class="r360-metric"><small>Horas</small><strong>${record.hours?`${app.number(record.hours).toFixed(1)} h`:'—'}</strong></div><div class="r360-metric"><small>Custo/km</small><strong>${app.money(record.costPerKm)}</strong></div></div><button type="button" data-r360-edit-day="${date}" class="r360-primary blue">Editar este dia</button>`;
    historyHub.hidden = true; historyHub.classList.add('hidden');
    const hero = historyRoot.firstElementChild; if (hero) hero.classList.add('hidden');
    qa('[data-history-page]', historyRoot).forEach(page => page.classList.add('hidden'));
    resultDetail.hidden = false;
    window.scrollTo({top:0,behavior:'smooth'});
  };

  resultsOverview?.addEventListener('click', event => {
    const period = event.target.closest('[data-r360-period]'); if (period) { app.state.r360.resultsPeriod=period.dataset.r360Period; app.save(); renderResults(); return; }
    const date = event.target.closest('[data-r360-result-date]'); if (date) { openResultDetail(date.dataset.r360ResultDate); return; }
    const action = event.target.closest('[data-r360-reading-action]'); if (action?.dataset.r360ReadingAction === 'record') app.navigateToPrimary('day');
    if (action?.dataset.r360ReadingAction === 'days') q('[data-history-section-open="days"]', historyRoot)?.click();
  });
  $('r360ResultsAll')?.addEventListener('click', () => q('[data-history-section-open="days"]', historyRoot)?.click());
  resultDetail?.addEventListener('click', event => {
    if (event.target.closest('[data-r360-result-back]')) { showResultsOverview(); return; }
    const edit = event.target.closest('[data-r360-edit-day]');
    if (edit) {
      const date = edit.dataset.r360EditDay;
      app.r360ReturnContext = { view:'history', period:app.state.r360.resultsPeriod, date };
      app.navigateToPrimary('day');
      requestAnimationFrame(() => {
        const raw = app.state.records.find(item=>item.date===date); if (!raw) return;
        $('recordDate').value=raw.date; $('recordGross').value=raw.gross; $('recordKm').value=raw.km; $('recordHours').value=raw.hours||''; $('recordFuel').value=raw.fuelSpend||''; $('recordOptionalDetails').open=Boolean(raw.hours||raw.fuelSpend); app.renderRecordPreview();
      });
    }
  });

  // R3.1 + R8 — Registrar: rascunho, atualização explícita, sucesso com consequência.
  let lastSavedDate = null;
  const recordRoot = $('view-day');
  const saveDayButton = $('saveDayButton');
  if (recordRoot && saveDayButton && !$('r360RecordCancel')) {
    const hero = recordRoot.firstElementChild;
    const cancel = document.createElement('button');
    cancel.id='r360RecordCancel'; cancel.type='button'; cancel.className='r360-link !text-blue-200 !p-0 mt-4'; cancel.textContent='Cancelar'; hero?.appendChild(cancel);
    const dateInput = $('recordDate');
    const hint = document.createElement('p'); hint.id='r360RecordDateHint'; hint.className='r360-dirty-note'; dateInput?.closest('div')?.appendChild(hint);
    saveDayButton.classList.add('r360-save-sticky');

    const draftInputs = ['recordDate','recordGross','recordKm','recordHours','recordFuel'];
    const saveDraft = () => {
      const draft = Object.fromEntries(draftInputs.map(id=>[id,$(id)?.value||'']));
      if (draft.recordGross || draft.recordKm || draft.recordHours || draft.recordFuel) localStorage.setItem(RECORD_DRAFT_KEY,JSON.stringify(draft));
      else localStorage.removeItem(RECORD_DRAFT_KEY);
      syncRecordMode();
    };
    const restoreDraft = () => {
      try {
        const draft=JSON.parse(localStorage.getItem(RECORD_DRAFT_KEY)||'null'); if(!draft) return;
        draftInputs.forEach(id=>{ if(draft[id]!=null && $(id)) $(id).value=draft[id]; });
        if (draft.recordHours || draft.recordFuel) $('recordOptionalDetails').open=true;
        app.renderRecordPreview();
      } catch {}
      syncRecordMode();
    };
    const syncRecordMode = () => {
      const date=$('recordDate')?.value; const exists=Boolean(date&&app.state.records.some(r=>r.date===date));
      saveDayButton.textContent=exists?'Atualizar dia':'Salvar dia';
      if ($('r360RecordDateHint')) $('r360RecordDateHint').textContent=exists?'Já existe um registro nesta data. Salvar atualizará o mesmo dia, sem duplicar.':'';
    };
    draftInputs.forEach(id=>$(id)?.addEventListener('input',saveDraft));
    restoreDraft();
    cancel.addEventListener('click',()=>{
      const hasDraft=Boolean(localStorage.getItem(RECORD_DRAFT_KEY));
      if(hasDraft&&!confirm('Descartar o rascunho deste registro?')) return;
      localStorage.removeItem(RECORD_DRAFT_KEY); vibrate(8);
      if(history.length>1) history.back(); else app.navigateToPrimary('dashboard');
    });
  }

  const baseSaveDay = app.saveDay.bind(app);
  app.saveDay = function() {
    const draft=this.recordDraft();
    if(!draft.date||draft.gross<=0||draft.km<=0) return baseSaveDay();
    lastSavedDate=draft.date;
    baseSaveDay();
    localStorage.removeItem(RECORD_DRAFT_KEY);
    const c=this.calculations(),week=this.weekContext(c),remaining=Math.max(0,week.target-week.actual);
    const text=$('recordConfirmationText');
    if(text) text.textContent=`Este dia deixou a semana com ${this.money(week.actual,0)} líquidos${remaining?` e ${this.money(remaining,0)} ainda faltam para o ritmo planejado`:'. O ritmo semanal foi alcançado'}. A projeção mensal agora é ${this.money(c.projectedNet,0)}.`;
    const secondary=$('recordEditButton');
    if(secondary&&!secondary.dataset.r360){
      const clone=secondary.cloneNode(true); clone.dataset.r360='1'; clone.textContent='Ver resultados deste dia'; secondary.replaceWith(clone);
      clone.addEventListener('click',()=>{ if(!lastSavedDate)return; app.state.r360.resultsPeriod='week'; app.save(); app.navigateToPrimary('history'); requestAnimationFrame(()=>openResultDetail(lastSavedDate)); });
    }
    vibrate([18,24,18]);
  };

  // R4 — Onboarding de 3 passos orientado pela realidade do motorista.
  const onboarding = $('onboardingModal');
  let onboardingVehicle = 'own';
  const setupOnboarding = () => {
    if(!onboarding||onboarding.dataset.r360==='ready') return;
    const s1=$('onboardingStep1'),s2=$('onboardingStep2'),s3=$('onboardingStep3');
    const target=$('onboardingTarget'),fuelType=$('onboardingFuelType'),fuelPrice=$('onboardingFuelPrice'),fuelEff=$('onboardingFuelEff'),revenue=$('onboardingRevenue'),fixed=$('onboardingFixed');
    const targetWrap=target?.closest('.input-wrapper'),daysGrid=q('[data-onboarding-days]',s1)?.parentElement,fuelGrid=fuelPrice?.closest('.grid'),revenueWrap=revenue?.closest('div');
    if(!s1||!s2||!s3||!targetWrap||!daysGrid||!fuelType||!fuelGrid||!revenueWrap) return;
    fixed.value='0'; fixed.closest('div')?.classList.add('hidden');
    s1.replaceChildren(); s2.replaceChildren(); s3.replaceChildren();
    const vehicle=document.createElement('div'); vehicle.id='r360OnboardingVehicle'; vehicle.className='r360-onboarding-extra'; vehicle.innerHTML=`<p class="text-sm text-slate-500">Comece pela sua realidade de trabalho. Isso ajuda o VETTA a organizar custos e ritmo.</p><span class="label-micro">Seu carro hoje</span><div class="r360-choice-grid"><button type="button" class="r360-choice active" data-r360-vehicle="own">Próprio</button><button type="button" class="r360-choice" data-r360-vehicle="financed">Financiado</button><button type="button" class="r360-choice" data-r360-vehicle="rental">Alugado</button></div><div id="r360RentalFields" class="hidden grid grid-cols-2 gap-3"><div><label class="label-micro">Aluguel semanal</label><div class="input-wrapper"><span>R$</span><input id="r360RentalValue" type="number" step=".01" class="input-vetta"></div></div><div><label class="label-micro">Dia do pagamento</label><select id="r360RentalWeekday" class="input-vetta"><option value="1">Seg</option><option value="2">Ter</option><option value="3">Qua</option><option value="4">Qui</option><option value="5">Sex</option><option value="6">Sáb</option><option value="0">Dom</option></select></div></div>`;
    s1.append(vehicle);
    const daysLabel=document.createElement('label'); daysLabel.className='label-micro'; daysLabel.textContent='Quantos dias pretende trabalhar por semana?'; s1.append(daysLabel,daysGrid);
    const p2=document.createElement('p'); p2.className='text-sm text-slate-500'; p2.textContent='Agora defina quanto você quer manter livre no bolso ao fim do mês.'; const targetLabel=document.createElement('label'); targetLabel.className='label-micro'; targetLabel.textContent='Meta líquida mensal'; s2.append(p2,targetLabel,targetWrap); const translation=document.createElement('div'); translation.id='r360OnboardingTargetTranslation'; translation.className='r360-summary-note'; s2.append(translation);
    const p3=document.createElement('p'); p3.className='text-sm text-slate-500'; p3.textContent='Feche com a operação. Os valores podem ser ajustados depois e o VETTA aprende com os dias reais.'; const fuelLabel=document.createElement('label'); fuelLabel.className='label-micro'; fuelLabel.textContent='Combustível'; s3.append(p3,fuelLabel,fuelType,fuelGrid,revenueWrap); const summary=document.createElement('div'); summary.id='r360OnboardingReview'; summary.className='r360-summary-note'; s3.append(summary);

    const saveOnboardingDraft=()=>{
      const draft={step:app.onboardingStep,vehicle:onboardingVehicle,days:app.onboardingDays,target:target.value,fuelType:fuelType.value,fuelPrice:fuelPrice.value,fuelEff:fuelEff.value,revenue:revenue.value,rentalValue:$('r360RentalValue')?.value||'',rentalWeekday:$('r360RentalWeekday')?.value||'1'};
      localStorage.setItem(ONBOARDING_DRAFT_KEY,JSON.stringify(draft)); updateOnboardingCopy();
    };
    const updateOnboardingCopy=()=>{
      const targetValue=app.number(target.value),days=Math.max(1,app.onboardingDays||6); const weekly=targetValue*12/52;
      $('r360OnboardingTargetTranslation').textContent=targetValue>0?`${app.money(targetValue,0)} líquidos por mês equivalem a cerca de ${app.money(weekly,0)} por semana antes de considerar o ritmo dos dias.`:'Defina uma meta maior que zero para o VETTA montar o plano.';
      const meta=fuelMeta[fuelType.value]||fuelMeta.gnv;
      $('r360OnboardingReview').innerHTML=`<strong class="block mb-1">Revisão rápida</strong>${days} dias/semana · ${meta.label} a ${app.money(fuelPrice.value)} por ${meta.unit} · ${app.number(fuelEff.value).toFixed(1)} km/${meta.unit} · receita estimada ${app.money(revenue.value)}/km.${onboardingVehicle==='rental'&&app.number($('r360RentalValue')?.value)>0?` Aluguel ${app.money($('r360RentalValue').value)}/semana será criado como obrigação.`:''}`;
    };
    vehicle.addEventListener('click',event=>{const button=event.target.closest('[data-r360-vehicle]');if(!button)return;onboardingVehicle=button.dataset.r360Vehicle;qa('[data-r360-vehicle]',vehicle).forEach(item=>item.classList.toggle('active',item===button));$('r360RentalFields').classList.toggle('hidden',onboardingVehicle!=='rental');saveOnboardingDraft();});
    [target,fuelPrice,fuelEff,revenue,$('r360RentalValue'),$('r360RentalWeekday')].forEach(input=>input?.addEventListener('input',saveOnboardingDraft));
    fuelType.addEventListener('change',()=>setTimeout(saveOnboardingDraft,0)); qa('[data-onboarding-days]',daysGrid).forEach(button=>button.addEventListener('click',()=>setTimeout(saveOnboardingDraft,0)));

    app.renderOnboardingStep=function(){[1,2,3].forEach(step=>$(`onboardingStep${step}`).classList.toggle('hidden',step!==this.onboardingStep)); const titles=['Como você trabalha hoje?','Quanto quer que sobre?','Como é sua operação?']; $('onboardingTitle').textContent=titles[this.onboardingStep-1]; $('onboardingProgress').textContent=`${this.onboardingStep} de 3`; $('onboardingProgress').setAttribute('aria-label',`Etapa ${this.onboardingStep} de 3`); $('onboardingBar').style.width=`${this.onboardingStep/3*100}%`; $('onboardingBack').classList.toggle('invisible',this.onboardingStep===1); $('onboardingNext').textContent=this.onboardingStep===3?'Montar meu plano':'Continuar'; updateOnboardingCopy();};
    app.nextOnboarding=function(){
      if(this.onboardingStep===1){if(onboardingVehicle==='rental'&&this.number($('r360RentalValue').value)<=0)return this.toast('Informe o valor semanal do aluguel.');this.onboardingStep=2;this.renderOnboardingStep();saveOnboardingDraft();return;}
      if(this.onboardingStep===2){if(this.number(target.value)<=0)return this.toast('Informe uma meta líquida mensal.');this.onboardingStep=3;this.renderOnboardingStep();saveOnboardingDraft();return;}
      if(this.number(fuelPrice.value)<=0||this.number(fuelEff.value)<=0)return this.toast('Informe preço e rendimento do combustível.');
      const type=fuelType.value,meta=fuelMeta[type]||fuelMeta.gnv;
      this.state.targetProfit=this.number(target.value); this.state.workWeekdays=this.weekdaysForCount(this.onboardingDays||6); this.state.fuel={type,label:meta.label,unit:meta.unit,price:this.number(fuelPrice.value),efficiency:this.number(fuelEff.value)}; this.state.revenueKm=this.number(revenue.value)||1.75; this.state.costs=[{id:'maintenance-onboarding',name:'Reserva de manutenção',kind:'per_km',category:'reserve',value:.18,active:true,paidPeriods:[]}];
      this.state.r360={...defaultR360(),...(this.state.r360||{}),vehicleOwnership:onboardingVehicle};
      if(onboardingVehicle==='rental')this.state.costs.push({id:'r360-rental',name:'Aluguel do carro',kind:'weekly',category:'obligation',value:this.number($('r360RentalValue').value),active:true,dueWeekday:Number($('r360RentalWeekday').value),paidPeriods:[]});
      this.state.onboardingComplete=true; this.save(); localStorage.removeItem(ONBOARDING_DRAFT_KEY); this.closeModal('onboardingModal'); this.syncInputs(); this.render(); this.navigateToPrimary('dashboard'); vibrate([18,24,18]); this.toast('Plano inicial montado. O VETTA já pode acompanhar seu mês.');
    };
    app.previousOnboarding=function(){if(this.onboardingStep>1){this.onboardingStep-=1;this.renderOnboardingStep();saveOnboardingDraft();}};

    try{const draft=JSON.parse(localStorage.getItem(ONBOARDING_DRAFT_KEY)||'null');if(draft&&!app.state.onboardingComplete){app.onboardingStep=Math.min(3,Math.max(1,Number(draft.step)||1));app.onboardingDays=Number(draft.days)||6;target.value=draft.target||target.value;fuelType.value=draft.fuelType||fuelType.value;app.fillOnboardingFuel(fuelType.value);fuelPrice.value=draft.fuelPrice||fuelPrice.value;fuelEff.value=draft.fuelEff||fuelEff.value;revenue.value=draft.revenue||revenue.value;onboardingVehicle=draft.vehicle||'own';qa('[data-r360-vehicle]',vehicle).forEach(item=>item.classList.toggle('active',item.dataset.r360Vehicle===onboardingVehicle));$('r360RentalFields').classList.toggle('hidden',onboardingVehicle!=='rental');$('r360RentalValue').value=draft.rentalValue||'';$('r360RentalWeekday').value=draft.rentalWeekday||'1';qa('[data-onboarding-days]',daysGrid).forEach(button=>button.classList.toggle('active',Number(button.dataset.onboardingDays)===app.onboardingDays));}}
    catch{}
    app.renderOnboardingStep(); onboarding.dataset.r360='ready';
  };
  setupOnboarding();

  // R6 — Mais: lista agrupada, importação segura, relatório por período e app/notificações.
  const moreRoot=$('view-more'),moreHub=$('moreHub');
  let notificationsPage=null;
  if(moreHub){
    const islands=q('[data-more-islands]',moreHub); if(islands) islands.classList.add('r360-list');
    const addEvent=$('addEventButton'); if(addEvent){addEvent.innerHTML='<i class="fas fa-plus mr-2"></i>Adicionar evento';addEvent.className='r360-primary blue';}
    if(islands&&!q('[data-r360-more-open="notifications"]',islands)){
      const button=document.createElement('button');button.type='button';button.className='r360-row';button.dataset.r360MoreOpen='notifications';button.innerHTML='<span class="r360-row-icon"><i class="fas fa-bell"></i></span><span class="r360-row-copy"><strong>Notificações e rituais</strong><small>Avisos contextuais quando existe uma ação útil</small></span><i class="fas fa-chevron-right text-slate-300"></i>';islands.appendChild(button);
      notificationsPage=document.createElement('section');notificationsPage.id='r360MoreNotifications';notificationsPage.className='r360-more-page r360-section';notificationsPage.hidden=true;notificationsPage.innerHTML=`<div class="r360-result-head"><button type="button" data-r360-more-back aria-label="Voltar"><i class="fas fa-arrow-left"></i></button><div><span class="r360-eyebrow">Preferências</span><h2 class="r360-title !mt-1">Notificações úteis</h2></div></div><div class="r360-surface"><p class="r360-copy !mt-0">O VETTA só pede permissão do sistema depois que você ativa um benefício. Sem servidor, os avisos do sistema podem ser emitidos quando o aplicativo estiver ativo; não simulamos push com o app fechado.</p><div id="r360NotificationToggles" class="mt-4"></div></div>`;moreRoot.appendChild(notificationsPage);
    } else notificationsPage=$('r360MoreNotifications');
  }

  const notificationDefs=[['dueCosts','Contas próximas','Conta vence hoje/amanhã e continua pendente.'],['weeklySummary','Resumo semanal','Mostra quando a semana tem dados suficientes para revisão.'],['pace','Queda de ritmo','Avisa quando ainda existe janela realista de recuperação.'],['missingRecords','Dias sem registro','Sinaliza quando a projeção começa a ficar fraca.'],['incompletePlan','Plano incompleto','Lembra o que falta depois que você já conhece o VETTA.']];
  const renderNotificationPrefs=()=>{
    const root=$('r360NotificationToggles');if(!root)return;root.innerHTML=notificationDefs.map(([key,title,copy])=>`<label class="r360-toggle"><input type="checkbox" data-r360-notification="${key}" ${app.state.r360.notifications[key]?'checked':''}><span><strong>${title}</strong><small>${copy}</small></span></label>`).join('');
  };
  const openNotifications=()=>{
    if(!moreHub||!notificationsPage)return;history.pushState({vettaNavigation:true,view:'more',primaryView:'more',r360More:'notifications'},'',location.href);q(':scope > div:first-child',moreRoot)?.classList.add('hidden');moreHub.classList.add('hidden');qa('[data-more-page]',moreRoot).forEach(page=>page.classList.add('hidden'));notificationsPage.hidden=false;renderNotificationPrefs();window.scrollTo({top:0,behavior:'smooth'});
  };
  moreHub?.addEventListener('click',event=>{if(event.target.closest('[data-r360-more-open="notifications"]'))openNotifications();});
  notificationsPage?.addEventListener('click',event=>{if(event.target.closest('[data-r360-more-back]'))history.back();});
  notificationsPage?.addEventListener('change',async event=>{
    const input=event.target.closest('[data-r360-notification]');if(!input)return;const key=input.dataset.r360Notification;
    if(input.checked&&'Notification'in window&&Notification.permission==='default'){const permission=await Notification.requestPermission();if(permission!=='granted'){input.checked=false;app.toast('Permissão não concedida. Os avisos no aplicativo continuam funcionando.');return;}}
    app.state.r360.notifications[key]=input.checked;app.save();vibrate(10);
  });

  const safeImportInput=()=>{
    const old=$('importInput');if(!old||old.dataset.r360)return;
    const clone=old.cloneNode(true);clone.dataset.r360='1';old.replaceWith(clone);let pending=null;
    const card=clone.closest('.card-vetta');const preview=document.createElement('div');preview.id='r360ImportPreview';preview.className='r360-safe-import';preview.hidden=true;preview.innerHTML='<div data-r360-import-copy></div><button type="button" data-r360-import-confirm class="r360-primary blue mt-3">Confirmar importação</button><button type="button" data-r360-import-cancel class="r360-secondary mt-2">Cancelar</button>';card?.appendChild(preview);
    clone.addEventListener('change',async()=>{const file=clone.files?.[0];if(!file)return;try{const parsed=JSON.parse(await file.text());const data=parsed?.data||parsed;if(!data||typeof data!=='object'||(data.records&&!Array.isArray(data.records))||(data.costs&&!Array.isArray(data.costs)))throw new Error('formato');pending=app.normalizeState(data);q('[data-r360-import-copy]',preview).textContent=`Backup válido: ${(pending.records||[]).length} registros, ${(pending.costs||[]).length} custos e versão de dados ${pending.version}. Seus dados atuais só serão substituídos depois da confirmação.`;preview.hidden=false;}catch{pending=null;preview.hidden=true;app.toast('Arquivo inválido. Seus dados atuais não foram alterados.');}clone.value='';});
    preview.addEventListener('click',event=>{if(event.target.closest('[data-r360-import-cancel]')){pending=null;preview.hidden=true;return;}if(event.target.closest('[data-r360-import-confirm]')&&pending){app.state=pending;app.save();app.syncInputs();app.render();pending=null;preview.hidden=true;vibrate([18,20,18]);app.toast('Backup importado com segurança.');}});
  };
  safeImportInput();

  const setupReport=()=>{
    const old=$('reportButton');if(!old||old.dataset.r360)return;const clone=old.cloneNode(true);clone.dataset.r360='1';old.replaceWith(clone);const card=clone.closest('.card-vetta');const picker=document.createElement('div');picker.className='mb-4';picker.innerHTML='<label class="label-micro">Período do relatório</label><input id="r360ReportMonth" type="month" class="input-vetta no-mask"><div id="r360ReportPreview" class="r360-summary-note mt-3"></div>';card?.insertBefore(picker,clone.parentElement||clone);const input=$('r360ReportMonth');input.value=app.monthKey();const sync=()=>{const s=app.monthSummary(input.value);$('r360ReportPreview').textContent=s.records.length?`${s.records.length} dias · ${app.money(s.gross,0)} bruto · ${app.money(s.net,0)} líquido · ${app.integer(s.km)} km.`:'Este período ainda não tem registros. O relatório mostrará o estado vazio sem inventar dados.';};input.addEventListener('input',sync);sync();clone.addEventListener('click',()=>{const s=app.monthSummary(input.value);app.$('reportSheet').innerHTML=`<div class="report-title">VETTA</div><div class="report-muted">Relatório de ${app.parseDate(`${input.value}-15`).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</div><div class="report-grid" style="margin-top:20px"><div class="report-metric"><div class="report-muted">Dias</div><strong>${s.records.length}</strong></div><div class="report-metric"><div class="report-muted">Faturamento</div><strong>${app.money(s.gross)}</strong></div><div class="report-metric"><div class="report-muted">Líquido</div><strong>${app.money(s.net)}</strong></div><div class="report-metric"><div class="report-muted">Km</div><strong>${app.integer(s.km)} km</strong></div></div>`;window.print();});
  };
  setupReport();

  const setupCompareConfirm=()=>{
    [['applyGasButton','gasoline'],['applyGnvButton','gnv']].forEach(([id,type])=>{const old=$(id);if(!old||old.dataset.r360)return;const clone=old.cloneNode(true);clone.dataset.r360='1';old.replaceWith(clone);clone.addEventListener('click',()=>{const label=type==='gasoline'?'Gasolina':'GNV';if(!confirm(`Usar ${label} como combustível das metas? A meta só será recalculada depois desta confirmação.`))return;app.applyCompareFuel(type);app.openSecondary('planning');setTimeout(()=>q('[data-planning-section-open="operation"]')?.click(),60);vibrate(15);});});
  };
  setupCompareConfirm();

  const renderAppPage=()=>{
    const button=$('installCardButton'),label=$('appVersionLabel');if(!button)return;if(label)label.textContent=`Versão ${app.state.release||'3.5.1'}`;if(app.isStandalone?.()){button.disabled=true;button.classList.remove('text-left');button.innerHTML=`<div class="text-left"><span class="label-micro !text-emerald-700">Aplicativo</span><strong class="block text-emerald-700">VETTA instalado</strong><span id="appVersionLabel" class="block text-[10px] text-slate-400 mt-1">Versão ${app.state.release||'3.5.1'}</span></div><i class="fas fa-circle-check text-emerald-600"></i>`;}}

  // R7 — contexto: alertas do sistema apenas enquanto a aplicação pode avaliar o estado.
  const maybeNotify=async()=>{
    if(!('Notification'in window)||Notification.permission!=='granted'||!navigator.serviceWorker?.controller)return;
    const prefs=app.state.r360.notifications;const candidates=[];const critical=app.state.costs.filter(cost=>cost.category==='obligation'&&cost.active&&!isPaid(cost)).map(cost=>({cost,meta:dueMeta(cost)})).filter(item=>item.meta.rank<=10).sort((a,b)=>a.meta.rank-b.meta.rank);
    if(prefs.dueCosts&&critical[0])candidates.push({tag:`cost-${critical[0].cost.id}-${app.todayKey()}`,title:`${critical[0].cost.name}: ${critical[0].meta.label}`,body:'O custo continua na matemática. Abra Custos para marcar o pagamento sem desativá-lo.',url:`./app-shell.html?vetta=costs&cost=${encodeURIComponent(critical[0].cost.id)}`});
    const c=app.calculations(),week=app.weekContext(c);if(prefs.pace&&week.records.length&&week.actual<week.target)candidates.push({tag:`pace-${app.dateKey(mondayFor())}`,title:'Sua semana está abaixo do ritmo',body:`Faltam ${app.money(week.target-week.actual,0)} para o planejado. Veja os dias antes de ajustar a meta.`,url:'./app-shell.html?vetta=results&period=week'});
    if(prefs.incompletePlan&&app.number(app.state.targetProfit)<=0)candidates.push({tag:`plan-${app.todayKey()}`,title:'Seu plano ainda precisa de uma meta',body:'Defina o objetivo líquido para o VETTA conseguir orientar o mês.',url:'./app-shell.html?vetta=plan'});
    let dedupe={};try{dedupe=JSON.parse(localStorage.getItem(NOTIFICATION_DEDUPE_KEY)||'{}');}catch{}
    const candidate=candidates.find(item=>!dedupe[item.tag]);if(!candidate)return;dedupe[candidate.tag]=Date.now();localStorage.setItem(NOTIFICATION_DEDUPE_KEY,JSON.stringify(dedupe));navigator.serviceWorker.controller.postMessage({type:'SHOW_CONTEXT_NOTIFICATION',payload:candidate});
  };

  // R8/R9 — shell, continuidade, scroll e navegação adaptativa.
  const nav=q('nav.fixed.bottom-0');
  const navInner=q('.max-w-lg',nav);
  if(navInner&&!nav.dataset.r360){
    const now=q('[data-view="dashboard"]',nav),register=q('[data-view="day"]',nav),results=q('[data-view="history"]',nav),costs=q('[data-view="costs"]',nav),more=q('[data-view="more"]',nav);
    [now,results,register,costs,more].forEach(button=>button&&navInner.appendChild(button));register?.classList.add('r360-register-action');nav.dataset.r360='ready';
  }

  const scrollByView=new Map();
  const baseShowView=app.showView.bind(app);
  app.showView=function(view,primaryView=view){
    if(this.currentView)scrollByView.set(this.currentView,window.scrollY);
    baseShowView(view,primaryView);
    const isRecord=view==='day';document.body.classList.toggle('r360-registering',isRecord);
    const onboardingOpen=onboarding&&!onboarding.classList.contains('hidden');document.body.classList.toggle('r360-onboarding',onboardingOpen);
    if(view==='history'&&!history.state?.historySection&&!history.state?.r360Detail)requestAnimationFrame(()=>showResultsOverview());
    if(view==='more'&&history.state?.r360More==='notifications')requestAnimationFrame(openNotifications);
    const restore=isRecord?0:(scrollByView.get(view)||0);requestAnimationFrame(()=>window.scrollTo({top:restore,behavior:'auto'}));
    if(isRecord){try{const draft=JSON.parse(localStorage.getItem(RECORD_DRAFT_KEY)||'null');if(draft){['recordDate','recordGross','recordKm','recordHours','recordFuel'].forEach(id=>{if(draft[id]!=null&&$(id))$(id).value=draft[id];});app.renderRecordPreview();}}catch{}const date=$('recordDate')?.value;const exists=Boolean(date&&app.state.records.some(r=>r.date===date));if($('saveDayButton'))$('saveDayButton').textContent=exists?'Atualizar dia':'Salvar dia';}
    renderAll();
  };

  if(onboarding){new MutationObserver(()=>document.body.classList.toggle('r360-onboarding',!onboarding.classList.contains('hidden'))).observe(onboarding,{attributes:true,attributeFilter:['class']});}
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){renderAll();maybeNotify();}});

  const routeFromUrl=()=>{
    const params=new URLSearchParams(location.search);const target=params.get('vetta');if(!target)return;
    history.replaceState({vettaNavigation:true,view:'dashboard',primaryView:'dashboard'},'',location.pathname);
    if(target==='costs')app.navigateToPrimary('costs');
    else if(target==='results')openResults(params.get('period')||'week');
    else if(target==='plan')app.openSecondary('planning');
    else if(target==='record')app.navigateToPrimary('day');
  };

  const baseRender=app.render.bind(app);
  app.render=function(){baseRender();renderAll();};

  const renderMoreSummaries=()=>{
    renderAppPage();
    const data=$('moreHubSummary-data');if(data)data.textContent=`${(app.state.records||[]).length} registros · ${(app.state.costs||[]).length} custos · versão de dados ${app.state.version}`;
  };

  function renderAll(){
    renderR360Costs();renderNow();renderResults();renderNotificationPrefs();renderMoreSummaries();
    const onboardingOpen=onboarding&&!onboarding.classList.contains('hidden');document.body.classList.toggle('r360-onboarding',onboardingOpen);
  }

  renderAll();
  routeFromUrl();
  setTimeout(maybeNotify,800);

  // Marcadores auditáveis do fechamento R10.
  document.body.dataset.r360='r10';
  app.r360Audit={version:STATE_VERSION,paymentPeriodKey,isPaid,dueMeta,openResults,openResultDetail,renderAll};
})();
