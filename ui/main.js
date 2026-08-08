import { model, root, ui, fuelPresets, setRenderCallback, installFacade, showToast, showSnackbar, vibrate, loadRecordDraft, saveRecordDraft, clearRecordDraft, loadOnboardingDraft, saveOnboardingDraft, clearOnboardingDraft, getDeferredPrompt, setDeferredPrompt } from './context.js';
import { renderTopbar, renderNav, renderDashboard } from './screens/dashboard.js';
import { renderPlanning, renderCostModal } from './screens/planning.js';
import { renderRecord, recordPreview, recordWeekImpact } from './screens/record.js';
import { renderHistory } from './screens/results.js';
import { renderMore, renderEventModal, renderInstallModal, renderNotificationsModal } from './screens/more.js';
import { renderOnboarding, onboardingDraft } from './screens/onboarding.js';

function render() {
  root.innerHTML = `<div class="app-frame">${renderTopbar()}<span id="appVersionLabel" class="hidden">Versão 3.5.1</span><main class="app-main">${renderDashboard()}${renderPlanning()}${renderRecord()}${renderHistory()}${renderMore()}</main>${renderNav()}${renderCostModal()}${renderEventModal()}${renderInstallModal()}${renderNotificationsModal()}${renderOnboarding()}</div>`;
  syncCostModalVisibility();
}

setRenderCallback(render);
ui.bootstrap({ onboardingStep: loadOnboardingDraft()?.step || 1 });
document.body.dataset.r360 = 'r10';
document.body.dataset.uiAuthority = 'premium-v1';
installFacade();

function syncCostModalVisibility() {
  const kind = document.getElementById('costKind')?.value;
  if (!kind) return;
  document.getElementById('costDueDayWrap')?.classList.toggle('hidden', !['monthly', 'one_time'].includes(kind));
  document.getElementById('r360CostWeekdayWrap')?.classList.toggle('hidden', kind !== 'weekly');
  const percent = kind === 'percent';
  const prefix = document.getElementById('costValuePrefix');
  const label = document.getElementById('costValueLabel');
  if (prefix) prefix.textContent = percent ? '%' : 'R$';
  if (label) label.textContent = percent ? 'Percentual' : 'Valor';
}

function currentRecordReturn() {
  if (ui.state.primary === 'history') return 'history';
  if (ui.state.primary === 'costs') return 'costs';
  if (ui.state.primary === 'more') return 'more';
  return 'dashboard';
}

function openRecord(returnTarget = 'dashboard', date = null) {
  const primary = returnTarget.startsWith('history') ? 'history' : returnTarget === 'costs' ? 'costs' : returnTarget === 'more' ? 'more' : 'dashboard';
  ui.push({ route: 'day', primary, recordReturn: returnTarget, recordEditingDate: date, recordConfirmationDate: null, lastRecordUpdated: false });
}

function finishRecord(date) {
  if (ui.state.recordReturn === 'history-detail') return ui.push({ route: 'history', primary: 'history', historySection: null, resultDetail: date, recordEditingDate: null, recordConfirmationDate: null });
  if (ui.state.recordReturn === 'history-days') return ui.push({ route: 'history', primary: 'history', historySection: 'days', resultDetail: null, recordEditingDate: null, recordConfirmationDate: null });
  if (ui.state.recordReturn === 'history') return ui.primary('history');
  if (ui.state.recordReturn === 'costs') return ui.primary('costs');
  if (ui.state.recordReturn === 'more') return ui.primary('more');
  return ui.primary('dashboard');
}

function openPlan(section = null) { ui.secondary('planning', { planningSection: section, primary: ui.state.primary === 'costs' ? 'costs' : ui.state.primary }); }
function openResults(period = 'week') { model.state.r360.resultsPeriod = period; model.save(); ui.primary('history'); }
function recordValuesFromDom() { return { date: document.getElementById('recordDate')?.value || model.todayKey(), gross: document.getElementById('recordGross')?.value || '', km: document.getElementById('recordKm')?.value || '', hours: document.getElementById('recordHours')?.value || '', fuelSpend: document.getElementById('recordFuel')?.value || '' }; }
function persistRecordDraft() { const values = recordValuesFromDom(); saveRecordDraft({ recordDate: values.date, recordGross: values.gross, recordKm: values.km, recordHours: values.hours, recordFuel: values.fuelSpend }); return values; }
function hasMeaningfulDraft() { const draft = loadRecordDraft(); return Boolean(draft && (draft.recordGross || draft.recordKm || draft.recordHours || draft.recordFuel)); }

