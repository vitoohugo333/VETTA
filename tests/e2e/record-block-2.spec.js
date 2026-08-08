import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';
const state = {
  version: 10, onboardingComplete: true, targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6], extraDaysOff: 0, revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [], records: [], events: [], closings: [],
};

async function waitForStableApp(page) {
  await expect.poll(async () => {
    try {
      const before = page.url();
      const navigationReady = await page.locator('nav.fixed.bottom-0').getAttribute('data-r1-navigation');
      const recordReady = await page.locator('#view-day').getAttribute('data-block2');
      const historyReady = await page.locator('#view-history').getAttribute('data-block4');
      const r360 = await page.locator('body').getAttribute('data-r360');
      await page.waitForTimeout(150);
      return navigationReady === 'ready' && recordReady === 'ready' && historyReady === 'ready' && r360 === 'r10' && page.url() === before ? 'stable' : 'waiting';
    } catch { return 'waiting'; }
  }, { timeout: 15000 }).toBe('stable');
}

async function openApp(page, initialState = state) {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: initialState });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForStableApp(page);
}

async function records(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').records || [], STORAGE_KEY);
}

test('registro prioriza essenciais, recolhe opcionais, confirma e atualiza a mesma data pelos Resultados', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);

  await page.locator('nav.fixed.bottom-0 [data-view="day"]').click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(page.locator('nav.fixed.bottom-0')).toBeHidden();
  await expect(page.locator('[data-record-role="essential-fields"]')).toBeVisible();
  await expect(page.locator('#recordGross')).toBeVisible();
  await expect(page.locator('#recordKm')).toBeVisible();

  const optional = page.locator('#recordOptionalDetails');
  await expect(optional).not.toHaveAttribute('open', '');
  await expect(page.locator('#recordHours')).toBeHidden();
  await optional.locator('summary').click();
  await expect(page.locator('#recordHours')).toBeVisible();
  await expect(page.locator('#recordFuel')).toBeVisible();

  await page.locator('#recordDate').fill('2026-08-04');
  await page.locator('#recordGross').fill('321.50');
  await page.locator('#recordKm').fill('120');
  await page.locator('#recordHours').fill('8.5');
  await page.locator('#recordFuel').fill('45');
  await expect(page.locator('#previewNet')).not.toHaveText('R$ 0,00');

  await page.locator('#saveDayButton').click();
  await expect(page.locator('#recordConfirmation')).toBeVisible();
  await expect(page.locator('#recordConfirmationTitle')).toHaveText('Dia registrado');
  await expect(page.locator('#recordConfirmationGross')).toContainText('321,50');
  await expect(page.locator('#recordConfirmationKm')).toHaveText('120 km');
  await expect(page.locator('#recordConfirmationText')).toContainText('semana');

  let saved = await records(page);
  expect(saved).toHaveLength(1);
  expect(saved[0]).toMatchObject({ date: '2026-08-04', gross: 321.5, km: 120, hours: 8.5, fuelSpend: 45 });

  await expect(page.locator('#recordEditButton')).toHaveText('Ver resultados deste dia');
  await page.locator('#recordEditButton').click();
  await expect(page.locator('#r360ResultDetail')).toBeVisible();
  await page.locator('[data-r360-edit-day="2026-08-04"]').click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(page.locator('#recordDate')).toHaveValue('2026-08-04');
  await expect(page.locator('#saveDayButton')).toHaveText('Atualizar dia');
  await expect(page.locator('#recordGross')).toHaveValue('321.5');
  await expect(optional).toHaveAttribute('open', '');

  await page.locator('#recordGross').fill('350');
  await page.locator('#saveDayButton').click();
  await expect(page.locator('#recordConfirmationTitle')).toHaveText('Dia atualizado');

  saved = await records(page);
  expect(saved).toHaveLength(1);
  expect(saved[0].gross).toBe(350);

  await page.locator('#recordDoneButton').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  expect(errors).toEqual([]);
});

test('edição pelos Resultados continua usando o mesmo formulário e a mesma data', async ({ page }) => {
  const stateWithRecord = {
    ...state,
    records: [{ id: 'day-2026-08-03', date: '2026-08-03', gross: 280, km: 100, hours: 7, fuelSpend: 38,
      fuelTypeSnapshot: 'gnv', fuelLabelSnapshot: 'GNV', fuelPriceSnapshot: 4.79,
      fuelCostKmSnapshot: 4.79 / 13.2, perKmCostSnapshot: 0, percentCostSnapshot: 0, fixedShareSnapshot: 0 }],
  };
  await openApp(page, stateWithRecord);
  await page.locator('nav.fixed.bottom-0 [data-view="history"]').click();
  const day = page.locator('[data-r360-result-date="2026-08-03"]');
  await expect(day).toBeVisible();
  await day.click();
  await page.locator('[data-r360-edit-day="2026-08-03"]').click();
  await expect(page.locator('#view-day')).toBeVisible();
  await expect(page.locator('#recordDate')).toHaveValue('2026-08-03');
  await expect(page.locator('#recordGross')).toHaveValue('280');
  await expect(page.locator('#recordOptionalDetails')).toHaveAttribute('open', '');
  await expect(page.locator('#saveDayButton')).toHaveText('Atualizar dia');
});
