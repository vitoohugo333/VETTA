(() => {
  const app = window.__vettaApp;
  const root = document.getElementById('view-history');
  if (!app || !root || root.dataset.block1b === 'ready') return;

  const baseRenderHistory = app.renderHistory;
  const baseRenderCharts = app.renderCharts;
  const baseShowView = app.showView;
  let activeTab = 'days';

  if (app.historyChart) {
    app.historyChart.destroy();
    app.historyChart = null;
  }

  root.dataset.block1b = 'ready';
  root.innerHTML = `
    <div class="rounded-[2rem] bg-white p-8 shadow-float border border-blue-50 flex justify-between">
      <div><h2 class="font-extrabold text-2xl">Histórico</h2><p class="text-xs text-slate-400 mt-1">Seus dias separados das análises.</p></div>
      <div class="w-12 h-12 bg-blue-50 rounded-2xl grid place-items-center text-blue-600"><i class="fas fa-calendar-check"></i></div>
    </div>

    <div class="card-vetta p-1.5 flex gap-1" role="tablist" aria-label="Áreas do histórico">
      <button id="historyDaysTab" data-history-tab="days" role="tab" aria-controls="historyDaysPanel" aria-selected="true" class="flex-1 py-3 rounded-2xl text-xs font-extrabold">Dias</button>
      <button id="historyAnalysisTab" data-history-tab="analysis" role="tab" aria-controls="historyAnalysisPanel" aria-selected="false" class="flex-1 py-3 rounded-2xl text-xs font-extrabold">Análise</button>
    </div>

    <section id="historyDaysPanel" data-history-panel="days" role="tabpanel" aria-labelledby="historyDaysTab" class="space-y-4">
      <div class="flex justify-between items-end gap-3">
        <div><span class="label-micro !text-vetta-900">Dias registrados</span><h3 class="font-extrabold text-xl">Seu resultado dia a dia</h3></div>
        <span id="historyCount" class="text-[10px] font-bold text-slate-400">0 REGISTROS</span>
      </div>
      <div id="historyList" class="space-y-3"></div>
    </section>

    <section id="historyAnalysisPanel" data-history-panel="analysis" role="tabpanel" aria-labelledby="historyAnalysisTab" class="hidden space-y-6">
      <div class="grid grid-cols-3 gap-3">
        <div class="card-vetta p-4 text-center"><span class="label-micro">Dias</span><strong id="historyDays">0</strong></div>
        <div class="card-vetta p-4 text-center"><span class="label-micro">Média/km</span><strong id="historyRevenueKm">R$ 0</strong></div>
        <div class="card-vetta p-4 text-center"><span class="label-micro">Líquido</span><strong id="historyNet" class="text-emerald-600">R$ 0</strong></div>
      </div>

      <div class="card-vetta p-6">
        <div class="flex justify-between items-start gap-3">
          <div><span class="label-micro !text-vetta-900">Semana atual</span><h3 id="historyWeekStatusTitle" class="text-lg font-extrabold">Planejamento semanal</h3></div>
          <span id="historyWeekStatusPill" class="px-3 py-1.5 rounded-full text-[10px] font-extrabold status-neutral">SEMANA</span>
        </div>
        <p id="historyWeekStatusText" class="text-xs text-slate-500 mt-2"></p>
        <div class="grid grid-cols-3 gap-3 mt-5 text-center">
          <div><span class="label-micro">Meta líquida</span><strong id="historyWeekTarget" class="text-sm">R$ 0</strong></div>
          <div><span class="label-micro">Realizado</span><strong id="historyWeekActual" class="text-sm text-emerald-600">R$ 0</strong></div>
          <div><span class="label-micro">Média/km</span><strong id="historyWeekRevenueKm" class="text-sm">R$ 0</strong></div>
        </div>
      </div>

      <div class="card-vetta p-6">
        <span class="label-micro !text-vetta-900">Evolução do líquido</span>
        <div class="chart-container-line"><canvas id="historyChart"></canvas></div>
      </div>

      <div id="historyInsight" class="card-vetta p-6 bg-gradient-to-br from-emerald-50 to-white"></div>
    </section>

    <div class="rounded-2xl bg-blue-50 p-4 text-xs text-blue-700 leading-relaxed"><strong>Transição segura:</strong> a análise semanal continua também em Início até o Bloco 1C. Nenhum conteúdo antigo foi retirado.</div>`;

  const $ = id => document.getElementById(id);

  const renderWeek = calculation => {
    const week = app.weekContext(calculation);
    const delta = week.actual - week.target;
    const hasRecords = week.records.length > 0;

    $('historyWeekTarget').textContent = app.money(week.target, 0);
    $('historyWeekActual').textContent = app.money(week.actual, 0);
    $('historyWeekRevenueKm').textContent = app.money(week.revenueKm);
    $('historyWeekStatusPill').className = `px-3 py-1.5 rounded-full text-[10px] font-extrabold ${delta >= 0 && hasRecords ? 'status-positive' : hasRecords ? 'status-negative' : 'status-neutral'}`;
    $('historyWeekStatusPill').textContent = hasRecords ? (delta >= 0 ? 'NO RITMO' : 'AJUSTANDO') : 'SEMANA';
    $('historyWeekStatusTitle').textContent = hasRecords ? (delta >= 0 ? 'Semana acima da rota' : 'Semana pede recuperação') : 'Planejamento semanal';
    $('historyWeekStatusText').textContent = hasRecords
      ? `${week.records.length} dia(s) registrados. Saldo semanal: ${delta >= 0 ? '+' : '-'} ${app.money(Math.abs(delta), 0)}.`
      : `A semana tem ${week.dates.length} dia(s) previstos na sua agenda.`;
  };

  const updateTabUi = () => {
    const days = activeTab === 'days';
    $('historyDaysPanel').classList.toggle('hidden', !days);
    $('historyAnalysisPanel').classList.toggle('hidden', days);
    $('historyDaysTab').setAttribute('aria-selected', String(days));
    $('historyAnalysisTab').setAttribute('aria-selected', String(!days));
    $('historyDaysTab').className = `flex-1 py-3 rounded-2xl text-xs font-extrabold ${days ? 'bg-vetta-900 text-white shadow-lg' : 'text-slate-500'}`;
    $('historyAnalysisTab').className = `flex-1 py-3 rounded-2xl text-xs font-extrabold ${days ? 'text-slate-500' : 'bg-vetta-900 text-white shadow-lg'}`;

    if (days && app.historyChart) {
      app.historyChart.destroy();
      app.historyChart = null;
    }
  };

  const selectTab = tab => {
    activeTab = tab === 'analysis' ? 'analysis' : 'days';
    updateTabUi();
    if (activeTab === 'analysis') {
      requestAnimationFrame(() => app.renderCharts(app.calculations()));
    }
  };

  app.renderHistory = function(existing = null) {
    const calculation = existing || this.calculations();
    baseRenderHistory.call(this, calculation);
    const label = $('historyInsight')?.querySelector('.label-micro');
    if (label) label.textContent = 'Comparação entre dias';
    renderWeek(calculation);
  };

  app.renderCharts = function(existing = null) {
    baseRenderCharts.call(this, existing);
    if (activeTab !== 'analysis' || root.classList.contains('hidden')) {
      if (this.historyChart) {
        this.historyChart.destroy();
        this.historyChart = null;
      }
    }
  };

  app.showView = function(view, primaryView = view) {
    if (view === 'history') activeTab = 'days';
    baseShowView.call(this, view, primaryView);
    if (view === 'history') updateTabUi();
  };

  root.addEventListener('click', event => {
    const tab = event.target.closest('[data-history-tab]');
    if (tab) {
      selectTab(tab.dataset.historyTab);
      return;
    }

    if (event.target.closest('[data-action]')) app.handleHistoryAction(event);
  });

  updateTabUi();
  app.renderHistory(app.calculations());
  app.renderCharts(app.calculations());
})();

if (!document.querySelector('script[data-vetta-module="today-1c"]')) {
  const todayScript = document.createElement('script');
  todayScript.src = './today-1c.js?v=1';
  todayScript.async = false;
  todayScript.dataset.vettaModule = 'today-1c';
  document.head.appendChild(todayScript);
}
