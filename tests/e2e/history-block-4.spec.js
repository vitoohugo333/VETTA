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
    costs: [{ id: 'history4-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
    records,
    events: [],
    closings: [],
  };
}

async function openApp(page, state) {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect.poll(async () => {
    try {
      const before = page.url();
      const navigation = await page.locator('nav.fixed.bottom-0').getAttribute('data-block1d');
      const history = await page.locator('#view-history').getAttribute('data-block4');
      await page.waitForTimeout(150);
      return navigation === 'ready' && history === 'ready' && before === page.url() ? 'stable' : 'waiting';
    } catch {
      return 'waiting';
    }
  }, { timeout: 15000 }).toBe('stable');
}

async function openHistory(page) {
  await page.locator('nav.fixed.bottom-0 [data-view="history"]').click();
  await expect(page.locator('#view-history')).toBeVisible();
  await expect(page.locator('#historyHub')).toBeVisible();
}

async function backToHub(page, pageKey) {
  await page.locator(`#historyPage-${pageKey} [data-history-section-back]`).click();
  await expect(page.locator('#historyHub')).toBeVisible();
}

test('Histórico abre curto e separa Dias, Resumo, Semana e Comparação', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const { monday, tuesday } = currentWeekDates();
  await openApp(page, stateWithRecords([record(monday, 500, 100), record(tuesday, 420, 80)]));
  await openHistory(page);

  await expect(page.locator('[data-history-section-open]')).toHaveCount(4);
  await expect(page.locator('[data-history-section-open="days"]')).toContainText('2 registros');
  await expect(page.locator('[role="tablist"]')).toBeHidden();
  await expect(page.locator('#historyDaysPanel')).toBeHidden();

  await page.locator('[data-history-section-open="days"]').click();
  await expect(page.locator('#historyPage-days')).toBeVisible();
  await expect(page.locator('#historyCount')).toContainText('2 REGISTROS');
  await expect(page.locator('#historyList [data-action="edit"]')).toHaveCount(2);
  await expect(page.locator('#historyList [data-action="delete"]')).toHaveCount(2);
  await backToHub(page, 'days');

  await page.locator('[data-history-section-open="summary"]').click();
  await expect(page.locator('#historyPage-summary')).toBeVisible();
  await expect(page.locator('#historyDays')).toHaveText('2');
  await expect(page.locator('#historyRevenueKm')).not.toHaveText('R$ 0,00');
  await expect(page.locator('#historyChart')).toBeVisible();
  await page.evaluate(() => window.history.back());
  await expect(page.locator('#historyHub')).toBeVisible();

  await page.locator('[data-history-section-open="week"]').click();
  await expect(page.locator('#historyPage-week')).toBeVisible();
  await expect(page.locator('#historyWeekStatusTitle')).toBeVisible();
  await expect(page.locator('#historyWeekTarget')).toBeVisible();
  await backToHub(page, 'week');

  await page.locator('[data-history-section-open="comparison"]').click();
  await expect(page.locator('#historyPage-comparison')).toBeVisible();
  await expect(page.locator('#historyInsight')).toContainText('Comparação entre dias');
  await expect(page.locator('nav.fixed.bottom-0 [data-view="history"]')).toHaveClass(/active/);

  expect(errors).toEqual([]);
});

test('Histórico mantém estados vazios claros em cada destino', async ({ page }) => {
  await openApp(page, stateWithRecords([]));
  await openHistory(page);

  await expect(page.locator('[data-history-section-open="days"]')).toContainText('0 registros');
  await page.locator('[data-history-section-open="days"]').click();
  await expect(page.locator('#historyList')).toContainText('Nenhum dia registrado ainda');
  await backToHub(page, 'days');

  await page.locator('[data-history-section-open="summary"]').click();
  await expect(page.locator('#historyDays')).toHaveText('0');
  await backToHub(page, 'summary');

  await page.locator('[data-history-section-open="comparison"]').click();
  await expect(page.locator('#historyInsight')).toContainText('Ainda não há dias suficientes');
});
