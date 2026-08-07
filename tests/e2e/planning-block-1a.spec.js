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
  records: [], events: [], closings: [],
};

async function waitForFinalNavigation(page) {
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect.poll(async () => {
    try {
      const before = page.url();
      const navigation = await page.locator('nav.fixed.bottom-0').getAttribute('data-r1-navigation');
      const planning = await page.locator('#view-planning').getAttribute('data-r1');
      await page.waitForTimeout(150);
      return navigation === 'ready' && planning === 'ready' && before === page.url() ? 'stable' : 'waiting';
    } catch { return 'waiting'; }
  }, { timeout: 15000 }).toBe('stable');
}

async function openPlan(page) {
  await page.locator('#r1HeaderPlanButton').click();
  await expect(page.locator('#planningHub')).toBeVisible();
}

async function openSection(page, key) {
  const secondary = ['distribution', 'learning', 'advanced'].includes(key);
  if (secondary && !await page.locator('#planningSecondary').getAttribute('open')) {
    await page.locator('#planningSecondary > summary').click();
  }
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

test('Plano reúne todos os destinos e Agora mantém o essencial sem esconder a meta', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForFinalNavigation(page);
  await openPlan(page);

  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Organize o mês antes de correr atrás da meta' })).toBeVisible();
  await expect(page.getByText('Quatro decisões formam seu plano', { exact: true })).toBeVisible();
  await expect(page.locator('#view-planning > div:first-child [data-back]')).toBeVisible();

  for (const section of ['distribution', 'goals', 'costs', 'learning']) {
    await openSection(page, section);
    if (section === 'distribution') await expect(page.locator('#planningDreGross')).toBeVisible();
    if (section === 'goals') await expect(page.locator('#planningTargetInput')).toHaveValue('4000');
    if (section === 'costs') await expect(page.locator('#planningCostList')).toContainText('Manutenção');
    if (section === 'learning') await expect(page.locator('#planningLearningText')).toBeVisible();
    await backToHub(page, section);
  }

  await page.locator('#view-planning > div:first-child [data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#revenueChart')).toBeHidden();
  await expect(page.locator('#targetProfitDisplay')).toBeVisible();
  await expect(page.locator('#r1PlanSummary')).toBeVisible();
  await expect(page.locator('#r1HeaderPlanButton')).toBeVisible();

  await page.locator('nav.fixed.bottom-0 [data-view="costs"]').click();
  await expect(page.locator('#planningPage-costs')).toBeVisible();
  await expect(page.locator('#planningCostList')).toContainText('Manutenção');
  expect(errors).toEqual([]);
});

test('edições no Plano usam o mesmo estado e o mesmo cadastro de custos', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForFinalNavigation(page);
  await openPlan(page);

  await openSection(page, 'goals');
  await page.locator('#planningTargetInput').fill('5000');
  await page.locator('#planningTargetInput').press('Tab');
  await backToHub(page, 'goals');

  await openSection(page, 'agenda');
  await page.locator('[data-plan-days="5"]').click();
  await backToHub(page, 'agenda');

  await openSection(page, 'operation');
  await page.locator('#planningFuelPrice').fill('5.55');
  await page.locator('#planningFuelPrice').press('Tab');
  await backToHub(page, 'operation');

  await openSection(page, 'costs');
  await page.locator('#planningAddCostButton').click();
  await expect(page.locator('#costModal')).toBeVisible();
  await page.locator('#costName').fill('Seguro Planejar');
  await page.locator('#costValue').fill('300');
  await page.locator('#saveCostButton').click();
  await expect(page.locator('#planningCostList').getByText('Seguro Planejar')).toHaveCount(1);

  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.targetProfit).toBe(5000);
  expect(saved.workWeekdays).toEqual([1, 2, 3, 4, 5]);
  expect(saved.fuel.price).toBe(5.55);
  expect(saved.costs.filter(cost => cost.name === 'Seguro Planejar')).toHaveLength(1);

  await backToHub(page, 'costs');
  await page.locator('#view-planning > div:first-child [data-back]').click();
  await expect(page.locator('#targetProfitDisplay')).toContainText('5.000');
  await expect(page.locator('#targetProfitDisplay')).toBeVisible();

  await openPlan(page);
  await openSection(page, 'operation');
  await expect(page.locator('#planningFuelPrice')).toHaveValue('5.55');
  await backToHub(page, 'operation');
  await openSection(page, 'costs');
  await expect(page.locator('#planningCostList').getByText('Seguro Planejar')).toHaveCount(1);
});
