import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function currentWeekDates() {
  const now = new Date();
  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const tuesday = new Date(monday);
  tuesday.setDate(monday.getDate() + 1);
  return { monday: dateKey(monday), tuesday: dateKey(tuesday) };
}

function stateWithRecords(records) {
  return {
    version: 10,
    onboardingComplete: true,
    targetProfit: 4000,
    workWeekdays: [0, 1, 2, 3, 4, 5, 6],
    extraDaysOff: 0,
    revenueKm: 2.25,
    fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
    compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
    costs: [{ id: 'history-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
    records,
    events: [],
    closings: [],
  };
}

function record(date, gross, km) {
  return {
    id: `day-${date}`,
    date,
    gross,
    km,
    hours: 8,
    fuelSpend: 0,
    fuelTypeSnapshot: 'gnv',
    fuelLabelSnapshot: 'GNV',
    fuelPriceSnapshot: 4.79,
    fuelCostKmSnapshot: 4.79 / 13.2,
    perKmCostSnapshot: 0.18,
    percentCostSnapshot: 0,
    fixedShareSnapshot: 0,
    updatedAt: new Date().toISOString(),
  };
}

async function openWithState(page, state) {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect(page.locator('#view-dashboard')).toBeVisible();
}

async function openHistory(page) {
  await page.locator('[data-view="history"]').first().click();
  await expect(page.locator('#view-history')).toBeVisible();
}

test('Histórico abre em Dias e editar ou excluir não duplica registros', async ({ page }) => {
  const { monday, tuesday } = currentWeekDates();
  await openWithState(page, stateWithRecords([record(monday, 500, 100), record(tuesday, 420, 80)]));

  await openHistory(page);
  await expect(page.locator('#historyDaysPanel')).toBeVisible();
  await expect(page.locator('#historyAnalysisPanel')).toBeHidden();
  await expect(page.locator('#historyCount')).toContainText('2 REGISTROS');
  await expect(page.locator('#historyList [data-action="edit"]')).toHaveCount(2);
  await expect(page.locator('#historyList [data-action="delete"]')).toHaveCount(2);

  await page.locator(`[data-action="edit"][data-date="${monday}"]`).click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(page.locator('#recordDate')).toHaveValue(monday);
  await page.locator('#recordGross').fill('650');
  await page.locator('#saveDayButton').click();

  let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.records).toHaveLength(2);
  expect(saved.records.find(item => item.date === monday)?.gross).toBe(650);

  await openHistory(page);
  await expect(page.locator('#historyCount')).toContainText('2 REGISTROS');
  page.once('dialog', dialog => dialog.accept());
  await page.locator(`[data-action="delete"][data-date="${tuesday}"]`).click();
  await expect(page.locator('#historyCount')).toContainText('1 REGISTRO');

  saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.records).toHaveLength(1);
  expect(saved.records[0].date).toBe(monday);
});

test('Análise reúne resumo, gráfico, comparação e a mesma semana de Início', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const { monday, tuesday } = currentWeekDates();
  await openWithState(page, stateWithRecords([record(monday, 500, 100), record(tuesday, 420, 80)]));

  await openHistory(page);
  await page.locator('[data-history-tab="analysis"]').click();

  await expect(page.locator('#historyAnalysisPanel')).toBeVisible();
  await expect(page.locator('#historyChart')).toBeVisible();
  await expect(page.locator('#historyDays')).toHaveText('2');
  await expect(page.locator('#historyInsight')).toContainText('Comparação entre dias');

  const historyWeek = await page.evaluate(() => ({
    title: document.getElementById('historyWeekStatusTitle').textContent,
    pill: document.getElementById('historyWeekStatusPill').textContent,
    text: document.getElementById('historyWeekStatusText').textContent,
    target: document.getElementById('historyWeekTarget').textContent,
    actual: document.getElementById('historyWeekActual').textContent,
    revenueKm: document.getElementById('historyWeekRevenueKm').textContent,
  }));

  await page.locator('[data-view="dashboard"]').first().click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#weekStatusTitle')).toBeVisible();
  const dashboardWeek = await page.evaluate(() => ({
    title: document.getElementById('weekStatusTitle').textContent,
    pill: document.getElementById('weekStatusPill').textContent,
    text: document.getElementById('weekStatusText').textContent,
    target: document.getElementById('weekTarget').textContent,
    actual: document.getElementById('weekActual').textContent,
    revenueKm: document.getElementById('weekRevenueKm').textContent,
  }));

  expect(historyWeek).toEqual(dashboardWeek);
  expect(errors).toEqual([]);
});

test('Estados sem dados e com um único dia continuam claros', async ({ page }) => {
  await openWithState(page, stateWithRecords([]));
  await openHistory(page);
  await expect(page.locator('#historyList')).toContainText('Nenhum dia registrado ainda');

  await page.locator('[data-history-tab="analysis"]').click();
  await expect(page.locator('#historyInsight')).toContainText('Ainda não há dias suficientes');
  await expect(page.locator('#historyWeekStatusPill')).toHaveText('SEMANA');
});
