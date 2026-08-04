import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';

const initialState = {
  version: 3,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 0,
  revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [],
  records: [],
  events: []
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state: initialState });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('nav.fixed.bottom-0').getAttribute('data-block1d')).toBe('ready');
});

test('uma ilha abre tela própria e voltar preserva o formulário', async ({ page }) => {
  await page.locator('#view-dashboard button[data-view="day"]').click();
  await expect(page.locator('nav.fixed.bottom-0 [data-view="dashboard"]')).toHaveClass(/active/);
  await page.locator('#recordGross').fill('321.50');
  await page.locator('#recordKm').fill('120');

  await page.locator('nav.fixed.bottom-0 [data-view="dashboard"]').click();
  await page.locator('[data-secondary-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningTarget')).toHaveText('R$ 4.000');
  await expect(page.locator('#view-planning [data-back]')).toBeVisible();

  await page.locator('#view-planning [data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('nav.fixed.bottom-0 [data-view="dashboard"]')).toHaveClass(/active/);

  await page.locator('#view-dashboard button[data-view="day"]').click();
  await expect(page.locator('#recordGross')).toHaveValue('321.50');
  await expect(page.locator('#recordKm')).toHaveValue('120');
});

test('o voltar do navegador ou Android retorna da tela secundária para sua área', async ({ page }) => {
  await page.locator('[data-secondary-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();

  await page.goBack();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('nav.fixed.bottom-0 [data-view="dashboard"]')).toHaveClass(/active/);
});
