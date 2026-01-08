import { test, expect } from '@playwright/test';

test.describe('useSQL Reactivity', () => {
  test.setTimeout(120000);

  test('should re-render when data changes via INSERT, UPDATE, DELETE', async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push({ type: msg.type(), text });
      console.log(`[${msg.type()}] ${text}`);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', (error) => {
      console.log('[pageerror]', error.message);
      consoleErrors.push(error.message);
    });

    await page.goto('/useSQL-reactivity-test.html');
    
    // Wait for page to be ready
    await page.waitForFunction(() => (window as any).pageReady === true, { timeout: 10000 });
    
    // Wait for tests to complete or timeout
    const result = await Promise.race([
      page.waitForFunction(() => (window as any).testsComplete === true, { timeout: 60000 })
        .then(() => 'done'),
      new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 70000))
    ]);
    
    if (result === 'timeout') {
      const content = await page.locator('#results').textContent();
      console.log('Test timed out. Current results:', content);
      throw new Error('Test timed out. Results: ' + content);
    }
    
    // Get test results
    const testResults = await page.evaluate(() => (window as any).testResults);
    console.log('Test Results:', JSON.stringify(testResults, null, 2));
    
    // Log failed tests with details
    const failedTests = testResults.results.filter((r: any) => !r.passed);
    if (failedTests.length > 0) {
      console.log('\n=== FAILED TESTS ===');
      for (const ft of failedTests) {
        console.log(`  - ${ft.name}: ${ft.error || 'assertion failed'}`);
      }
    }
    
    // Check results
    expect(testResults.failed).toBe(0);
    expect(testResults.passed).toBeGreaterThan(0);
    
    // Verify key tests passed
    const resultNames = testResults.results.map((r: any) => r.name);
    
    // useMutation tests (should pass - it calls invalidateTables)
    expect(resultNames).toContain('INSERT via useMutation triggers re-render');
    expect(resultNames).toContain('UPDATE via useMutation works');
    expect(resultNames).toContain('DELETE via useMutation triggers re-render');
    
    // db.exec tests (these are the critical ones - may fail if reactivity is broken)
    expect(resultNames).toContain('INSERT via db.exec triggers re-render');
    expect(resultNames).toContain('UPDATE via db.exec works');
    expect(resultNames).toContain('DELETE via db.exec triggers re-render');
    
    // Ignore non-critical errors
    const realErrors = consoleErrors.filter(e => 
      !e.includes('Failed to load resource') &&
      !e.includes('404')
    );
    expect(realErrors).toHaveLength(0);
  });
});
