import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'vetta-driver-intelligence-v3';

test('Montar minha meta conclui o onboarding e abre Hoje', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#onboardingModal')).toBeVisible();
  await expect(page.locator('#onboardingTarget')).toHaveValue('4000');

  await page.locator('#onboardingNext').click();
  await expect(page.locator('#onboardingTitle')).toHaveText('Qual combustível entra nas metas?');

  await page.locator('#onboardingNext').click();
  await expect(page.locator('#onboardingTitle')).toHaveText('Vamos conferir seu planejamento');
  await expect(page.locator('#onboardingRevenue')).toHaveValue('1.75');
  await expect(page.locator('#onboardingFixed')).toBeHidden();

  await page.locator('#onboardingNext').click();

  await expect(page.locator('#onboardingModal')).toBeHidden();
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('#toast')).toContainText('Meta montada');

  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), STORAGE_KEY);
  expect(saved).toBeTruthy();
  expect(saved.onboardingComplete).toBe(true);
  expect(saved.revenueKm).toBe(1.75);
  expect(saved.costs).toEqual([
    expect.objectContaining({
      id: 'maintenance-onboarding',
      kind: 'per_km',
      value: 0.18,
      active: true,
    }),
  ]);
  expect(errors).toEqual([]);
});
