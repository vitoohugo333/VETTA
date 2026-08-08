import { test, expect } from '@playwright/test';

test('browser comum mostra apenas a instalação do VETTA', async ({ page }) => {
  await page.goto('/?forceBrowser=1');
  await expect(page.locator('#installView')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tenha o VETTA na tela do seu celular' })).toBeVisible();
  await expect(page.locator('#view-dashboard')).toHaveCount(0);
  await expect(page.locator('script[src*="app.js"]')).toHaveCount(0);
});

test('modo instalado abre a autoridade premium do aplicativo', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/app-shell\.html/);
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-ui-authority', 'premium-v1');
  await expect(page.locator('script[src="./ui/main.js"]')).toHaveCount(1);
});

test('primeiro service worker não recarrega a tarefa já aberta', async ({ page }) => {
  await page.addInitScript(() => {
    if (!location.pathname.endsWith('/app-shell.html')) return;
    const count = Number(sessionStorage.getItem('vetta-pwa-load-count') || '0') + 1;
    sessionStorage.setItem('vetta-pwa-load-count', String(count));
  });
  await page.goto('/app-shell.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#view-dashboard')).toBeVisible();
  await expect.poll(async () => page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'unsupported';
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state || 'waiting';
  }), { timeout: 15000 }).toBe('activated');
  await page.waitForTimeout(750);
  const loads = await page.evaluate(() => Number(sessionStorage.getItem('vetta-pwa-load-count') || '0'));
  expect(loads).toBe(1);
});

test('instalação concluída orienta abrir o VETTA pelo ícone', async ({ page }) => {
  await page.goto('/?forceBrowser=1');
  await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
  await expect(page.locator('#installView')).toBeHidden();
  await expect(page.locator('#successView')).toBeVisible();
  await expect(page.locator('.success-lead')).toContainText('abra o VETTA pelo novo ícone');
  await expect(page.locator('#view-dashboard')).toHaveCount(0);
});
