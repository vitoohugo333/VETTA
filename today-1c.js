(() => {
  const dashboard = document.getElementById('view-dashboard');
  const planning = document.getElementById('view-planning');
  const history = document.getElementById('view-history');

  if (!dashboard || dashboard.dataset.block1c === 'ready') return;

  const requiredDestinations = [
    planning?.dataset.block1a === 'ready',
    history?.dataset.block1b === 'ready',
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
    return;
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
    return;
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

  const historyNote = history.querySelector(':scope > .rounded-2xl.bg-blue-50');
  if (historyNote) {
    historyNote.innerHTML = '<strong>Destino consolidado:</strong> a análise semanal permanece aqui. Início mantém o acompanhamento diário e mensal.';
  }

  dashboard.dataset.block1c = 'ready';
})();
