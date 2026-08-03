import { test, expect } from '@playwright/test';

const password = process.env.VETTA_TEST_PASSWORD?.trim();
const STORAGE_KEY = 'vetta-driver-intelligence-v3';

const initialState = {
  version: 3,
  onboardingComplete: true,
  targetProfit: 4000,
  workWeekdays: [1, 2, 3, 4, 5, 6],
  extraDaysOff: 0,
  revenueKm: 2.25,
  fuel: { type: 'gnv', label: 'GNV', unit: 'm³', price: 4.79, efficiency: 13.2 },
  compare: { gasPrice: 6.19, gasEff: 10.5, gnvPrice: 4.79, gnvEff: 13.2, period: 1 },
  costs: [],
  records: [],
  events: []
};

test.describe.configure({ mode: 'serial' });

test('protege o navegador comum e testa o uso interno pelo caminho de automação', async ({ page, request }) => {
  expect(password, 'Configure o segredo VETTA_TEST_PASSWORD antes de executar o teste remoto.').toBeTruthy();

  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const publicPwaFiles = [
    '/manifest.webmanifest',
    '/sw.js',
    '/icon.svg',
    '/icon-192.png',
    '/icon-512.png'
  ];

  for (const path of publicPwaFiles) {
    const response = await request.get(path);
    expect(response.ok(), `${path} deve continuar público para permitir a instalação`).toBeTruthy();
  }

  const protectedResponse = await page.goto('/?forceBrowser=1', { waitUntil: 'domcontentloaded' });
  expect(protectedResponse?.status(), 'o site deve pedir senha antes de mostrar a instalação').toBe(401);
  await expect(page.locator('[data-vetta-access-gate="true"]')).toBeVisible();

  await page.getByLabel('Senha de acesso').fill(password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.getByRole('button', { name: 'Entrar no VETTA' }).click()
  ]);

  await expect(page.locator('[data-vetta-access-gate="true"]')).toHaveCount(0);
  await expect(page.locator('#installView')).toBeVisible();
  await expect(page.locator('#view-dashboard')).toHaveCount(0);
  await expect(page).toHaveTitle(/Instalação/);

  await page.addInitScript(({ key, state }) => {
    localStorage.setItem(key, JSON.stringify(state));
  }, { key: STORAGE_KEY, state: initialState });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/app-shell\.html(?:$|[?#])/);
  await expect(page.locator('#view-dashboard')).toBeVisible();

  await page.locator('[data-view="day"]').first().click();
  await page.locator('#recordGross').fill('321.50');
  await page.locator('#recordKm').fill('120');

  await page.locator('[data-view="dashboard"]').first().click();
  await page.locator('[data-secondary-view="planning"]').click();
  await expect(page.locator('#view-planning')).toBeVisible();
  await expect(page.locator('#planningTarget')).toHaveText('R$ 4.000');

  await page.locator('[data-back]').click();
  await expect(page.locator('#view-dashboard')).toBeVisible();

  await page.locator('[data-view="day"]').first().click();
  await expect(page.locator('#recordGross')).toHaveValue('321.50');
  await expect(page.locator('#recordKm')).toHaveValue('120');
  expect(pageErrors, `erros JavaScript encontrados: ${pageErrors.join(' | ')}`).toEqual([]);
});
