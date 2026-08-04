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

async function waitForStableNavigation(page) {
  await expect.poll(async () => {
    try {
      const before = page.url();
      const navigation = await page.locator('nav.fixed.bottom-0').getAttribute('data-block1d');
      const record = await page.locator('#view-day').getAttribute('data-block2');
      const planning = await page.locator('#view-planning').getAttribute('data-block3');
      const history = await page.locator('#view-history').getAttribute('data-block4');
      await page.waitForTimeout(150);
      return navigation === 'ready' && record === 'ready' && planning === 'ready' && history === 'ready' && page.url() === before ? 'stable' : 'waiting';
    } catch {
      return 'waiting';
    }
  }, { timeout: 15000 }).toBe('stable');
}

async function openSecondary(page, selector, target) {
  await expect.poll(async () => {
    try {
      if (await page.locator(target).isVisible()) return 'ready';
      const trigger = page.locator(selector);
      if (await trigger.isVisible()) await trigger.click();
      return await page.locator(target).isVisible() ? 'ready' : 'waiting';
    } catch {
      return 'waiting';
    }
  }, { timeout: 15000 }).toBe('ready');
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state: initialState });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForStableNavigation(page);
});

test('uma ilha abre tela própria e voltar preserva o formulário', async ({ page }) => {
  await openSecondary(page, '#view-dashboard button[data-view="day"]', '#view-day');
  await expect(page.locator('nav.fixed.bottom-0 [data-view="dashboard"]')).toHaveClass(/active/);
  await expect(page.locator('#recordGross')).toBeVisible();
  await page.locator('#recordGross').fill('321.50');
  await page.locator('#recordKm').fill('120');

  await page.locator('nav.fixed.bottom-0 [data-view="dashboard"]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await openSecondary(page, '[data-secondary-view="planning"]', '#view-planning');
  await expect(page.locator('#planningTarget')).toHaveText('R$ 4.000');
  await expect(page.locator('#view-planning [data-back]')).toBeVisible();

  await page.locator('#view-planning [data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('nav.fixed.bottom-0 [data-view="dashboard"]')).toHaveClass(/active/);

  await openSecondary(page, '#view-dashboard button[data-view="day"]', '#view-day');
  await expect(page.locator('#recordGross')).toHaveValue('321.50');
  await expect(page.locator('#recordKm')).toHaveValue('120');
});

test('o voltar do navegador ou Android retorna da tela secundária para sua área', async ({ page }) => {
  await openSecondary(page, '[data-secondary-view="planning"]', '#view-planning');

  await page.evaluate(() => window.history.back());
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('nav.fixed.bottom-0 [data-view="dashboard"]')).toHaveClass(/active/);
});
