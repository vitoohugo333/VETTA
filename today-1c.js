(() => {
  const app = window.__vettaApp;
  const dashboard = document.getElementById('view-dashboard');
  const planning = document.getElementById('view-planning');
  const historyView = document.getElementById('view-history');
  const settingsView = document.getElementById('view-settings');

  if (!app || !dashboard || !planning || !historyView) return;

  const $ = id => document.getElementById(id);

  const consolidateToday = () => {
    if (dashboard.dataset.block1c === 'ready') return true;

    const targetCard = $('targetProfitDisplay')?.closest('.card-vetta');
    const weekCard = $('weekStatusTitle')?.closest('.card-vetta');
    const chartCard = $('revenueChart')?.closest('.card-vetta');
    const hero = dashboard.firstElementChild;
    const registerButton = dashboard.querySelector('button[data-view="day"]');
    const planningShortcut = dashboard.querySelector('[data-secondary-view="planning"]');
    const monthCard = $('monthStatusTitle')?.closest('.card-vetta');
    const insightCard = $('insightTitle')?.closest('.card-vetta');

    const requiredDestinations = [
      planning.dataset.block1a === 'ready',
      historyView.dataset.block1b === 'ready',
      $('planningTargetInput'),
      $('planningDaysOffInput'),
      $('planningRevenueChart'),
      $('historyAnalysisPanel'),
      $('historyWeekStatusTitle'),
      hero,
      targetCard,
      weekCard,
      chartCard,
      registerButton,
      planningShortcut,
      monthCard,
      insightCard,
    ];

    if (requiredDestinations.some(item => !item)) {
      console.warn('R1 não aplicado: um destino ou elemento essencial não está disponível.');
      return false;
    }

    for (const [source, destination] of [
      [weekCard, 'Resultados → Semana atual'],
      [chartCard, 'Plano → Distribuição'],
    ]) {
      source.hidden = true;
      source.setAttribute('aria-hidden', 'true');
      source.dataset.relocatedTo = destination;
    }

    targetCard.dataset.r1Role = 'monthly-plan';
    targetCard.className = 'card-vetta p-6 border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50';
    const targetHeader = targetCard.querySelector('.flex.justify-between');
    const targetLabel = targetCard.querySelector('label');
    if (targetLabel) targetLabel.textContent = 'Meu plano do mês';
    if (targetHeader && !$('r1PlanStatus')) {
      const status = document.createElement('span');
      status.id = 'r1PlanStatus';
      status.className = 'px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold whitespace-nowrap';
      status.textContent = 'PLANO ATIVO';
      targetHeader.appendChild(status);
    }

    const planSummary = document.createElement('p');
    planSummary.id = 'r1PlanSummary';
    planSummary.className = 'text-xs text-slate-600 leading-relaxed mt-5';
    planSummary.setAttribute('aria-live', 'polite');
    targetCard.appendChild(planSummary);

    const planButton = document.createElement('button');
    planButton.id = 'r1PlanButton';
    planButton.type = 'button';
    planButton.className = 'w-full mt-4 min-h-[48px] px-4 py-3 rounded-2xl bg-vetta-900 text-white text-xs font-extrabold flex items-center justify-between gap-3 active:scale-[.985] transition-transform';
    planButton.innerHTML = '<span>Revisar meu plano completo</span><i class="fas fa-arrow-right" aria-hidden="true"></i>';
    targetCard.appendChild(planButton);

    const nextAction = document.createElement('section');
    nextAction.id = 'r1NextAction';
    nextAction.dataset.r1Role = 'next-action';
    nextAction.className = 'border-t border-slate-200 pt-5';
    nextAction.setAttribute('aria-live', 'polite');
    nextAction.innerHTML = `
      <span class="label-micro !text-vetta-900">Próxima ação</span>
      <button id="r1NextActionButton" type="button" class="w-full min-h-[66px] flex items-center gap-4 text-left rounded-2xl px-2 active:bg-slate-50 transition-colors">
        <span id="r1NextActionIconWrap" class="w-12 h-12 shrink-0 rounded-2xl bg-vetta-900 text-white grid place-items-center"><i id="r1NextActionIcon" class="fas fa-arrow-right" aria-hidden="true"></i></span>
        <span class="min-w-0 flex-1"><strong id="r1NextActionTitle" class="block text-sm"></strong><small id="r1NextActionText" class="block text-xs text-slate-500 mt-1 leading-relaxed"></small></span>
        <i class="fas fa-chevron-right text-slate-300" aria-hidden="true"></i>
      </button>`;

    hero.after(targetCard);
    targetCard.after(nextAction);
    nextAction.after(registerButton);
    registerButton.after(monthCard);
    monthCard.after(insightCard);

    planningShortcut.hidden = true;
    planningShortcut.classList.add('hidden');
    planningShortcut.setAttribute('aria-hidden', 'true');
    planningShortcut.dataset.replacedBy = 'r1PlanButton';

    const topInner = document.querySelector('body > nav.sticky .max-w-lg');
    const installButton = $('installButton');
    if (installButton) {
      installButton.hidden = true;
      installButton.classList.add('hidden');
      installButton.setAttribute('aria-hidden', 'true');
      installButton.dataset.relocatedTo = 'Mais → Aplicativo';
    }
    if (topInner && !$('r1HeaderPlanButton')) {
      const headerPlan = document.createElement('button');
      headerPlan.id = 'r1HeaderPlanButton';
      headerPlan.type = 'button';
      headerPlan.className = 'min-h-[40px] px-4 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold flex items-center gap-2 active:scale-95 transition-transform';
      headerPlan.innerHTML = '<i class="fas fa-bullseye" aria-hidden="true"></i><span>Plano</span>';
      headerPlan.setAttribute('aria-label', 'Abrir plano do mês');
      topInner.appendChild(headerPlan);
      headerPlan.addEventListener('click', () => app.openSecondary('planning'));
    }

    const openPlanSection = section => {
      app.openSecondary('planning');
      const openWhenReady = attempt => {
        const button = document.querySelector(`[data-planning-section-open="${section}"]`);
        if (button) return button.click();
        if (attempt < 80) setTimeout(() => openWhenReady(attempt + 1), 50);
      };
      openWhenReady(0);
    };

    planButton.addEventListener('click', () => {
      if (app.number(app.state.targetProfit) <= 0) openPlanSection('goals');
      else app.openSecondary('planning');
    });

    let nextActionHandler = () => app.navigateToPrimary('day');
    $('r1NextActionButton').addEventListener('click', () => nextActionHandler());

    const syncTodayGuide = () => {
      const c = app.calculations();
      const target = app.number(app.state.targetProfit);
      const records = c.records || [];
      const targetMissing = target <= 0;
      const plannedDays = c.ctx?.plannedDays || 0;
      const status = $('r1PlanStatus');
      const summary = $('r1PlanSummary');
      const actionText = planButton.querySelector('span');
      const nextWrap = $('r1NextActionIconWrap');
      const nextIcon = $('r1NextActionIcon');
      const nextTitle = $('r1NextActionTitle');
      const nextText = $('r1NextActionText');

      if (targetMissing) {
        status.textContent = 'FALTA META';
        status.className = 'px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-extrabold whitespace-nowrap';
        summary.innerHTML = '<strong>Seu mês ainda não tem um objetivo.</strong> Defina quanto quer que sobre; o VETTA transforma isso em dias, quilômetros e faturamento necessário.';
        actionText.textContent = 'Montar meu plano';
        nextWrap.className = 'w-12 h-12 shrink-0 rounded-2xl bg-orange-500 text-white grid place-items-center';
        nextIcon.className = 'fas fa-bullseye';
        nextTitle.textContent = 'Comece definindo sua meta';
        nextText.textContent = 'Sem uma meta líquida, o VETTA não consegue orientar seu ritmo do mês.';
        nextActionHandler = () => openPlanSection('goals');
        dashboard.dataset.r1State = 'missing-target';
      } else if (!records.length) {
        status.textContent = 'PRONTO';
        status.className = 'px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold whitespace-nowrap';
        summary.textContent = `${app.money(target, 0)} líquidos · ${plannedDays} dias planejados · cerca de ${app.money(c.dailyGross, 0)} de faturamento por dia.`;
        actionText.textContent = 'Revisar meu plano completo';
        nextWrap.className = 'w-12 h-12 shrink-0 rounded-2xl bg-blue-600 text-white grid place-items-center';
        nextIcon.className = 'fas fa-plus';
        nextTitle.textContent = 'Registre seu primeiro dia';
        nextText.textContent = 'O primeiro registro conecta seu planejamento à vida real e libera a leitura do mês.';
        nextActionHandler = () => app.navigateToPrimary('day');
        dashboard.dataset.r1State = 'ready-first-record';
      } else if (c.paceDelta < 0) {
        status.textContent = 'EM CURSO';
        status.className = 'px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold whitespace-nowrap';
        summary.textContent = `${app.money(target, 0)} líquidos · ${plannedDays} dias planejados · ${records.length} ${records.length === 1 ? 'dia registrado' : 'dias registrados'}.`;
        actionText.textContent = 'Revisar meu plano completo';
        nextWrap.className = 'w-12 h-12 shrink-0 rounded-2xl bg-vetta-900 text-white grid place-items-center';
        nextIcon.className = 'fas fa-chart-line';
        nextTitle.textContent = 'Revise seu ritmo do mês';
        nextText.textContent = 'O realizado está abaixo do ritmo planejado. Veja o que mudou antes de ajustar a meta.';
        nextActionHandler = () => app.navigateToPrimary('history');
        dashboard.dataset.r1State = 'review-pace';
      } else {
        status.textContent = 'EM CURSO';
        status.className = 'px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold whitespace-nowrap';
        summary.textContent = `${app.money(target, 0)} líquidos · ${plannedDays} dias planejados · ${records.length} ${records.length === 1 ? 'dia registrado' : 'dias registrados'}.`;
        actionText.textContent = 'Revisar meu plano completo';
        nextWrap.className = 'w-12 h-12 shrink-0 rounded-2xl bg-emerald-600 text-white grid place-items-center';
        nextIcon.className = 'fas fa-plus';
        nextTitle.textContent = 'Continue registrando seus dias';
        nextText.textContent = 'Seu plano está alimentado. Mantenha os registros para o VETTA acompanhar o mês com você.';
        nextActionHandler = () => app.navigateToPrimary('day');
        dashboard.dataset.r1State = 'continue';
      }
    };

    const baseRender = app.render;
    app.render = function() {
      baseRender.call(this);
      syncTodayGuide();
    };

    syncTodayGuide();
    dashboard.dataset.block1c = 'ready';
    dashboard.dataset.r1 = 'ready';
    return true;
  };

  const activateFinalNavigation = () => {
    const bottomNav = document.querySelector('nav.fixed.bottom-0');
    if (!bottomNav || bottomNav.dataset.block1d === 'ready') return Boolean(bottomNav);

    const nowNav = bottomNav.querySelector('.nav-item[data-view="dashboard"]');
    const registerNav = bottomNav.querySelector('.nav-item[data-view="day"]');
    const resultsNav = bottomNav.querySelector('.nav-item[data-view="history"]');
    const costsNav = bottomNav.querySelector('.nav-item[data-view="settings"]');
    const moreNav = bottomNav.querySelector('.nav-item[data-view="more"]');
    const planningBack = planning.querySelector('[data-back]');

    const requiredNavigation = [
      dashboard.dataset.block1c === 'ready',
      planning.dataset.block1a === 'ready',
      historyView.dataset.block1b === 'ready',
      nowNav,
      registerNav,
      resultsNav,
      costsNav,
      moreNav,
      planningBack,
    ];

    if (requiredNavigation.some(item => !item)) {
      console.warn('R1 navegação não aplicada: a navegação anterior foi preservada porque falta um destino validado.');
      return false;
    }

    const labels = [nowNav, registerNav, resultsNav, costsNav, moreNav].map(item => item.querySelector('span'));
    const icons = [resultsNav.querySelector('i'), costsNav.querySelector('i')];
    if (labels.some(item => !item) || icons.some(item => !item)) return false;

    labels[0].textContent = 'Agora';
    labels[1].textContent = 'Registrar';
    labels[2].textContent = 'Resultados';
    labels[3].textContent = 'Custos';
    labels[4].textContent = 'Mais';
    nowNav.setAttribute('aria-label', 'Agora');
    registerNav.setAttribute('aria-label', 'Registrar');
    resultsNav.setAttribute('aria-label', 'Resultados');
    costsNav.setAttribute('aria-label', 'Custos');
    moreNav.setAttribute('aria-label', 'Mais');
    icons[0].className = 'fas fa-chart-line';
    icons[1].className = 'fas fa-wallet';

    costsNav.dataset.view = 'costs';
    costsNav.dataset.relocatedFrom = 'Ajustes';
    if (settingsView) settingsView.dataset.relocatedTo = 'Custos';

    const primaryViews = new Set(['dashboard', 'day', 'history', 'costs', 'more']);
    const syncPlanningBack = (view, primaryView) => {
      const isSecondaryPlanning = view === 'planning' && primaryView !== 'costs';
      planningBack.hidden = !isSecondaryPlanning;
      planningBack.setAttribute('aria-hidden', String(!isSecondaryPlanning));
    };

    const baseShowView = app.showView;
    const baseNavigateToPrimary = app.navigateToPrimary;

    app.showView = function(view, primaryView = view) {
      let resolvedView = view;
      let resolvedPrimary = primaryView;
      if (resolvedView === 'settings') resolvedView = 'planning';
      if (resolvedPrimary === 'settings') resolvedPrimary = 'costs';
      if (resolvedPrimary === 'planning') resolvedPrimary = this.currentPrimaryView || 'dashboard';
      if (resolvedView === 'day') resolvedPrimary = 'day';
      baseShowView.call(this, resolvedView, resolvedPrimary);
      syncPlanningBack(resolvedView, resolvedPrimary);
    };

    app.navigateToPrimary = function(view) {
      if (view === 'planning') return this.openSecondary('planning');
      if (view === 'settings') view = 'costs';
      if (view === 'costs') {
        history.pushState({ vettaNavigation: true, view: 'planning', primaryView: 'costs', planningSection: 'costs' }, '', window.location.href);
        this.showView('planning', 'costs');
        return;
      }
      return baseNavigateToPrimary.call(this, view);
    };

    bottomNav.dataset.block1d = 'ready';
    bottomNav.dataset.r1Navigation = 'ready';

    let currentView = app.currentView === 'settings' ? 'planning' : app.currentView;
    let currentPrimary = app.currentPrimaryView === 'settings' ? 'costs' : app.currentPrimaryView;
    if (currentPrimary === 'planning' || !primaryViews.has(currentPrimary)) currentPrimary = 'dashboard';
    if (currentView === 'day') currentPrimary = 'day';

    const state = { vettaNavigation: true, view: currentView, primaryView: currentPrimary };
    if (currentView === 'planning' && currentPrimary === 'costs') state.planningSection = 'costs';
    history.replaceState(state, '', window.location.href);
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

if (!document.querySelector('script[data-vetta-module="more-5"]')) {
  const moreScript = document.createElement('script');
  moreScript.src = './more-5.js?v=1';
  moreScript.async = false;
  moreScript.dataset.vettaModule = 'more-5';
  document.head.appendChild(moreScript);
}

if (!document.querySelector('script[data-vetta-module="onboarding-6"]')) {
  const onboardingScript = document.createElement('script');
  onboardingScript.src = './onboarding-6.js?v=1';
  onboardingScript.async = false;
  onboardingScript.dataset.vettaModule = 'onboarding-6';
  document.head.appendChild(onboardingScript);
}
