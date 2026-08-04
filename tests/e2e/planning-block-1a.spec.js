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

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state: initialState });
});

test('Planejar reúne todos os destinos e Hoje mantém somente o essencial', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-secondary-view="planning"]').click();

  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Meu planejamento completo' })).toBeVisible();
  await expect(page.locator('#planningRevenueChart')).toBeVisible();
  await expect(page.locator('#planningTargetInput')).toHaveValue('4000');
  await expect(page.locator('#planningCostList')).toContainText('Manutenção');
  await expect(page.locator('#planningLearningText')).toBeVisible();

  await page.locator('[data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#revenueChart')).toBeHidden();
  await expect(page.locator('#targetProfitDisplay')).toBeHidden();
  await expect(page.locator('#kpiGrossDaily')).toBeVisible();
  await expect(page.locator('[data-secondary-view="planning"]')).toBeVisible();

  await page.locator('[data-view="settings"]').first().click();
  await expect(page.locator('#fuelType')).toBeVisible();
  await expect(page.locator('#costList')).toContainText('Manutenção');
  expect(errors).toEqual([]);
});

test('edições em Planejar usam o mesmo estado e o mesmo cadastro de custos', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-secondary-view="planning"]').click();

  await page.locator('#planningTargetInput').fill('5000');
  await page.locator('#planningTargetInput').press('Tab');
  await page.locator('[data-plan-days="5"]').click();

  const operation = page.locator('#view-planning details').filter({ hasText: 'Operação e combustível' });
  await operation.locator('summary').click();
  await page.locator('#planningFuelPrice').fill('5.55');
  await page.locator('#planningFuelPrice').press('Tab');

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

  await page.locator('[data-back]').click();
  await expect(page.locator('#targetProfitDisplay')).toContainText('5.000');
  await expect(page.locator('#targetProfitDisplay')).toBeHidden();
  await page.locator('[data-view="settings"]').first().click();
  await expect(page.locator('#fuelPrice')).toHaveValue('5.55');
  await expect(page.locator('#costList').getByText('Seguro Planejar')).toHaveCount(1);
});
