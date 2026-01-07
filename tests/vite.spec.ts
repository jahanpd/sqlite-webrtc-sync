import { test, expect } from '@playwright/test';

interface TestResults {
  passed: number;
  failed: number;
  total: number;
  errors: Array<{ name: string; error: string }>;
  success: boolean;
}

// Tests for Vite Dev Server (port 3002)
test.describe('Vite Dev Server Integration', () => {
  test.beforeEach(async ({}, testInfo) => {
    // Only run these tests for vite-dev project
    test.skip(testInfo.project.name !== 'vite-dev', 'Only run on vite-dev project');
  });

  test('should load WASM and pass all database tests', async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(`Page error: ${error.message}`);
    });

    page.on('requestfailed', (request) => {
      const url = request.url();
      if (!url.includes('favicon')) {
        failedRequests.push(url);
      }
    });

    await page.goto('/');

    // Wait for tests to complete
    const results = await page.waitForFunction(
      () => (window as any).__TEST_RESULTS__ as TestResults | undefined,
      { timeout: 60000 }
    );

    const testResults = await results.jsonValue() as TestResults;
    console.log('Test Results:', JSON.stringify(testResults, null, 2));

    // Verify no critical request failures
    const criticalFailures = failedRequests.filter(url => 
      url.includes('.wasm') || 
      url.includes('worker') ||
      url.includes('syncable-sqlite')
    );
    expect(criticalFailures).toHaveLength(0);

    // Verify all tests passed
    expect(testResults.success).toBe(true);
    expect(testResults.failed).toBe(0);
    expect(testResults.passed).toBeGreaterThan(0);

    if (testResults.errors.length > 0) {
      console.error('Test failures:', testResults.errors);
    }
  });

  test('should properly serve WASM file with correct MIME type', async ({ page }) => {
    await page.goto('/');
    
    // Use fetch API to check WASM file
    const wasmResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/node_modules/syncable-sqlite/dist/sqlite3.wasm', {
          method: 'HEAD'
        });
        return {
          ok: response.ok,
          status: response.status,
          contentType: response.headers.get('content-type'),
        };
      } catch (e) {
        return { ok: false, error: (e as Error).message };
      }
    });
    
    if (wasmResponse.ok) {
      expect(wasmResponse.contentType).toContain('wasm');
    }
  });

  test('should handle database creation without import.meta.url errors', async ({ page }) => {
    const urlErrors: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Invalid URL') || text.includes('import.meta.url')) {
        urlErrors.push(text);
      }
    });

    page.on('pageerror', (error) => {
      if (error.message.includes('Invalid URL') || error.message.includes('import.meta.url')) {
        urlErrors.push(error.message);
      }
    });

    await page.goto('/');

    await page.waitForFunction(
      () => (window as any).__TEST_RESULTS__,
      { timeout: 60000 }
    );

    expect(urlErrors).toHaveLength(0);
  });

  test('should work with multiple database instances', async ({ page }) => {
    await page.goto('/');

    const results = await page.waitForFunction(
      () => (window as any).__TEST_RESULTS__ as TestResults | undefined,
      { timeout: 60000 }
    );

    const testResults = await results.jsonValue() as TestResults;

    const multiDbError = testResults.errors.find(e => 
      e.name.includes('Multiple databases')
    );
    expect(multiDbError).toBeUndefined();
  });
});

// Tests for Vite Production Build (port 3003)
// These tests verify full functionality including OPFS persistence
test.describe('Vite Production Build Integration', () => {
  test.beforeEach(async ({}, testInfo) => {
    // Only run these tests for vite-preview project
    test.skip(testInfo.project.name !== 'vite-preview', 'Only run on vite-preview project');
  });

  test('should load WASM and pass all database tests in preview mode', async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(`Page error: ${error.message}`);
    });

    page.on('requestfailed', (request) => {
      const url = request.url();
      if (!url.includes('favicon')) {
        failedRequests.push(url);
      }
    });

    await page.goto('/');

    // Wait for tests to complete
    const results = await page.waitForFunction(
      () => (window as any).__TEST_RESULTS__ as TestResults | undefined,
      { timeout: 60000 }
    );

    const testResults = await results.jsonValue() as TestResults;
    console.log('Preview Mode Test Results:', JSON.stringify(testResults, null, 2));

    // Verify no critical request failures (WASM, workers, etc.)
    const criticalFailures = failedRequests.filter(url => 
      url.includes('.wasm') || 
      url.includes('worker') ||
      url.includes('opfs') ||
      url.includes('syncable-sqlite')
    );
    expect(criticalFailures).toHaveLength(0);

    // Verify all tests passed
    expect(testResults.success).toBe(true);
    expect(testResults.failed).toBe(0);
    expect(testResults.passed).toBeGreaterThan(0);

    if (testResults.errors.length > 0) {
      console.error('Test failures:', testResults.errors);
    }
  });

  test('should serve WASM and OPFS proxy files with correct content types', async ({ page }) => {
    await page.goto('/');
    
    // Check WASM file
    const wasmResponse = await page.evaluate(async () => {
      const response = await fetch('/assets/sqlite3.wasm', { method: 'HEAD' });
      return {
        ok: response.ok,
        status: response.status,
        contentType: response.headers.get('content-type'),
      };
    });
    
    expect(wasmResponse.ok).toBe(true);
    expect(wasmResponse.contentType).toContain('wasm');

    // Check OPFS proxy worker file
    const opfsResponse = await page.evaluate(async () => {
      const response = await fetch('/assets/sqlite3-opfs-async-proxy.js', { method: 'HEAD' });
      return {
        ok: response.ok,
        status: response.status,
        contentType: response.headers.get('content-type'),
      };
    });
    
    expect(opfsResponse.ok).toBe(true);
    expect(opfsResponse.contentType).toContain('javascript');
  });

  test('should handle database creation without import.meta.url errors in production', async ({ page }) => {
    const urlErrors: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Invalid URL') || text.includes('import.meta.url')) {
        urlErrors.push(text);
      }
    });

    page.on('pageerror', (error) => {
      if (error.message.includes('Invalid URL') || error.message.includes('import.meta.url')) {
        urlErrors.push(error.message);
      }
    });

    await page.goto('/');

    await page.waitForFunction(
      () => (window as any).__TEST_RESULTS__,
      { timeout: 60000 }
    );

    expect(urlErrors).toHaveLength(0);
  });

  test('should work with multiple database instances in production', async ({ page }) => {
    await page.goto('/');

    const results = await page.waitForFunction(
      () => (window as any).__TEST_RESULTS__ as TestResults | undefined,
      { timeout: 60000 }
    );

    const testResults = await results.jsonValue() as TestResults;

    const multiDbError = testResults.errors.find(e => 
      e.name.includes('Multiple databases')
    );
    expect(multiDbError).toBeUndefined();
  });
});
