(() => {
  const app = window.__vettaApp;
  const dashboard = document.getElementById('view-dashboard');
  const planning = document.getElementById('view-planning');
  const historyView = document.getElementById('view-history');
  const settingsView = document.getElementById('view-settings');

  if (!app || !dashboard || !planning || !historyView) return;

  const consolidateToday = () => {
    if (dashboard.dataset.block1c === 'ready') return true;

    const requiredDestinations = [
      planning.dataset.block1a === 'ready',
      historyView.dataset.block1b === 'ready',
      document.getElementById('planningTargetInput'),
      document.getElementById('planningDaysOffInput'),
      document.getElementById('planningRevenueChart'),
      document.getElementById('planningDreGross'),
      document.getElementById('historyAnalysisPanel'),
      document.getElementById('historyWeekStatusTitle'),
      document.getElementById('historyWeekTarget'),
    ];

    if (requiredDestinations.some(item => !item)) {
      console.warn('Bloco 1C não aplicado: um destino validado não está disponível.');
      return false;
    }

    const relocations = [
      {
        source: document.getElementById('targetProfitDisplay')?.closest('.card-vetta'),
        destination: 'Planejar → Metas e Agenda',
      },
      {
        source: document.getElementById('weekStatusTitle')?.closest('.card-vetta'),
        destination: 'Histórico → Análise → Semana atual',
      },
      {
        source: document.getElementById('revenueChart')?.closest('.card-vetta'),
        destination: 'Planejar → Distribuição da meta',
      },
    ];

    if (relocations.some(item => !item.source)) {
      console.warn('Bloco 1C não aplicado: uma duplicação de Início não foi encontrada.');
      return false;
    }

    for (const item of relocations) {
      item.source.hidden = true;
      item.source.setAttribute('aria-hidden', 'true');
      item.source.dataset.relocatedTo = item.destination;
    }

    const planningNote = planning.querySelector(':scope > .rounded-2xl.bg-blue-50');
    if (planningNote) {
      planningNote.innerHTML = '<strong>Destino consolidado:</strong> meta, agenda e distribuição permanecem aqui. Início agora mostra somente o resumo essencial; Ajustes continua preservado até a navegação final.';
    }

    const historyNote = historyView.querySelector(':scope > .rounded-2xl.bg-blue-50');
    if (historyNote) {
      historyNote.innerHTML = '<strong>Destino consolidado:</strong> a análise semanal permanece aqui. Início mantém o acompanhamento diário e mensal.';
    }

    dashboard.dataset.block1c = 'ready';
    return true;
  };

  const activateFinalNavigation = () => {
    const bottomNav = document.querySelector('nav.fixed.bottom-0');
    if (!bottomNav || bottomNav.dataset.block1d === 'ready') return Boolean(bottomNav);

    const todayNav = bottomNav.querySelector('.nav-item[data-view="dashboard"]');
    const dayNav = bottomNav.querySelector('.nav-item[data-view="day"]');
    const historyNav = bottomNav.querySelector('.nav-item[data-view="history"]');
    const planningNav = bottomNav.querySelector('.nav-item[data-view="settings"]');
    const moreNav = bottomNav.querySelector('.nav-item[data-view="more"]');
    const registerButton = dashboard.querySelector('button[data-view="day"]');
    const planningBack = planning.querySelector('[data-back]');

    const requiredNavigation = [
      dashboard.dataset.block1c === 'ready',
      planning.dataset.block1a === 'ready',
      historyView.dataset.block1b === 'ready',
      todayNav,
      dayNav,
      historyNav,
      planningNav,
      moreNav,
      registerButton,
      planningBack,
    ];

    if (requiredNavigation.some(item => !item)) {
      console.warn('Bloco 1D não aplicado: a navegação anterior foi preservada porque falta um destino validado.');
      return false;
    }

    const todayLabel = todayNav.querySelector('span');
    const planningLabel = planningNav.querySelector('span');
    const planningIcon = planningNav.querySelector('i');
    if (!todayLabel || !planningLabel || !planningIcon) {
      console.warn('Bloco 1D não aplicado: a navegação anterior foi preservada porque falta um elemento visual.');
      return false;
    }

    todayLabel.textContent = 'Hoje';
    todayNav.setAttribute('aria-label', 'Hoje');

    dayNav.dataset.relocatedTo = 'Hoje → Registrar meu dia';
    dayNav.remove();

    planningNav.dataset.view = 'planning';
    planningNav.dataset.relocatedFrom = 'Ajustes';
    planningNav.setAttribute('aria-label', 'Planejar');
    planningLabel.textContent = 'Planejar';
    planningIcon.className = 'fas fa-calendar-days';

    registerButton.dataset.navigationRole = 'secondary-day';
    if (settingsView) settingsView.dataset.relocatedTo = 'Planejar';

    const primaryViews = new Set(['dashboard', 'history', 'planning', 'more']);
    const syncPlanningBack = (view, primaryView) => {
      const isSecondaryPlanning = view === 'planning' && primaryView !== 'planning';
      planningBack.hidden = !isSecondaryPlanning;
      planningBack.setAttribute('aria-hidden', String(!isSecondaryPlanning));
    };

    const baseShowView = app.showView;
    const baseNavigateToPrimary = app.navigateToPrimary;

    app.showView = function(view, primaryView = view) {
      let resolvedView = view === 'settings' ? 'planning' : view;
      let resolvedPrimary = primaryView === 'settings' ? 'planning' : primaryView;

      if (resolvedView === 'day' && resolvedPrimary === 'day') {
        resolvedPrimary = primaryViews.has(this.currentPrimaryView) ? this.currentPrimaryView : 'dashboard';
      }

      baseShowView.call(this, resolvedView, resolvedPrimary);
      syncPlanningBack(resolvedView, resolvedPrimary);
    };

    app.navigateToPrimary = function(view) {
      if (view === 'day') return this.openSecondary('day');
      return baseNavigateToPrimary.call(this, view === 'settings' ? 'planning' : view);
    };

    const planningNote = planning.querySelector(':scope > .rounded-2xl.bg-blue-50');
    if (planningNote) {
      planningNote.innerHTML = '<strong>Navegação final:</strong> Planejar agora é uma área principal. O botão Voltar aparece somente quando esta tela é aberta pelo atalho de Hoje.';
    }

    bottomNav.dataset.block1d = 'ready';

    let currentView = app.currentView === 'settings' ? 'planning' : app.currentView;
    let currentPrimary = app.currentPrimaryView === 'settings' ? 'planning' : app.currentPrimaryView;
    if (currentView === 'day' && currentPrimary === 'day') currentPrimary = 'dashboard';
    if (!primaryViews.has(currentPrimary)) currentPrimary = 'dashboard';

    window.history.replaceState(
      { vettaNavigation: true, view: currentView, primaryView: currentPrimary },
      '',
      window.location.href,
    );
    app.showView(currentView, currentPrimary);
    return true;
  };

  if (consolidateToday()) activateFinalNavigation();
})();

if (!document.querySelector('script[data-vetta-module="planning-3"]')) {
  const planningScript = document.createElement('script');
  planningScript.src = './planning-3.js?v=1';
  planningScript.async = false;
  planningScript.dataset.vettaModule = 'planning-3';
  document.head.appendChild(planningScript);
}

if (!document.querySelector('script[data-vetta-module="record-2"]')) {
  const recordScript = document.createElement('script');
  recordScript.src = './record-2.js?v=1';
  recordScript.async = false;
  recordScript.dataset.vettaModule = 'record-2';
  document.head.appendChild(recordScript);
}

if (!document.querySelector('script[data-vetta-module="history-4"]')) {
  const historyScript = document.createElement('script');
  historyScript.src = './history-4.js?v=1';
  historyScript.async = false;
  historyScript.dataset.vettaModule = 'history-4';
  document.head.appendChild(historyScript);
}
