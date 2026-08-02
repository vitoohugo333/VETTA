const DAYS_PER_MONTH_FROM_WEEK = 52 / 12;

export const fuelOptions = {
  gnv: { name: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  gasoline: { name: 'Gasolina', unit: 'L', price: 6.19, efficiency: 10.5 },
  ethanol: { name: 'Etanol', unit: 'L', price: 4.29, efficiency: 7.4 },
  diesel: { name: 'Diesel', unit: 'L', price: 6.09, efficiency: 11.5 },
};

export function createInitialState() {
  return {
    schemaVersion: 1,
    configured: false,
    targetProfit: 4000,
    workWeekdays: [1, 2, 3, 4, 5, 6],
    revenuePerKm: 2.25,
    fuel: { type: 'gnv', ...fuelOptions.gnv },
    costs: [],
    records: [],
  };
}

export function asNumber(value) {
  const number = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(number) ? number : 0;
}

export function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function plannedDays(state, reference = new Date()) {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const activeDays = new Set(state.workWeekdays);
  let count = 0;
  for (let day = 1; day <= daysInMonth(year, month); day += 1) {
    if (activeDays.has(new Date(year, month, day).getDay())) count += 1;
  }
  return Math.max(1, count);
}

export function monthlyCost(cost, reference = new Date()) {
  if (!cost.active) return 0;
  if (cost.kind === 'monthly') return asNumber(cost.value);
  if (cost.kind === 'weekly') return asNumber(cost.value) * DAYS_PER_MONTH_FROM_WEEK;
  if (cost.kind === 'one_time') return cost.month === monthKey(reference) ? asNumber(cost.value) : 0;
  return 0;
}

export function summarizeCosts(costs, reference = new Date()) {
  return costs.filter((cost) => cost.active).reduce((summary, cost) => {
    if (cost.kind === 'per_km') summary.perKm += asNumber(cost.value);
    else summary.monthly += monthlyCost(cost, reference);
    return summary;
  }, { monthly: 0, perKm: 0 });
}

export function fuelCostPerKm(fuel) {
  const efficiency = asNumber(fuel.efficiency);
  return efficiency > 0 ? asNumber(fuel.price) / efficiency : 0;
}

export function calculateRecord(record, state, reference) {
  const km = Math.max(0, asNumber(record.km));
  const gross = Math.max(0, asNumber(record.gross));
  const costs = summarizeCosts(state.costs, reference);
  const fuel = asNumber(record.fuelSpend) > 0
    ? asNumber(record.fuelSpend)
    : km * fuelCostPerKm(state.fuel);
  const variable = km * costs.perKm;
  const fixedShare = costs.monthly / plannedDays(state, reference);
  return { ...record, gross, km, fuel, variable, fixedShare, net: gross - fuel - variable - fixedShare };
}

export function calculateMonth(state, reference = new Date()) {
  const period = monthKey(reference);
  const costs = summarizeCosts(state.costs, reference);
  const records = state.records
    .filter((record) => record.date?.startsWith(period))
    .map((record) => calculateRecord(record, state, reference));
  const totals = records.reduce((total, record) => ({
    gross: total.gross + record.gross,
    km: total.km + record.km,
    fuel: total.fuel + record.fuel,
    variable: total.variable + record.variable,
  }), { gross: 0, km: 0, fuel: 0, variable: 0 });
  const days = plannedDays(state, reference);
  const contributionPerKm = Math.max(0.01, asNumber(state.revenuePerKm) - fuelCostPerKm(state.fuel) - costs.perKm);
  const fixedAllocated = costs.monthly * Math.min(1, records.length / days);
  const net = totals.gross - totals.fuel - totals.variable - fixedAllocated;
  const remainingDays = Math.max(0, days - records.length);
  const remainingContribution = Math.max(0, asNumber(state.targetProfit) + costs.monthly - (totals.gross - totals.fuel - totals.variable));
  const dailyContribution = remainingDays ? remainingContribution / remainingDays : remainingContribution;
  const dailyKm = dailyContribution / contributionPerKm;
  return {
    records,
    costs,
    totals,
    net,
    plannedDays: days,
    remainingDays,
    dailyKm,
    dailyGross: dailyKm * asNumber(state.revenuePerKm),
    progress: state.targetProfit > 0 ? Math.max(0, Math.min(100, (net / state.targetProfit) * 100)) : 0,
  };
}
