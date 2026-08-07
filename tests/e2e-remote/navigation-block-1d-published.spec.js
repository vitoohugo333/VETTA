import { test, expect } from '@playwright/test';

const baseURL = process.env.VETTA_TEST_BASE_URL?.trim();
const STORAGE_KEY = 'vetta-driver-intelligence-v3';

function url(path) {
  if (!baseURL) throw new Error('VETTA_TEST_BASE_URL não configurada.');
  const normalized = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
  return new URL(path.replace(/^\//, ''), normalized).toString();
}

const state = {
  version: 3, onboardingComplete: true, targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6], extraDaysOff: 0, revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [], records: [], events: [],
};

test('GitHub Pages servem a navegação R1 e o Plano contextual', async ({ page, request }) => {
  const moduleResponse = await request.get(url('today-1c.js'));
  expect(moduleResponse.ok(), 'today-1c.js deve estar publicado.').toBeTruthy();

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto(url('app-shell.html'), { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('nav.fixed.bottom-0').getAttribute('data-r1-navigation')).toBe('ready');
  await expect.poll(() => page.locator('#view-planning').getAttribute('data-r1')).toBe('ready');

  const nav = page.locator('nav.fixed.bottom-0');
  await expect(nav.locator('[data-view]')).toHaveCount(5);
  await expect(nav.locator('[data-view] span')).toHaveText(['Agora', 'Registrar', 'Resultados', 'Custos', 'Mais']);

  await nav.locator('[data-view="day"]').click();
  await expect(page.locator('#view-day')).toBeVisible();
  await nav.locator('[data-view="dashboard"]').click();

  await page.locator('#r1HeaderPlanButton').click();
  await expect(page.locator('#planningHub')).toBeVisible();
  await expect(page.locator('#view-planning > div:first-child [data-back]')).toBeVisible();
  await page.locator('#view-planning > div:first-child [data-back]').click();

  await nav.locator('[data-view="costs"]').click();
  await expect(page.locator('#planningPage-costs')).toBeVisible();
  await expect(nav.locator('[data-view="costs"]')).toHaveClass(/active/);
});
