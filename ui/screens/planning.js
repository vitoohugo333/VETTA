import { model, ui, h, fuelPresets } from '../context.js';

const sectionHead = (title, copy) => `
  <div class="page-head">
    <button type="button" class="back-button" data-planning-section-open="" aria-label="Voltar">←</button>
    <div><span class="eyebrow">Meu plano</span><h2 class="title">${title}</h2><p class="subtitle">${copy}</p></div>
  </div>`;

const coreRow = (key, title, summary, status) => `
  <button type="button" class="row" data-planning-section-open="${key}">
    <span class="row-icon">${key === 'goals' ? '◎' : key === 'agenda' ? '▦' : key === 'costs' ? '▣' : '⛽'}</span>
    <span class="row-copy"><strong>${title}</strong><small id="planningHubSummary-${key}">${summary}</small></span>
    <span id="planningStatus-${key}" class="pill ${status.includes('Definir') ? 'warn' : 'blue'}">${status}</span><span class="chev">›</span>
  </button>`;

function hub() {
  const calculation = model.calculations();
  const missingTarget = model.state.targetProfit <= 0;
  const weeklyTarget = model.state.targetProfit / Math.max(1, calculation.ctx.plannedDays) * model.weekContext(calculation).dates.length;
  return `<div id="planningHub">
    <div class="surface">
      <span class="eyebrow">Plano do mês</span><h2 class="title">Organize o mês antes de correr atrás da meta</h2><p class="subtitle">Quatro decisões formam seu plano</p>
      <div class="metric-grid section-gap">
        <div class="metric"><small>Objetivo líquido</small><strong id="planningTarget">${missingTarget ? '—' : model.money(model.state.targetProfit, 0)}</strong></div>
        <div class="metric"><small>Dias planejados</small><strong>${calculation.ctx.plannedDays}</strong></div>
        <div class="metric"><small>Bruto necessário</small><strong>${model.money(calculation.totalGross, 0)}</strong></div>
        <div class="metric"><small>Ritmo semanal</small><strong>${model.money(weeklyTarget, 0)}</strong></div>
      </div>
    </div>
    <div class="surface section-gap" data-planning-core>
      ${coreRow('goals', 'Objetivo', missingTarget ? 'Sem meta definida' : `${model.money(model.state.targetProfit, 0)} líquidos`, missingTarget ? 'Definir meta' : 'Meta definida')}
      ${coreRow('agenda', 'Agenda', `${model.state.workWeekdays.length} dias por semana`, 'Agenda definida')}
      ${coreRow('costs', 'Dinheiro comprometido', `${model.state.costs.filter(cost => cost.active).length} itens ativos`, 'Custos revisáveis')}
      ${coreRow('operation', 'Operação', `${model.state.fuel.label} · ${model.money(calculation.fuelKm)}/km`, 'Operação definida')}
    </div>
    <details id="planningSecondary" class="details section-gap"><summary><span>Depois do essencial</span><span>⌄</span></summary><div class="details-body">
      <button class="row" data-planning-section-open="distribution"><span class="row-copy"><strong>Distribuição</strong><small>Como a meta se decompõe</small></span><span class="chev">›</span></button>
      <button class="row" data-planning-section-open="learning"><span class="row-copy"><strong>Aprendizado</strong><small>Leituras construídas com seus registros</small></span><span class="chev">›</span></button>
      <button class="row" data-planning-section-open="advanced"><span class="row-copy"><strong>Avançado</strong><small>Funções de baixo uso e restauração</small></span><span class="chev">›</span></button>
    </div></details>
  </div>`;
}

function goals() {
  const target = model.state.targetProfit;
  return `<section id="planningPage-goals">${sectionHead('Quanto precisa sobrar?', 'Defina o objetivo líquido. O VETTA traduz o valor em ritmo semanal e diário.')}
    <div class="surface stack">
      <div class="input-group"><label class="input-label" for="planningTargetInput">Objetivo líquido mensal</label><div class="money-input"><span>R$</span><input id="planningTargetInput" class="input" type="number" min="0" step="100" value="${target}"></div></div>
      <input id="planningTargetSlider" type="range" min="0" max="20000" step="100" value="${Math.min(20000, target)}" aria-label="Ajuste rápido da meta">
      <div class="metric-grid"><div class="metric"><small>Por semana</small><strong>${model.money(target / 4.345, 0)}</strong></div><div class="metric"><small>Por dia planejado</small><strong>${model.money(target / Math.max(1, model.calculations().ctx.plannedDays), 0)}</strong></div></div>
      <button class="primary full" type="button" data-planning-section-back>Salvar objetivo</button>
    </div>
  </section>`;
}

