import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';

const initialState = {
  version: 10, release: '3.5.1', onboardingComplete: true, targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6], extraDaysOff: 0, revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [{ id: 'more5-maintenance', name: 'Manutenção', kind: 'per_km', category: 'reserve', value: 0.18, active: true }],
  records: [{ id: 'more5-day', date: '2026-08-01', gross: 300, km: 100, hours: 8, fuelSpend: 0, fuelTypeSnapshot: 'gnv', fuelLabelSnapshot: 'GNV', fuelPriceSnapshot: 4.79, fuelCostKmSnapshot: 4.79 / 13.2, perKmCostSnapshot: 0.18, percentCostSnapshot: 0, fixedShareSnapshot: 0, updatedAt: new Date().toISOString() }],
  events: [], closings: [],
};

async function openApp(page, state = initialState) {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value: state });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect.poll(async () => {
    try {
      const before = page.url();
      const navigation = await page.locator('nav.fixed.bottom-0').getAttribute('data-block1d');
      const more = await page.locator('#view-more').getAttribute('data-block5');
      const r360 = await page.locator('body').getAttribute('data-r360');
      await page.waitForTimeout(150);
      return navigation === 'ready' && more === 'ready' && r360 === 'r10' && before === page.url() ? 'stable' : 'waiting';
    } catch { return 'waiting'; }
  }, { timeout: 15000 }).toBe('stable');
}

async function openMore(page) {
  await page.locator('nav.fixed.bottom-0 [data-view="more"]').click();
  await expect(page.locator('#view-more')).toBeVisible();
  await expect(page.locator('#moreHub')).toBeVisible();
}

async function backToHub(page, key) {
  await page.locator(`#morePage-${key} [data-more-section-back]`).click();
  await expect(page.locator('#moreHub')).toBeVisible();
}

test('Mais abre curto e mantém Ferramentas, Relatórios, Dados, Radar e Aplicativo', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);
  await openMore(page);

  await expect(page.locator('[data-more-section-open]')).toHaveCount(5);
  await expect(page.locator('[data-r360-more-open="notifications"]')).toHaveCount(1);
  await expect(page.locator('#compareDetails')).toBeHidden();
  await expect(page.locator('#reportButton')).toBeHidden();

  await page.locator('[data-more-section-open="tools"]').click();
  await expect(page.locator('#morePage-tools')).toBeVisible();
  await expect(page.locator('#compareDetails')).toBeVisible();
  await expect(page.locator('#compareDetails')).toHaveAttribute('open', '');
  await expect(page.locator('#compareChart')).toBeVisible();
  await page.locator('#compareGasPrice').fill('7.00');
  await page.locator('#compareGasPrice').press('Tab');
  await backToHub(page, 'tools');
  await expect(page.locator('#moreHubSummary-tools')).toContainText('GNV');

  await page.locator('[data-more-section-open="reports"]').click();
  await page.evaluate(() => { window.print = () => { window.__vettaPrinted = true; }; });
  await page.locator('#reportButton').click();
  await expect.poll(() => page.evaluate(() => window.__vettaPrinted === true)).toBe(true);
  await backToHub(page, 'reports');

  await page.locator('[data-more-section-open="data"]').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportButton').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^vetta-backup-\d{4}-\d{2}-\d{2}\.json$/);
  await expect(page.locator('#importInput')).toHaveCount(1);
  await backToHub(page, 'data');

  await page.locator('[data-more-section-open="radar"]').click();
  await page.locator('#addEventButton').click();
  await page.locator('#eventTitle').fill('Evento de teste');
  await page.locator('#eventDate').fill('2026-08-10');
  await page.locator('#saveEventButton').click();
  await expect(page.locator('#eventList')).toContainText('Evento de teste');
  await page.locator('#eventList [data-event-action="edit"]').click();
  await page.locator('#eventTitle').fill('Evento atualizado');
  await page.locator('#saveEventButton').click();
  await expect(page.locator('#eventList')).toContainText('Evento atualizado');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#eventList [data-event-action="delete"]').click();
  await expect(page.locator('#eventList')).toContainText('Nenhum evento ou alerta salvo');
  await backToHub(page, 'radar');

  await page.locator('[data-more-section-open="app"]').click();
  await expect(page.locator('#appVersionLabel')).toHaveText('Versão 3.5.1');
  await page.locator('#installCardButton').click();
  await expect(page.locator('#installModal')).toBeVisible();
  await page.locator('#closeInstallModal').click();
  await expect(page.locator('#installModal')).toBeHidden();
  expect(errors).toEqual([]);
});

test('importação valida e explica antes de substituir a mesma fonte de dados', async ({ page }) => {
  await openApp(page);
  await openMore(page);
  await page.locator('[data-more-section-open="data"]').click();

  const imported = {
    ...initialState,
    targetProfit: 5200,
    records: [...initialState.records, { ...initialState.records[0], id: 'more5-day-2', date: '2026-08-02' }],
  };

  await page.locator('#importInput').setInputFiles({
    name: 'vetta-backup.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ app: 'VETTA', version: 10, data: imported })),
  });
  await expect(page.locator('#r360ImportPreview')).toBeVisible();
  await expect(page.locator('#r360ImportPreview')).toContainText('2 registros');

  let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.targetProfit).toBe(4000);
  expect(saved.records).toHaveLength(1);

  await page.locator('[data-r360-import-confirm]').click();
  await expect(page.locator('#toast')).toContainText('Backup importado');
  saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.targetProfit).toBe(5200);
  expect(saved.records).toHaveLength(2);

  await page.evaluate(() => window.history.back());
  await expect(page.locator('#moreHub')).toBeVisible();
  await expect(page.locator('#moreHubSummary-data')).toContainText('2 registros');

  await page.locator('[data-more-section-open="radar"]').click();
  await page.locator('nav.fixed.bottom-0 [data-view="more"]').click();
  await expect(page.locator('#moreHub')).toBeVisible();
});
