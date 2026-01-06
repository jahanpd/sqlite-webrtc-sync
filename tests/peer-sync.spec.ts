import { test, expect, BrowserContext, Page } from '@playwright/test';

// Helper to wait for page to be ready
async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForFunction(() => (window as any).pageReady === true, { timeout: 10000 });
}

// Helper to create a page in an existing context
async function createPeerPageInContext(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  
  // Log console messages for debugging
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

// Helper to create a fresh browser context and page
async function createPeerPage(browser: any): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  const page = await createPeerPageInContext(context);
  return { context, page };
}

// Generate unique database name
function uniqueDbName(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

test.describe('Peer Syncing', () => {
  // Increase timeout for peer tests since WebRTC can be slow
  test.setTimeout(60000);

  test('Test 1: Create syncing database and get peer ID', async ({ browser }) => {
    const { context, page } = await createPeerPage(browser);
    
    try {
      const dbName = uniqueDbName('sync-test-1');
      
      // Create a syncing database
      const result = await page.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbName);
      
      // Verify we got a peer ID
      expect(result.peerId).toBeTruthy();
      expect(typeof result.peerId).toBe('string');
      expect(result.peerId.length).toBeGreaterThan(0);
      
      // Verify getPeerId returns the same ID
      const peerId = await page.evaluate((name) => {
        return (window as any).getPeerId(name);
      }, dbName);
      
      expect(peerId).toBe(result.peerId);
      
      // Cleanup
      await page.evaluate((name) => (window as any).closeDb(name), dbName);
    } finally {
      await context.close();
    }
  });

  test('Test 2: Connect two peers', async ({ browser }) => {
    // Use a single context with two pages for better WebRTC connectivity
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const dbNameA = uniqueDbName('peer-a');
      const dbNameB = uniqueDbName('peer-b');
      
      // Create databases on both pages
      const resultA = await pageA.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbNameA);
      
      const resultB = await pageB.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbNameB);
      
      expect(resultA.peerId).toBeTruthy();
      expect(resultB.peerId).toBeTruthy();
      
      // Give PeerJS time to register with the signaling server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Connect B to A
      await pageB.evaluate(async ({ dbName, remotePeerId }) => {
        return await (window as any).connectToPeer(dbName, remotePeerId);
      }, { dbName: dbNameB, remotePeerId: resultA.peerId });
      
      // Wait for connection to be established on both sides
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify B sees A as connected
      const peersB = await pageB.evaluate((name) => {
        return (window as any).getConnectedPeers(name);
      }, dbNameB);
      
      expect(peersB.length).toBe(1);
      expect(peersB[0].id).toBe(resultA.peerId);
      expect(peersB[0].status).toBe('connected');
      
      // Verify A sees B as connected
      const peersA = await pageA.evaluate((name) => {
        return (window as any).getConnectedPeers(name);
      }, dbNameA);
      
      expect(peersA.length).toBe(1);
      expect(peersA[0].id).toBe(resultB.peerId);
      expect(peersA[0].status).toBe('connected');
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), dbNameA);
      await pageB.evaluate((name) => (window as any).closeDb(name), dbNameB);
    } finally {
      await context.close();
    }
  });

  test('Test 3: Sync data from peer A to peer B', async ({ browser }) => {
    // Use a single context with two pages for better WebRTC connectivity
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const dbNameA = uniqueDbName('sync-a');
      const dbNameB = uniqueDbName('sync-b');
      
      // Create databases
      const resultA = await pageA.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbNameA);
      
      await pageB.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbNameB);
      
      // Insert data into A
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE items (name TEXT, value INTEGER)');
        await (window as any).execSql(name, "INSERT INTO items (name, value) VALUES ('from-peer-a', 42)");
      }, dbNameA);
      
      // Verify A has the data
      const dataA = await pageA.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items');
      }, dbNameA);
      
      expect(dataA.rows.length).toBe(1);
      expect((dataA.rows[0] as any).name).toBe('from-peer-a');
      
      // Give PeerJS time to register
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Connect B to A
      await pageB.evaluate(async ({ dbName, remotePeerId }) => {
        return await (window as any).connectToPeer(dbName, remotePeerId);
      }, { dbName: dbNameB, remotePeerId: resultA.peerId });
      
      // Wait for connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // B requests export from A (pulls A's data)
      await pageB.evaluate(async ({ dbName, peerId }) => {
        return await (window as any).exportToPeer(dbName, peerId);
      }, { dbName: dbNameB, peerId: resultA.peerId });
      
      // Wait for sync to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify B now has A's data
      const dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items');
      }, dbNameB);
      
      expect(dataB.rows.length).toBe(1);
      expect((dataB.rows[0] as any).name).toBe('from-peer-a');
      expect((dataB.rows[0] as any).value).toBe(42);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), dbNameA);
      await pageB.evaluate((name) => (window as any).closeDb(name), dbNameB);
    } finally {
      await context.close();
    }
  });

  test('Test 4: Bidirectional sync', async ({ browser }) => {
    // Use a single context with two pages for better WebRTC connectivity
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const dbNameA = uniqueDbName('bidir-a');
      const dbNameB = uniqueDbName('bidir-b');
      
      // Create databases
      const resultA = await pageA.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbNameA);
      
      const resultB = await pageB.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbNameB);
      
      // Insert different data into each database
      await pageA.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE items (name TEXT)');
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('item-from-a')");
      }, dbNameA);
      
      await pageB.evaluate(async (name) => {
        await (window as any).execSql(name, 'CREATE TABLE items (name TEXT)');
        await (window as any).execSql(name, "INSERT INTO items (name) VALUES ('item-from-b')");
      }, dbNameB);
      
      // Give PeerJS time to register
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Connect B to A
      await pageB.evaluate(async ({ dbName, remotePeerId }) => {
        return await (window as any).connectToPeer(dbName, remotePeerId);
      }, { dbName: dbNameB, remotePeerId: resultA.peerId });
      
      // Wait for connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // B pulls from A
      await pageB.evaluate(async ({ dbName, peerId }) => {
        return await (window as any).exportToPeer(dbName, peerId);
      }, { dbName: dbNameB, peerId: resultA.peerId });
      
      // A pulls from B
      await pageA.evaluate(async ({ dbName, peerId }) => {
        return await (window as any).exportToPeer(dbName, peerId);
      }, { dbName: dbNameA, peerId: resultB.peerId });
      
      // Wait for sync to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify both have all data
      const dataA = await pageA.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, dbNameA);
      
      const dataB = await pageB.evaluate(async (name) => {
        return await (window as any).execSql(name, 'SELECT * FROM items ORDER BY name');
      }, dbNameB);
      
      expect(dataA.rows.length).toBe(2);
      expect(dataB.rows.length).toBe(2);
      
      const namesA = dataA.rows.map((r: any) => r.name).sort();
      const namesB = dataB.rows.map((r: any) => r.name).sort();
      
      expect(namesA).toEqual(['item-from-a', 'item-from-b']);
      expect(namesB).toEqual(['item-from-a', 'item-from-b']);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), dbNameA);
      await pageB.evaluate((name) => (window as any).closeDb(name), dbNameB);
    } finally {
      await context.close();
    }
  });

  test('Test 5: Disconnect from peer', async ({ browser }) => {
    // Use a single context with two pages for better WebRTC connectivity
    const context = await browser.newContext();
    const pageA = await createPeerPageInContext(context);
    const pageB = await createPeerPageInContext(context);
    
    try {
      const dbNameA = uniqueDbName('disconnect-a');
      const dbNameB = uniqueDbName('disconnect-b');
      
      // Create databases
      const resultA = await pageA.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbNameA);
      
      await pageB.evaluate(async (name) => {
        return await (window as any).createSyncingDb(name);
      }, dbNameB);
      
      // Give PeerJS time to register
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Connect B to A
      await pageB.evaluate(async ({ dbName, remotePeerId }) => {
        return await (window as any).connectToPeer(dbName, remotePeerId);
      }, { dbName: dbNameB, remotePeerId: resultA.peerId });
      
      // Wait for connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify B is connected
      let peersB = await pageB.evaluate((name) => {
        return (window as any).getConnectedPeers(name);
      }, dbNameB);
      
      expect(peersB.length).toBe(1);
      
      // Disconnect B from A
      await pageB.evaluate(async ({ dbName, peerId }) => {
        return await (window as any).disconnectFromPeer(dbName, peerId);
      }, { dbName: dbNameB, peerId: resultA.peerId });
      
      // Verify B has no connected peers
      peersB = await pageB.evaluate((name) => {
        return (window as any).getConnectedPeers(name);
      }, dbNameB);
      
      expect(peersB.length).toBe(0);
      
      // Cleanup
      await pageA.evaluate((name) => (window as any).closeDb(name), dbNameA);
      await pageB.evaluate((name) => (window as any).closeDb(name), dbNameB);
    } finally {
      await context.close();
    }
  });

  test('Test 6: Local mode cannot connect to peers', async ({ browser }) => {
    const { context, page } = await createPeerPage(browser);
    
    try {
      const dbName = uniqueDbName('local-test');
      
      // Create a LOCAL database (not syncing)
      await page.evaluate(async (name) => {
        return await (window as any).createLocalDb(name);
      }, dbName);
      
      // Try to connect to a peer - should fail
      const error = await page.evaluate(async (name) => {
        try {
          await (window as any).connectToPeer(name, 'some-peer-id');
          return null;
        } catch (e) {
          return (e as Error).message;
        }
      }, dbName);
      
      expect(error).toBe('Cannot connect to peers in local mode');
      
      // Cleanup
      await page.evaluate((name) => (window as any).closeDb(name), dbName);
    } finally {
      await context.close();
    }
  });
});
