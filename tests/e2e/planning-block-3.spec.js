import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';
const initialState = {
  version: 10,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 1,
  revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [{ id: 'planning-3-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
  records: [],
  events: [],
  closings: [],
};

async function openApp(page) {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state: initialState });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect.poll(async () => {
    try {
      const before = page.url();
      const navigation = await page.locator('nav.fixed.bottom-0').getAttribute('data-block1d');
      const planning = await page.locator('#view-planning').getAttribute('data-block3');
      const history = await page.locator('#view-history').getAttribute('data-block4');
      await page.waitForTimeout(150);
      return navigation === 'ready' && planning === 'ready' && history === 'ready' && before === page.url() ? 'stable' : 'waiting';
    } catch {
      return 'waiting';
    }
  }, { timeout: 15000 }).toBe('stable');
}

async function openPlanning(page) {
  await expect.poll(async () => {
    try {
      if (await page.locator('#view-planning').isVisible() && await page.locator('#planningHub').isVisible()) return 'ready';
      const button = page.locator('nav.fixed.bottom-0 [data-view="planning"]');
      if (await button.isVisible()) await button.click();
      return await page.locator('#view-planning').isVisible() && await page.locator('#planningHub').isVisible() ? 'ready' : 'waiting';
    } catch {
      return 'waiting';
    }
  }, { timeout: 15000 }).toBe('ready');
}

async function openSection(page, key) {
  await expect.poll(async () => {
    try {
      if (await page.locator(`#planningPage-${key}`).isVisible()) return 'ready';
      const button = page.locator(`[data-planning-section-open="${key}"]`);
      if (await button.isVisible()) await button.click();
      return await page.locator(`#planningPage-${key}`).isVisible() ? 'ready' : 'waiting';
    } catch {
      return 'waiting';
    }
  }, { timeout: 15000 }).toBe('ready');
  await expect(page.locator('#planningHub')).toBeHidden();
}

test('Planejar abre curto e cada recurso permanece acessível em uma tela própria', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);
  await openPlanning(page);

  await expect(page.locator('[data-planning-section-open]')).toHaveCount(7);
  await expect(page.locator('#planningPage-goals')).toBeHidden();
  await expect(page.locator('#planningTargetInput')).toBeHidden();
  await expect(page.locator('#planningHubSummary-goals')).toContainText('R$');
  await expect(page.locator('#planningHubSummary-operation')).toContainText('GNV');

  for (const key of ['goals', 'agenda', 'operation', 'costs', 'distribution', 'learning', 'advanced']) {
    await openSection(page, key);
    await page.locator(`#planningPage-${key} [data-planning-section-back]`).click();
    await expect(page.locator('#planningHub')).toBeVisible();
    await expect(page.locator(`#planningPage-${key}`)).toBeHidden();
  }

  expect(errors).toEqual([]);
});

test('editar em uma área, voltar e abrir outra preserva o mesmo estado', async ({ page }) => {
  await openApp(page);
  await openPlanning(page);

  await openSection(page, 'goals');
  await page.locator('#planningTargetInput').fill('5200');
  await page.locator('#planningTargetInput').press('Tab');
  await page.locator('#planningPage-goals [data-planning-section-back]').click();
  await expect(page.locator('#planningHubSummary-goals')).toContainText('5.200');

  await openSection(page, 'agenda');
  await page.locator('[data-plan-days="5"]').click();
  await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => null);
  await expect(page.locator('#planningHub')).toBeVisible();

  await openSection(page, 'operation');
  await page.locator('#planningFuelPrice').fill('5.49');
  await page.locator('#planningFuelPrice').press('Tab');
  await page.locator('#planningPage-operation [data-planning-section-back]').click();

  await openSection(page, 'costs');
  await expect(page.locator('#planningCostList')).toContainText('Manutenção');
  await page.locator('#planningPage-costs [data-planning-section-back]').click();

  await openSection(page, 'distribution');
  await expect(page.locator('#planningRevenueChart')).toBeVisible();
  await expect(page.locator('#planningDreGross')).toContainText('R$');

  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.targetProfit).toBe(5200);
  expect(saved.workWeekdays).toEqual([1, 2, 3, 4, 5]);
  expect(saved.fuel.price).toBe(5.49);
  expect(saved.costs).toHaveLength(1);
});

test('atalho de Hoje mantém dois retornos previsíveis: assunto, Planejar e Hoje', async ({ page }) => {
  await openApp(page);
  await expect.poll(async () => {
    try {
      if (await page.locator('#view-planning').isVisible()) return 'ready';
      const shortcut = page.locator('[data-secondary-view="planning"]');
      if (await shortcut.isVisible()) await shortcut.click();
      return await page.locator('#view-planning').isVisible() ? 'ready' : 'waiting';
    } catch {
      return 'waiting';
    }
  }, { timeout: 15000 }).toBe('ready');
  await expect(page.locator('#view-planning > div:first-child [data-back]')).toBeVisible();

  await openSection(page, 'learning');
  await page.locator('#planningPage-learning [data-planning-section-back]').click();
  await expect(page.locator('#planningHub')).toBeVisible();
  await expect(page.locator('#view-planning > div:first-child [data-back]')).toBeVisible();

  await page.locator('#view-planning > div:first-child [data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('nav.fixed.bottom-0 [data-view="dashboard"]')).toHaveClass(/active/);
});
