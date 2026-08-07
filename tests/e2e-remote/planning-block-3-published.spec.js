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

test('GitHub Pages servem Plano guiado com quatro decisões essenciais', async ({ page, request }) => {
  const moduleResponse = await request.get(url('planning-3.js'));
  expect(moduleResponse.ok(), 'planning-3.js deve estar publicado.').toBeTruthy();

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto(url('app-shell.html'), { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#view-planning').getAttribute('data-r1')).toBe('ready');

  await page.locator('#r1HeaderPlanButton').click();
  await expect(page.locator('#planningHub')).toBeVisible();
  await expect(page.locator('#planningHub [data-planning-core] [data-planning-section-open]')).toHaveCount(4);
  await expect(page.locator('#planningSecondary [data-planning-section-open]')).toHaveCount(3);
  await expect(page.locator('#planningHub')).not.toContainText('BLOCO 3');

  await page.locator('[data-planning-section-open="goals"]').click();
  await expect(page.locator('#planningTargetInput')).toBeVisible();
  await page.locator('#planningTargetInput').fill('5100');
  await page.locator('#planningTargetInput').press('Tab');
  await page.locator('#planningPage-goals [data-planning-section-back]').click();
  await expect(page.locator('#planningHubSummary-goals')).toContainText('5.100');

  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.targetProfit).toBe(5100);
});
