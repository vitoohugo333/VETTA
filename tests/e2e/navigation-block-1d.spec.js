import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';
const initialState = {
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

async function waitForStableNavigation(page) {
  await expect.poll(async () => {
    try {
      const before = page.url();
      const ready = await page.locator('nav.fixed.bottom-0').getAttribute('data-block1d');
      await page.waitForTimeout(150);
      return ready === 'ready' && page.url() === before ? 'stable' : 'waiting';
    } catch {
      return 'waiting';
    }
  }, { timeout: 15000 }).toBe('stable');
}

async function openApp(page) {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state: initialState });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await waitForStableNavigation(page);
}

async function goBackInsideApp(page) {
  await page.evaluate(() => window.history.back());
}

test('barra final mostra Hoje, Histórico, Planejar e Mais', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);

  const nav = page.locator('nav.fixed.bottom-0');
  await expect(nav.locator('[data-view]')).toHaveCount(4);
  await expect(nav.locator('[data-view] span')).toHaveText(['Hoje', 'Histórico', 'Planejar', 'Mais']);
  await expect(nav.locator('[data-view="day"]')).toHaveCount(0);
  await expect(nav.locator('[data-view="settings"]')).toHaveCount(0);
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);

  await nav.locator('[data-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(nav.locator('[data-view="planning"]')).toHaveClass(/active/);
  await expect(page.locator('#view-planning [data-back]')).toBeHidden();

  await nav.locator('[data-view="history"]').click();
  await expect(page.locator('#view-history')).toBeVisible();
  await expect(nav.locator('[data-view="history"]')).toHaveClass(/active/);

  await nav.locator('[data-view="more"]').click();
  await expect(page.locator('#view-more')).toBeVisible();
  await expect(nav.locator('[data-view="more"]')).toHaveClass(/active/);

  await nav.locator('[data-view="dashboard"]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);
  expect(errors).toEqual([]);
});

test('registro e atalho de Planejar continuam secundários de Hoje', async ({ page }) => {
  await openApp(page);
  const nav = page.locator('nav.fixed.bottom-0');

  await page.locator('#view-dashboard button[data-view="day"]').click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);
  await expect.poll(() => page.evaluate(() => ({
    view: window.__vettaApp.currentView,
    primary: window.__vettaApp.currentPrimaryView,
  }))).toEqual({ view: 'day', primary: 'dashboard' });

  await page.locator('#recordGross').fill('321.50');
  await page.locator('#recordKm').fill('120');
  await goBackInsideApp(page);
  await expect(page.locator('#view-dashboard')).toBeVisible();

  await page.locator('#view-dashboard button[data-view="day"]').click();
  await expect(page.locator('#recordGross')).toHaveValue('321.50');
  await expect(page.locator('#recordKm')).toHaveValue('120');

  await nav.locator('[data-view="dashboard"]').click();
  await page.locator('[data-secondary-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);
  await expect(page.locator('#view-planning [data-back]')).toBeVisible();

  await page.locator('#view-planning [data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);
});

test('voltar do navegador retorna de Planejar principal para Hoje', async ({ page }) => {
  await openApp(page);
  const nav = page.locator('nav.fixed.bottom-0');

  await nav.locator('[data-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#view-planning [data-back]')).toBeHidden();

  await goBackInsideApp(page);
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);
});
