import { test, expect } from '@playwright/test';

test.describe('SyncableDatabase', () => {
  test('should pass all tests', async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    
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

    page.on('requestfailed', (request) => {
      console.log('[requestfailed]', request.url());
      failedRequests.push(request.url());
    });

    page.on('response', (response) => {
      if (response.status() >= 400) {
        console.log('[response error]', response.url(), response.status());
        failedRequests.push(response.url() + ' - ' + response.status());
      }
    });

    await page.goto('/test.html');
    
    // Wait for results or timeout
    const result = await Promise.race([
      page.waitForFunction(() => {
        const results = document.getElementById('results');
        return results && (results.innerHTML.includes('All tests passed') || results.innerHTML.includes('FAIL'));
      }, { timeout: 60000 }).then(() => 'done'),
      new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 15000))
    ]);
    
    const content = await page.locator('#results').textContent();
    console.log('Results content:', content);
    
    if (result === 'timeout') {
      console.log('Test timed out. Current results:', content);
      console.log('Console messages:', JSON.stringify(consoleMessages, null, 2));
      throw new Error('Test timed out. Results: ' + content);
    }
    
    if (content?.includes('FAIL')) {
      throw new Error('Tests failed: ' + content);
    }
    
    expect(content).toContain('All tests passed');
    // Ignore 404 errors for missing resources like favicon
    const realErrors = consoleErrors.filter(e => 
      !e.includes('Executing SQL') && 
      !e.includes('Failed to load resource') &&
      !e.includes('404')
    );
    expect(realErrors).toHaveLength(0);
  });
});
