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
  costs: [{ id: 'nav-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
  records: [], events: [],
};

async function openApp(page) {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state: initialState });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect.poll(async () => {
    try {
      const nav = await page.locator('nav.fixed.bottom-0').getAttribute('data-r1-navigation');
      const plan = await page.locator('#view-planning').getAttribute('data-r1');
      return nav === 'ready' && plan === 'ready' ? 'ready' : 'waiting';
    } catch { return 'waiting'; }
  }, { timeout: 15000 }).toBe('ready');
}

test('barra principal mostra Agora, Registrar, Resultados, Custos e Mais', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);

  const nav = page.locator('nav.fixed.bottom-0');
  await expect(nav.locator('[data-view]')).toHaveCount(5);
  await expect(nav.locator('[data-view] span')).toHaveText(['Agora', 'Registrar', 'Resultados', 'Custos', 'Mais']);
  await expect(nav.locator('[data-view="day"]')).toHaveCount(1);
  await expect(nav.locator('[data-view="costs"]')).toHaveCount(1);
  await expect(nav.locator('[data-view="settings"]')).toHaveCount(0);

  await nav.locator('[data-view="day"]').click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(nav.locator('[data-view="day"]')).toHaveClass(/active/);

  await nav.locator('[data-view="history"]').click();
  await expect(page.locator('#view-history')).toBeVisible();
  await expect(nav.locator('[data-view="history"]')).toHaveClass(/active/);

  await nav.locator('[data-view="costs"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningPage-costs')).toBeVisible();
  await expect(nav.locator('[data-view="costs"]')).toHaveClass(/active/);

  await nav.locator('[data-view="more"]').click();
  await expect(page.locator('#view-more')).toBeVisible();
  await nav.locator('[data-view="dashboard"]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Plano é global e contextual sem ocupar uma sexta aba', async ({ page }) => {
  await openApp(page);
  const nav = page.locator('nav.fixed.bottom-0');

  await expect(page.locator('#r1HeaderPlanButton')).toBeVisible();
  await page.locator('#r1HeaderPlanButton').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningHub')).toBeVisible();
  await expect(page.locator('#view-planning > div:first-child [data-back]')).toBeVisible();
  await expect(nav.locator('[data-view="dashboard"]')).toHaveClass(/active/);
  await expect(nav.locator('[data-view="planning"]')).toHaveCount(0);

  await page.locator('#view-planning > div:first-child [data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
});

test('rascunho de Registrar continua preservado ao navegar e voltar', async ({ page }) => {
  await openApp(page);
  const nav = page.locator('nav.fixed.bottom-0');

  await nav.locator('[data-view="day"]').click();
  await page.locator('#recordGross').fill('321.50');
  await page.locator('#recordKm').fill('120');
  await nav.locator('[data-view="dashboard"]').click();
  await nav.locator('[data-view="day"]').click();
  await expect(page.locator('#recordGross')).toHaveValue('321.50');
  await expect(page.locator('#recordKm')).toHaveValue('120');
});