function agenda() {
  const count = model.state.workWeekdays.length;
  const labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  return `<section id="planningPage-agenda">${sectionHead('Quando você pretende trabalhar?', 'Sua agenda distribui a meta pelos dias em que realmente pretende rodar.')}
    <div class="surface stack">
      <div class="day-count-grid">${[5, 6, 7].map(value => `<button type="button" data-plan-days="${value}" class="day-count ${count === value ? 'active' : ''}">${value} dias</button>`).join('')}</div>
      <div class="weekday-grid">${labels.map((label, day) => `<button type="button" class="weekday ${model.state.workWeekdays.includes(day) ? 'active' : ''}" data-plan-weekday="${day}">${label}</button>`).join('')}</div>
      <div class="input-group"><label class="input-label" for="planningDaysOff">Folgas extras neste mês</label><input id="planningDaysOff" class="input" type="number" min="0" max="31" value="${model.state.extraDaysOff}"></div>
      <button class="primary full" type="button" data-planning-section-back>Salvar agenda</button>
    </div>
  </section>`;
}

function operation() {
  const fuel = model.state.fuel;
  return `<section id="planningPage-operation">${sectionHead('Quanto custa rodar?', 'A operação transforma quilômetros em custo e dá contexto à sua meta.')}
    <div class="surface stack">
      <div class="input-group"><label class="input-label">Combustível</label><select id="planningFuelType" class="input">${Object.entries(fuelPresets).map(([key, preset]) => `<option value="${key}" ${fuel.type === key ? 'selected' : ''}>${preset.label}</option>`).join('')}</select></div>
      <div class="input-row"><div class="input-group"><label class="input-label">Preço</label><input id="planningFuelPrice" class="input" type="number" step=".01" value="${fuel.price}"></div><div class="input-group"><label class="input-label">Rendimento (${h(fuel.unit)})</label><input id="planningFuelEff" class="input" type="number" step=".1" value="${fuel.efficiency}"></div></div>
      <div class="input-group"><label class="input-label">Receita esperada por km</label><input id="planningRevenueKm" class="input" type="number" step=".01" value="${model.state.revenueKm}"></div>
      <div class="positive"><strong>Custo de combustível: ${model.money(model.fuelCostKm())}/km</strong><small>Este valor entra nos mesmos cálculos que sustentam suas metas e registros.</small></div>
      <button class="primary full" type="button" data-planning-section-back>Salvar operação</button>
    </div>
  </section>`;
}

function distribution() {
  const calculation = model.calculations();
  return `<section id="planningPage-distribution">${sectionHead('Como a meta se distribui', 'Aprofunde quando quiser. A rotina diária continua simples.')}
    <div class="surface"><canvas id="planningRevenueChart" class="chart-placeholder"></canvas><div class="metric-grid section-gap">
      <div class="metric"><small>Bruto necessário</small><strong id="planningDreGross">${model.money(calculation.totalGross, 0)}</strong></div>
      <div class="metric"><small>Rodagem estimada</small><strong>${model.integer(calculation.totalRequiredKm)} km</strong></div>
      <div class="metric"><small>Comprometido</small><strong>${model.money(calculation.costs.monthlyFixed, 0)}</strong></div>
      <div class="metric"><small>Objetivo líquido</small><strong>${model.money(model.state.targetProfit, 0)}</strong></div>
    </div></div>
  </section>`;
}

function learning() {
  const calculation = model.calculations();
  const text = calculation.records.length < 3 ? 'Ainda faltam alguns dias reais para separar tendência de acaso.' : calculation.avgRevenueKm >= model.state.revenueKm ? 'Sua receita real por km está acima da referência usada no plano.' : 'Sua receita real por km está abaixo da referência usada no plano.';
  return `<section id="planningPage-learning">${sectionHead('O que o VETTA está aprendendo', 'Sugestões explicam evidência; nada altera sua meta automaticamente.')}<div class="surface"><span class="eyebrow">Leitura atual</span><h3 class="section-title">${calculation.records.length} dia(s) de evidência</h3><p id="planningLearningText" class="copy">${h(text)}</p></div></section>`;
}

function advanced() {
  return `<section id="planningPage-advanced">${sectionHead('Avançado', 'Funções raras ficam fora da rotina principal.')}<div class="surface"><span class="eyebrow">Segurança</span><h3 class="section-title">Restaurar padrões</h3><p class="copy">Esta ação altera configurações do plano, mas não apaga registros sem confirmação.</p><button class="danger full section-gap" type="button" data-reset-plan>Restaurar configurações</button></div></section>`;
}

