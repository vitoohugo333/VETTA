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

test('GitHub Pages serve o Histórico 4 e suas quatro áreas', async ({ page, request }) => {
  const moduleResponse = await request.get(url('history-4.js'));
  expect(moduleResponse.ok(), 'history-4.js deve estar publicado.').toBeTruthy();

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto(url('app-shell.html'), { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#view-history').getAttribute('data-block4')).toBe('ready');

  await page.locator('nav.fixed.bottom-0 [data-view="history"]').click();
  await expect(page.locator('#historyHub')).toBeVisible();
  await expect(page.locator('[data-history-section-open]')).toHaveCount(4);

  await page.locator('[data-history-section-open="days"]').click();
  await expect(page.locator('#historyList')).toContainText('Nenhum dia registrado ainda');
  await page.locator('#historyPage-days [data-history-section-back]').click();
  await expect(page.locator('#historyHub')).toBeVisible();

  await page.locator('[data-history-section-open="summary"]').click();
  await expect(page.locator('#historyChart')).toBeVisible();
  await page.locator('#historyPage-summary [data-history-section-back]').click();

  await page.locator('[data-history-section-open="week"]').click();
  await expect(page.locator('#historyWeekStatusTitle')).toBeVisible();
  await page.locator('#historyPage-week [data-history-section-back]').click();

  await page.locator('[data-history-section-open="comparison"]').click();
  await expect(page.locator('#historyInsight')).toContainText('Ainda não há dias suficientes');
});
