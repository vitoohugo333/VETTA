(() => {
  const app = window.__vettaApp;
  const root = document.getElementById('view-history');

  if (!app || !root || root.dataset.block1b !== 'ready' || root.dataset.block4 === 'ready') return;

  const $ = id => document.getElementById(id);
  const hero = root.firstElementChild;
  const tablist = root.querySelector('[role="tablist"]');
  const daysPanel = $('historyDaysPanel');
  const analysisPanel = $('historyAnalysisPanel');
  const daysTab = $('historyDaysTab');
  const analysisTab = $('historyAnalysisTab');
  const summaryGrid = $('historyDays')?.closest('.grid');
  const weekCard = $('historyWeekStatusTitle')?.closest('.card-vetta');
  const chartCard = $('historyChart')?.closest('.card-vetta');
  const comparisonCard = $('historyInsight');
  const note = [...root.children].find(element => element.classList.contains('rounded-2xl') && element.classList.contains('bg-blue-50'));

  const required = [
    hero,
    tablist,
    daysPanel,
    analysisPanel,
    daysTab,
    analysisTab,
    summaryGrid,
    weekCard,
    chartCard,
    comparisonCard,
    note,
  ];

  const analysisHosts = [summaryGrid, weekCard, chartCard, comparisonCard];
  if (
    required.some(item => !item)
    || analysisHosts.some(item => item.parentElement !== analysisPanel)
    || new Set(analysisHosts).size !== analysisHosts.length
  ) {
    console.warn('Bloco 4 não aplicado: Histórico anterior foi preservado porque um destino obrigatório não foi encontrado.');
    return;
  }

  const definitions = [
    {
      key: 'days',
      label: 'Dias registrados',
      title: 'Seu resultado dia a dia',
      description: 'Consulte, edite ou exclua cada registro.',
      icon: 'fa-calendar-check',
      tone: 'text-blue-600 bg-blue-50',
      hosts: [daysPanel],
    },
    {
      key: 'summary',
      label: 'Resumo e evolução',
      title: 'Visão geral do período',
      description: 'Veja dias, média por km, líquido e evolução.',
      icon: 'fa-chart-line',
      tone: 'text-emerald-600 bg-emerald-50',
      hosts: [summaryGrid, chartCard],
    },
    {
      key: 'week',
      label: 'Semana atual',
      title: 'Ritmo da semana',
      description: 'Compare meta, realizado e média por km.',
      icon: 'fa-calendar-week',
      tone: 'text-amber-600 bg-amber-50',
      hosts: [weekCard],
    },
    {
      key: 'comparison',
      label: 'Comparação',
      title: 'Comparação entre dias',
      description: 'Descubra qual dia realmente rendeu mais.',
      icon: 'fa-scale-balanced',
      tone: 'text-purple-600 bg-purple-50',
      hosts: [comparisonCard],
    },
  ];

  const setHidden = (element, hidden) => {
    element.hidden = hidden;
    element.classList.toggle('hidden', hidden);
    element.setAttribute('aria-hidden', String(hidden));
  };

  const hub = document.createElement('section');
  hub.id = 'historyHub';
  hub.className = 'space-y-4';
  hub.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <div>
        <span class="label-micro !text-vetta-900">Organize por assunto</span>
        <h3 class="text-xl font-extrabold">O que você quer consultar?</h3>
      </div>
      <span class="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold">BLOCO 4</span>
    </div>
    <p class="text-xs text-slate-500 leading-relaxed">Cada área abre sozinha. A lista, os cálculos e o gráfico continuam usando os mesmos registros.</p>
    <div class="grid grid-cols-1 gap-3" data-history-islands></div>`;

  const islands = hub.querySelector('[data-history-islands]');
  for (const definition of definitions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.historySectionOpen = definition.key;
    button.className = 'card-vetta p-5 flex items-center gap-4 text-left w-full';
    button.setAttribute('aria-controls', `historyPage-${definition.key}`);
    button.innerHTML = `
      <span class="w-12 h-12 shrink-0 rounded-2xl grid place-items-center ${definition.tone}"><i class="fas ${definition.icon}"></i></span>
      <span class="min-w-0 flex-1">
        <span class="label-micro !mb-1">${definition.label}</span>
        <strong class="block text-sm">${definition.title}</strong>
        <small id="historyHubSummary-${definition.key}" class="block text-xs text-slate-500 mt-1 leading-relaxed">${definition.description}</small>
      </span>
      <i class="fas fa-chevron-right text-slate-300"></i>`;
    islands.appendChild(button);
  }

  hero.after(hub);

  const pages = new Map();
  for (const definition of definitions) {
    const page = document.createElement('section');
    page.id = `historyPage-${definition.key}`;
    page.dataset.historyPage = definition.key;
    page.className = 'space-y-4';
    page.innerHTML = `
      <button type="button" data-history-section-back class="-ml-2 px-2 py-2 text-xs font-extrabold text-blue-600">
        <i class="fas fa-arrow-left mr-2"></i>Voltar para Histórico
      </button>
      <div class="rounded-[2rem] bg-vetta-900 p-7 text-white">
        <span class="text-[10px] text-blue-300 font-extrabold uppercase tracking-widest">${definition.label}</span>
        <h2 class="text-2xl font-extrabold mt-2">${definition.title}</h2>
        <p class="text-sm text-slate-400 mt-2">${definition.description}</p>
      </div>`;

    tablist.before(page);
    for (const host of definition.hosts) page.appendChild(host);
    pages.set(definition.key, page);
  }

  note.innerHTML = '<strong>Histórico organizado:</strong> cada consulta agora abre em uma tela própria. Nenhum registro, cálculo, gráfico ou ação foi removido.';

  let currentSection = null;
  const baseRenderHistory = app.renderHistory;
  const baseRenderCharts = app.renderCharts;
  const baseShowView = app.showView;
  const baseNavigateToPrimary = app.navigateToPrimary;
  const baseRender = app.render;

  const activateLegacyMode = section => {
    const tab = section === 'days' ? daysTab : analysisTab;
    tab.click();
    setHidden(tablist, true);
    setHidden(analysisPanel, true);
  };

  const syncHub = () => {
    const calculations = app.calculations();
    const records = [...calculations.records].sort((a, b) => b.date.localeCompare(a.date));
    const latest = records[0];
    const latestLabel = latest
      ? app.parseDate(latest.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      : 'nenhum registro';

    const comparisonTitle = comparisonCard.querySelector('h3')?.textContent || 'Aguardando registros suficientes';
    const summaries = {
      days: `${records.length} ${records.length === 1 ? 'registro' : 'registros'} · último: ${latestLabel}`,
      summary: `${$('historyDays')?.textContent || records.length} dias · ${$('historyRevenueKm')?.textContent || app.money(calculations.avgRevenueKm)}/km · ${$('historyNet')?.textContent || app.money(0)}`,
      week: `${$('historyWeekStatusTitle')?.textContent || 'Planejamento semanal'} · ${$('historyWeekActual')?.textContent || app.money(0)} realizado`,
      comparison: comparisonTitle,
    };

    for (const [key, value] of Object.entries(summaries)) {
      const target = $(`historyHubSummary-${key}`);
      if (target) target.textContent = value;
    }
  };

  app.renderHistory = function(existing = null) {
    baseRenderHistory.call(this, existing);
    syncHub();
  };

  app.renderCharts = function(existing = null) {
    baseRenderCharts.call(this, existing);
    if (currentSection !== 'summary' && this.historyChart) {
      this.historyChart.destroy();
      this.historyChart = null;
    }
  };

  const showHub = ({ scroll = false } = {}) => {
    currentSection = null;
    root.dataset.historySection = 'hub';
    activateLegacyMode('days');
    setHidden(hero, false);
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
    root.dataset.historySection = key;
    setHidden(hero, true);
    setHidden(hub, true);
    setHidden(note, true);
    pages.forEach((candidate, candidateKey) => setHidden(candidate, candidateKey !== key));
    activateLegacyMode(key === 'days' ? 'days' : 'analysis');
    syncHub();

    if (key === 'summary') {
      requestAnimationFrame(() => app.renderCharts(app.calculations()));
    }

    if (scroll) root.scrollIntoView({ block: 'start' });
  };

  const openSection = key => {
    if (!pages.has(key)) return;
    const currentState = history.state?.vettaNavigation
      ? history.state
      : { vettaNavigation: true, view: 'history', primaryView: app.currentPrimaryView || 'history' };

    history.pushState(
      {
        ...currentState,
        view: 'history',
        primaryView: app.currentPrimaryView || currentState.primaryView || 'history',
        historySection: key,
      },
      '',
      window.location.href,
    );
    showSection(key, { scroll: true });
  };

  islands.addEventListener('click', event => {
    const button = event.target.closest('[data-history-section-open]');
    if (button) openSection(button.dataset.historySectionOpen);
  });

  pages.forEach(page => {
    page.querySelector('[data-history-section-back]').addEventListener('click', () => {
      if (history.state?.historySection) history.back();
      else showHub({ scroll: true });
    });
  });

  app.showView = function(view, primaryView = view) {
    baseShowView.call(this, view, primaryView);
    if (view !== 'history') {
      showHub();
      return;
    }

    const section = history.state?.historySection;
    if (section && pages.has(section)) showSection(section);
    else showHub();
  };

  app.navigateToPrimary = function(view) {
    if (view === 'history' && currentSection) {
      history.pushState(
        { vettaNavigation: true, view: 'history', primaryView: 'history' },
        '',
        window.location.href,
      );
      this.showView('history', 'history');
      return;
    }
    return baseNavigateToPrimary.call(this, view);
  };

  app.render = function() {
    baseRender.call(this);
    syncHub();
  };

  root.dataset.block4 = 'ready';
  showHub();
})();
