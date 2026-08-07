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
  costs: [{ id: 'published-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
  records: [], events: [],
};

test('GitHub Pages servem Plano do mês e próxima ação em Agora', async ({ page, request }) => {
  const moduleResponse = await request.get(url('today-1c.js'));
  expect(moduleResponse.ok(), 'today-1c.js deve estar publicado.').toBeTruthy();

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto(url('app-shell.html'), { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#view-dashboard').getAttribute('data-r1')).toBe('ready');
  await expect.poll(() => page.locator('#view-planning').getAttribute('data-r1')).toBe('ready');

  await expect(page.locator('#targetProfitDisplay')).toBeVisible();
  await expect(page.locator('#r1PlanSummary')).toContainText('4.000');
  await expect(page.locator('#r1NextActionTitle')).toHaveText('Registre seu primeiro dia');
  await expect(page.locator('#r1HeaderPlanButton')).toBeVisible();
  await expect(page.locator('#installButton')).toBeHidden();
  await expect(page.locator('#weekStatusTitle')).toBeHidden();
  await expect(page.locator('#revenueChart')).toBeHidden();

  await page.locator('#r1PlanButton').click();
  await expect(page.locator('#planningHub')).toBeVisible();
  await expect(page.getByText('Quatro decisões formam seu plano', { exact: true })).toBeVisible();
});
