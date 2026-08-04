(() => {
  const app = window.__vettaApp;
  const root = document.getElementById('view-more');

  if (!app || !root || root.dataset.block5 === 'ready') return;

  const $ = id => document.getElementById(id);
  const hero = root.firstElementChild;
  const compareDetails = $('compareDetails');
  const reportCard = $('reportButton')?.closest('.card-vetta');
  const dataCard = $('exportButton')?.closest('.card-vetta');
  const importInput = $('importInput');
  const radarCard = $('addEventButton')?.closest('.card-vetta');
  const installCard = $('installCardButton');

  const required = [hero, compareDetails, reportCard, dataCard, importInput, radarCard, installCard];
  const originalHosts = [compareDetails, reportCard, dataCard, radarCard, installCard];

  if (
    required.some(item => !item)
    || originalHosts.some(item => item.parentElement !== root)
    || new Set(originalHosts).size !== originalHosts.length
  ) {
    console.warn('Bloco 5 não aplicado: Mais anterior foi preservado porque um recurso obrigatório não foi encontrado.');
    return;
  }

  const versionCard = document.createElement('div');
  versionCard.id = 'moreAppVersionCard';
  versionCard.className = 'card-vetta p-5 flex items-center justify-between gap-4';
  versionCard.innerHTML = `
    <div>
      <span class="label-micro !text-vetta-900">Versão instalada</span>
      <strong id="appVersionLabel" class="block text-lg">Versão ${app.state?.release || '3.5.1'}</strong>
      <p class="text-xs text-slate-500 mt-1">Informação do aplicativo em uso neste aparelho.</p>
    </div>
    <span class="w-11 h-11 shrink-0 rounded-2xl bg-slate-100 text-slate-600 grid place-items-center"><i class="fas fa-code-branch"></i></span>`;

  const definitions = [
    {
      key: 'tools',
      label: 'Ferramentas',
      title: 'Comparar combustíveis',
      description: 'Compare Gasolina e GNV antes de alterar suas metas.',
      icon: 'fa-gas-pump',
      tone: 'text-amber-600 bg-amber-50',
      hosts: [compareDetails],
    },
    {
      key: 'reports',
      label: 'Relatórios',
      title: 'Relatório mensal',
      description: 'Gere o resumo do mês para imprimir ou salvar.',
      icon: 'fa-file-lines',
      tone: 'text-blue-600 bg-blue-50',
      hosts: [reportCard],
    },
    {
      key: 'data',
      label: 'Meus dados',
      title: 'Exportar e importar',
      description: 'Leve um backup ao trocar de aparelho.',
      icon: 'fa-database',
      tone: 'text-purple-600 bg-purple-50',
      hosts: [dataCard],
    },
    {
      key: 'radar',
      label: 'Radar',
      title: 'Eventos e alertas',
      description: 'Organize oportunidades e lembretes locais.',
      icon: 'fa-radar',
      tone: 'text-emerald-600 bg-emerald-50',
      hosts: [radarCard],
    },
    {
      key: 'app',
      label: 'Aplicativo',
      title: 'Instalação e versão',
      description: 'Instale o VETTA e consulte a versão atual.',
      icon: 'fa-mobile-screen-button',
      tone: 'text-slate-700 bg-slate-100',
      hosts: [installCard, versionCard],
    },
  ];

  const setHidden = (element, hidden) => {
    element.hidden = hidden;
    element.classList.toggle('hidden', hidden);
    element.setAttribute('aria-hidden', String(hidden));
  };

  const hub = document.createElement('section');
  hub.id = 'moreHub';
  hub.className = 'space-y-4';
  hub.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <div>
        <span class="label-micro !text-vetta-900">Organize por assunto</span>
        <h3 class="text-xl font-extrabold">O que você quer fazer?</h3>
      </div>
      <span class="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold">BLOCO 5</span>
    </div>
    <p class="text-xs text-slate-500 leading-relaxed">Cada recurso abre em uma tela própria. Seus dados e ferramentas continuam sendo os mesmos.</p>
    <div class="grid grid-cols-1 gap-3" data-more-islands></div>`;

  const islands = hub.querySelector('[data-more-islands]');
  for (const definition of definitions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.moreSectionOpen = definition.key;
    button.className = 'card-vetta p-5 flex items-center gap-4 text-left w-full';
    button.setAttribute('aria-controls', `morePage-${definition.key}`);
    button.innerHTML = `
      <span class="w-12 h-12 shrink-0 rounded-2xl grid place-items-center ${definition.tone}"><i class="fas ${definition.icon}"></i></span>
      <span class="min-w-0 flex-1">
        <span class="label-micro !mb-1">${definition.label}</span>
        <strong class="block text-sm">${definition.title}</strong>
        <small id="moreHubSummary-${definition.key}" class="block text-xs text-slate-500 mt-1 leading-relaxed">${definition.description}</small>
      </span>
      <i class="fas fa-chevron-right text-slate-300"></i>`;
    islands.appendChild(button);
  }

  hero.after(hub);

  const pages = new Map();
  let insertionPoint = hub;
  for (const definition of definitions) {
    const page = document.createElement('section');
    page.id = `morePage-${definition.key}`;
    page.dataset.morePage = definition.key;
    page.className = 'space-y-4';
    page.innerHTML = `
      <button type="button" data-more-section-back class="-ml-2 px-2 py-2 text-xs font-extrabold text-blue-600">
        <i class="fas fa-arrow-left mr-2"></i>Voltar para Mais
      </button>
      <div class="rounded-[2rem] bg-vetta-900 p-7 text-white">
        <span class="text-[10px] text-blue-300 font-extrabold uppercase tracking-widest">${definition.label}</span>
        <h2 class="text-2xl font-extrabold mt-2">${definition.title}</h2>
        <p class="text-sm text-slate-400 mt-2">${definition.description}</p>
      </div>`;

    insertionPoint.after(page);
    insertionPoint = page;
    for (const host of definition.hosts) page.appendChild(host);
    pages.set(definition.key, page);
  }

  let currentSection = null;
  const baseShowView = app.showView;
  const baseNavigateToPrimary = app.navigateToPrimary;
  const baseRender = app.render;

  const syncHub = () => {
    const calculations = app.calculations();
    const events = [...(app.state.events || [])].sort((a, b) => a.date.localeCompare(b.date));
    const nextEvent = events.find(item => item.date >= app.todayKey()) || events[0];
    const release = app.state?.release || '3.5.1';
    const compare = app.state.compare || {};
    const gasCost = app.number(compare.gasPrice) / Math.max(app.number(compare.gasEff), 0.1);
    const gnvCost = app.number(compare.gnvPrice) / Math.max(app.number(compare.gnvEff), 0.1);
    const cheaper = gasCost <= gnvCost ? 'Gasolina' : 'GNV';
    const month = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const nextEventText = nextEvent
      ? `${events.length} ${events.length === 1 ? 'item' : 'itens'} · próximo: ${app.parseDate(nextEvent.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`
      : 'Nenhum evento ou alerta salvo';

    const summaries = {
      tools: `${cheaper} está mais barato por km na simulação atual`,
      reports: `${calculations.records.length} ${calculations.records.length === 1 ? 'dia registrado' : 'dias registrados'} em ${month}`,
      data: `${calculations.records.length} registros · ${(app.state.costs || []).length} custos · ${events.length} itens no radar`,
      radar: nextEventText,
      app: `Versão ${release} · ${app.isStandalone?.() ? 'instalado neste aparelho' : 'instruções de instalação disponíveis'}`,
    };

    for (const [key, value] of Object.entries(summaries)) {
      const target = $(`moreHubSummary-${key}`);
      if (target) target.textContent = value;
    }

    const versionLabel = $('appVersionLabel');
    if (versionLabel) versionLabel.textContent = `Versão ${release}`;
  };

  const showHub = ({ scroll = false } = {}) => {
    currentSection = null;
    root.dataset.moreSection = 'hub';
    setHidden(hero, false);
    setHidden(hub, false);
    pages.forEach(page => setHidden(page, true));
    syncHub();
    if (scroll) root.scrollIntoView({ block: 'start' });
  };

  const showSection = (key, { scroll = false } = {}) => {
    const page = pages.get(key);
    if (!page) return showHub({ scroll });

    currentSection = key;
    root.dataset.moreSection = key;
    setHidden(hero, true);
    setHidden(hub, true);
    pages.forEach((candidate, candidateKey) => setHidden(candidate, candidateKey !== key));
    syncHub();

    if (key === 'tools') {
      compareDetails.open = true;
      requestAnimationFrame(() => app.renderCompare(app.calculations()));
    }

    if (scroll) root.scrollIntoView({ block: 'start' });
  };

  const openSection = key => {
    if (!pages.has(key)) return;
    const currentState = history.state?.vettaNavigation
      ? history.state
      : { vettaNavigation: true, view: 'more', primaryView: app.currentPrimaryView || 'more' };

    history.pushState(
      {
        ...currentState,
        view: 'more',
        primaryView: app.currentPrimaryView || currentState.primaryView || 'more',
        moreSection: key,
      },
      '',
      window.location.href,
    );
    showSection(key, { scroll: true });
  };

  islands.addEventListener('click', event => {
    const button = event.target.closest('[data-more-section-open]');
    if (button) openSection(button.dataset.moreSectionOpen);
  });

  pages.forEach(page => {
    page.querySelector('[data-more-section-back]').addEventListener('click', () => {
      if (history.state?.moreSection) history.back();
      else showHub({ scroll: true });
    });
  });

  app.showView = function(view, primaryView = view) {
    baseShowView.call(this, view, primaryView);
    if (view !== 'more') {
      showHub();
      return;
    }

    const section = history.state?.moreSection;
    if (section && pages.has(section)) showSection(section);
    else showHub();
  };

  app.navigateToPrimary = function(view) {
    if (view === 'more' && currentSection) {
      history.pushState(
        { vettaNavigation: true, view: 'more', primaryView: 'more' },
        '',
        window.location.href,
      );
      this.showView('more', 'more');
      return;
    }
    return baseNavigateToPrimary.call(this, view);
  };

  app.render = function() {
    baseRender.call(this);
    syncHub();
  };

  root.dataset.block5 = 'ready';
  showHub();
})();
