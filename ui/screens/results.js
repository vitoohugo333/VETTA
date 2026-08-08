import { model, ui, h, formatDate, weekPresentation } from '../context.js';

const periodRecords = period => {
  const calculation = model.calculations();
  return period === 'week' ? model.weekContext(calculation).records : calculation.records;
};

const metrics = records => {
  const gross = records.reduce((sum, record) => sum + record.gross, 0);
  const km = records.reduce((sum, record) => sum + record.km, 0);
  const net = records.reduce((sum, record) => sum + record.net, 0);
  return { gross, km, net, revenueKm: km > 0 ? gross / km : 0 };
};

const bars = records => {
  const max = Math.max(1, ...records.map(record => Math.max(0, record.net)));
  return `<div class="chart">${records.slice(-10).map(record => `<span style="--h:${Math.max(5, Math.round(Math.max(0, record.net) / max * 100))}%" title="${formatDate(record.date)}"></span>`).join('')}</div>`;
};

const pageHead = title => `<div class="page-head"><button type="button" class="back-button" data-history-section-back>←</button><div><span class="eyebrow">Resultados</span><h2 class="title">${title}</h2></div></div>`;

function detail(date) {
  const record = model.state.records.find(item => item.date === date);
  if (!record) return '<div class="r360-empty">Este registro não está mais disponível.</div>';
  const numbers = model.recordNumbers(record);
  const month = model.calculations(model.parseDate(date));
  const share = model.state.targetProfit > 0 ? Math.max(0, numbers.net / model.state.targetProfit * 100) : 0;
  return `<section id="r360ResultDetail">
    <div class="page-head"><button type="button" class="back-button" data-close-result-detail>←</button><div><span class="eyebrow">Detalhe do dia</span><h2 class="title">${formatDate(date)}</h2><p class="subtitle">Veja o resultado como parte do seu plano, não como um registro isolado.</p></div></div>
    <div class="hero"><span class="eyebrow">Líquido estimado</span><strong class="hero-value">${model.money(numbers.net)}</strong><p class="hero-note">Este dia representou aproximadamente ${share.toFixed(1).replace('.', ',')}% da sua meta líquida do mês.</p></div>
    <div class="metric-grid section-gap"><div class="metric"><small>Faturamento</small><strong>${model.money(numbers.gross)}</strong></div><div class="metric"><small>Quilômetros</small><strong>${model.integer(numbers.km)} km</strong></div><div class="metric"><small>Receita/km</small><strong>${model.money(numbers.revenuePerKm)}</strong></div><div class="metric"><small>Custo/km</small><strong>${model.money(numbers.costPerKm)}</strong></div></div>
    <div class="surface section-gap"><span class="eyebrow">Impacto</span><strong class="section-title">${numbers.net >= 0 ? 'Este dia somou ao seu objetivo' : 'Este dia consumiu parte do resultado'}</strong><p class="copy">No mês desta data, o VETTA considera ${month.ctx.plannedDays} dias planejados e os custos que estavam ativos no registro.</p></div>
    <button class="secondary full section-gap" type="button" data-r360-edit-day="${date}">Editar este dia</button>
  </section>`;
}

function hub() {
  const period = model.state.r360.resultsPeriod || 'week';
  const records = periodRecords(period);
  const summary = metrics(records);
  const week = weekPresentation();
  const status = !records.length ? 'Ainda sem resultado' : period === 'week' ? (week.delta >= 0 ? 'Semana no ritmo' : `${model.money(Math.abs(week.delta), 0)} abaixo do ritmo`) : `${model.money(summary.net, 0)} líquidos no mês`;
  return `<div id="historyHub"><section id="r360ResultsOverview" class="r360-section">
    <div class="r360-segment"><button type="button" data-r360-period="week" class="${period === 'week' ? 'active' : ''}">Semana</button><button type="button" data-r360-period="month" class="${period === 'month' ? 'active' : ''}">Mês</button></div>
    <div id="r360ResultsHero" class="r360-hero"><span class="eyebrow">Resultados</span><strong class="hero-value">${h(status)}</strong><p class="hero-note">${!records.length ? 'Registre seu primeiro dia e o VETTA começa a confrontar o plano com a realidade.' : period === 'week' ? week.text : `${records.length} registro(s) formam o resultado deste mês.`}</p></div>
    <div id="r360ResultsMetrics" class="r360-metric-grid"><div class="r360-metric"><small>Faturamento</small><strong>${model.money(summary.gross, 0)}</strong></div><div class="r360-metric"><small>Líquido</small><strong>${model.money(summary.net, 0)}</strong></div><div class="r360-metric"><small>Km</small><strong>${model.integer(summary.km)}</strong></div><div class="r360-metric"><small>R$/km</small><strong>${model.money(summary.revenueKm)}</strong></div></div>
    <div id="r360ResultsChartCard" class="r360-surface ${records.length ? '' : 'hidden'}"><span class="eyebrow">Evolução do líquido</span>${bars(records)}</div>
    <div id="r360ResultsReading" class="r360-surface"><span class="eyebrow">Leitura</span><strong class="section-title">${records.length < 2 ? 'A evidência ainda está começando' : summary.revenueKm >= model.state.revenueKm ? 'Eficiência acima da referência' : 'Eficiência abaixo da referência'}</strong><p class="copy">${records.length < 2 ? 'Mais registros tornam a comparação útil.' : `Sua receita média no período foi ${model.money(summary.revenueKm)}/km.`}</p></div>
    <div class="r360-surface"><span class="eyebrow">Dias recentes</span><strong class="section-title">O que formou este resultado</strong><div>${records.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map(record => `<button class="row" type="button" data-r360-result-date="${record.date}"><span class="row-copy"><strong>${formatDate(record.date)}</strong><small>${model.money(record.net)} líquido · ${model.integer(record.km)} km</small></span><span class="chev">›</span></button>`).join('') || '<div class="r360-empty section-gap">Nenhum dia registrado ainda.</div>'}</div></div>
    <details id="r360ResultsDeepDive" class="details"><summary><span>Aprofundar</span><span>⌄</span></summary><div class="details-body"><button class="row" data-history-section-open="days"><span class="row-copy"><strong>Dias registrados</strong><small>${model.state.records.length} registros</small></span><span class="chev">›</span></button><button class="row" data-history-section-open="summary"><span class="row-copy"><strong>Resumo do mês</strong><small>Totais e eficiência</small></span><span class="chev">›</span></button><button class="row" data-history-section-open="week"><span class="row-copy"><strong>Semana</strong><small>Ritmo operacional</small></span><span class="chev">›</span></button><button class="row" data-history-section-open="comparison"><span class="row-copy"><strong>Comparação</strong><small>Entenda o que rendeu mais</small></span><span class="chev">›</span></button></div></details>
  </section></div>`;
}

