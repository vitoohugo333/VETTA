const STORAGE_KEY = 'vetta-driver-intelligence-v3';
const STATE_VERSION = 12;

const fuelPresets = {
  gnv: { label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  gasoline: { label: 'Gasolina', unit: 'L', price: 6.19, efficiency: 10.5 },
  ethanol: { label: 'Etanol', unit: 'L', price: 4.29, efficiency: 7.4 },
  diesel: { label: 'Diesel', unit: 'L', price: 6.09, efficiency: 11.5 },
  custom: { label: 'Personalizado', unit: 'un.', price: 5, efficiency: 10 },
};

const defaults = {
  version: STATE_VERSION,
  release: '3.5.1',
  onboardingComplete: false,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 0,
  revenueKm: 2.25,
  fuel: { type: 'gnv', ...fuelPresets.gnv },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [
    { id: 'maintenance-default', name: 'Reserva de manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true, paidPeriods: [] },
    { id: 'fixed-default', name: 'Outros custos mensais', kind: 'monthly', category: 'obligation', value: 650, active: true, paidPeriods: [] },
  ],
  records: [],
  events: [],
  closings: [],
  r360: {
    resultsPeriod: 'week',
    vehicleOwnership: 'unknown',
    notifications: { dueCosts: false, weeklySummary: false, pace: false, missingRecords: false, incompletePlan: false },
  },
};

const clone = value => JSON.parse(JSON.stringify(value));
const number = value => {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const monthKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const parseDate = key => {
  const [year, month, day] = String(key).split('-').map(Number);
  return new Date(year, month - 1, day || 1, 12);
};

function normalizeState(value = {}) {
  const base = clone(defaults);
  const state = { ...base, ...value };
  state.fuel = { ...base.fuel, ...(value.fuel || {}) };
  state.compare = { ...base.compare, ...(value.compare || {}) };
  state.records = Array.isArray(value.records) ? value.records : [];
  state.events = Array.isArray(value.events) ? value.events : [];
  state.closings = Array.isArray(value.closings) ? value.closings : [];
  state.workWeekdays = Array.isArray(value.workWeekdays) && value.workWeekdays.length ? [...value.workWeekdays] : base.workWeekdays;
  state.costs = (Array.isArray(value.costs) ? value.costs : base.costs).map(cost => ({
    ...cost,
    name: ['fixed-default', 'fixed-migrated'].includes(cost?.id) || /custos?\s+fixos?\s+(migrados?|iniciais?)/i.test(cost?.name || '') ? 'Outros custos mensais' : cost.name,
    active: cost?.active !== false,
    paidPeriods: Array.isArray(cost?.paidPeriods) ? [...cost.paidPeriods] : [],
    legacySource: false,
    dueWeekday: Number.isInteger(cost?.dueWeekday) ? cost.dueWeekday : undefined,
  }));
  state.r360 = { ...base.r360, ...(value.r360 || {}) };
  state.r360.notifications = { ...base.r360.notifications, ...(value.r360?.notifications || {}) };
  state.targetProfit = Math.max(0, number(state.targetProfit));
  state.extraDaysOff = Math.max(0, number(state.extraDaysOff));
  state.revenueKm = Math.max(0, number(state.revenueKm));
  state.version = STATE_VERSION;
  state.release = '3.5.1';
  return state;
}

export class VettaModel {
  constructor() { this.state = normalizeState(this.read()); this.save(); }
  read() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || clone(defaults); } catch { return clone(defaults); } }
  save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); }
  replace(value) { this.state = normalizeState(value); this.save(); return this.state; }
  reset() { this.state = clone(defaults); this.save(); return this.state; }
  number(value) { return number(value); }
  clamp(value, min, max) { return clamp(value, min, max); }
  money(value, digits = 2) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number.isFinite(value) ? value : 0); }
  integer(value) { return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0); }
  dateKey(date) { return dateKey(date); }
  todayKey() { return dateKey(new Date()); }
  monthKey(date = new Date()) { return monthKey(date); }
  parseDate(key) { return parseDate(key); }
  weekdaysForCount(count) { return count <= 5 ? [1,2,3,4,5] : count === 6 ? [1,2,3,4,5,6] : [0,1,2,3,4,5,6]; }

  monthContext(reference = new Date()) {
    const year = reference.getFullYear(), month = reference.getMonth();
    const first = new Date(year, month, 1, 12), last = new Date(year, month + 1, 0, 12);
    const selectedDates = [];
    for (let cursor = new Date(first); cursor <= last; cursor.setDate(cursor.getDate() + 1)) if (this.state.workWeekdays.includes(cursor.getDay())) selectedDates.push(this.dateKey(cursor));
    const key = this.monthKey(reference);
    const monthRecords = this.state.records.filter(record => String(record.date || '').startsWith(key)).sort((a,b) => a.date.localeCompare(b.date));
    const recordDates = new Set(monthRecords.map(record => record.date));
    const today = this.todayKey();
    const elapsedSelected = selectedDates.filter(item => item < today).length;
    const recordedElapsed = monthRecords.filter(record => record.date < today && selectedDates.includes(record.date)).length;
    const extraUsed = this.clamp(elapsedSelected - recordedElapsed, 0, this.state.extraDaysOff);
    const extraRemaining = Math.max(0, this.state.extraDaysOff - extraUsed);
    const selectedRemaining = selectedDates.filter(item => item >= today && !recordDates.has(item)).length;
    const remainingDays = Math.max(0, selectedRemaining - extraRemaining);
    return { year, month, first, last, selectedDates, monthRecords, recordDates, plannedDays: Math.max(1, selectedDates.length - this.state.extraDaysOff), remainingDays, extraUsed, extraRemaining };
  }

  fuelCostKm() { return this.state.fuel.efficiency > 0 ? this.state.fuel.price / this.state.fuel.efficiency : 0; }
  monthlyEquivalent(cost, reference = new Date()) {
    if (!cost?.active) return 0;
    if (cost.kind === 'monthly') return this.number(cost.value);
    if (cost.kind === 'weekly') return this.number(cost.value) * 52 / 12;
    if (cost.kind === 'one_time') return (!cost.month || cost.month === this.monthKey(reference)) ? this.number(cost.value) : 0;
    return 0;
  }
  costContext(reference = new Date()) {
    const active = this.state.costs.filter(cost => cost.active);
    let obligations = 0, reserves = 0, perKm = 0, percent = 0;
    active.forEach(cost => {
      if (cost.kind === 'per_km') perKm += this.number(cost.value);
      else if (cost.kind === 'percent') percent += this.number(cost.value) / 100;
      else if (cost.category === 'reserve') reserves += this.monthlyEquivalent(cost, reference);
      else obligations += this.monthlyEquivalent(cost, reference);
    });
    return { active, obligations, reserves, monthlyFixed: obligations + reserves, perKm, percent: this.clamp(percent, 0, 0.95) };
  }
  recordNumbers(record, context = this.monthContext(this.parseDate(record.date))) {
    const gross = this.number(record.gross), km = this.number(record.km);
    const fuelRate = this.number(record.fuelCostKmSnapshot) || this.fuelCostKm();
    const fuel = this.number(record.fuelSpend) > 0 ? this.number(record.fuelSpend) : km * fuelRate;
    const perKmRate = record.perKmCostSnapshot != null ? this.number(record.perKmCostSnapshot) : (record.maintKmSnapshot != null ? this.number(record.maintKmSnapshot) : this.costContext(this.parseDate(record.date)).perKm);
    const percentRate = record.percentCostSnapshot != null ? this.number(record.percentCostSnapshot) : 0;
    const variable = km * perKmRate;
    const percentCost = gross * percentRate;
    const currentFixed = this.costContext(this.parseDate(record.date)).monthlyFixed;
    const fixedShare = this.number(record.fixedShareSnapshot) > 0 ? this.number(record.fixedShareSnapshot) : currentFixed / Math.max(1, context.plannedDays);
    const contribution = gross - fuel - variable - percentCost;
    return { ...record, gross, km, fuel, variable, percentCost, contribution, fixedShare, net: contribution - fixedShare, revenuePerKm: km > 0 ? gross / km : 0, costPerKm: km > 0 ? (fuel + variable + percentCost) / km : 0 };
  }
  calculations(reference = new Date()) {
    const state = this.state, ctx = this.monthContext(reference), costs = this.costContext(reference), fuelKm = this.fuelCostKm();
    const contributionKm = Math.max(0.01, state.revenueKm * (1 - costs.percent) - fuelKm - costs.perKm);
    const records = ctx.monthRecords.map(record => this.recordNumbers(record, ctx));
    const actualGross = records.reduce((sum, record) => sum + record.gross, 0);
    const actualKm = records.reduce((sum, record) => sum + record.km, 0);
    const actualFuel = records.reduce((sum, record) => sum + record.fuel, 0);
    const actualVariable = records.reduce((sum, record) => sum + record.variable, 0);
    const actualPercent = records.reduce((sum, record) => sum + record.percentCost, 0);
    const actualContribution = actualGross - actualFuel - actualVariable - actualPercent;
    const fixedAllocated = costs.monthlyFixed * Math.min(1, records.length / Math.max(1, ctx.plannedDays));
    const actualNet = actualContribution - fixedAllocated;
    const requiredContribution = state.targetProfit + costs.monthlyFixed;
    const remainingContribution = Math.max(0, requiredContribution - actualContribution);
    const remainingDays = Math.max(0, ctx.remainingDays);
    const dailyContribution = remainingDays > 0 ? remainingContribution / remainingDays : remainingContribution;
    const dailyKm = dailyContribution / contributionKm;
    const dailyGross = dailyKm * state.revenueKm;
    const dailyNet = remainingDays > 0 ? Math.max(0, (state.targetProfit - actualNet) / remainingDays) : Math.max(0, state.targetProfit - actualNet);
    const totalRequiredKm = requiredContribution / contributionKm;
    const totalGross = totalRequiredKm * state.revenueKm;
    const totalFuel = totalRequiredKm * fuelKm;
    const totalVariable = totalRequiredKm * costs.perKm;
    const totalPercent = totalGross * costs.percent;
    const averageContribution = records.length ? actualContribution / records.length : dailyContribution;
    const projectedNet = records.length ? averageContribution * ctx.plannedDays - costs.monthlyFixed : state.targetProfit;
    const consumedDays = Math.max(0, ctx.plannedDays - remainingDays);
    const expectedNetToDate = state.targetProfit * (consumedDays / Math.max(1, ctx.plannedDays));
    const paceDelta = actualNet - expectedNetToDate;
    const progress = state.targetProfit > 0 ? this.clamp(actualNet / state.targetProfit * 100, 0, 100) : 0;
    const avgRevenueKm = actualKm > 0 ? actualGross / actualKm : 0;
    const avgNetKm = actualKm > 0 ? actualContribution / actualKm : 0;
    const surplusContribution = Math.max(0, actualContribution - requiredContribution * (consumedDays / Math.max(1, ctx.plannedDays)));
    const earnedDays = dailyContribution > 0 ? Math.floor(surplusContribution / dailyContribution) : 0;
    return { ctx, costs, records, fuelKm, contributionKm, actualGross, actualKm, actualFuel, actualVariable, actualPercent, actualContribution, fixedAllocated, actualNet, remainingContribution, remainingDays, dailyContribution, dailyGross, dailyKm, dailyNet, totalRequiredKm, totalGross, totalFuel, totalVariable, totalPercent, projectedNet, expectedNetToDate, paceDelta, progress, avgRevenueKm, avgNetKm, earnedDays };
  }
  weekContext(calculation = null) {
    const now = new Date();
    const monday = new Date(now); monday.setHours(12,0,0,0); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    const dates = [];
    for (let cursor = new Date(monday); cursor <= sunday; cursor.setDate(cursor.getDate() + 1)) if (this.state.workWeekdays.includes(cursor.getDay()) && cursor.getMonth() === now.getMonth()) dates.push(this.dateKey(cursor));
    const c = calculation || this.calculations();
    const records = c.records.filter(record => record.date >= this.dateKey(monday) && record.date <= this.dateKey(sunday));
    const target = (this.state.targetProfit / Math.max(1, c.ctx.plannedDays)) * dates.length;
    const actual = records.reduce((sum, record) => sum + record.net, 0);
    const km = records.reduce((sum, record) => sum + record.km, 0);
    const gross = records.reduce((sum, record) => sum + record.gross, 0);
    return { monday, sunday, dates, records, target, actual, revenueKm: km > 0 ? gross / km : 0 };
  }
  monthSummary(key) {
    const reference = parseDate(`${key}-01`), ctx = this.monthContext(reference), records = ctx.monthRecords.map(record => this.recordNumbers(record, ctx));
    return { key, records, gross: records.reduce((sum,item)=>sum+item.gross,0), km: records.reduce((sum,item)=>sum+item.km,0), net: records.reduce((sum,item)=>sum+item.net,0) };
  }
  recordDraft(data) {
    const date = data.date || this.todayKey(), reference = this.parseDate(date), ctx = this.monthContext(reference), costs = this.costContext(reference);
    return { id:`day-${date}`, date, gross:this.number(data.gross), km:this.number(data.km), hours:this.number(data.hours), fuelSpend:this.number(data.fuelSpend), fuelTypeSnapshot:this.state.fuel.type, fuelLabelSnapshot:this.state.fuel.label, fuelPriceSnapshot:this.state.fuel.price, fuelCostKmSnapshot:this.fuelCostKm(), perKmCostSnapshot:costs.perKm, percentCostSnapshot:costs.percent, fixedShareSnapshot:costs.monthlyFixed/Math.max(1,ctx.plannedDays), updatedAt:new Date().toISOString() };
  }
  saveRecord(data) {
    const draft = this.recordDraft(data); if (!draft.date || draft.gross <= 0 || draft.km <= 0) return { ok:false, reason:'invalid', draft };
    const index = this.state.records.findIndex(record => record.date === draft.date);
    if (index >= 0) this.state.records[index] = { ...this.state.records[index], ...draft }; else this.state.records.push({ ...draft, createdAt:new Date().toISOString() });
    this.state.records.sort((a,b)=>a.date.localeCompare(b.date)); this.save();
    return { ok:true, updated:index>=0, draft:this.state.records.find(record=>record.date===draft.date) };
  }
  deleteRecord(date) { const before=this.state.records.length; this.state.records=this.state.records.filter(record=>record.date!==date); this.save(); return this.state.records.length!==before; }
  upsertCost(input) {
    const id=input.id||`cost-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`, current=this.state.costs.find(cost=>cost.id===id);
    const cost={...(current||{}),id,name:String(input.name||'').trim(),category:input.category||'obligation',kind:input.kind||'monthly',value:this.number(input.value),active:input.active!==false,dueDay:input.dueDay?this.number(input.dueDay):undefined,dueWeekday:Number.isInteger(input.dueWeekday)?input.dueWeekday:undefined,month:input.month||undefined,paidPeriods:current?.paidPeriods||[]};
    if(!cost.name||cost.value<0)return{ok:false}; const index=this.state.costs.findIndex(item=>item.id===id); if(index>=0)this.state.costs[index]=cost;else this.state.costs.push(cost);this.save();return{ok:true,cost};
  }
  deleteCost(id){this.state.costs=this.state.costs.filter(cost=>cost.id!==id);this.save();}
  paymentPeriodKey(cost,date=new Date()){if(cost.kind==='weekly'){const monday=new Date(date);monday.setHours(12,0,0,0);monday.setDate(date.getDate()-((date.getDay()+6)%7));return`week:${this.dateKey(monday)}`;}return`month:${this.monthKey(date)}`;}
  isPaid(cost,date=new Date()){return(cost.paidPeriods||[]).includes(this.paymentPeriodKey(cost,date));}
  setPaid(cost,paid,date=new Date()){const key=this.paymentPeriodKey(cost,date),set=new Set(cost.paidPeriods||[]);if(paid)set.add(key);else set.delete(key);cost.paidPeriods=[...set];this.save();}
  dueMeta(cost,date=new Date()) {
    if(cost.category!=='obligation'||!cost.active||cost.kind==='per_km'||cost.kind==='percent')return{group:'operational',label:'Operacional',rank:90}; if(this.isPaid(cost,date))return{group:'paid',label:'Pago',rank:80};
    const today=new Date(date);today.setHours(12,0,0,0);let due=null;
    if((cost.kind==='monthly'||cost.kind==='one_time')&&cost.dueDay)due=new Date(today.getFullYear(),today.getMonth(),Math.min(Number(cost.dueDay),new Date(today.getFullYear(),today.getMonth()+1,0).getDate()),12);
    else if(cost.kind==='weekly'&&Number.isInteger(cost.dueWeekday)){const monday=new Date(today);monday.setDate(today.getDate()-((today.getDay()+6)%7));const offset=cost.dueWeekday===0?6:cost.dueWeekday-1;due=new Date(monday);due.setDate(monday.getDate()+offset);}
    if(!due)return{group:'upcoming',label:'Sem vencimento definido',rank:50};const diff=Math.round((due-today)/86400000);if(diff<0)return{group:'urgent',label:`Vencida há ${Math.abs(diff)} dia(s)`,rank:0};if(diff===0)return{group:'urgent',label:'Vence hoje',rank:1};if(diff===1)return{group:'upcoming',label:'Vence amanhã',rank:10};return{group:'upcoming',label:`Vence em ${diff} dias`,rank:20+diff};
  }
  costCadence(cost){if(cost.kind==='weekly')return`${this.money(cost.value)}/semana`;if(cost.kind==='per_km')return`${this.money(cost.value)}/km`;if(cost.kind==='percent')return`${this.number(cost.value)}% do faturamento`;if(cost.kind==='one_time')return`${this.money(cost.value)} neste mês`;return`${this.money(cost.value)}/mês`;}
  upsertEvent(input){const id=input.id||`event-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,event={id,title:String(input.title||'').trim(),date:input.date,note:String(input.note||'').trim()};if(!event.title||!event.date)return{ok:false};const index=this.state.events.findIndex(item=>item.id===id);if(index>=0)this.state.events[index]=event;else this.state.events.push(event);this.state.events.sort((a,b)=>a.date.localeCompare(b.date));this.save();return{ok:true,event};}
  deleteEvent(id){this.state.events=this.state.events.filter(event=>event.id!==id);this.save();}
  exportPayload(){return{app:'VETTA',version:STATE_VERSION,exportedAt:new Date().toISOString(),data:clone(this.state)};}
}

export { STORAGE_KEY, STATE_VERSION, defaults, normalizeState, fuelPresets };
