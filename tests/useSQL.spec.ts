import { test, expect } from '@playwright/test';

test.describe('useSQL Hook', () => {
  test.setTimeout(60000);

  test('should pass all complex SQL query tests', async ({ page }) => {
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

    await page.goto('/sql-test.html');
    
    // Wait for page to be ready
    await page.waitForFunction(() => (window as any).pageReady === true, { timeout: 10000 });
    
    // Wait for tests to complete or timeout
    const result = await Promise.race([
      page.waitForFunction(() => (window as any).testsComplete === true, { timeout: 30000 })
        .then(() => 'done'),
      new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 35000))
    ]);
    
    if (result === 'timeout') {
      const content = await page.locator('#results').textContent();
      console.log('Test timed out. Current results:', content);
      throw new Error('Test timed out. Results: ' + content);
    }
    
    // Get test results
    const testResults = await page.evaluate(() => (window as any).testResults);
    console.log('Test Results:', JSON.stringify(testResults, null, 2));
    
    // Check results
    expect(testResults.failed).toBe(0);
    expect(testResults.passed).toBeGreaterThan(0);
    
    // Verify specific tests passed
    const resultNames = testResults.results.map((r: any) => r.name);
    
    // Core functionality tests
    expect(resultNames).toContain('Simple query returns data');
    expect(resultNames).toContain('GROUP BY returns 3 categories');
    expect(resultNames).toContain('Subquery MAX works');
    expect(resultNames).toContain('HAVING filters to 2 categories');
    
    // Reactivity tests
    expect(resultNames).toContain('Param query re-runs when params change');
    expect(resultNames).toContain('GROUP BY query reactively updates when items table changes');
    
    // Ignore non-critical errors
    const realErrors = consoleErrors.filter(e => 
      !e.includes('Failed to load resource') &&
      !e.includes('404')
    );
    expect(realErrors).toHaveLength(0);
  });

  test('should handle query errors gracefully', async ({ page }) => {
    await page.goto('/test.html');
    
    // Test that invalid SQL returns an error
    const result = await page.evaluate(async () => {
      // @ts-ignore - dynamic import in browser context
      const { createDatabase } = await import('./index.js');
      const db = await createDatabase('error-test-' + Date.now(), { mode: 'local' });
      
      try {
        await db.exec('SELECT * FROM nonexistent_table');
        return { error: null };
      } catch (err: any) {
        return { error: err.message };
      } finally {
        await db.close();
      }
    });
    
    expect(result.error).toBeTruthy();
    expect(result.error).toContain('no such table');
  });

  test('should support parameterized queries for SQL injection prevention', async ({ page }) => {
    await page.goto('/test.html');
    
    const result = await page.evaluate(async () => {
      // @ts-ignore - dynamic import in browser context
      const { createDatabase } = await import('./index.js');
      const db = await createDatabase('param-test-' + Date.now(), { mode: 'local' });
      
      await db.exec('CREATE TABLE users (name TEXT, role TEXT)');
      await db.exec("INSERT INTO users (name, role) VALUES ('admin', 'superuser')");
      await db.exec("INSERT INTO users (name, role) VALUES ('guest', 'viewer')");
      
      // Test with safe parameterized query
      const maliciousInput = "admin' OR '1'='1";
      const safeResult = await db.exec(
        'SELECT * FROM users WHERE name = ? AND deleted = 0',
        [maliciousInput]
      );
      
      // Should return 0 rows because the malicious input is treated as a literal string
      const rowCount = safeResult.rows.length;
      
      await db.close();
      return { rowCount };
    });
    
    expect(result.rowCount).toBe(0);
  });
});
