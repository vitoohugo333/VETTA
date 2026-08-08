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
  costs: [
    { id: 'maintenance-default', name: 'Reserva de manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true },
    { id: 'fixed-default', name: 'Seguro mensal', kind: 'monthly', category: 'obligation', value: 650, active: true, dueDay: 31 }
  ],
  records: [
    { date: '2026-08-06', gross: 420, km: 180, hours: 8, fuelSpend: 70, createdAt: '2026-08-06T20:00:00.000Z' },
    { date: '2026-08-07', gross: 510, km: 210, hours: 9, fuelSpend: 82, createdAt: '2026-08-07T20:00:00.000Z' }
  ],
  events: [], closings: []
};

async function seed(page, state = baseState) {
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html/);
  await expect.poll(() => page.locator('body').getAttribute('data-r360'), { timeout: 15000 }).toBe('r10');
}

test('R3.0/R8: navegação definitiva prioriza Registrar e preserva rascunho sem barra durante edição', async ({ page }) => {
  await seed(page);
  const labels = await page.locator('nav.fixed.bottom-0 .nav-item span').allTextContents();
  expect(labels.map(text => text.trim())).toEqual(['Agora', 'Resultados', 'Registrar', 'Custos', 'Mais']);

  const register = page.locator('nav.fixed.bottom-0 [data-view="day"]');
  await expect(register).toHaveClass(/r360-register-action/);
  await register.click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(page.locator('nav.fixed.bottom-0')).toBeHidden();

  await page.locator('#recordGross').fill('333.50');
  await page.locator('#recordKm').fill('123');
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('vetta-r360-record-draft-v1') || 'null')?.recordGross)).toBe('333.50');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('body').getAttribute('data-r360'), { timeout: 15000 }).toBe('r10');
  await page.locator('nav.fixed.bottom-0 [data-view="day"]').click();
  await expect.poll(async () => Number(await page.locator('#recordGross').inputValue())).toBe(333.5);
  await expect.poll(async () => Number(await page.locator('#recordKm').inputValue())).toBe(123);
});

test('R2: marcar uma conta como paga não altera a matemática e pode ser desfeito', async ({ page }) => {
  await seed(page);
  await page.locator('nav.fixed.bottom-0 [data-view="costs"]').click();
  await expect(page.locator('#r360Costs')).toBeVisible();

  const before = await page.evaluate(() => ({
    monthlyFixed: window.__vettaApp.costContext().monthlyFixed,
    projectedNet: window.__vettaApp.calculations().projectedNet,
  }));

  const payment = page.locator('[data-r360-payment="fixed-default"]');
  await expect(payment).toBeVisible();
  await payment.click();
  await expect(page.locator('#r360Snackbar')).toBeVisible();

  const paid = await page.evaluate(key => {
    const state = JSON.parse(localStorage.getItem(key));
    const cost = state.costs.find(item => item.id === 'fixed-default');
    return { active: cost.active, paidPeriods: cost.paidPeriods, value: cost.value };
  }, STORAGE_KEY);
  expect(paid.active).toBe(true);
  expect(paid.value).toBe(650);
  expect(paid.paidPeriods.length).toBe(1);

  const after = await page.evaluate(() => ({
    monthlyFixed: window.__vettaApp.costContext().monthlyFixed,
    projectedNet: window.__vettaApp.calculations().projectedNet,
  }));
  expect(after).toEqual(before);

  await page.locator('#r360Snackbar button').click();
  await expect.poll(async () => page.evaluate(key => JSON.parse(localStorage.getItem(key)).costs.find(item => item.id === 'fixed-default').paidPeriods.length, STORAGE_KEY)).toBe(0);
});

test('R3.2: Resultados lembra Semana ou Mês e abre detalhe sem duplicar dados', async ({ page }) => {
  await seed(page);
  await page.locator('nav.fixed.bottom-0 [data-view="history"]').click();
  await expect(page.locator('#r360ResultsOverview')).toBeVisible();
  await expect(page.locator('[data-r360-period="week"]')).toHaveClass(/active/);
  await page.locator('[data-r360-period="month"]').click();
  await expect(page.locator('[data-r360-period="month"]')).toHaveClass(/active/);
  await expect.poll(async () => page.evaluate(key => JSON.parse(localStorage.getItem(key)).r360.resultsPeriod, STORAGE_KEY)).toBe('month');

  const recent = page.locator('[data-r360-result-date]').first();
  await expect(recent).toBeVisible();
  await recent.click();
  await expect(page.locator('#r360ResultDetail')).toBeVisible();
  await expect(page.locator('[data-r360-edit-day]')).toBeVisible();

  const count = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).records.length, STORAGE_KEY);
  expect(count).toBe(2);
});

