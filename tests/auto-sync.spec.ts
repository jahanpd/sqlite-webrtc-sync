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
      
      // Create databases with callbacks registered immediately (before peer connection)
      // This ensures we don't miss the peerConnected event
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name, null, true);  // true = register callbacks
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name, null, true);  // true = register callbacks
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

  test('Test 10: Full sync lifecycle - connect, sync, disconnect, queue, reconnect, verify', async ({ browser }) => {
    // Use two separate browser contexts to simulate different browsers/devices
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await createPeerPageInContext(contextA);
    const pageB = await createPeerPageInContext(contextB);
    
    try {
      const sharedDbName = uniqueDbName('full-lifecycle');
      
      // === PHASE 1: Create databases with same name ===
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT, value INTEGER)');
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        (window as any).registerSyncCallback(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT, value INTEGER)');
      }, sharedDbName);
      
      // === PHASE 2: Wait for auto-discovery and verify connection ===
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      const isConnectedA = await pageA.evaluate((name) => (window as any).isConnected(name), sharedDbName);
      const isConnectedB = await pageB.evaluate((name) => (window as any).isConnected(name), sharedDbName);
      expect(isConnectedA).toBe(true);
      expect(isConnectedB).toBe(true);
      
      // === PHASE 3: Live sync - Insert on A, verify on B ===
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('item-1', 100)");
      }, sharedDbName);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      expect(dataB.rows.length).toBe(1);
      expect((dataB.rows[0] as any).name).toBe('item-1');
      
      // === PHASE 4: Live sync - Insert on B, verify on A ===
      await pageB.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('item-2', 200)");
      }, sharedDbName);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let dataA = await pageA.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      expect(dataA.rows.length).toBe(2);
      
      // === PHASE 5: Disconnect B from A ===
      const peerIdA = await pageA.evaluate((name) => (window as any).getPeerId(name), sharedDbName);
      
      await pageB.evaluate(async ({ dbName, peerId }) => {
        await (window as any).disconnectFromPeer(dbName, peerId);
      }, { dbName: sharedDbName, peerId: peerIdA });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify disconnected
      const isConnectedAfterDisconnect = await pageB.evaluate((name) => (window as any).isConnected(name), sharedDbName);
      expect(isConnectedAfterDisconnect).toBe(false);
      
      // === PHASE 6: Make changes on both sides while disconnected ===
      // Insert on A (should queue since B disconnected, but A might still have B in its list)
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('item-3-from-a', 300)");
      }, sharedDbName);
      
      // Insert on B (will definitely queue since B has no peers)
      await pageB.evaluate(async (name) => {
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('item-4-from-b', 400)");
      }, sharedDbName);
      
      // Check B has queued operations
      const queueB = await pageB.evaluate((name) => (window as any).getQueuedOperations(name), sharedDbName);
      expect(queueB.length).toBeGreaterThanOrEqual(1);
      
      // === PHASE 7: Reconnect B to A ===
      await pageB.evaluate(async ({ dbName, peerId }) => {
        await (window as any).connectToPeer(dbName, peerId);
      }, { dbName: sharedDbName, peerId: peerIdA });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify reconnected
      const isReconnected = await pageB.evaluate((name) => (window as any).isConnected(name), sharedDbName);
      expect(isReconnected).toBe(true);
      
      // === PHASE 8: Push queued operations from B ===
      await pageB.evaluate(async (name) => {
        await (window as any).pushQueuedOperations(name);
      }, sharedDbName);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify B's queue is empty
      const queueAfterPush = await pageB.evaluate((name) => (window as any).getQueuedOperations(name), sharedDbName);
      expect(queueAfterPush.length).toBe(0);
      
      // === PHASE 9: Pull A's data to B to get item-3-from-a ===
      // (A's insert while "disconnected" may have gone to a stale connection)
      await pageB.evaluate(async ({ dbName, peerId }) => {
        await (window as any).exportToPeer(dbName, peerId);
      }, { dbName: sharedDbName, peerId: peerIdA });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // === PHASE 10: Verify both databases have all items ===
      dataA = await pageA.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      // Both should have all 4 items
      expect(dataA.rows.length).toBe(4);
      expect(dataB.rows.length).toBe(4);
      
      // Verify the data matches
      const namesA = dataA.rows.map((r: any) => r.name).sort();
      const namesB = dataB.rows.map((r: any) => r.name).sort();
      
      expect(namesA).toEqual(['item-1', 'item-2', 'item-3-from-a', 'item-4-from-b']);
      expect(namesB).toEqual(['item-1', 'item-2', 'item-3-from-a', 'item-4-from-b']);
      
      // Verify values match too
      const valuesA = dataA.rows.map((r: any) => r.value).sort((a: number, b: number) => a - b);
      const valuesB = dataB.rows.map((r: any) => r.value).sort((a: number, b: number) => a - b);
      
      expect(valuesA).toEqual([100, 200, 300, 400]);
      expect(valuesB).toEqual([100, 200, 300, 400]);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await contextA.close();
      await contextB.close();
    }
  });

  test('Test 11: Merge sync preserves data from both peers', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await createPeerPageInContext(contextA);
    const pageB = await createPeerPageInContext(contextB);
    
    try {
      const sharedDbName = uniqueDbName('merge-sync');
      
      // === PHASE 1: Create databases with different initial data ===
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT, value INTEGER)');
        // Insert data only on A
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('only-on-a', 100)");
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('shared-item', 50)");
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT, value INTEGER)');
        // Insert different data only on B
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('only-on-b', 200)");
      }, sharedDbName);
      
      // === PHASE 2: Wait for auto-discovery ===
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Verify connected
      const isConnected = await pageA.evaluate((name) => (window as any).isConnected(name), sharedDbName);
      expect(isConnected).toBe(true);
      
      // Get peer IDs
      const peerIdB = await pageB.evaluate((name) => (window as any).getPeerId(name), sharedDbName);
      
      // === PHASE 3: Use syncWithPeer for bidirectional merge ===
      await pageA.evaluate(async ({ dbName, peerId }) => {
        await (window as any).syncWithPeer(dbName, peerId);
      }, { dbName: sharedDbName, peerId: peerIdB });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // === PHASE 4: Verify both databases have all data (merged, not overwritten) ===
      const dataA = await pageA.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      const dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      // Both should have all 3 items
      expect(dataA.rows.length).toBe(3);
      expect(dataB.rows.length).toBe(3);
      
      const namesA = dataA.rows.map((r: any) => r.name).sort();
      const namesB = dataB.rows.map((r: any) => r.name).sort();
      
      expect(namesA).toEqual(['only-on-a', 'only-on-b', 'shared-item']);
      expect(namesB).toEqual(['only-on-a', 'only-on-b', 'shared-item']);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await contextA.close();
      await contextB.close();
    }
  });

  test('Test 12: syncWithAllPeers syncs with multiple peers', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const contextC = await browser.newContext();
    const pageA = await createPeerPageInContext(contextA);
    const pageB = await createPeerPageInContext(contextB);
    const pageC = await createPeerPageInContext(contextC);
    
    try {
      const sharedDbName = uniqueDbName('multi-merge');
      
      // === PHASE 1: Create databases with different initial data ===
      await pageA.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('from-a')");
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('from-b')");
      }, sharedDbName);
      
      await pageC.evaluate(async (name) => {
        await (window as any).createSyncingDb(name);
        await (window as any).execSql(name, 'CREATE TABLE IF NOT EXISTS items (name TEXT)');
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('from-c')");
      }, sharedDbName);
      
      // === PHASE 2: Wait for auto-discovery ===
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Verify A is connected to at least one peer
      const peersA = await pageA.evaluate((name) => (window as any).getConnectedPeers(name), sharedDbName);
      expect(peersA.length).toBeGreaterThanOrEqual(1);
      
      // === PHASE 3: Use syncWithAllPeers from A ===
      await pageA.evaluate(async (name) => {
        await (window as any).syncWithAllPeers(name);
      }, sharedDbName);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // === PHASE 4: Sync B and C with all their peers too ===
      await pageB.evaluate(async (name) => {
        await (window as any).syncWithAllPeers(name);
      }, sharedDbName);
      
      await pageC.evaluate(async (name) => {
        await (window as any).syncWithAllPeers(name);
      }, sharedDbName);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // === PHASE 5: Verify all databases have all data ===
      const dataA = await pageA.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      const dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      const dataC = await pageC.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, sharedDbName);
      
      // All should have all 3 items
      expect(dataA.rows.length).toBe(3);
      expect(dataB.rows.length).toBe(3);
      expect(dataC.rows.length).toBe(3);
      
      const namesA = dataA.rows.map((r: any) => r.name).sort();
      const namesB = dataB.rows.map((r: any) => r.name).sort();
      const namesC = dataC.rows.map((r: any) => r.name).sort();
      
      expect(namesA).toEqual(['from-a', 'from-b', 'from-c']);
      expect(namesB).toEqual(['from-a', 'from-b', 'from-c']);
      expect(namesC).toEqual(['from-a', 'from-b', 'from-c']);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageB.evaluate((name) => (window as any).closeDb(name), sharedDbName);
      await pageC.evaluate((name) => (window as any).closeDb(name), sharedDbName);
    } finally {
      await contextA.close();
      await contextB.close();
      await contextC.close();
    }
  });

  test('Test 13: React components re-render on live sync from peer', async ({ browser }) => {
    // Helper to create a React peer page
    async function createReactPeerPage(context: BrowserContext): Promise<Page> {
      const page = await context.newPage();
      
      page.on('console', (msg: { type: () => string; text: () => string }) => {
        const text = msg.text();
        if (msg.type() === 'error' && !text.includes('404') && !text.includes('Failed to load')) {
          console.log(`[React Page Error] ${text}`);
        }
      });
      
      page.on('pageerror', (error: Error) => {
        console.log(`[React Page Error] ${error.message}`);
      });
      
      await page.goto('/react-peer-sync-test.html');
      await page.waitForFunction(() => (window as any).pageReady === true, { timeout: 10000 });
      
      return page;
    }
    
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await createReactPeerPage(contextA);
    const pageB = await createReactPeerPage(contextB);
    
    try {
      const sharedDbName = uniqueDbName('react-sync');
      
      // === PHASE 1: Create databases with React on both sides ===
      await pageA.evaluate(async (name) => {
        await (window as any).createDb(name);
      }, sharedDbName);
      
      await pageB.evaluate(async (name) => {
        await (window as any).createDb(name);
      }, sharedDbName);
      
      // === PHASE 2: Wait for auto-discovery ===
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Verify connected
      const isConnectedA = await pageA.evaluate(() => (window as any).isConnected());
      const isConnectedB = await pageB.evaluate(() => (window as any).isConnected());
      expect(isConnectedA).toBe(true);
      expect(isConnectedB).toBe(true);
      
      // === PHASE 3: Verify B's React shows 0 items initially ===
      const countBefore = await pageB.evaluate(() => (window as any).getItemCount());
      expect(countBefore).toBe(0);
      
      // === PHASE 4: Insert on A ===
      await pageA.evaluate(async () => {
        await (window as any).insertItem('test-item-1', 42);
      });
      
      // Small delay for sync to propagate
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify A has the data
      const directDataA = await pageA.evaluate(async () => {
        const result = await (window as any).dbInstance.exec('SELECT * FROM items');
        return result.rows;
      });
      expect(directDataA.length).toBe(1);
      
      // Verify B received the data directly (bypassing React)
      const directDataB = await pageB.evaluate(async () => {
        const result = await (window as any).dbInstance.exec('SELECT * FROM items');
        return result.rows;
      });
      expect(directDataB.length).toBe(1);
      
      // === PHASE 5: Wait for B's React to update via live sync ===
      // The sync-operation should trigger onSyncReceived -> invalidateTables -> re-render
      await pageB.evaluate(async () => {
        await (window as any).waitForItemCount(1, 10000);
      });
      
      // Verify B shows 1 item
      const countAfterFirst = await pageB.evaluate(() => (window as any).getItemCount());
      expect(countAfterFirst).toBe(1);
      
      // === PHASE 6: Insert another item on A ===
      await pageA.evaluate(async () => {
        await (window as any).insertItem('test-item-2', 99);
      });
      
      // Wait for B to update
      await pageB.evaluate(async () => {
        await (window as any).waitForItemCount(2, 10000);
      });
      
      const countAfterSecond = await pageB.evaluate(() => (window as any).getItemCount());
      expect(countAfterSecond).toBe(2);
      
      // === PHASE 7: UPDATE on A, verify B's React shows new value ===
      await pageA.evaluate(async () => {
        await (window as any).updateItem('test-item-1', 999);
      });
      
      // Wait for B to receive the updated value
      await pageB.evaluate(async () => {
        await (window as any).waitForItemValue('test-item-1', 999, 10000);
      });
      
      // Verify B has the updated value
      const updatedValueOnB = await pageB.evaluate(async () => {
        return await (window as any).getItemValue('test-item-1');
      });
      expect(updatedValueOnB).toBe(999);
      
      // Verify B still shows 2 items (count unchanged, just value updated)
      const countAfterUpdate = await pageB.evaluate(() => (window as any).getItemCount());
      expect(countAfterUpdate).toBe(2);
      
      // === PHASE 8: Insert on B, verify A updates ===
      await pageB.evaluate(async () => {
        await (window as any).insertItem('from-b', 123);
      });
      
      // Wait for A to update
      await pageA.evaluate(async () => {
        await (window as any).waitForItemCount(3, 10000);
      });
      
      const countOnA = await pageA.evaluate(() => (window as any).getItemCount());
      expect(countOnA).toBe(3);
      
      // === PHASE 9: DELETE on A, verify B's React shows one fewer item ===
      await pageA.evaluate(async () => {
        await (window as any).deleteItem('test-item-2');
      });
      
      // Wait for B to show exactly 2 items (was 3, deleted 1)
      await pageB.evaluate(async () => {
        await (window as any).waitForItemCountExact(2, 10000);
      });
      
      const countAfterDelete = await pageB.evaluate(() => (window as any).getItemCount());
      expect(countAfterDelete).toBe(2);
      
      // Verify the deleted item is gone on B
      const deletedItemValue = await pageB.evaluate(async () => {
        return await (window as any).getItemValue('test-item-2');
      });
      expect(deletedItemValue).toBeNull();
      
      // === PHASE 10: UPDATE on B, verify A's React shows new value ===
      await pageB.evaluate(async () => {
        await (window as any).updateItem('from-b', 456);
      });
      
      // Wait for A to receive the updated value
      await pageA.evaluate(async () => {
        await (window as any).waitForItemValue('from-b', 456, 10000);
      });
      
      // Verify A has the updated value
      const updatedValueOnA = await pageA.evaluate(async () => {
        return await (window as any).getItemValue('from-b');
      });
      expect(updatedValueOnA).toBe(456);
      
      // Cleanup
      await pageA.evaluate(() => (window as any).closeDb());
      await pageB.evaluate(() => (window as any).closeDb());
    } finally {
      await contextA.close();
      await contextB.close();
    }
  });
});
