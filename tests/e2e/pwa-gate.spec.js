import { test, expect } from '@playwright/test';

test('browser comum mostra apenas a instalação', async ({ page }) => {
  await page.goto('/?forceBrowser=1');
  await expect(page.getByRole('heading', { name: 'Instale o VETTA para continuar' })).toBeVisible();
  await expect(page.locator('#view-dashboard')).toHaveCount(0);
  await expect(page.locator('script[src*="app.js"]')).toHaveCount(0);
});

test('modo instalado abre a tela interna do aplicativo', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/app-shell\.html/);
  await expect(page.locator('#view-dashboard')).toBeVisible();
});

test('instalação concluída orienta abrir pelo ícone', async ({ page }) => {
  await page.goto('/?forceBrowser=1');
  await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
  await expect(page.locator('#status')).toContainText('abra pelo ícone');
});
