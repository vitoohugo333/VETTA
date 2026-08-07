import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';
const baseState = {
  version: 3,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 0,
  revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [{ id: 'today-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
  records: [],
  events: [],
};

async function openApp(page, state = baseState) {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect.poll(async () => {
    try {
      const today = await page.locator('#view-dashboard').getAttribute('data-r1');
      const nav = await page.locator('nav.fixed.bottom-0').getAttribute('data-r1-navigation');
      const plan = await page.locator('#view-planning').getAttribute('data-r1');
      return today === 'ready' && nav === 'ready' && plan === 'ready' ? 'ready' : 'waiting';
    } catch { return 'waiting'; }
  }, { timeout: 15000 }).toBe('ready');
}

test('Agora coloca Plano e próxima ação antes de detalhes secundários', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);

  await expect(page.locator('#targetProfitDisplay')).toBeVisible();
  await expect(page.locator('#r1PlanSummary')).toBeVisible();
  await expect(page.locator('#r1PlanSummary')).toContainText('4.000');
  await expect(page.locator('#r1HeaderPlanButton')).toBeVisible();
  await expect(page.locator('#installButton')).toBeHidden();
  await expect(page.locator('#r1NextActionTitle')).toHaveText('Registre seu primeiro dia');

  const order = await page.evaluate(() => {
    const dashboard = document.getElementById('view-dashboard');
    const children = [...dashboard.children];
    return {
      hero: children.indexOf(dashboard.firstElementChild),
      plan: children.indexOf(document.getElementById('targetProfitDisplay').closest('.card-vetta')),
      next: children.indexOf(document.getElementById('r1NextAction')),
      register: children.indexOf(dashboard.querySelector('button[data-view="day"]')),
      month: children.indexOf(document.getElementById('monthStatusTitle').closest('.card-vetta')),
    };
  });
  expect(order.plan).toBeGreaterThan(order.hero);
  expect(order.next).toBeGreaterThan(order.plan);
  expect(order.register).toBeGreaterThan(order.next);
  expect(order.month).toBeGreaterThan(order.register);

  await page.locator('#r1NextActionButton').click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(page.locator('nav.fixed.bottom-0 [data-view="day"]')).toHaveClass(/active/);

  await page.locator('nav.fixed.bottom-0 [data-view="dashboard"]').click();
  await page.locator('#r1HeaderPlanButton').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningHub')).toBeVisible();
  expect(errors).toEqual([]);
});

test('meta zero não deixa o usuário perdido e leva direto à definição da meta', async ({ page }) => {
  await openApp(page, { ...baseState, targetProfit: 0 });

  await expect(page.locator('#view-dashboard')).toHaveAttribute('data-r1-state', 'missing-target');
  await expect(page.locator('#r1PlanStatus')).toHaveText('FALTA META');
  await expect(page.locator('#r1PlanButton')).toContainText('Montar meu plano');
  await expect(page.locator('#r1NextActionTitle')).toHaveText('Comece definindo sua meta');
  await expect(page.locator('#r1NextActionText')).toContainText('Sem uma meta líquida');

  await page.locator('#r1NextActionButton').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningPage-goals')).toBeVisible();
  await expect(page.locator('#planningTargetInput')).toBeVisible();
});

test('R1 reorganiza a experiência sem alterar os dados financeiros', async ({ page }) => {
  await openApp(page);
  const fingerprint = () => page.evaluate(key => {
    const state = JSON.parse(localStorage.getItem(key));
    return {
      targetProfit: state.targetProfit,
      workWeekdays: state.workWeekdays,
      revenueKm: state.revenueKm,
      fuel: state.fuel,
      costs: state.costs,
      records: state.records,
    };
  }, STORAGE_KEY);

  const before = await fingerprint();
  await page.locator('#r1HeaderPlanButton').click();
  await page.locator('[data-planning-section-open="distribution"]').click();
  await expect(page.locator('#planningRevenueChart')).toBeVisible();
  await page.locator('#planningPage-distribution [data-planning-section-back]').click();
  await page.locator('nav.fixed.bottom-0 [data-view="dashboard"]').click();
  expect(await fingerprint()).toEqual(before);
});