test('R4: onboarding retoma e carro alugado vira obrigação semanal', async ({ page }) => {
  const state = { ...baseState, onboardingComplete: false, targetProfit: 0, costs: [], records: [] };
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state });
  await page.goto('/app-shell.html', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('body').getAttribute('data-r360'), { timeout: 15000 }).toBe('r10');
  await expect(page.locator('#onboardingModal')).toBeVisible();
  await expect(page.locator('#onboardingProgress')).toHaveText('1 de 3');

  await page.locator('[data-r360-vehicle="rental"]').click();
  await page.locator('#r360RentalValue').fill('650');
  await page.locator('#r360RentalWeekday').selectOption('5');
  await page.locator('#onboardingNext').click();
  await expect(page.locator('#onboardingProgress')).toHaveText('2 de 3');
  await page.locator('#onboardingTarget').fill('4500');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('body').getAttribute('data-r360'), { timeout: 15000 }).toBe('r10');
  await expect(page.locator('#onboardingProgress')).toHaveText('2 de 3');
  await page.locator('#onboardingNext').click();
  await expect(page.locator('#onboardingProgress')).toHaveText('3 de 3');
  await page.locator('#onboardingFuelPrice').fill('4.79');
  await page.locator('#onboardingFuelEff').fill('13.2');
  await page.locator('#onboardingRevenue').fill('2.25');
  await page.locator('#onboardingNext').click();
  await expect(page.locator('#onboardingModal')).toBeHidden();

  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.onboardingComplete).toBe(true);
  expect(saved.targetProfit).toBe(4500);
  expect(saved.r360.vehicleOwnership).toBe('rental');
  const rental = saved.costs.find(cost => cost.id === 'r360-rental');
  expect(rental).toMatchObject({ kind: 'weekly', category: 'obligation', value: 650, dueWeekday: 5, active: true });
});

test('R6: importação inválida preserva dados e backup válido só entra após confirmação', async ({ page }) => {
  await seed(page);
  await page.locator('nav.fixed.bottom-0 [data-view="more"]').click();
  await page.locator('[data-more-section-open="data"]').click();
  const importInput = page.locator('#importInput');
  await expect(importInput).toHaveAttribute('type', 'file');
  await expect(page.locator('label:has(#importInput)')).toBeVisible();

  const before = await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY);
  await importInput.setInputFiles({ name: 'invalido.json', mimeType: 'application/json', buffer: Buffer.from('{quebrado') });
  await expect.poll(async () => page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe(before);

  const imported = { ...baseState, targetProfit: 7777, records: [], costs: [] };
  await importInput.setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ data: imported })) });
  await expect(page.locator('#r360ImportPreview')).toBeVisible();
  expect(JSON.parse(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).targetProfit).toBe(4000);
  await page.locator('[data-r360-import-confirm]').click();
  await expect.poll(async () => page.evaluate(key => JSON.parse(localStorage.getItem(key)).targetProfit, STORAGE_KEY)).toBe(7777);
});

test('R9: zoom fica liberado, layout expandido vira rail e movimento reduzido é respeitado', async ({ page }) => {
  await seed(page);
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).not.toContain('user-scalable=no');
  expect(viewport).not.toContain('maximum-scale=1');

  await page.setViewportSize({ width: 900, height: 700 });
  const navBox = await page.locator('nav.fixed.bottom-0').boundingBox();
  expect(navBox.width).toBeLessThan(120);
  expect(navBox.height).toBeGreaterThan(500);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const duration = await page.locator('nav.fixed.bottom-0 .nav-item').first().evaluate(el => getComputedStyle(el).transitionDuration);
  const maxDurationSeconds = duration.split(',').reduce((max, token) => {
    const value = Number.parseFloat(token);
    const seconds = token.trim().endsWith('ms') ? value / 1000 : value;
    return Math.max(max, seconds);
  }, 0);
  expect(maxDurationSeconds).toBeLessThanOrEqual(0.00001);
});