function costLine(cost, allowPayment = true) {
  const meta = model.dueMeta(cost);
  const paid = model.isPaid(cost);
  const statusClass = paid ? 'paid' : meta.group === 'urgent' ? (meta.label.includes('hoje') ? 'today' : 'overdue') : 'upcoming';
  const category = cost.kind === 'percent' ? 'taxa percentual' : cost.category === 'reserve' ? 'reserva' : 'obrigação';
  return `<div class="r360-cost-line">${allowPayment ? `<button type="button" class="r360-payment ${paid ? 'is-paid' : ''}" data-r360-payment="${h(cost.id)}" aria-label="${paid ? 'Desfazer pagamento' : 'Marcar como pago'}">${paid ? '✓' : '○'}</button>` : ''}<button type="button" class="r360-cost-main" data-cost-edit="${h(cost.id)}"><strong>${h(cost.name)}</strong><small>${h(model.costCadence(cost))} · ${category}</small></button><span class="r360-status ${statusClass}">${h(meta.label)}</span></div>`;
}

function costs() {
  const active = model.state.costs.filter(cost => cost.active);
  const context = model.costContext();
  const reserveMonthly = active.filter(cost => cost.category === 'reserve' && !['per_km', 'percent'].includes(cost.kind)).reduce((sum, cost) => sum + model.monthlyEquivalent(cost), 0);
  const perKm = active.filter(cost => cost.kind === 'per_km').reduce((sum, cost) => sum + model.number(cost.value), 0);
  const obligations = active.filter(cost => cost.category === 'obligation' && !['per_km', 'percent'].includes(cost.kind));
  const classified = obligations.map(cost => ({ cost, meta: model.dueMeta(cost) })).sort((a, b) => a.meta.rank - b.meta.rank);
  const urgent = classified.filter(item => item.meta.group === 'urgent');
  const upcoming = classified.filter(item => item.meta.group === 'upcoming');
  const paid = classified.filter(item => item.meta.group === 'paid');
  const operational = model.state.costs.filter(cost => cost.category === 'reserve' || ['per_km', 'percent'].includes(cost.kind));
  const group = (id, items, empty, payment = true) => `<div id="${id}" class="r360-list">${items.length ? items.map(item => costLine(item.cost || item, payment)).join('') : `<div class="r360-empty">${empty}</div>`}</div>`;
  return `<section id="planningPage-costs">
    <div class="page-head">${ui.state.primary === 'costs' ? '' : '<button type="button" class="back-button" data-planning-section-open="">←</button>'}<div><span class="eyebrow">Custos</span><h2 class="title">Para onde seu dinheiro precisa ir</h2><p class="subtitle">Pagamento é estado administrativo. O custo continua na matemática enquanto estiver ativo.</p></div></div>
    <section id="r360Costs">
      <div id="r360CostAttention">${urgent.length ? `<div class="attention"><strong>${urgent.length} compromisso(s) pedem atenção</strong><small>${urgent.slice(0, 2).map(item => `${h(item.cost.name)} — ${h(item.meta.label)}`).join(' · ')}</small></div>` : '<div class="positive"><strong>Nenhuma conta crítica agora</strong><small>Os próximos compromissos continuam organizados abaixo.</small></div>'}</div>
      <div id="r360CostAddSlot" class="section-gap"><button id="planningAddCostButton" class="primary full" type="button">+ Adicionar custo</button></div>
      <div id="r360CostMetrics" class="metric-grid section-gap"><div class="metric"><small>Contas/mês</small><strong>${model.money(Math.max(0, context.monthlyFixed - reserveMonthly))}</strong></div><div class="metric"><small>Reservas/mês</small><strong>${model.money(reserveMonthly)}</strong></div><div class="metric"><small>Custo/km</small><strong>${model.money(perKm)}</strong></div><div class="metric"><small>Itens ativos</small><strong>${active.length}</strong></div></div>
      <div class="group-title">Vencidas e hoje</div>${group('r360CostUrgent', urgent, 'Nada vencido ou com vencimento hoje.')}
      <div class="group-title">Próximas</div>${group('r360CostUpcoming', upcoming, 'Cadastre vencimentos para antecipar o mês.')}
      <details id="r360PaidDetails" class="details section-gap"><summary><span>Pagas neste período</span><span>⌄</span></summary><div class="details-body">${group('r360CostPaid', paid, 'Nenhum pagamento marcado neste período.')}</div></details>
      <div class="group-title">Reservas, taxas e custos operacionais</div>${group('r360CostOperational', operational, 'Nenhuma reserva, taxa ou custo operacional cadastrado.', false)}
    </section>
    <div id="planningCostList" class="hidden">${model.state.costs.map(cost => h(cost.name)).join(' ')}</div>
  </section>`;
}

