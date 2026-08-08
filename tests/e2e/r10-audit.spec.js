import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';

const baseState = {
  version: 11,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 0,
  revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [{ id: 'maintenance-r10', name: 'Reserva de manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true, paidPeriods: [] }],
  records: [],
  events: [],
  closings: [],
  r360: {
    resultsPeriod: 'week',
    vehicleOwnership: 'own',
    notifications: { dueCosts: false, weeklySummary: false, pace: false, missingRecords: false, incompletePlan: false },
  },
};

async function freezeDate(page, iso) {
  await page.addInitScript(({ iso }) => {
    const NativeDate = Date;
    const fixed = NativeDate.parse(iso);
    class FixedDate extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [fixed])); }
      static now() { return fixed; }
    }
    globalThis.Date = FixedDate;
  }, { iso });
}

async function seed(page, state = baseState, url = '/') {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('body').getAttribute('data-r360'), { timeout: 15000 }).toBe('r10');
}

async function stored(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
}

test('R10 1/3: primeira abertura com carro próprio monta o plano e chega ao Agora sem obrigação de veículo', async ({ page }) => {
  const state = { ...baseState, onboardingComplete: false, targetProfit: 0, costs: [], records: [], r360: undefined };
  await freezeDate(page, '2026-08-08T12:00:00-03:00');
  await seed(page, state, '/app-shell.html');

  await expect(page.locator('#onboardingModal')).toBeVisible();
  await expect(page.locator('#onboardingProgress')).toHaveText('1 de 3');
  await page.locator('[data-r360-vehicle="own"]').click();
  await page.locator('#onboardingNext').click();

  await expect(page.locator('#onboardingProgress')).toHaveText('2 de 3');
  await page.locator('#onboardingTarget').fill('4500');
  await page.locator('#onboardingNext').click();

  await expect(page.locator('#onboardingProgress')).toHaveText('3 de 3');
  await page.locator('#onboardingFuelPrice').fill('4.79');
  await page.locator('#onboardingFuelEff').fill('13.2');
  await page.locator('#onboardingRevenue').fill('2.25');
  await page.locator('#onboardingNext').click();

  await expect(page.locator('#onboardingModal')).toBeHidden();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#r360NowHero')).toBeVisible();

  const stateAfter = await stored(page);
  expect(stateAfter.onboardingComplete).toBe(true);
  expect(stateAfter.targetProfit).toBe(4500);
  expect(stateAfter.r360.vehicleOwnership).toBe('own');
  expect(stateAfter.costs.filter(cost => cost.category === 'obligation')).toHaveLength(0);
});

test('R10 2: motorista sem meta corrige o objetivo no Plano e retorna ao Agora orientado', async ({ page }) => {
  await seed(page, { ...baseState, targetProfit: 0 });

  await expect(page.locator('#view-dashboard')).toHaveAttribute('data-r1-state', 'missing-target');
  await expect(page.locator('#r1NextActionTitle')).toHaveText('Complete o objetivo do seu plano');
  await page.locator('#r1NextActionButton').click();
  await expect(page.locator('#planningHub')).toBeVisible();

  await page.locator('[data-planning-section-open="goals"]').click();
  await page.locator('#planningTargetInput').fill('4500');
  await page.locator('#planningTargetInput').press('Tab');
  await expect.poll(async () => (await stored(page)).targetProfit).toBe(4500);

  await page.locator('#planningPage-goals [data-planning-section-back]').click();
  await expect(page.locator('#planningHub')).toBeVisible();
  await page.locator('#view-planning > div:first-child [data-back]').click();

  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#view-dashboard')).not.toHaveAttribute('data-r1-state', 'missing-target');
  await expect(page.locator('#r1NextActionTitle')).toHaveText('Registre seu primeiro dia');
});

test('R10 5: adicionar conta vencida, pagar e desfazer mantém a matemática intacta', async ({ page }) => {
  await freezeDate(page, '2026-08-08T12:00:00-03:00');
  await seed(page);
  await page.locator('nav.fixed.bottom-0 [data-view="costs"]').click();
  await page.locator('#planningAddCostButton').click();

  await page.locator('#costName').fill('Conta R10');
  await page.locator('#costCategory').selectOption('obligation');
  await page.locator('#costKind').selectOption('monthly');
  await page.locator('#costValue').fill('200');
  await page.locator('#costDueDay').fill('1');
  await page.locator('#saveCostButton').click();

  const savedCost = (await stored(page)).costs.find(cost => cost.name === 'Conta R10');
  expect(savedCost).toBeTruthy();
  const row = page.locator('.r360-cost-line').filter({ hasText: 'Conta R10' });
  await expect(row.locator('.r360-status')).toContainText('Vencida');

  const before = await page.evaluate(() => ({
    monthlyFixed: window.__vettaApp.costContext().monthlyFixed,
    projectedNet: window.__vettaApp.calculations().projectedNet,
  }));

  await row.locator(`[data-r360-payment="${savedCost.id}"]`).click();
  await expect.poll(async () => (await stored(page)).costs.find(cost => cost.id === savedCost.id).paidPeriods.length).toBe(1);
  const paidMath = await page.evaluate(() => ({
    monthlyFixed: window.__vettaApp.costContext().monthlyFixed,
    projectedNet: window.__vettaApp.calculations().projectedNet,
  }));
  expect(paidMath).toEqual(before);

  await page.locator('#r360Snackbar button').click();
  await expect.poll(async () => (await stored(page)).costs.find(cost => cost.id === savedCost.id).paidPeriods.length).toBe(0);
  const undoneMath = await page.evaluate(() => ({
    monthlyFixed: window.__vettaApp.costContext().monthlyFixed,
    projectedNet: window.__vettaApp.calculations().projectedNet,
  }));
  expect(undoneMath).toEqual(before);
});

