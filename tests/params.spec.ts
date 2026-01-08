import { test, expect } from '@playwright/test';

test.describe('Parameterized Queries (db.exec)', () => {
  test.setTimeout(120000);

  test('should pass all parameterized query tests', async ({ page }) => {
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

    await page.goto('/params-test.html');
    
    // Wait for page to be ready
    await page.waitForFunction(() => (window as any).pageReady === true, { timeout: 10000 });
    
    // Wait for tests to complete or timeout
    const result = await Promise.race([
      page.waitForFunction(() => (window as any).testsComplete === true, { timeout: 90000 })
        .then(() => 'done'),
      new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 100000))
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
        console.log(`  - ${ft.name}: ${ft.error}`);
      }
    }
    
    // Check results
    expect(testResults.failed).toBe(0);
    expect(testResults.passed).toBeGreaterThan(0);
    
    // Verify key tests passed
    const resultNames = testResults.results.map((r: any) => r.name);
    
    // SELECT tests
    expect(resultNames).toContain('SELECT with single string param');
    expect(resultNames).toContain('SELECT with multiple params (AND)');
    
    // INSERT tests
    expect(resultNames).toContain('INSERT with single string param');
    expect(resultNames).toContain('INSERT with column name containing "id" substring (patient_id)');
    
    // UPDATE tests - including the failing case
    expect(resultNames).toContain('UPDATE with SET param and WHERE param');
    expect(resultNames).toContain('UPDATE with explicit updated_at param (YOUR FAILING CASE)');
    expect(resultNames).toContain('UPDATE column with "id" in name (patient_id)');
    
    // DELETE tests
    expect(resultNames).toContain('DELETE with single WHERE param');
    
    // Edge cases
    expect(resultNames).toContain('Empty params array');
    expect(resultNames).toContain('Param with special characters');
    
    // Ignore non-critical errors
    const realErrors = consoleErrors.filter(e => 
      !e.includes('Failed to load resource') &&
      !e.includes('404')
    );
    expect(realErrors).toHaveLength(0);
  });
});
