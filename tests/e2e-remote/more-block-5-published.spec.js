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
  release: '3.5.1',
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

test('GitHub Pages serve o Mais 5 e seus cinco destinos', async ({ page, request }) => {
  const moduleResponse = await request.get(url('more-5.js'));
  expect(moduleResponse.ok(), 'more-5.js deve estar publicado.').toBeTruthy();

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto(url('app-shell.html'), { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('#view-more').getAttribute('data-block5')).toBe('ready');

  await page.locator('nav.fixed.bottom-0 [data-view="more"]').click();
  await expect(page.locator('#moreHub')).toBeVisible();
  await expect(page.locator('[data-more-section-open]')).toHaveCount(5);

  await page.locator('[data-more-section-open="tools"]').click();
  await expect(page.locator('#compareChart')).toBeVisible();
  await page.locator('#morePage-tools [data-more-section-back]').click();

  await page.locator('[data-more-section-open="reports"]').click();
  await expect(page.locator('#reportButton')).toBeVisible();
  await page.locator('#morePage-reports [data-more-section-back]').click();

  await page.locator('[data-more-section-open="data"]').click();
  await expect(page.locator('#exportButton')).toBeVisible();
  await expect(page.locator('#importInput')).toHaveCount(1);
  await page.locator('#morePage-data [data-more-section-back]').click();

  await page.locator('[data-more-section-open="radar"]').click();
  await expect(page.locator('#addEventButton')).toBeVisible();
  await page.locator('#morePage-radar [data-more-section-back]').click();

  await page.locator('[data-more-section-open="app"]').click();
  await expect(page.locator('#installCardButton')).toBeVisible();
  await expect(page.locator('#appVersionLabel')).toHaveText('Versão 3.5.1');
});
