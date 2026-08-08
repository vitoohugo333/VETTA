import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';
const baseState = {
  version: 11,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1,2,3,4,5,6],
  extraDaysOff: 0,
  revenueKm: 2.25,
  fuel: { type:'gnv', label:'GNV', unit:'m³', price:4.79, efficiency:13.2 },
  compare: { gasPrice:6.19, gasEff:10.5, gnvPrice:4.79, gnvEff:13.2, period:1 },
  costs: [
    { id:'rent-friendly', name:'Aluguel', kind:'weekly', category:'obligation', value:450, dueWeekday:5, active:true, paidPeriods:[] },
    { id:'maintenance-friendly', name:'Manutenção', kind:'per_km', category:'reserve', value:.18, active:true, paidPeriods:[] },
  ],
  records: [
    { date:'2026-08-04', gross:360, km:160, hours:8, fuelSpend:0 },
    { date:'2026-08-05', gross:420, km:175, hours:8, fuelSpend:0 },
    { date:'2026-08-06', gross:500, km:180, hours:9, fuelSpend:0 },
  ],
  events: [], closings: [],
  r360: { resultsPeriod:'week', vehicleOwnership:'own', notifications:{ dueCosts:false, weeklySummary:false, pace:false, missingRecords:false, incompletePlan:false } },
};

async function freezeDate(page) {
  await page.addInitScript(() => {
    const NativeDate = Date;
    const fixed = NativeDate.parse('2026-08-08T12:00:00-03:00');
    class FixedDate extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [fixed])); }
      static now() { return fixed; }
    }
    globalThis.Date = FixedDate;
  });
}

async function seed(page, state = baseState) {
  await freezeDate(page);
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state });
  await page.goto('/app-shell.html', { waitUntil:'domcontentloaded' });
  await expect.poll(() => page.locator('body').getAttribute('data-friendly-ux'), { timeout:15000 }).toBe('v2');
}

test('friendly UX: Agora mostra progresso vivo e explica projeção sem tirar contexto', async ({ page }) => {
  await seed(page);
  await expect(page.locator('.friendly-week-progress')).toBeVisible();
  await expect(page.locator('.friendly-week-progress')).toContainText('dias registrados');
  await page.locator('#r360NowHero .hero-metric').filter({ hasText:'Projeção' }).click();
  await expect(page.locator('#friendlySheet')).toBeVisible();
  await expect(page.locator('#friendlySheet')).toContainText('O VETTA usa seus registros atuais');
  await page.locator('[data-friendly-close]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();
});

test('friendly UX: Registrar protege rascunho, avisa data existente e mantém CTA alcançável', async ({ page }) => {
  await seed(page);
  await page.locator('[data-view="day"]').click();
  await expect(page.locator('#friendlyRecordStatus')).toBeVisible();
  await page.locator('#recordDate').fill('2026-08-05');
  await expect(page.locator('#friendlyDuplicateHint')).toBeVisible();
  await page.locator('#recordGross').fill('430');
  await expect(page.locator('#friendlyRecordStatus')).toContainText('Rascunho salvo');
  await expect(page.locator('#saveDayButton')).toHaveClass(/friendly-sticky-action/);
});

test('friendly UX: Resultados oferece melhores dias e gráfico abre detalhe real', async ({ page }) => {
  await seed(page);
  await page.locator('[data-view="history"]').click();
  await expect(page.locator('.friendly-insight-grid')).toBeVisible();
  const firstInsight = page.locator('[data-friendly-result-date]').first();
  const date = await firstInsight.getAttribute('data-friendly-result-date');
  await firstInsight.click();
  await expect(page.locator('#r360ResultDetail')).toBeVisible();
  await page.locator('[data-close-result-detail]').click();
  const bar = page.locator('.chart span[data-friendly-result-date]').first();
  await expect(bar).toHaveAttribute('data-friendly-result-date');
  await bar.click();
  await expect(page.locator('#r360ResultDetail')).toBeVisible();
  expect(date).toBeTruthy();
});

test('friendly UX: Custos traduz consequência e atalhos abrem o custo correto', async ({ page }) => {
  await seed(page);
  await page.locator('[data-view="costs"]').click();
  await expect(page.locator('.friendly-due-strip')).toBeVisible();
  await expect(page.locator('#friendlyCostConsequence')).toContainText('por dia planejado');
  await page.locator('[data-friendly-cost="rent-friendly"]').click();
  await expect(page.locator('#costModal')).toBeVisible();
  await expect(page.locator('#costName')).toHaveValue('Aluguel');
});

test('friendly UX: Plano mostra continuidade e Mais encontra funções por intenção', async ({ page }) => {
  await seed(page);
  await page.locator('[data-open-plan]').first().click();
  await expect(page.locator('.friendly-plan-progress')).toContainText('4 de 4 partes');
  await page.locator('[data-back]').first().click();
  await page.locator('[data-view="more"]').click();
  await expect(page.locator('#friendlyGlobalSearch')).toBeVisible();
  await page.locator('#friendlyGlobalSearch').fill('backup');
  await expect(page.locator('#friendlySearchResults')).toContainText('Meus dados e backup');
  await page.locator('#friendlySearchResults button').first().click();
  await expect(page.locator('#morePage-data')).toBeVisible();
  await expect(page.locator('#friendlyBackupStatus')).toBeVisible();
});

test('friendly UX: onboarding explica a jornada e prepara o primeiro valor', async ({ page }) => {
  await seed(page, { ...baseState, onboardingComplete:false, targetProfit:0, costs:[], records:[], r360:undefined });
  await expect(page.locator('.friendly-onboarding-roadmap')).toBeVisible();
  await page.locator('[data-r360-vehicle="own"]').click();
  await page.locator('#onboardingNext').click();
  await page.locator('#onboardingTarget').fill('4500');
  await page.locator('#onboardingNext').click();
  await expect(page.locator('#friendlyOnboardingSummary')).toContainText('primeiro plano');
});
