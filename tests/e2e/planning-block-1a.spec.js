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
  costs: [{ id: 'maintenance-test', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
  records: [],
  events: [],
  closings: [],
};

async function waitForFinalNavigation(page) {
  await expect.poll(() => page.locator('nav.fixed.bottom-0').getAttribute('data-block1d')).toBe('ready');
  await expect.poll(() => page.locator('#view-planning').getAttribute('data-block3')).toBe('ready');
}

async function openSection(page, key) {
  await page.locator(`[data-planning-section-open="${key}"]`).click();
  await expect(page.locator(`#planningPage-${key}`)).toBeVisible();
}

async function backToHub(page, key) {
  await page.locator(`#planningPage-${key} [data-planning-section-back]`).click();
  await expect(page.locator('#planningHub')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state: initialState });
});

test('Planejar reúne todos os destinos e Hoje mantém somente o essencial', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForFinalNavigation(page);
  await page.locator('[data-secondary-view="planning"]').click();

  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Meu planejamento completo' })).toBeVisible();
  await expect(page.locator('#planningHub')).toBeVisible();
  await expect(page.locator('#view-planning > div:first-child [data-back]')).toBeVisible();

  await openSection(page, 'distribution');
  await expect(page.locator('#planningRevenueChart')).toBeVisible();
  await expect(page.locator('#planningDreGross')).toBeVisible();
  await backToHub(page, 'distribution');

  await openSection(page, 'goals');
  await expect(page.locator('#planningTargetInput')).toHaveValue('4000');
  await backToHub(page, 'goals');

  await openSection(page, 'costs');
  await expect(page.locator('#planningCostList')).toContainText('Manutenção');
  await backToHub(page, 'costs');

  await openSection(page, 'learning');
  await expect(page.locator('#planningLearningText')).toBeVisible();
  await backToHub(page, 'learning');

  await page.locator('#view-planning > div:first-child [data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#revenueChart')).toBeHidden();
  await expect(page.locator('#targetProfitDisplay')).toBeHidden();
  await expect(page.locator('#kpiGrossDaily')).toBeVisible();
  await expect(page.locator('[data-secondary-view="planning"]')).toBeVisible();

  await page.locator('nav.fixed.bottom-0 [data-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningHub')).toBeVisible();
  await expect(page.locator('#view-planning > div:first-child [data-back]')).toBeHidden();
  await openSection(page, 'costs');
  await expect(page.locator('#planningCostList')).toContainText('Manutenção');
  expect(errors).toEqual([]);
});

test('edições em Planejar usam o mesmo estado e o mesmo cadastro de custos', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForFinalNavigation(page);
  await page.locator('[data-secondary-view="planning"]').click();
  await expect(page.locator('#planningHub')).toBeVisible();

  await openSection(page, 'goals');
  await page.locator('#planningTargetInput').fill('5000');
  await page.locator('#planningTargetInput').press('Tab');
  await backToHub(page, 'goals');

  await openSection(page, 'agenda');
  await page.locator('[data-plan-days="5"]').click();
  await backToHub(page, 'agenda');

  await openSection(page, 'operation');
  await expect(page.locator('#planningFuelPrice')).toBeVisible();
  await page.locator('#planningFuelPrice').fill('5.55');
  await page.locator('#planningFuelPrice').press('Tab');
  await backToHub(page, 'operation');

  await openSection(page, 'costs');
  await page.locator('#planningAddCostButton').click();
  await expect(page.locator('#costModal')).toBeVisible();
  await page.locator('#costName').fill('Seguro Planejar');
  await page.locator('#costValue').fill('300');
  await page.locator('#saveCostButton').click();

  await expect(page.locator('#planningCostList')).toContainText('Seguro Planejar');
  await expect(page.locator('#planningCostList').getByText('Seguro Planejar')).toHaveCount(1);

  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.targetProfit).toBe(5000);
  expect(saved.workWeekdays).toEqual([1, 2, 3, 4, 5]);
  expect(saved.fuel.price).toBe(5.55);
  expect(saved.costs.filter(cost => cost.name === 'Seguro Planejar')).toHaveLength(1);

  await backToHub(page, 'costs');
  await page.locator('#view-planning > div:first-child [data-back]').click();
  await expect(page.locator('#targetProfitDisplay')).toContainText('5.000');
  await expect(page.locator('#targetProfitDisplay')).toBeHidden();

  await page.locator('nav.fixed.bottom-0 [data-view="planning"]').click();
  await expect(page.locator('#planningHub')).toBeVisible();
  await openSection(page, 'operation');
  await expect(page.locator('#planningFuelPrice')).toHaveValue('5.55');
  await backToHub(page, 'operation');
  await openSection(page, 'costs');
  await expect(page.locator('#planningCostList').getByText('Seguro Planejar')).toHaveCount(1);
});