export function renderPlanning() {
  let body = hub();
  if (ui.state.planningSection === 'goals') body = goals();
  if (ui.state.planningSection === 'agenda') body = agenda();
  if (ui.state.planningSection === 'costs') body = costs();
  if (ui.state.planningSection === 'operation') body = operation();
  if (ui.state.planningSection === 'distribution') body = distribution();
  if (ui.state.planningSection === 'learning') body = learning();
  if (ui.state.planningSection === 'advanced') body = advanced();
  const hubHeader = ui.state.planningSection ? '' : '<div class="page-head"><button type="button" class="back-button" data-back aria-label="Voltar">←</button><div><span class="eyebrow">Planejamento</span></div></div>';
  return `<section id="view-planning" class="view-section ${ui.state.route === 'planning' ? '' : 'hidden'}" data-r1="ready" data-plan-state="${model.state.targetProfit <= 0 ? 'missing-target' : 'active'}">${hubHeader}${body}</section>`;
}

export function renderCostModal() {
  if (!ui.state.costModalOpen) return '';
  const cost = ui.state.costEditingId ? model.state.costs.find(item => item.id === ui.state.costEditingId) : null;
  const kind = cost?.kind || 'monthly';
  const valuePrefix = kind === 'percent' ? '%' : 'R$';
  return `<div id="costModal" class="modal"><div class="sheet">
    <div class="sheet-head"><div><span class="eyebrow">Planejamento financeiro</span><h3 id="costModalTitle" class="section-title">${cost ? 'Editar custo' : 'Adicionar custo'}</h3></div><button id="closeCostModal" class="icon-button" type="button" aria-label="Fechar"><i aria-hidden="true">×</i></button></div>
    <input id="costId" type="hidden" value="${h(cost?.id || '')}">
    <div class="modal-grid">
      <div class="input-group"><label class="input-label">Nome</label><input id="costName" class="input" value="${h(cost?.name || '')}"></div>
      <div class="input-row"><div class="input-group"><label class="input-label">Finalidade</label><select id="costCategory" class="input"><option value="obligation" ${cost?.category !== 'reserve' ? 'selected' : ''}>Conta ou obrigação</option><option value="reserve" ${cost?.category === 'reserve' ? 'selected' : ''}>Reserva</option></select></div><div class="input-group"><label class="input-label">Frequência</label><select id="costKind" class="input"><option value="monthly" ${kind === 'monthly' ? 'selected' : ''}>Todo mês</option><option value="weekly" ${kind === 'weekly' ? 'selected' : ''}>Toda semana</option><option value="per_km" ${kind === 'per_km' ? 'selected' : ''}>A cada km</option><option value="percent" ${kind === 'percent' ? 'selected' : ''}>Percentual do faturamento</option><option value="one_time" ${kind === 'one_time' ? 'selected' : ''}>Só neste mês</option></select></div></div>
      <div class="input-group"><label id="costValueLabel" class="input-label">${kind === 'percent' ? 'Percentual' : 'Valor'}</label><div class="money-input"><span id="costValuePrefix">${valuePrefix}</span><input id="costValue" class="input" type="number" step=".01" value="${h(cost?.value ?? '')}"></div></div>
      <div id="costDueDayWrap" class="input-group"><label class="input-label">Dia do vencimento</label><input id="costDueDay" class="input" type="number" min="1" max="31" value="${h(cost?.dueDay ?? '')}"></div>
      <div id="r360CostWeekdayWrap" class="input-group"><label class="input-label">Dia semanal</label><select id="r360CostWeekday" class="input">${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day, index) => `<option value="${index}" ${Number(cost?.dueWeekday ?? 5) === index ? 'selected' : ''}>${day}</option>`).join('')}</select></div>
      <label class="switch-row"><input id="r360CostActive" type="checkbox" ${cost?.active === false ? '' : 'checked'}><span><strong>Considerar no plano</strong><small class="copy">Marcar como pago não remove o custo da matemática.</small></span></label>
    </div>
    <button id="saveCostButton" class="primary full section-gap" type="button">Salvar custo</button>
  </div></div>`;
}