root.addEventListener('click', event => {
  const target = event.target.closest('button,[data-view],[data-planning-section-open],[data-history-section-open],[data-more-section-open],summary,label');
  if (!target) return;

  if (target.matches('[data-view]')) {
    const view = target.dataset.view;
    if (view === 'day') openRecord(currentRecordReturn());
    else ui.primary(view);
    return;
  }
  if (target.matches('[data-open-plan],#r1HeaderPlanButton,#r1PlanButton')) { openPlan(); return; }
  if (target.matches('[data-open-costs]')) { ui.primary('costs'); return; }
  if (target.matches('[data-open-results]')) { openResults(target.dataset.openResults || 'week'); return; }

  const next = target.closest('[data-next-action]');
  if (next) {
    const mode = next.dataset.nextAction;
    if (mode === 'plan') openPlan();
    else if (mode === 'costs') ui.primary('costs');
    else if (mode === 'results') openResults('week');
    else openRecord('dashboard');
    return;
  }

  if (target.matches('[data-back]')) { ui.back({ route: 'dashboard', primary: 'dashboard' }); return; }
  if (target.matches('[data-planning-section-open]')) { ui.secondary('planning', { planningSection: target.dataset.planningSectionOpen }); return; }
  if (target.matches('[data-planning-section-back]')) { if (ui.state.primary === 'costs') ui.primary('costs'); else ui.replace({ planningSection: null }); return; }
  if (target.matches('[data-plan-days]')) { model.state.workWeekdays = model.weekdaysForCount(Number(target.dataset.planDays)); model.save(); render(); return; }
  if (target.matches('[data-plan-weekday]')) {
    const day = Number(target.dataset.planWeekday), set = new Set(model.state.workWeekdays);
    if (set.has(day)) { if (set.size === 1) return showToast('Escolha pelo menos um dia.'); set.delete(day); } else set.add(day);
    model.state.workWeekdays = [...set].sort((a, b) => a - b); model.save(); render(); return;
  }
  if (target.matches('[data-reset-plan]')) {
    if (confirm('Restaurar configurações do plano? Seus registros serão preservados.')) {
      model.state.targetProfit = 4000; model.state.workWeekdays = [1, 2, 3, 4, 5, 6]; model.state.extraDaysOff = 0; model.state.revenueKm = 2.25; model.state.fuel = { type: 'gnv', ...fuelPresets.gnv };
      model.save(); render(); showToast('Configurações restauradas.');
    }
    return;
  }

  if (target.matches('#planningAddCostButton,[data-add-cost]')) { ui.set({ costModalOpen: true, costEditingId: null }); return; }
  if (target.matches('[data-cost-edit]')) { ui.set({ costModalOpen: true, costEditingId: target.dataset.costEdit }); return; }
  const payment = target.closest('[data-r360-payment]');
  if (payment) {
    const cost = model.state.costs.find(item => item.id === payment.dataset.r360Payment);
    if (!cost) return;
    const wasPaid = model.isPaid(cost);
    const before = model.costContext();
    model.setPaid(cost, !wasPaid);
    const after = model.costContext();
    if (Math.abs(before.monthlyFixed - after.monthlyFixed) > 0.000001 || Math.abs(before.percent - after.percent) > 0.000001 || Math.abs(before.perKm - after.perKm) > 0.000001) {
      model.setPaid(cost, wasPaid); return showToast('A operação foi interrompida para preservar a matemática.');
    }
    vibrate(18);
    showSnackbar(wasPaid ? 'Pagamento reaberto.' : 'Pagamento marcado. A matemática do custo foi preservada.', () => model.setPaid(cost, wasPaid));
    render(); return;
  }
  if (target.matches('#closeCostModal')) { ui.set({ costModalOpen: false, costEditingId: null }); return; }
  if (target.matches('#saveCostButton')) {
    const kind = document.getElementById('costKind').value;
    const result = model.upsertCost({ id: document.getElementById('costId').value || undefined, name: document.getElementById('costName').value, category: document.getElementById('costCategory').value, kind, value: document.getElementById('costValue').value, dueDay: document.getElementById('costDueDay').value, dueWeekday: kind === 'weekly' ? Number(document.getElementById('r360CostWeekday').value) : undefined, active: document.getElementById('r360CostActive').checked });
    if (!result.ok) return showToast('Informe nome e valor válidos.');
    ui.set({ costModalOpen: false, costEditingId: null }); vibrate(16); showToast('Custo salvo.'); return;
  }

  if (target.matches('#r360RecordCancel')) { if (hasMeaningfulDraft() && !confirm('Descartar o rascunho deste dia?')) return; clearRecordDraft(); ui.back({ route: ui.state.primary, primary: ui.state.primary }); return; }
  if (target.matches('#saveDayButton')) {
    const result = model.saveRecord(recordValuesFromDom());
    if (!result.ok) return showToast('Informe faturamento e quilômetros maiores que zero.');
    clearRecordDraft(); ui.set({ recordEditingDate: result.draft.date, recordConfirmationDate: result.draft.date, lastRecordUpdated: result.updated }); vibrate(18); return;
  }
  if (target.matches('#recordEditButton')) { const date = ui.state.recordConfirmationDate; ui.push({ route: 'history', primary: 'history', historySection: null, resultDetail: date, recordEditingDate: null, recordConfirmationDate: null }); return; }
  if (target.matches('#recordDoneButton')) { finishRecord(ui.state.recordConfirmationDate); return; }

  if (target.matches('[data-r360-result-date]')) { ui.set({ resultDetail: target.dataset.r360ResultDate }); return; }
  if (target.matches('[data-close-result-detail]')) { ui.set({ resultDetail: null }); return; }
  if (target.matches('[data-r360-edit-day]')) { openRecord('history-detail', target.dataset.r360EditDay); return; }
  if (target.matches('[data-r360-period]')) { model.state.r360.resultsPeriod = target.dataset.r360Period; model.save(); render(); return; }
  if (target.matches('[data-history-section-open]')) { ui.secondary('history', { historySection: target.dataset.historySectionOpen, resultDetail: null, primary: 'history' }); return; }
  if (target.matches('[data-history-section-back]')) { ui.replace({ historySection: null, resultDetail: null }); return; }
  if (target.matches('[data-action="edit"]')) { openRecord('history-days', target.dataset.date); return; }
  if (target.matches('[data-action="delete"]')) { if (confirm('Excluir este registro? A meta será recalculada.')) { model.deleteRecord(target.dataset.date); render(); showToast('Registro excluído.'); } return; }

  if (target.matches('[data-more-section-open]')) { ui.secondary('more', { moreSection: target.dataset.moreSectionOpen, primary: 'more' }); return; }
  if (target.matches('[data-more-section-back]')) { ui.replace({ moreSection: null }); return; }
  if (target.matches('#reportButton')) { window.print(); return; }
  if (target.matches('#exportButton')) {
    const blob = new Blob([JSON.stringify(model.exportPayload(), null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `vetta-backup-${model.todayKey()}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); return;
  }
  if (target.matches('[data-r360-import-confirm]')) { model.replace(ui.state.importCandidate); ui.set({ importCandidate: null }); showToast('Backup importado com sucesso.'); return; }
  if (target.matches('#addEventButton,[data-add-event]')) { ui.set({ eventModalOpen: true, eventEditingId: null }); return; }
  if (target.matches('#closeEventModal')) { ui.set({ eventModalOpen: false, eventEditingId: null }); return; }
  if (target.matches('#saveEventButton')) {
    const result = model.upsertEvent({ id: ui.state.eventEditingId || undefined, title: document.getElementById('eventTitle').value, date: document.getElementById('eventDate').value, note: document.getElementById('eventNote').value });
    if (!result.ok) return showToast('Informe título e data.'); ui.set({ eventModalOpen: false, eventEditingId: null }); showToast('Evento salvo.'); return;
  }
  if (target.matches('[data-event-action="edit"]')) { ui.set({ eventModalOpen: true, eventEditingId: target.dataset.eventId }); return; }
  if (target.matches('[data-event-action="delete"]')) { if (confirm('Excluir este evento?')) { model.deleteEvent(target.dataset.eventId); render(); } return; }
  if (target.matches('#installCardButton,[data-install]')) { ui.set({ installOpen: true }); return; }
  if (target.matches('#closeInstallModal')) { ui.set({ installOpen: false }); return; }
  if (target.matches('#retryInstallButton,[data-run-install]')) { const prompt = getDeferredPrompt(); if (prompt) { prompt.prompt(); prompt.userChoice.finally(() => { setDeferredPrompt(null); ui.set({ installOpen: false }); }); } return; }
  if (target.matches('[data-r360-more-open="notifications"]')) { ui.set({ notificationsOpen: true }); return; }
  if (target.matches('[data-close-notifications]')) { ui.set({ notificationsOpen: false }); return; }

  if (target.matches('[data-r360-vehicle]')) { const draft = onboardingDraft(); draft.vehicle = target.dataset.r360Vehicle; saveOnboardingDraft(draft); render(); return; }
  if (target.matches('[data-onboarding-days]')) { const draft = onboardingDraft(); draft.days = Number(target.dataset.onboardingDays); saveOnboardingDraft(draft); render(); return; }
  if (target.matches('#onboardingBack')) { const draft = onboardingDraft(); draft.step = Math.max(1, (draft.step || 1) - 1); saveOnboardingDraft(draft); ui.set({ onboardingStep: draft.step }); return; }
  if (target.matches('#onboardingNext')) { advanceOnboarding(); return; }
});

root.addEventListener('input', event => {
  const id = event.target.id;
  if (['recordDate', 'recordGross', 'recordKm', 'recordHours', 'recordFuel'].includes(id)) {
    const values = persistRecordDraft(), preview = recordPreview(values), impact = recordWeekImpact(values);
    document.getElementById('previewNet').textContent = model.money(preview.net);
    document.getElementById('previewCost').textContent = model.money(preview.fuel + preview.variable + preview.percentCost + preview.fixedShare);
    document.getElementById('previewRevenueKm').textContent = model.money(preview.revenuePerKm);
    document.getElementById('previewExplanation').textContent = values.gross && values.km ? `Este dia levaria sua semana para aproximadamente ${Math.round(impact.pct)}% do planejado.` : 'Preencha faturamento e quilômetros para ver a consequência antes de salvar.';
    return;
  }
  if (id === 'planningTargetSlider') { const input = document.getElementById('planningTargetInput'); if (input) input.value = event.target.value; return; }
  if (['onboardingTarget', 'onboardingTargetSlider', 'r360RentalValue'].includes(id)) {
    const draft = onboardingDraft();
    if (id === 'onboardingTarget' || id === 'onboardingTargetSlider') { draft.target = Number(event.target.value); const peer = document.getElementById(id === 'onboardingTarget' ? 'onboardingTargetSlider' : 'onboardingTarget'); if (peer) peer.value = event.target.value; }
    else draft.rentalValue = event.target.value;
    saveOnboardingDraft(draft); return;
  }
});

root.addEventListener('change', async event => {
  const id = event.target.id;
  if (id === 'planningTargetInput' || id === 'planningTargetSlider') { model.state.targetProfit = Math.max(0, model.number(event.target.value)); model.save(); render(); return; }
  if (id === 'planningDaysOff') { model.state.extraDaysOff = Math.max(0, model.number(event.target.value)); model.save(); render(); return; }
  if (id === 'planningFuelType') { const preset = fuelPresets[event.target.value] || fuelPresets.custom; model.state.fuel = { type: event.target.value, ...preset }; model.save(); render(); return; }
  if (id === 'planningFuelPrice') { model.state.fuel.price = model.number(event.target.value); model.save(); return; }
  if (id === 'planningFuelEff') { model.state.fuel.efficiency = model.number(event.target.value); model.save(); return; }
  if (id === 'planningRevenueKm') { model.state.revenueKm = model.number(event.target.value); model.save(); return; }
  if (id === 'costKind') { syncCostModalVisibility(); return; }
  if (['compareGasPrice', 'compareGasEff', 'compareGnvPrice', 'compareGnvEff'].includes(id)) { const map = { compareGasPrice: 'gasPrice', compareGasEff: 'gasEff', compareGnvPrice: 'gnvPrice', compareGnvEff: 'gnvEff' }; model.state.compare[map[id]] = model.number(event.target.value); model.save(); return; }
  if (id === 'importInput') { handleImport(event.target.files?.[0]); return; }
  if (id === 'r360RentalWeekday') { const draft = onboardingDraft(); draft.rentalWeekday = Number(event.target.value); saveOnboardingDraft(draft); return; }
  if (id === 'onboardingFuelType') { const draft = onboardingDraft(), preset = fuelPresets[event.target.value] || fuelPresets.custom; draft.fuelType = event.target.value; draft.fuelPrice = preset.price; draft.fuelEff = preset.efficiency; saveOnboardingDraft(draft); render(); return; }
  if (['onboardingFuelPrice', 'onboardingFuelEff', 'onboardingRevenue'].includes(id)) { const draft = onboardingDraft(); if (id === 'onboardingFuelPrice') draft.fuelPrice = event.target.value; if (id === 'onboardingFuelEff') draft.fuelEff = event.target.value; if (id === 'onboardingRevenue') draft.revenue = event.target.value; saveOnboardingDraft(draft); return; }
  if (event.target.matches('[data-notification]')) {
    const key = event.target.dataset.notification;
    if (event.target.checked && 'Notification' in window && Notification.permission === 'default') { const permission = await Notification.requestPermission(); if (permission !== 'granted') { event.target.checked = false; showToast('Permissão de notificação não concedida.'); return; } }
    model.state.r360.notifications[key] = event.target.checked; model.save(); return;
  }
});

function handleImport(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result), candidate = parsed?.data || parsed;
      if (!candidate || typeof candidate !== 'object' || !Array.isArray(candidate.records) || !Array.isArray(candidate.costs)) throw new Error('invalid');
      ui.set({ importCandidate: candidate });
    } catch { showToast('Arquivo inválido. Seus dados não foram alterados.'); }
  };
  reader.readAsText(file);
}

function advanceOnboarding() {
  const draft = onboardingDraft(), step = draft.step || 1;
  if (step === 1) {
    if (!['own', 'financed', 'rental'].includes(draft.vehicle)) return showToast('Escolha como você trabalha hoje.');
    if (draft.vehicle === 'rental' && model.number(document.getElementById('r360RentalValue')?.value || draft.rentalValue) <= 0) return showToast('Informe o valor do aluguel semanal.');
    draft.rentalValue = document.getElementById('r360RentalValue')?.value || draft.rentalValue;
    draft.rentalWeekday = Number(document.getElementById('r360RentalWeekday')?.value ?? draft.rentalWeekday ?? 5);
    draft.step = 2; saveOnboardingDraft(draft); ui.set({ onboardingStep: 2 }); return;
  }
  if (step === 2) {
    draft.target = model.number(document.getElementById('onboardingTarget').value);
    if (draft.target <= 0) return showToast('Defina uma meta líquida maior que zero.');
    draft.step = 3; saveOnboardingDraft(draft); ui.set({ onboardingStep: 3 }); return;
  }
  draft.fuelType = document.getElementById('onboardingFuelType').value;
  draft.fuelPrice = model.number(document.getElementById('onboardingFuelPrice').value);
  draft.fuelEff = model.number(document.getElementById('onboardingFuelEff').value);
  draft.revenue = model.number(document.getElementById('onboardingRevenue').value);
  if (draft.fuelPrice <= 0 || draft.fuelEff <= 0 || draft.revenue <= 0) return showToast('Revise preço, rendimento e receita por km.');
  model.state.onboardingComplete = true;
  model.state.targetProfit = draft.target;
  model.state.workWeekdays = model.weekdaysForCount(Number(draft.days || 6));
  model.state.r360.vehicleOwnership = draft.vehicle;
  const preset = fuelPresets[draft.fuelType] || fuelPresets.custom;
  model.state.fuel = { type: draft.fuelType, label: preset.label, unit: preset.unit, price: draft.fuelPrice, efficiency: draft.fuelEff };
  model.state.revenueKm = draft.revenue;
  if (draft.vehicle === 'rental') model.upsertCost({ id: 'r360-rental', name: 'Aluguel do veículo', kind: 'weekly', category: 'obligation', value: draft.rentalValue, dueWeekday: Number(draft.rentalWeekday), active: true });
  else model.state.costs = model.state.costs.filter(cost => cost.id !== 'r360-rental');
  model.save(); clearOnboardingDraft(); ui.set({ onboardingStep: 1 }); vibrate(22); showToast('Plano inicial pronto.');
}

function applyDeepLink() {
  const params = new URLSearchParams(location.search), destination = params.get('vetta');
  if (destination === 'results') { const period = params.get('period') === 'month' ? 'month' : 'week'; model.state.r360.resultsPeriod = period; model.save(); ui.replace({ route: 'history', primary: 'history', historySection: null, resultDetail: null }); }
  else if (destination === 'costs') ui.replace({ route: 'planning', primary: 'costs', planningSection: 'costs' });
  else if (destination === 'plan') ui.replace({ route: 'planning', primary: 'dashboard', planningSection: null });
}

window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); setDeferredPrompt(event); });
window.addEventListener('appinstalled', () => { setDeferredPrompt(null); showToast('VETTA instalado com sucesso.'); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Service worker não registrado', error)));
applyDeepLink();
render();