test('R10 6/8/9: primeiro registro alimenta Semana/Mês, orienta ritmo baixo e reconhece semana saudável', async ({ page }) => {
  await freezeDate(page, '2026-08-08T12:00:00-03:00');
  await seed(page);

  await page.locator('nav.fixed.bottom-0 [data-view="day"]').click();
  await page.locator('#recordDate').fill('2026-08-08');
  await page.locator('#recordGross').fill('100');
  await page.locator('#recordKm').fill('100');
  await page.locator('#saveDayButton').click();
  await expect(page.locator('#recordConfirmationTitle')).toHaveText('Dia registrado');
  await page.locator('#recordDoneButton').click();

  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#r1NextActionTitle')).toHaveText('Entenda o ritmo antes de mudar o plano');
  await page.locator('#r1NextActionButton').click();
  await expect(page.locator('#view-history')).toBeVisible();
  await expect(page.locator('[data-r360-period="week"]')).toHaveClass(/active/);
  await expect(page.locator('#r360ResultsHero')).not.toContainText('Ainda sem resultado');

  await page.locator('[data-r360-period="month"]').click();
  await expect(page.locator('[data-r360-period="month"]')).toHaveClass(/active/);
  await expect(page.locator('#r360ResultsHero')).not.toContainText('Ainda sem resultado');

  await page.evaluate(() => {
    const app = window.__vettaApp;
    app.state.records[0].gross = 10000;
    app.save();
    app.render();
    app.r360Audit.renderAll();
    app.navigateToPrimary('dashboard');
  });
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#r1NextActionTitle')).toHaveText('Continue alimentando o mês');
});

test('R10 13: virada de mês separa Agosto e Setembro e a semana corrente não mistura o mês anterior', async ({ page }) => {
  await freezeDate(page, '2026-09-01T12:00:00-03:00');
  const state = {
    ...baseState,
    records: [
      { date: '2026-08-31', gross: 300, km: 120, hours: 8, fuelSpend: 45 },
      { date: '2026-09-01', gross: 350, km: 130, hours: 8, fuelSpend: 48 },
    ],
  };
  await seed(page, state);

  const periods = await page.evaluate(() => {
    const app = window.__vettaApp;
    const current = app.calculations();
    const week = app.weekContext(current);
    return {
      current: current.records.map(record => record.date),
      week: week.records.map(record => record.date),
      august: app.monthSummary('2026-08').records.map(record => record.date),
      september: app.monthSummary('2026-09').records.map(record => record.date),
    };
  });

  expect(periods.current).toEqual(['2026-09-01']);
  expect(periods.week).toEqual(['2026-09-01']);
  expect(periods.august).toEqual(['2026-08-31']);
  expect(periods.september).toEqual(['2026-09-01']);
});

test('R10 14: deep-links usados pelas notificações abrem o destino correto', async ({ page }) => {
  await seed(page, baseState, '/app-shell.html?vetta=results&period=week');
  await expect(page.locator('#view-history')).toBeVisible();
  await expect(page.locator('[data-r360-period="week"]')).toHaveClass(/active/);

  await page.goto('/app-shell.html?vetta=costs&cost=maintenance-r10', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('body').getAttribute('data-r360'), { timeout: 15000 }).toBe('r10');
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningPage-costs')).toBeVisible();

  await page.goto('/app-shell.html?vetta=plan', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('body').getAttribute('data-r360'), { timeout: 15000 }).toBe('r10');
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningHub')).toBeVisible();
});

test('R10 15: compacto, telefone grande, tablet, landscape e movimento reduzido mantêm composição utilizável', async ({ page }) => {
  await seed(page);

  for (const viewport of [
    { width: 360, height: 640, rail: false },
    { width: 430, height: 932, rail: false },
    { width: 820, height: 1180, rail: false },
    { width: 900, height: 500, rail: true },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const geometry = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);

    const nav = await page.locator('nav.fixed.bottom-0').boundingBox();
    expect(nav).toBeTruthy();
    if (viewport.rail) {
      expect(nav.width).toBeLessThan(120);
      expect(nav.height).toBeGreaterThan(350);
    } else {
      expect(nav.width).toBeGreaterThan(300);
    }
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const duration = await page.locator('nav.fixed.bottom-0 .nav-item').first().evaluate(el => getComputedStyle(el).transitionDuration);
  const maxSeconds = duration.split(',').reduce((max, token) => {
    const value = Number.parseFloat(token);
    return Math.max(max, token.trim().endsWith('ms') ? value / 1000 : value);
  }, 0);
  expect(maxSeconds).toBeLessThanOrEqual(0.00001);
});
