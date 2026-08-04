import { test, expect } from '@playwright/test';

const baseURL = process.env.VETTA_TEST_BASE_URL?.trim();
const STORAGE_KEY = 'vetta-driver-intelligence-v3';

function url(path) {
  if (!baseURL) throw new Error('VETTA_TEST_BASE_URL não configurada.');
  const normalized = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
  return new URL(path.replace(/^\//, ''), normalized).toString();
}

const state = {
  version: 10,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 0,
  revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [],
  records: [],
  events: [],
  closings: [],
};

test('GitHub Pages serve o Bloco 1C e mantêm os destinos acessíveis', async ({ page, request }) => {
  const moduleResponse = await request.get(url('today-1c.js'));
  expect(moduleResponse.ok(), 'today-1c.js deve estar publicado.').toBeTruthy();

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto(url('app-shell.html'), { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#view-dashboard').getAttribute('data-block1c')).toBe('ready');

  await expect(page.locator('#kpiGrossDaily')).toBeVisible();
  await expect(page.locator('[data-view="day"]').first()).toBeVisible();
  await expect(page.locator('#monthStatusTitle')).toBeVisible();
  await expect(page.locator('#insightTitle')).toBeVisible();
  await expect(page.locator('#targetProfitDisplay')).toBeHidden();
  await expect(page.locator('#weekStatusTitle')).toBeHidden();
  await expect(page.locator('#revenueChart')).toBeHidden();

  await page.locator('[data-secondary-view="planning"]').click();
  await expect(page.locator('#planningTargetInput')).toBeVisible();
  await expect(page.locator('#planningRevenueChart')).toBeVisible();

  await page.locator('[data-back]').click();
  await page.locator('[data-view="history"]').first().click();
  await page.locator('[data-history-tab="analysis"]').click();
  await expect(page.locator('#historyWeekStatusTitle')).toBeVisible();
});
