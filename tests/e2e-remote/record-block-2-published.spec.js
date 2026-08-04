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

test('GitHub Pages servem o Bloco 2 e confirmam um único registro por data', async ({ page, request }) => {
  const moduleResponse = await request.get(url('record-2.js'));
  expect(moduleResponse.ok(), 'record-2.js deve estar publicado.').toBeTruthy();

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto(url('app-shell.html'), { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#view-day').getAttribute('data-block2')).toBe('ready');

  await page.locator('#view-dashboard button[data-view="day"]').click();
  await expect(page.locator('#recordGross')).toBeVisible();
  await expect(page.locator('#recordHours')).toBeHidden();

  await page.locator('#recordDate').fill('2026-08-04');
  await page.locator('#recordGross').fill('300');
  await page.locator('#recordKm').fill('100');
  await page.locator('#saveDayButton').click();

  await expect(page.locator('#recordConfirmation')).toBeVisible();
  await expect(page.locator('#recordConfirmationTitle')).toHaveText('Dia registrado');

  await page.locator('#recordEditButton').click();
  await page.locator('#recordGross').fill('330');
  await page.locator('#saveDayButton').click();
  await expect(page.locator('#recordConfirmationTitle')).toHaveText('Dia atualizado');

  const records = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').records || [], STORAGE_KEY);
  expect(records).toHaveLength(1);
  expect(records[0].date).toBe('2026-08-04');
  expect(records[0].gross).toBe(330);
});
