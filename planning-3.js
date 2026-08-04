(() => {
  const app = window.__vettaApp;
  const root = document.getElementById('view-planning');

  if (!app || !root || root.dataset.block1a !== 'ready' || root.dataset.block3 === 'ready') return;

  const $ = id => document.getElementById(id);
  const hero = root.firstElementChild;
  const summary = $('planningTarget')?.closest('.card-vetta');
  const note = [...root.children].find(element => element.classList.contains('rounded-2xl') && element.classList.contains('bg-blue-50'));

  const definitions = [
    {
      key: 'goals',
      anchorId: 'planningTargetInput',
      label: 'Metas',
      title: 'Objetivo mensal',
      description: 'Defina quanto deseja gerar de líquido no mês.',
      icon: 'fa-bullseye',
      tone: 'text-emerald-600 bg-emerald-50',
    },
    {
      key: 'agenda',
      anchorId: 'planningDaysOffInput',
      label: 'Agenda',
      title: 'Dias de trabalho e folgas',
      description: 'Escolha os dias da semana e as folgas extras.',
      icon: 'fa-calendar-days',
      tone: 'text-blue-600 bg-blue-50',
    },
    {
      key: 'operation',
      anchorId: 'planningFuelType',
      label: 'Operação',
      title: 'Combustível e receita por km',
      description: 'Atualize preço, rendimento e receita média.',
      icon: 'fa-gas-pump',
      tone: 'text-amber-600 bg-amber-50',
    },
    {
      key: 'costs',
      anchorId: 'planningCostList',
      label: 'Custos e reservas',
      title: 'Para onde o dinheiro precisa ir',
      description: 'Cadastre contas, custos por km e reservas.',
      icon: 'fa-wallet',
      tone: 'text-red-600 bg-red-50',
    },
    {
      key: 'distribution',
      anchorId: 'planningRevenueChart',
      label: 'Distribuição',
      title: 'Como a meta será dividida',
      description: 'Veja faturamento, combustível, custos e líquido.',
      icon: 'fa-chart-pie',
      tone: 'text-purple-600 bg-purple-50',
    },
    {
      key: 'learning',
      anchorId: 'planningLearningText',
      label: 'Aprendizado',
      title: 'Leituras dos seus próprios dias',
      description: 'Consulte sugestões sem mudança automática.',
      icon: 'fa-wand-magic-sparkles',
      tone: 'text-indigo-600 bg-indigo-50',
    },
    {
      key: 'advanced',
      anchorId: 'planningResetButton',
      label: 'Opções avançadas',
      title: 'Restaurar parâmetros',
      description: 'Restaure valores padrão preservando histórico e radar.',
      icon: 'fa-sliders',
      tone: 'text-slate-600 bg-slate-100',
    },
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
    console.warn('Bloco 3 não aplicado: Planejar original foi preservado porque um destino obrigatório não foi encontrado.');
    return;
  }

  const setHidden = (element, hidden) => {
    element.hidden = hidden;
    element.classList.toggle('hidden', hidden);
    element.setAttribute('aria-hidden', String(hidden));
  };

  const hub = document.createElement('section');
  hub.id = 'planningHub';
  hub.className = 'space-y-4';
  hub.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <div>
        <span class="label-micro !text-vetta-900">Organize por assunto</span>
        <h3 class="text-xl font-extrabold">O que você quer planejar?</h3>
      </div>
      <span class="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold">BLOCO 3</span>
    </div>
    <p class="text-xs text-slate-500 leading-relaxed">Cada área abre sozinha. Seus valores continuam sendo os mesmos usados em Hoje e nos cálculos.</p>
    <div class="grid grid-cols-1 gap-3" data-planning-islands></div>`;

  const islands = hub.querySelector('[data-planning-islands]');
  for (const definition of definitions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.planningSectionOpen = definition.key;
    button.className = 'card-vetta p-5 flex items-center gap-4 text-left w-full';
    button.setAttribute('aria-controls', `planningPage-${definition.key}`);
    button.innerHTML = `
      <span class="w-12 h-12 shrink-0 rounded-2xl grid place-items-center ${definition.tone}"><i class="fas ${definition.icon}"></i></span>
      <span class="min-w-0 flex-1">
        <span class="label-micro !mb-1">${definition.label}</span>
        <strong class="block text-sm">${definition.title}</strong>
        <small id="planningHubSummary-${definition.key}" class="block text-xs text-slate-500 mt-1 leading-relaxed">${definition.description}</small>
      </span>
      <i class="fas fa-chevron-right text-slate-300"></i>`;
    islands.appendChild(button);
  }

  summary.after(hub);

  const pages = new Map();
  definitions.forEach((definition, index) => {
    const host = hosts[index];
    const page = document.createElement('section');
    page.id = `planningPage-${definition.key}`;
    page.dataset.planningPage = definition.key;
    page.className = 'space-y-4';
    page.innerHTML = `
      <button type="button" data-planning-section-back class="-ml-2 px-2 py-2 text-xs font-extrabold text-blue-600">
        <i class="fas fa-arrow-left mr-2"></i>Voltar para Planejar
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

  note.innerHTML = '<strong>Planejar organizado:</strong> cada assunto agora abre em uma tela própria. Nenhum campo, custo, gráfico ou aprendizado foi removido.';

  let currentSection = null;

  const syncHub = () => {
    const calculations = app.calculations();
    const summaries = {
      goals: `${$('planningTarget')?.textContent || app.money(app.state.targetProfit, 0)} líquidos · ${$('planningDailyGross')?.textContent || app.money(calculations.dailyGross, 0)} por dia`,
      agenda: `${$('planningDays')?.textContent || `${calculations.ctx.plannedDays} dias`} · ${app.state.extraDaysOff} folga(s) extra(s)`,
      operation: $('planningFuelSummary')?.textContent || `${app.state.fuel.label} · ${app.money(calculations.fuelKm)}/km`,
      costs: `${calculations.costs.active.length} item(ns) ativo(s) · ${app.money(calculations.costs.monthlyFixed)}/mês`,
      distribution: `${$('planningDreGross')?.textContent || app.money(calculations.totalGross)} de faturamento bruto necessário`,
      learning: $('planningLearningText')?.textContent || 'As sugestões aparecem depois dos primeiros registros.',
      advanced: 'Restaura parâmetros e preserva histórico e radar.',
    };

    for (const [key, value] of Object.entries(summaries)) {
      const target = $(`planningHubSummary-${key}`);
      if (target) target.textContent = value;
    }
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
      : { vettaNavigation: true, view: 'planning', primaryView: app.currentPrimaryView || 'planning' };
    history.pushState(
      {
        ...currentState,
        view: 'planning',
        primaryView: app.currentPrimaryView || currentState.primaryView || 'planning',
        planningSection: key,
      },
      '',
      window.location.href,
    );
    showSection(key, { scroll: true });
  };

  islands.addEventListener('click', event => {
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
    if (view === 'planning' && currentSection) {
      history.pushState(
        { vettaNavigation: true, view: 'planning', primaryView: 'planning' },
        '',
        window.location.href,
      );
      this.showView('planning', 'planning');
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
  showHub();
})();
