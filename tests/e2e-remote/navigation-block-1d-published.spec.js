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

test('GitHub Pages servem a navegação final e preservam as rotas secundárias', async ({ page, request }) => {
  const moduleResponse = await request.get(url('today-1c.js'));
  expect(moduleResponse.ok(), 'today-1c.js deve estar publicado.').toBeTruthy();

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto(url('app-shell.html'), { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('nav.fixed.bottom-0').getAttribute('data-block1d')).toBe('ready');

  const nav = page.locator('nav.fixed.bottom-0');
  await expect(nav.locator('[data-view]')).toHaveCount(4);
  await expect(nav.locator('[data-view] span')).toHaveText(['Hoje', 'Histórico', 'Planejar', 'Mais']);

  await nav.locator('[data-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#view-planning [data-back]')).toBeHidden();
  await expect(page.locator('#planningRevenueChart')).toBeVisible();

  await nav.locator('[data-view="dashboard"]').click();
  await page.locator('#view-dashboard button[data-view="day"]').click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);

  await page.goBack();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);
});
