import { createDatabase } from 'syncable-sqlite';

const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

let passed = 0;
let failed = 0;
const errors = [];

function log(msg, type = 'log') {
  const div = document.createElement('div');
  div.className = type;
  div.textContent = msg;
  resultsEl.appendChild(div);
  console.log(`[${type}]`, msg);
}

function updateStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = type;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function runTest(name, testFn) {
  log(`\nTest: ${name}`, 'test-name');
  try {
    await testFn();
    log('  PASS', 'pass');
    passed++;
    return true;
  } catch (error) {
    log(`  FAIL: ${error.message}`, 'fail');
    console.error(error);
    errors.push({ name, error: error.message });
    failed++;
    return false;
  }
}

async function runTests() {
  log('Starting Vite Integration Tests...', 'info');
  log(`Running in: ${import.meta.env.MODE} mode`, 'info');
  log('');

  // Test 1: WASM Loading - Create database successfully
  await runTest('WASM Loading - Database creation', async () => {
    const db = await createDatabase('vite-test-wasm-' + Date.now(), { mode: 'local' });
    assert(db !== null, 'Database should be created');
    await db.close();
  });

  // Test 2: Worker Initialization - Verify worker communicates properly
  await runTest('Worker Initialization - Basic query', async () => {
    const db = await createDatabase('vite-test-worker-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE test (id TEXT PRIMARY KEY, value TEXT)');
    const result = await db.exec('SELECT 1 as num');
    assert(result.rows.length === 1, 'Should return one row');
    await db.close();
  });

  // Test 3: CREATE TABLE with auto-generated columns
  await runTest('CREATE TABLE with auto-generated columns', async () => {
    const db = await createDatabase('vite-test-create-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE items (name TEXT, value INTEGER)');
    await db.exec("INSERT INTO items (name, value) VALUES ('test', 42)");
    const result = await db.exec('SELECT * FROM items');
    assert(result.rows.length === 1, 'Should have 1 row');
    const row = result.rows[0];
    assert(row.id !== undefined, 'Should have auto-generated id');
    assert(row.updated_at !== undefined, 'Should have auto-generated updated_at');
    assert(row.deleted === 0, 'Should have deleted = 0');
    assert(row.name === 'test', 'Name should be test');
    assert(row.value === 42, 'Value should be 42');
    await db.close();
  });

  // Test 4: INSERT operation
  await runTest('INSERT operation', async () => {
    const db = await createDatabase('vite-test-insert-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE users (name TEXT, email TEXT)');
    const result = await db.exec("INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com')");
    assert(result.affectedRows.length === 1, 'Should affect 1 row');
    const selectResult = await db.exec('SELECT * FROM users');
    assert(selectResult.rows.length === 1, 'Should have 1 row');
    assert(selectResult.rows[0].name === 'Alice', 'Name should be Alice');
    await db.close();
  });

  // Test 5: SELECT operation
  await runTest('SELECT operation', async () => {
    const db = await createDatabase('vite-test-select-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE products (name TEXT, price INTEGER)');
    await db.exec("INSERT INTO products (name, price) VALUES ('Apple', 100)");
    await db.exec("INSERT INTO products (name, price) VALUES ('Banana', 50)");
    await db.exec("INSERT INTO products (name, price) VALUES ('Cherry', 200)");
    
    const allResult = await db.exec('SELECT * FROM products ORDER BY price');
    assert(allResult.rows.length === 3, 'Should have 3 rows');
    assert(allResult.rows[0].name === 'Banana', 'First should be Banana (lowest price)');
    
    const filteredResult = await db.exec('SELECT * FROM products WHERE price > 75');
    assert(filteredResult.rows.length === 2, 'Should have 2 rows with price > 75');
    await db.close();
  });

  // Test 6: UPDATE operation with timestamp
  await runTest('UPDATE operation with auto-updating timestamp', async () => {
    const db = await createDatabase('vite-test-update-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE items (name TEXT, value INTEGER)');
    await db.exec("INSERT INTO items (name, value) VALUES ('item1', 1)");
    
    const beforeResult = await db.exec('SELECT * FROM items');
    const beforeTimestamp = beforeResult.rows[0].updated_at;
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.exec("UPDATE items SET value = 99 WHERE name = 'item1'");
    
    const afterResult = await db.exec('SELECT * FROM items');
    const afterTimestamp = afterResult.rows[0].updated_at;
    
    assert(afterResult.rows[0].value === 99, 'Value should be updated to 99');
    assert(afterTimestamp > beforeTimestamp, 'Timestamp should increase after update');
    await db.close();
  });

  // Test 7: DELETE as soft delete
  await runTest('DELETE as soft delete', async () => {
    const db = await createDatabase('vite-test-delete-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE items (name TEXT)');
    await db.exec("INSERT INTO items (name) VALUES ('to-delete')");
    await db.exec("INSERT INTO items (name) VALUES ('to-keep')");
    
    let result = await db.exec('SELECT * FROM items');
    assert(result.rows.length === 2, 'Should have 2 rows before delete');
    
    await db.exec("DELETE FROM items WHERE name = 'to-delete'");
    
    result = await db.exec('SELECT * FROM items');
    assert(result.rows.length === 1, 'Should have 1 row after delete');
    assert(result.rows[0].name === 'to-keep', 'Remaining row should be to-keep');
    await db.close();
  });

  // Test 8: Export database
  await runTest('Export database', async () => {
    const db = await createDatabase('vite-test-export-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE data (content TEXT)');
    await db.exec("INSERT INTO data (content) VALUES ('exported content')");
    
    const exported = await db.export();
    assert(exported instanceof Uint8Array, 'Export should return Uint8Array');
    assert(exported.length > 0, 'Exported data should not be empty');
    await db.close();
  });

  // Test 9: Import database
  await runTest('Import database', async () => {
    const dbSource = await createDatabase('vite-test-import-src-' + Date.now(), { mode: 'local' });
    await dbSource.exec('CREATE TABLE data (content TEXT)');
    await dbSource.exec("INSERT INTO data (content) VALUES ('imported content')");
    const exported = await dbSource.export();
    await dbSource.close();
    
    const dbTarget = await createDatabase('vite-test-import-tgt-' + Date.now(), { mode: 'local' });
    await dbTarget.import(exported);
    const result = await dbTarget.exec('SELECT * FROM data');
    assert(result.rows.length === 1, 'Should have 1 row after import');
    assert(result.rows[0].content === 'imported content', 'Content should match');
    await dbTarget.close();
  });

  // Test 10: Multiple databases simultaneously
  await runTest('Multiple databases simultaneously', async () => {
    const timestamp = Date.now();
    const db1 = await createDatabase('vite-multi-1-' + timestamp, { mode: 'local' });
    const db2 = await createDatabase('vite-multi-2-' + timestamp, { mode: 'local' });
    const db3 = await createDatabase('vite-multi-3-' + timestamp, { mode: 'local' });
    
    await db1.exec('CREATE TABLE t1 (data TEXT)');
    await db2.exec('CREATE TABLE t2 (data TEXT)');
    await db3.exec('CREATE TABLE t3 (data TEXT)');
    
    await db1.exec("INSERT INTO t1 (data) VALUES ('from-db1')");
    await db2.exec("INSERT INTO t2 (data) VALUES ('from-db2')");
    await db3.exec("INSERT INTO t3 (data) VALUES ('from-db3')");
    
    const r1 = await db1.exec('SELECT * FROM t1');
    const r2 = await db2.exec('SELECT * FROM t2');
    const r3 = await db3.exec('SELECT * FROM t3');
    
    assert(r1.rows.length === 1 && r1.rows[0].data === 'from-db1', 'db1 should have correct data');
    assert(r2.rows.length === 1 && r2.rows[0].data === 'from-db2', 'db2 should have correct data');
    assert(r3.rows.length === 1 && r3.rows[0].data === 'from-db3', 'db3 should have correct data');
    
    await db1.close();
    await db2.close();
    await db3.close();
  });

  // Test 11: Merge databases (last-write-wins)
  await runTest('Merge databases with last-write-wins', async () => {
    const dbA = await createDatabase('vite-merge-a-' + Date.now(), { mode: 'local' });
    const dbB = await createDatabase('vite-merge-b-' + Date.now(), { mode: 'local' });
    
    await dbA.exec('CREATE TABLE items (name TEXT, value INTEGER)');
    await dbB.exec('CREATE TABLE items (name TEXT, value INTEGER)');
    
    await dbA.exec("INSERT INTO items (name, value) VALUES ('shared', 1)");
    const exportA1 = await dbA.export();
    await dbB.import(exportA1);
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await dbA.exec("UPDATE items SET value = 100 WHERE name = 'shared'");
    const exportA2 = await dbA.export();
    await dbB.merge(exportA2);
    
    const result = await dbB.exec('SELECT * FROM items');
    assert(result.rows.length === 1, 'Should have 1 row after merge');
    assert(result.rows[0].value === 100, 'Value should be 100 (newer from dbA)');
    
    await dbA.close();
    await dbB.close();
  });

  // Test 12: Large data handling
  await runTest('Large data handling', async () => {
    const db = await createDatabase('vite-large-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE large_data (content TEXT)');
    
    // Insert 100 rows
    for (let i = 0; i < 100; i++) {
      await db.exec(`INSERT INTO large_data (content) VALUES ('Row ${i} with some content padding to make it larger')`);
    }
    
    const result = await db.exec('SELECT COUNT(*) as count FROM large_data');
    assert(result.rows[0].count === 100, 'Should have 100 rows');
    
    const allRows = await db.exec('SELECT * FROM large_data');
    assert(allRows.rows.length === 100, 'Should retrieve all 100 rows');
    
    await db.close();
  });

  // Test 13: Special characters in data
  await runTest('Special characters in data', async () => {
    const db = await createDatabase('vite-special-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE special (content TEXT)');
    
    const specialStrings = [
      "Hello 'World'",
      'Double "quotes"',
      'Backslash \\ test',
      'Unicode: ',
      'Newline\ntest',
      'Tab\there',
    ];
    
    for (const str of specialStrings) {
      await db.exec(`INSERT INTO special (content) VALUES ('${str.replace(/'/g, "''")}')`);
    }
    
    const result = await db.exec('SELECT * FROM special');
    assert(result.rows.length === specialStrings.length, `Should have ${specialStrings.length} rows`);
    
    await db.close();
  });

  // Test 14: Parameterized queries
  await runTest('Parameterized queries', async () => {
    const db = await createDatabase('vite-params-' + Date.now(), { mode: 'local' });
    await db.exec('CREATE TABLE params_test (name TEXT, value INTEGER)');
    
    await db.exec('INSERT INTO params_test (name, value) VALUES (?, ?)', ['test-name', 42]);
    
    const result = await db.exec('SELECT * FROM params_test WHERE name = ?', ['test-name']);
    assert(result.rows.length === 1, 'Should find 1 row with parameterized query');
    assert(result.rows[0].value === 42, 'Value should be 42');
    
    await db.close();
  });

  // Summary
  log('');
  log('='.repeat(50), 'info');
  if (failed === 0) {
    log(`All tests passed! (${passed}/${passed})`, 'pass');
    updateStatus(`All tests passed! (${passed}/${passed})`, 'pass');
  } else {
    log(`Tests completed: ${passed} passed, ${failed} failed`, 'fail');
    updateStatus(`Tests failed: ${passed} passed, ${failed} failed`, 'fail');
    log('Failed tests:', 'fail');
    errors.forEach(e => log(`  - ${e.name}: ${e.error}`, 'fail'));
  }
  log('='.repeat(50), 'info');

  // Set global result for Playwright to check
  window.__TEST_RESULTS__ = {
    passed,
    failed,
    total: passed + failed,
    errors,
    success: failed === 0,
  };
}

// Run tests when page loads
runTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'fail');
  console.error(error);
  updateStatus('Fatal error occurred', 'fail');
  window.__TEST_RESULTS__ = {
    passed: 0,
    failed: 1,
    total: 1,
    errors: [{ name: 'Fatal', error: error.message }],
    success: false,
  };
});
