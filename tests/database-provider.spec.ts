import { test, expect } from '@playwright/test';

test.describe('DatabaseProvider', () => {
  test.setTimeout(60000);

  test('children mount while provider is initializing (core fix)', async ({ page }) => {
    const mountLogs: string[] = [];
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('Child component mounted')) {
        mountLogs.push(msg.text());
      }
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.goto('/provider-test.html');

    await page.waitForFunction(() => (window as any).pageReady === true, { timeout: 10000 });

    expect(mountLogs).toContain('Child component mounted');

    console.log('Page errors:', consoleErrors);
  });

  test('react-test.html still works (integration test)', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.goto('/react-test.html');

    try {
      await page.waitForFunction(() => (window as any).testsComplete === true, { timeout: 30000 });

      const testResults = await page.evaluate(() => (window as any).testResults);
      expect(testResults.failed).toBe(0);
      expect(testResults.passed).toBeGreaterThan(0);
    } catch (e) {
      console.log('Console errors:', consoleErrors);
      throw e;
    }
  });
});
