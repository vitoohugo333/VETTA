import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';
const state = {
  version: 10,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 0,
  revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [{ id: 'today-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
  records: [],
  events: [],
  closings: [],
};
const expectedBusinessState = JSON.stringify(state);

async function openApp(page) {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect.poll(() => page.locator('#view-dashboard').getAttribute('data-block1c')).toBe('ready');
  await expect.poll(() => page.locator('nav.fixed.bottom-0').getAttribute('data-block1d')).toBe('ready');
  await expect.poll(() => page.locator('#view-planning').getAttribute('data-block3')).toBe('ready');
  await expect.poll(() => page.locator('#view-history').getAttribute('data-block4')).toBe('ready');
}

async function businessState(page) {
  try {
    return await page.evaluate(key => {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const value = JSON.parse(raw);
      delete value.release;
      value.costs = (value.costs || []).map(cost => {
        const clean = { ...cost };
        delete clean.legacySource;
        return clean;
      });
      return JSON.stringify(value);
    }, STORAGE_KEY);
  } catch {
    return null;
  }
}

test('Hoje mantém o essencial e retira somente duplicações com destino validado', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);

  for (const selector of ['#kpiGrossDaily', '#kpiNetDaily', '#kpiKmDaily', '#view-dashboard button[data-view="day"]', '#monthStatusTitle', '#insightTitle', '[data-secondary-view="planning"]']) {
    await expect(page.locator(selector).first()).toBeVisible();
  }
  await expect(page.locator('#monthProgress')).toBeAttached();
  await expect(page.locator('#monthProgress').locator('..')).toBeVisible();

  for (const selector of ['#targetProfitDisplay', '#weekStatusTitle', '#revenueChart']) {
    await expect(page.locator(selector)).toBeHidden();
  }

  const destinations = await page.evaluate(() => ({
    target: document.getElementById('targetProfitDisplay').closest('.card-vetta').dataset.relocatedTo,
    week: document.getElementById('weekStatusTitle').closest('.card-vetta').dataset.relocatedTo,
    chart: document.getElementById('revenueChart').closest('.card-vetta').dataset.relocatedTo,
  }));
  expect(destinations).toEqual({
    target: 'Planejar → Metas e Agenda',
    week: 'Histórico → Análise → Semana atual',
    chart: 'Planejar → Distribuição da meta',
  });

  await page.locator('[data-secondary-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningHub')).toBeVisible();

  await page.locator('[data-planning-section-open="goals"]').click();
  await expect(page.locator('#planningTargetInput')).toBeVisible();
  await page.locator('#planningPage-goals [data-planning-section-back]').click();
  await expect(page.locator('#planningHub')).toBeVisible();

  await page.locator('[data-planning-section-open="distribution"]').click();
  await expect(page.locator('#planningRevenueChart')).toBeVisible();
  await expect(page.locator('#planningDreGross')).toBeVisible();
  await page.locator('#planningPage-distribution [data-planning-section-back]').click();
  await expect(page.locator('#planningHub')).toBeVisible();

  await page.locator('#view-planning > div:first-child [data-back]').click();
  await page.locator('nav.fixed.bottom-0 [data-view="history"]').click();
  await expect(page.locator('#historyHub')).toBeVisible();
  await page.locator('[data-history-section-open="week"]').click();
  await expect(page.locator('#historyWeekStatusTitle')).toBeVisible();
  await expect(page.locator('#historyWeekTarget')).toBeVisible();

  expect(errors).toEqual([]);
});

test('consolidação visual não altera dados e usa a navegação final', async ({ page }) => {
  await openApp(page);
  await expect.poll(() => businessState(page), { timeout: 10000 }).toBe(expectedBusinessState);

  const nav = page.locator('nav.fixed.bottom-0');
  await expect(nav.locator('[data-view]')).toHaveCount(4);
  await expect(nav.locator('[data-view] span')).toHaveText(['Hoje', 'Histórico', 'Planejar', 'Mais']);
  await expect(nav.locator('[data-view="day"]')).toHaveCount(0);
  await expect(nav.locator('[data-view="settings"]')).toHaveCount(0);

  await expect.poll(() => businessState(page), { timeout: 10000 }).toBe(expectedBusinessState);
});
