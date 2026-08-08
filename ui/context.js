import { VettaModel, fuelPresets } from './model.js';
import { UiStore } from './store.js';

export const RECORD_DRAFT_KEY = 'vetta-r360-record-draft-v1';
export const ONBOARDING_DRAFT_KEY = 'vetta-r360-onboarding-draft-v1';
export const model = new VettaModel();
export const root = document.getElementById('app');
export const h = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
export const formatDate = key => model.parseDate(key).toLocaleDateString('pt-BR', { weekday:'short', day:'2-digit', month:'short' });
export const vibrate = pattern => { if (!navigator.vibrate || matchMedia('(prefers-reduced-motion: reduce)').matches) return; try { navigator.vibrate(pattern); } catch {} };
export const loadJson = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
export const saveJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const loadRecordDraft = () => loadJson(RECORD_DRAFT_KEY);
export const saveRecordDraft = value => saveJson(RECORD_DRAFT_KEY, value);
export const clearRecordDraft = () => localStorage.removeItem(RECORD_DRAFT_KEY);
export const loadOnboardingDraft = () => loadJson(ONBOARDING_DRAFT_KEY);
export const saveOnboardingDraft = value => saveJson(ONBOARDING_DRAFT_KEY, value);
export const clearOnboardingDraft = () => localStorage.removeItem(ONBOARDING_DRAFT_KEY);
export { fuelPresets };

let renderCallback = () => {};
export const setRenderCallback = callback => { renderCallback = callback; };
export const renderNow = () => renderCallback();
export const ui = new UiStore(() => renderCallback());

const toast = document.createElement('div');
toast.id = 'toast'; toast.className = 'toast hidden'; document.body.appendChild(toast);
let toastTimer = null;
export function showToast(message) { clearTimeout(toastTimer); toast.textContent = message; toast.classList.remove('hidden'); toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800); }

const snackbar = document.createElement('div');
snackbar.id = 'r360Snackbar'; snackbar.className = 'r360-snackbar hidden'; snackbar.innerHTML = '<span></span><button type="button">DESFAZER</button>'; document.body.appendChild(snackbar);
let snackbarUndo = null;
snackbar.querySelector('button').addEventListener('click', () => { const undo = snackbarUndo; snackbarUndo = null; snackbar.classList.add('hidden'); if (undo) { undo(); renderCallback(); } });
export function showSnackbar(message, undo = null) { snackbar.querySelector('span').textContent = message; snackbar.querySelector('button').hidden = typeof undo !== 'function'; snackbarUndo = undo; snackbar.classList.remove('hidden'); }

export function weekPresentation() {
  const c = model.calculations(), week = model.weekContext(c), delta = week.actual - week.target, has = week.records.length > 0;
  return { week, delta, title:has?(delta>=0?'Semana acima da rota':'Semana pede recuperação'):'Planejamento semanal', pill:has?(delta>=0?'NO RITMO':'AJUSTANDO'):'SEMANA', text:has?`${week.records.length} dia(s) registrados. Saldo semanal: ${delta>=0?'+':'-'} ${model.money(Math.abs(delta),0)}.`:`A semana tem ${week.dates.length} dia(s) previstos na sua agenda.` };
}
export function criticalCosts() { return model.state.costs.filter(cost => cost.category === 'obligation' && cost.active && !model.isPaid(cost)).map(cost => ({cost,meta:model.dueMeta(cost)})).filter(item => item.meta.rank < 22).sort((a,b)=>a.meta.rank-b.meta.rank); }
export function nextAction() {
  const c=model.calculations(), wp=weekPresentation(), critical=criticalCosts();
  if(model.state.targetProfit<=0)return{mode:'plan',title:'Complete o objetivo do seu plano',text:'Sem meta líquida, o VETTA não consegue dizer se a semana está no ritmo.',glyph:'◎'};
  if(critical.length)return{mode:'costs',title:'Resolva a atenção financeira mais próxima',text:`${critical[0].cost.name}: ${critical[0].meta.label.toLowerCase()}.`,glyph:'▣'};
  if(!c.records.length)return{mode:'record',title:'Registre seu primeiro dia',text:'O primeiro registro conecta planejamento e realidade.',glyph:'+'};
  if(wp.delta<0)return{mode:'results',title:'Entenda o ritmo antes de mudar o plano',text:'Veja a semana e decida a próxima ação com base no realizado.',glyph:'↗'};
  return{mode:'record',title:'Continue alimentando o mês',text:'Seu ritmo está coerente. Registre o próximo dia quando terminar.',glyph:'+'};
}

let deferredPrompt = null;
export const getDeferredPrompt = () => deferredPrompt;
export const setDeferredPrompt = value => { deferredPrompt = value; };

export function installFacade() {
  window.__vettaApp = {
    get state(){return model.state;}, set state(value){model.state=value;}, save:()=>model.save(), render:()=>renderCallback(),
    calculations:(...args)=>model.calculations(...args), costContext:(...args)=>model.costContext(...args), weekContext:(...args)=>model.weekContext(...args),
    monthSummary:(...args)=>model.monthSummary(...args), monthContext:(...args)=>model.monthContext(...args), recordNumbers:(...args)=>model.recordNumbers(...args),
    money:(...args)=>model.money(...args), integer:(...args)=>model.integer(...args), number:value=>model.number(value), dateKey:date=>model.dateKey(date),
    navigateToPrimary:view=>ui.primary(view), r360Audit:{renderAll:()=>renderCallback()},
  };
}