function days() {
  const records = model.calculations().records.slice().sort((a, b) => b.date.localeCompare(a.date));
  return `<section id="historyPage-days">${pageHead('Dias registrados')}<div class="surface"><span id="historyCount" class="pill blue">${records.length} ${records.length === 1 ? 'REGISTRO' : 'REGISTROS'}</span><div id="historyList" class="section-gap">${records.length ? records.map(record => `<article class="row"><span class="row-copy"><strong>${formatDate(record.date)} · ${model.money(record.gross)}</strong><small>${model.integer(record.km)} km · ${model.money(record.net)} líquido</small></span><button class="link-button" data-action="edit" data-date="${record.date}">EDITAR</button><button class="link-button" style="color:var(--red)" data-action="delete" data-date="${record.date}">EXCLUIR</button></article>`).join('') : '<div class="r360-empty">Nenhum dia registrado ainda.</div>'}</div></div></section>`;
}

function summaryPage() {
  const calculation = model.calculations();
  return `<section id="historyPage-summary">${pageHead('Resumo do mês')}<div class="surface"><canvas id="historyChart" class="chart-placeholder"></canvas><div class="metric-grid section-gap"><div class="metric"><small>Dias</small><strong id="historyDays">${calculation.records.length}</strong></div><div class="metric"><small>Receita/km</small><strong id="historyRevenueKm">${model.money(calculation.avgRevenueKm)}</strong></div><div class="metric"><small>Líquido</small><strong>${model.money(calculation.actualNet, 0)}</strong></div><div class="metric"><small>Km</small><strong>${model.integer(calculation.actualKm)}</strong></div></div></div></section>`;
}

function weekPage() {
  const week = weekPresentation();
  return `<section id="historyPage-week">${pageHead('Sua semana')}<div class="surface"><div style="display:flex;justify-content:space-between"><div><span class="eyebrow">Ritmo operacional</span><h3 id="historyWeekStatusTitle" class="section-title">${h(week.title)}</h3></div><span id="historyWeekStatusPill" class="pill ${week.delta >= 0 && week.week.records.length ? 'good' : week.week.records.length ? 'warn' : ''}">${week.pill}</span></div><p id="historyWeekStatusText" class="copy">${h(week.text)}</p><div class="metric-grid section-gap"><div class="metric"><small>Meta</small><strong id="historyWeekTarget">${model.money(week.week.target, 0)}</strong></div><div class="metric"><small>Realizado</small><strong id="historyWeekActual">${model.money(week.week.actual, 0)}</strong></div><div class="metric"><small>R$/km</small><strong id="historyWeekRevenueKm">${model.money(week.week.revenueKm)}</strong></div><div class="metric"><small>Dias</small><strong>${week.week.records.length}/${week.week.dates.length}</strong></div></div></div></section>`;
}

function comparison() {
  const records = model.calculations().records;
  let content;
  if (records.length < 2) content = '<strong class="section-title">Ainda não há dias suficientes</strong><p class="copy">Depois de dois registros, o VETTA mostra qual dia realmente rendeu mais.</p>';
  else {
    const best = [...records].sort((a, b) => b.net - a.net)[0];
    const highestGross = [...records].sort((a, b) => b.gross - a.gross)[0];
    content = `<strong class="section-title">Comparação entre dias</strong><p class="copy">${best.date === highestGross.date ? 'Seu maior faturamento também foi o melhor dia líquido.' : `Faturar mais não significou ganhar mais: ${formatDate(best.date)} teve o melhor líquido.`}</p>`;
  }
  return `<section id="historyPage-comparison">${pageHead('Comparar dias')}<div id="historyInsight" class="surface">${content}</div></section>`;
}

export function renderHistory() {
  let body;
  if (ui.state.resultDetail) body = detail(ui.state.resultDetail);
  else if (ui.state.historySection === 'days') body = days();
  else if (ui.state.historySection === 'summary') body = summaryPage();
  else if (ui.state.historySection === 'week') body = weekPage();
  else if (ui.state.historySection === 'comparison') body = comparison();
  else body = hub();
  return `<section id="view-history" class="view-section ${ui.state.route === 'history' ? '' : 'hidden'}" data-block4="ready">${body}</section>`;
}
