import { test, expect, BrowserContext, Page } from '@playwright/test';

// Helper to wait for page to be ready
async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForFunction(() => (window as any).pageReady === true, { timeout: 10000 });
}

// Helper to create a page in an existing context
async function createPeerPageInContext(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  
  page.on('console', (msg: { type: () => string; text: () => string }) => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('404')) {
      console.log(`[Page Error] ${text}`);
    }
  });
  
  page.on('pageerror', (error: Error) => {
    console.log(`[Page Error] ${error.message}`);
  });
  
  await page.goto('/peer-test.html');
  await waitForPageReady(page);
  
  return page;
}

// Generate unique database name with a common prefix for auto-discovery
function uniqueDbName(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

test.describe('Auto-Discovery and Real-time Sync', () => {
  test.setTimeout(90000);

  test('Test 1: Auto-discovery - Two peers with same DB name find each other', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      // Use same database name for both - this enables auto-discovery
      const sharedDbName = uniqueDbName('autodiscover');
      
      // Create databases on both pages with the same name
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      // Wait for auto-discovery (discovery interval is 5 seconds, wait a bit longer)
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Both should have discovered and connected to each other
      const peersA = await pageA.evaluate((name) => {
        return (window as any).getConnectedPeers(name);
      }, sharedDbName);
      
      const peersB = await pageB.evaluate((name) => {
        return (window as any).getConnectedPeers(name);
      }, sharedDbName);
      
      // Each should see the other as connected
      expect(peersA.length).toBeGreaterThanOrEqual(1);
      expect(peersB.length).toBeGreaterThanOrEqual(1);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await context.close();
    }
  });

  test('Test 2: Real-time sync - INSERT on A appears on B automatically', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const sharedDbName = uniqueDbName('realtime-insert');
      
      // Create databases and register callbacks
      const resultA = await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
        return (window as any).getPeerId(name);
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      // Create same table on both (needed for sync to work)
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT, value INTEGER)');
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT, value INTEGER)');
      }, sharedDbName);
      
      // Wait for auto-discovery
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Verify connected
      const isConnected = await pageA.evaluate((name) => {
        return (window as any).isConnected(name);
      }, sharedDbName);
      expect(isConnected).toBe(true);
      
      // Insert data on A
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('from-a', 42)");
      }, sharedDbName);
      
      // Wait for sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check that B received the sync event
      const eventsB = await pageB.evaluate((name) => {
        return (window as any).getSyncEvents(name);
      }, sharedDbName);
      
      expect(eventsB.syncReceived.length).toBeGreaterThanOrEqual(1);
      
      // Verify B has the data
      const dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items');
      }, sharedDbName);
      
      expect(dataB.rows.length).toBe(1);
      expect((dataB.rows[0] as any).name).toBe('from-a');
      expect((dataB.rows[0] as any).value).toBe(42);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await context.close();
    }
  });

  test('Test 3: Real-time sync - UPDATE on A appears on B', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const sharedDbName = uniqueDbName('realtime-update');
      
      // Create databases
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      // Create same table on both
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT, value INTEGER)');
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT, value INTEGER)');
      }, sharedDbName);
      
      // Wait for auto-discovery
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Insert data on A - this will sync to B
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('test', 1)");
      }, sharedDbName);
      
      // Wait for sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Now UPDATE on A
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, "UPDATE items SET value = 99 WHERE name = 'test'");
      }, sharedDbName);
      
      // Wait for sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify B has the updated value
      const dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items');
      }, sharedDbName);
      
      expect(dataB.rows.length).toBe(1);
      expect((dataB.rows[0] as any).value).toBe(99);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await context.close();
    }
  });

  test('Test 4: Real-time sync - DELETE on A appears on B', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const sharedDbName = uniqueDbName('realtime-delete');
      
      // Create databases
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      // Create same table on both
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
      }, sharedDbName);
      
      // Wait for auto-discovery
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Insert data on A
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('to-delete')");
      }, sharedDbName);
      
      // Wait for sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify B has the row
      let dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items');
      }, sharedDbName);
      expect(dataB.rows.length).toBe(1);
      
      // Delete on A
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, "DELETE FROM items WHERE name = 'to-delete'");
      }, sharedDbName);
      
      // Wait for sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify B shows no rows (soft delete)
      dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items');
      }, sharedDbName);
      expect(dataB.rows.length).toBe(0);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await context.close();
    }
  });

  test('Test 5: Bidirectional real-time sync', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const sharedDbName = uniqueDbName('realtime-bidir');
      
      // Create databases
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      // Create same table on both
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
      }, sharedDbName);
      
      // Wait for auto-discovery
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Both insert data
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('from-a')");
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('from-b')");
      }, sharedDbName);
      
      // Wait for sync
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Both should have both items
      const dataA = await pageA.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      const dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      expect(dataA.rows.length).toBe(2);
      expect(dataB.rows.length).toBe(2);
      
      const namesA = dataA.rows.map((r: any) => r.name).sort();
      const namesB = dataB.rows.map((r: any) => r.name).sort();
      
      expect(namesA).toEqual(['from-a', 'from-b']);
      expect(namesB).toEqual(['from-a', 'from-b']);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await context.close();
    }
  });

  test('Test 6: Offline queue - Operations queued when no peers', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    
    try {
      // Use a unique name that won't match any other peers
      const uniqueName = uniqueDbName('offline-queue-solo');
      
      // Create database (no other peers will have this name)
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
      }, uniqueName);
      
      // Create table and insert while "offline" (no peers)
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('queued-item')");
      }, uniqueName);
      
      // Check that operation was queued
      const queue = await pageA.evaluate((name) => {
        return (window as any).getQueuedOperations(name);
      }, uniqueName);
      
      expect(queue.length).toBeGreaterThanOrEqual(1);
      expect(queue[0].table).toBe('items');
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), uniqueName);
    } finally {
      await context.close();
    }
  });

  test('Test 7: Push queued operations on reconnect', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      // Create A first with unique name
      const sharedDbName = uniqueDbName('push-queue');
      
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
        // Insert while no peers connected - this will queue
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('queued-from-a')");
      }, sharedDbName);
      
      // Verify A has queued operations
      const queueBefore = await pageA.evaluate((name) => {
        return (window as any).getQueuedOperations(name);
      }, sharedDbName);
      expect(queueBefore.length).toBeGreaterThanOrEqual(1);
      
      // Now create B with same name - will auto-discover A
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
      }, sharedDbName);
      
      // Wait for auto-discovery
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Push queued operations from A
      await pageA.evaluate(async (name) => {
        await (window as any).pushQueuedOperations(name);
      }, sharedDbName);
      
      // Wait for sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify A's queue is now empty
      const queueAfter = await pageA.evaluate((name) => {
        return (window as any).getQueuedOperations(name);
      }, sharedDbName);
      expect(queueAfter.length).toBe(0);
      
      // Verify B received the data
      const dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items');
      }, sharedDbName);
      expect(dataB.rows.length).toBe(1);
      expect((dataB.rows[0] as any).name).toBe('queued-from-a');
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await context.close();
    }
  });

  test('Test 8: Different DB names do not discover each other', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      // Use DIFFERENT database names
      const dbNameA = uniqueDbName('isolated-a');
      const dbNameB = uniqueDbName('isolated-b');
      
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
      }, dbNameA);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
      }, dbNameB);
      
      // Wait for discovery attempts
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Neither should have discovered the other
      const peersA = await pageA.evaluate((name) => {
        return (window as any).getConnectedPeers(name);
      }, dbNameA);
      
      const peersB = await pageB.evaluate((name) => {
        return (window as any).getConnectedPeers(name);
      }, dbNameB);
      
      expect(peersA.length).toBe(0);
      expect(peersB.length).toBe(0);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), dbNameA);
      await pageB.evaluate((name) => (window as any).closeDb(name), dbNameB);
    } finally {
      await context.close();
    }
  });

  test('Test 9: Event callbacks fire correctly', async ({ browser }) => {
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const sharedDbName = uniqueDbName('events-test');
      
      // Create databases and register callbacks
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
      }, sharedDbName);
      
      // Wait for auto-discovery
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Check that peerConnected events fired
      const eventsA = await pageA.evaluate((name) => {
        return (window as any).getSyncEvents(name);
      }, sharedDbName);
      
      const eventsB = await pageB.evaluate((name) => {
        return (window as any).getSyncEvents(name);
      }, sharedDbName);
      
      expect(eventsA.peerConnected.length).toBeGreaterThanOrEqual(1);
      expect(eventsB.peerConnected.length).toBeGreaterThanOrEqual(1);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await context.close();
    }
  });
});
