(() => {
  const app = window.__vettaApp;
  const root = document.getElementById('view-planning');

  if (!app || !root || root.dataset.block1a !== 'ready' || root.dataset.block3 === 'ready') return;

  const $ = id => document.getElementById(id);
  const hero = root.firstElementChild;
  const summary = $('planningTarget')?.closest('.card-vetta');
  const note = [...root.children].find(element => element.classList.contains('rounded-2xl') && element.classList.contains('bg-blue-50'));

  const definitions = [
    { key: 'goals', anchorId: 'planningTargetInput', label: '1 · Objetivo', title: 'Quanto você quer que sobre?', description: 'Defina o líquido desejado. Todo o resto do plano parte daqui.', icon: 'fa-bullseye', tone: 'text-emerald-600 bg-emerald-50', core: true },
    { key: 'agenda', anchorId: 'planningDaysOffInput', label: '2 · Agenda', title: 'Quando você pretende trabalhar?', description: 'Escolha dias de trabalho e folgas para distribuir a meta com realidade.', icon: 'fa-calendar-days', tone: 'text-blue-600 bg-blue-50', core: true },
    { key: 'costs', anchorId: 'planningCostList', label: '3 · Dinheiro comprometido', title: 'Quais custos o mês precisa sustentar?', description: 'Contas, custos por km e reservas entram antes de calcular o que precisa faturar.', icon: 'fa-wallet', tone: 'text-red-600 bg-red-50', core: true },
    { key: 'operation', anchorId: 'planningFuelType', label: '4 · Operação', title: 'Quanto custa e quanto rende rodar?', description: 'Combustível e receita por km transformam objetivo em quilômetros e faturamento.', icon: 'fa-gas-pump', tone: 'text-amber-600 bg-amber-50', core: true },
    { key: 'distribution', anchorId: 'planningRevenueChart', label: 'Análise', title: 'Como o faturamento será distribuído', description: 'Entenda quanto vai para combustível, custos, reservas e líquido.', icon: 'fa-chart-pie', tone: 'text-purple-600 bg-purple-50', core: false },
    { key: 'learning', anchorId: 'planningLearningText', label: 'Aprendizado', title: 'O que seus próprios dias estão ensinando', description: 'Veja sugestões baseadas na realidade sem mudanças automáticas.', icon: 'fa-wand-magic-sparkles', tone: 'text-indigo-600 bg-indigo-50', core: false },
    { key: 'advanced', anchorId: 'planningResetButton', label: 'Avançado', title: 'Restaurar parâmetros', description: 'Use somente quando quiser voltar aos valores padrão.', icon: 'fa-sliders', tone: 'text-slate-600 bg-slate-100', core: false },
  ];

  const locateHost = anchorId => {
    const anchor = $(anchorId);
    if (!anchor) return null;
    const host = anchor.closest('details, .card-vetta');
    return host?.parentElement === root ? host : null;
  };

  const hosts = definitions.map(definition => locateHost(definition.anchorId));
  const required = [hero, summary, note, ...hosts];
  if (required.some(item => !item) || new Set(hosts).size !== hosts.length) {
    console.warn('R1 Planejamento não aplicado: a tela funcional anterior foi preservada porque um destino obrigatório não foi encontrado.');
    return;
  }

  const setHidden = (element, hidden) => {
    element.hidden = hidden;
    element.classList.toggle('hidden', hidden);
    element.setAttribute('aria-hidden', String(hidden));
  };

  const heroEyebrow = hero.querySelector('span');
  const heroTitle = hero.querySelector('h2');
  const heroText = hero.querySelector('p');
  if (heroEyebrow) heroEyebrow.textContent = 'Plano do mês';
  if (heroTitle) heroTitle.textContent = 'Organize o mês antes de correr atrás da meta';
  if (heroText) heroText.textContent = 'Objetivo, agenda, custos e operação formam um único plano. Ajuste na ordem que o dinheiro acontece.';

  const oldBadge = [...summary.querySelectorAll('span')].find(element => element.textContent.trim() === 'BLOCO 1A');
  if (oldBadge) {
    oldBadge.textContent = 'PLANO';
    oldBadge.className = 'px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold';
  }
  const summaryLabel = summary.querySelector('.label-micro');
  const summaryTitle = summary.querySelector('h3');
  if (summaryLabel) summaryLabel.textContent = 'Seu mês em números';
  if (summaryTitle) summaryTitle.textContent = 'O plano que sustenta sua meta';

  const hub = document.createElement('section');
  hub.id = 'planningHub';
  hub.className = 'space-y-5';
  hub.innerHTML = `
    <div>
      <span class="label-micro !text-vetta-900">Monte de cima para baixo</span>
      <h3 class="text-xl font-extrabold">Quatro decisões formam seu plano</h3>
      <p class="text-xs text-slate-500 mt-2 leading-relaxed">O VETTA mostra o estado de cada parte. Você pode ajustar só o que precisa, sem refazer o mês inteiro.</p>
    </div>
    <div class="overflow-hidden rounded-[1.6rem] bg-white border border-slate-100" data-planning-core></div>
    <details id="planningSecondary" class="rounded-[1.4rem] bg-slate-50 overflow-hidden">
      <summary class="details-summary !px-5 !py-4"><div><span class="label-micro !mb-0">Depois do essencial</span><strong>Análises e opções</strong></div><i class="fas fa-chevron-down" aria-hidden="true"></i></summary>
      <div class="border-t border-slate-100" data-planning-secondary></div>
    </details>`;

  const coreList = hub.querySelector('[data-planning-core]');
  const secondaryList = hub.querySelector('[data-planning-secondary]');
  const createRow = definition => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.planningSectionOpen = definition.key;
    button.className = 'w-full min-h-[76px] px-5 py-4 flex items-center gap-4 text-left border-b border-slate-100 last:border-b-0 active:bg-slate-50 transition-colors';
    button.setAttribute('aria-controls', `planningPage-${definition.key}`);
    button.innerHTML = `
      <span class="w-11 h-11 shrink-0 rounded-2xl grid place-items-center ${definition.tone}" aria-hidden="true"><i class="fas ${definition.icon}"></i></span>
      <span class="min-w-0 flex-1">
        <span class="label-micro !mb-1">${definition.label}</span>
        <strong class="block text-sm">${definition.title}</strong>
        <small id="planningHubSummary-${definition.key}" class="block text-xs text-slate-500 mt-1 leading-relaxed">${definition.description}</small>
        ${definition.core ? `<span id="planningStatus-${definition.key}" class="inline-flex items-center gap-1.5 mt-2 text-[10px] font-extrabold text-slate-400"><i class="fas fa-circle text-[6px]" aria-hidden="true"></i><span>Verificar</span></span>` : ''}
      </span>
      <i class="fas fa-chevron-right text-slate-300" aria-hidden="true"></i>`;
    return button;
  };

  definitions.forEach(definition => (definition.core ? coreList : secondaryList).appendChild(createRow(definition)));
  summary.after(hub);

  const pages = new Map();
  definitions.forEach((definition, index) => {
    const host = hosts[index];
    const page = document.createElement('section');
    page.id = `planningPage-${definition.key}`;
    page.dataset.planningPage = definition.key;
    page.className = 'space-y-4';
    page.innerHTML = `
      <button type="button" data-planning-section-back class="-ml-2 min-h-[44px] px-2 py-2 text-xs font-extrabold text-blue-600">
        <i class="fas fa-arrow-left mr-2" aria-hidden="true"></i>Voltar para o plano
      </button>
      <div class="rounded-[2rem] bg-vetta-900 p-7 text-white">
        <span class="text-[10px] text-blue-300 font-extrabold uppercase tracking-widest">${definition.label}</span>
        <h2 class="text-2xl font-extrabold mt-2">${definition.title}</h2>
        <p class="text-sm text-slate-400 mt-2">${definition.description}</p>
      </div>`;
    host.before(page);
    page.appendChild(host);
    if (host.tagName === 'DETAILS') host.open = true;
    pages.set(definition.key, page);
  });

  note.innerHTML = '<strong>Plano guiado:</strong> objetivo, agenda, custos e operação formam o essencial. Análises ficam disponíveis sem competir com o que você precisa decidir primeiro.';
  let currentSection = null;

  const setStatus = (key, ok, text) => {
    const target = $(`planningStatus-${key}`);
    if (!target) return;
    target.className = `inline-flex items-center gap-1.5 mt-2 text-[10px] font-extrabold ${ok ? 'text-emerald-700' : 'text-orange-600'}`;
    const label = target.querySelector('span');
    if (label) label.textContent = text;
  };

  const syncHub = () => {
    const calculations = app.calculations();
    const target = app.number(app.state.targetProfit);
    const workdays = app.state.workWeekdays?.length || 0;
    const activeCosts = calculations.costs.active.length;
    const revenue = app.number(app.state.revenueKm);
    const summaries = {
      goals: target > 0 ? `${app.money(target, 0)} líquidos · ${app.money(calculations.dailyGross, 0)} de bruto por dia` : 'Sem meta definida. Comece por aqui.',
      agenda: workdays ? `${workdays} dias da semana selecionados · ${app.state.extraDaysOff} folga(s) extra(s)` : 'Escolha pelo menos um dia de trabalho.',
      costs: activeCosts ? `${activeCosts} ${activeCosts === 1 ? 'item ativo' : 'itens ativos'} · ${app.money(calculations.costs.monthlyFixed)}/mês em obrigações e reservas` : 'Nenhum custo ativo. Revise o que seu mês precisa sustentar.',
      operation: `${app.state.fuel.label} · ${app.money(calculations.fuelKm)}/km · ${app.money(revenue)}/km de receita média`,
      distribution: `${app.money(calculations.totalGross)} de faturamento bruto necessário`,
      learning: $('planningLearningText')?.textContent || 'As sugestões aparecem depois dos primeiros registros.',
      advanced: 'Restaura parâmetros e preserva histórico e radar.',
    };

    Object.entries(summaries).forEach(([key, value]) => {
      const targetElement = $(`planningHubSummary-${key}`);
      if (targetElement) targetElement.textContent = value;
    });

    setStatus('goals', target > 0, target > 0 ? 'Meta definida' : 'Definir meta');
    setStatus('agenda', workdays > 0, workdays > 0 ? 'Agenda definida' : 'Escolher dias');
    setStatus('costs', activeCosts > 0, activeCosts > 0 ? 'Custos revisáveis' : 'Revisar custos');
    setStatus('operation', revenue > 0 && calculations.fuelKm > 0, revenue > 0 && calculations.fuelKm > 0 ? 'Operação definida' : 'Revisar operação');

    root.dataset.planState = target <= 0 ? 'missing-target' : 'active';
  };

  const showHub = ({ scroll = false } = {}) => {
    currentSection = null;
    root.dataset.planningSection = 'hub';
    setHidden(hero, false);
    setHidden(summary, false);
    setHidden(hub, false);
    setHidden(note, false);
    pages.forEach(page => setHidden(page, true));
    syncHub();
    if (scroll) root.scrollIntoView({ block: 'start' });
  };

  const showSection = (key, { scroll = false } = {}) => {
    const page = pages.get(key);
    if (!page) return showHub({ scroll });
    currentSection = key;
    root.dataset.planningSection = key;
    setHidden(hero, true);
    setHidden(summary, true);
    setHidden(hub, true);
    setHidden(note, true);
    pages.forEach((candidate, candidateKey) => setHidden(candidate, candidateKey !== key));
    const details = page.querySelector('details');
    if (details) details.open = true;
    app.renderPlanning?.();
    syncHub();
    if (scroll) root.scrollIntoView({ block: 'start' });
  };

  const openSection = key => {
    if (!pages.has(key)) return;
    const currentState = history.state?.vettaNavigation
      ? history.state
      : { vettaNavigation: true, view: 'planning', primaryView: app.currentPrimaryView || 'dashboard' };
    history.pushState({ ...currentState, view: 'planning', planningSection: key }, '', window.location.href);
    showSection(key, { scroll: true });
  };

  hub.addEventListener('click', event => {
    const button = event.target.closest('[data-planning-section-open]');
    if (button) openSection(button.dataset.planningSectionOpen);
  });

  pages.forEach(page => {
    page.querySelector('[data-planning-section-back]').addEventListener('click', () => {
      if (history.state?.planningSection) history.back();
      else showHub({ scroll: true });
    });
  });

  const baseShowView = app.showView;
  app.showView = function(view, primaryView = view) {
    baseShowView.call(this, view, primaryView);
    if (view !== 'planning') {
      showHub();
      return;
    }
    const section = history.state?.planningSection;
    if (section && pages.has(section)) showSection(section);
    else showHub();
  };

  const baseNavigateToPrimary = app.navigateToPrimary;
  app.navigateToPrimary = function(view) {
    if (view === 'costs') {
      if (this.currentView === 'planning' && this.currentPrimaryView === 'costs' && currentSection === 'costs') return;
      history.pushState({ vettaNavigation: true, view: 'planning', primaryView: 'costs', planningSection: 'costs' }, '', window.location.href);
      this.showView('planning', 'costs');
      return;
    }
    if (view === 'planning' && currentSection) {
      history.pushState({ vettaNavigation: true, view: 'planning', primaryView: this.currentPrimaryView || 'dashboard' }, '', window.location.href);
      this.showView('planning', this.currentPrimaryView || 'dashboard');
      return;
    }
    return baseNavigateToPrimary.call(this, view);
  };

  const baseRender = app.render;
  app.render = function() {
    baseRender.call(this);
    syncHub();
  };

  root.dataset.block3 = 'ready';
  root.dataset.r1 = 'ready';
  const initialSection = history.state?.planningSection;
  if (initialSection && pages.has(initialSection) && app.currentView === 'planning') showSection(initialSection);
  else showHub();
})();
