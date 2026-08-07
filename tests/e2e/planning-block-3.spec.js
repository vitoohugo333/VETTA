import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';
const initialState = {
  version: 3,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 1,
  revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [{ id: 'planning-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
  records: [], events: [],
};

async function openApp(page, state = initialState) {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
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

async function openPlan(page) {
  await page.locator('#r1HeaderPlanButton').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningHub')).toBeVisible();
}

async function openSection(page, key) {
  await page.locator(`[data-planning-section-open="${key}"]`).click();
  await expect(page.locator(`#planningPage-${key}`)).toBeVisible();
}

test('Plano apresenta quatro decisões essenciais antes das análises', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);
  await openPlan(page);

  await expect(page.getByText('Quatro decisões formam seu plano', { exact: true })).toBeVisible();
  const core = page.locator('#planningHub [data-planning-core]');
  await expect(core.locator('[data-planning-section-open]')).toHaveCount(4);
  await expect(core.locator('[data-planning-section-open]')).toHaveAttribute('data-planning-section-open', /goals|agenda|costs|operation/);
  await expect(page.locator('#planningSecondary [data-planning-section-open]')).toHaveCount(3);
  await expect(page.locator('#planningHub')).not.toContainText('BLOCO 3');
  await expect(page.locator('#planningStatus-goals')).toContainText('Meta definida');
  await expect(page.locator('#planningStatus-agenda')).toContainText('Agenda definida');
  await expect(page.locator('#planningStatus-costs')).toContainText('Custos revisáveis');
  await expect(page.locator('#planningStatus-operation')).toContainText('Operação definida');
  expect(errors).toEqual([]);
});

test('editar meta e agenda preserva a mesma fonte de verdade', async ({ page }) => {
  await openApp(page);
  await openPlan(page);

  await openSection(page, 'goals');
  await page.locator('#planningTargetInput').fill('5200');
  await page.locator('#planningTargetInput').press('Tab');
  await page.locator('#planningPage-goals [data-planning-section-back]').click();
  await expect(page.locator('#planningHubSummary-goals')).toContainText('5.200');

  await openSection(page, 'agenda');
  await page.locator('[data-plan-days="5"]').click();
  await page.locator('#planningPage-agenda [data-planning-section-back]').click();
  await expect(page.locator('#planningHubSummary-agenda')).toContainText('5 dias');

  const saved = await page.evaluate(key => {
    const state = JSON.parse(localStorage.getItem(key));
    return { targetProfit: state.targetProfit, workWeekdays: state.workWeekdays, costs: state.costs };
  }, STORAGE_KEY);
  expect(saved.targetProfit).toBe(5200);
  expect(saved.workWeekdays).toEqual([1, 2, 3, 4, 5]);
  expect(saved.costs).toHaveLength(1);
});

test('Custos abre diretamente da barra sem passar por diretório', async ({ page }) => {
  await openApp(page);
  await page.locator('nav.fixed.bottom-0 [data-view="costs"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningPage-costs')).toBeVisible();
  await expect(page.locator('#planningCostList')).toContainText('Manutenção');
  await expect(page.locator('#planningHub')).toBeHidden();
});

test('meta zero aparece como parte incompleta do plano', async ({ page }) => {
  await openApp(page, { ...initialState, targetProfit: 0 });
  await openPlan(page);
  await expect(page.locator('#view-planning')).toHaveAttribute('data-plan-state', 'missing-target');
  await expect(page.locator('#planningStatus-goals')).toContainText('Definir meta');
  await expect(page.locator('#planningHubSummary-goals')).toContainText('Sem meta definida');
});
