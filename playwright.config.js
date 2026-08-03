import { defineConfig } from '@playwright/test';

const localBaseURL = 'http://127.0.0.1:4173';
const remoteBaseURL = process.env.VETTA_TEST_BASE_URL?.trim();
const remoteUsageMode = Boolean(remoteBaseURL);

export default defineConfig({
  testDir: remoteUsageMode ? './tests/e2e-remote' : './tests/e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: remoteUsageMode ? 'test-results/remote' : 'test-results/local',
  use: {
    baseURL: remoteBaseURL || localBaseURL,
    browserName: 'chromium',
    headless: true,
    serviceWorkers: 'allow',
    viewport: remoteUsageMode ? { width: 390, height: 844 } : undefined,
    hasTouch: remoteUsageMode,
    isMobile: remoteUsageMode,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: remoteUsageMode ? 'retain-on-failure' : 'off',
    screenshot: remoteUsageMode ? 'only-on-failure' : 'off',
    video: 'off'
  },
  webServer: remoteUsageMode ? undefined : {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory _site',
    url: localBaseURL,
    reuseExistingServer: false,
    timeout: 30_000
  },
  reporter: remoteUsageMode
    ? [['line'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['line']]
});
