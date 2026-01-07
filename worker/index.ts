// NOTE: globalThis.sqlite3InitModuleState is set up by the main thread BEFORE this code runs
// This is injected at the start of the worker blob to configure WASM file location
// because sqlite3.mjs reads it at module evaluation time

import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

const OPFS_VFS = 'opfs';

let sqlite3: any = null;
const databases = new Map<string, any>();

// Track last processed SQL and affected rows for sync
const lastProcessedSql = new Map<string, string>();
const lastAffectedRows = new Map<string, { id: string; table: string }[]>();

type SQLiteRequest = {
  id: number;
  type: string;
  dbName: string;
  args: unknown[];
};

type SQLiteResponse = {
  id: number;
  type: string;
  success: boolean;
  result?: unknown;
  error?: string;
};

async function initSqlite(): Promise<void> {
  console.log('[Worker] Initializing SQLite WASM module...');
  const module = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  });
  sqlite3 = module;
  console.log('[Worker] SQLite WASM module initialized successfully');
  console.log('[Worker] OPFS directory:', sqlite3?.capi.sqlite3_wasmfs_opfs_dir?.() || 'opfs');
}

function createDb(dbName: string): any {
  console.log(`[Worker] Creating database: ${dbName}`);
  
  if (!sqlite3) {
    throw new Error('SQLite not initialized');
  }
  
  if (databases.has(dbName)) {
    throw new Error(`Database ${dbName} already exists`);
  }
  
  const db = new sqlite3.oo1.OpfsDb(`${OPFS_VFS}/${dbName}.db`);
  databases.set(dbName, db);
  
  initializeSchema(db);
  
  console.log(`[Worker] Database ${dbName} created successfully`);
  return db;
}

function exportDatabase(db: any): Uint8Array {
  // For OPFS databases, we need to dump SQL statements since binary export doesn't work well
  const statements: string[] = [];
  
  // Get all user tables (excluding system tables)
  const tablesResult = execute(db, "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE '_syncable_%' AND name NOT LIKE 'sqlite_%'");
  
  for (const table of tablesResult.rows) {
    const tableName = (table as any).name;
    const createSql = (table as any).sql;
    
    if (createSql) {
      statements.push(createSql + ';');
    }
    
    // Get all rows including deleted ones for export
    const rowsResult = execute(db, `SELECT * FROM ${tableName}`);
    
    for (const row of rowsResult.rows) {
      const rowObj = row as Record<string, unknown>;
      const columns = Object.keys(rowObj);
      const values = columns.map(col => {
        const v = rowObj[col];
        if (v === null) return 'NULL';
        if (typeof v === 'string') return `'${String(v).replace(/'/g, "''")}'`;
        return String(v);
      });
      
      statements.push(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`);
    }
  }
  
  const sql = statements.join('\n');
  return new TextEncoder().encode(sql);
}

function importDatabase(db: any, data: Uint8Array): void {
  if (data.length === 0) {
    throw new Error('Byte array size 0 is invalid for an SQLite3 db.');
  }
  
  // Parse SQL dump and execute on existing database
  const sql = new TextDecoder().decode(data);
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  
  for (const stmt of statements) {
    try {
      // Skip CREATE TABLE if table already exists
      if (stmt.toUpperCase().startsWith('CREATE TABLE')) {
        const match = stmt.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?(\w+)["`]?/i);
        if (match) {
          const tableName = match[1];
          // Check if table exists
          const exists = execute(db, `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`);
          if (exists.rows.length > 0) {
            continue; // Skip - table exists
          }
        }
        db.exec(stmt + ';');
      } else if (stmt.toUpperCase().startsWith('INSERT')) {
        // For INSERT statements, use INSERT OR REPLACE
        const modified = stmt.replace(/^INSERT\s+INTO/i, 'INSERT OR REPLACE INTO');
        db.exec(modified + ';');
      } else {
        db.exec(stmt + ';');
      }
    } catch (e) {
      console.warn('Import statement failed:', stmt, e);
    }
  }
}

function initializeSchema(db: any): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _syncable_metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
}

interface QueryResult {
  rows: unknown[];
  columns: string[];
  affectedRows?: { id: string; table: string }[];
}

function execute(db: any, sql: string, params?: unknown[]): QueryResult {
  const stmt = db.prepare(sql);
  
  if (params) {
    stmt.bind(params);
  }
  
  const rows: unknown[] = [];
  const columns: string[] = [];
  
  while (stmt.step()) {
    const numColumns = stmt.columnCount;
    const row: Record<string, unknown> = {};
    for (let i = 0; i < numColumns; i++) {
      const columnName = stmt.getColumnName(i);
      row[columnName] = stmt.get(i);
    }
    rows.push(row);
    if (columns.length === 0) {
      for (let i = 0; i < numColumns; i++) {
        columns.push(stmt.getColumnName(i));
      }
    }
  }
  
  stmt.finalize();
  return { rows, columns };
}

function injectColumns(sql: string): { sql: string; hasUserColumns: boolean } {
  const createTableMatch = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?(\w+)["`]?\s*\(([^)]+)\)/i);
  
  if (!createTableMatch) {
    return { sql, hasUserColumns: false };
  }
  
  const fullMatch = createTableMatch[0];
  const tableName = createTableMatch[1];
  const columnsStr = createTableMatch[2].trim();
  const columns = columnsStr.split(',').map(c => c.trim());
  
  let hasId = false;
  let hasUpdatedAt = false;
  let hasDeleted = false;
  
  for (const c of columns) {
    const lowerC = c.toLowerCase();
    if (/^\s*["`]?id["`]?\s+/.test(c) || lowerC.includes('primary key')) {
      hasId = true;
    }
    if (lowerC.includes('updated_at')) {
      hasUpdatedAt = true;
    }
    if (lowerC.includes('deleted')) {
      hasDeleted = true;
    }
  }
  
  const hasUserColumns = hasId || hasUpdatedAt || hasDeleted;
  
  if (hasUserColumns) {
    return { sql, hasUserColumns: true };
  }
  
  const cleanColumns = columns.map(c => c.replace(/\s+/g, ' ').trim()).join(', ');
  
  const systemColumns = 
    'id TEXT PRIMARY KEY, ' +
    'updated_at INTEGER NOT NULL, ' +
    'deleted INTEGER NOT NULL DEFAULT 0';
  
  const isIfNotExists = /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS/i.test(sql);
  const ifNotExistsStr = isIfNotExists ? 'IF NOT EXISTS ' : '';
  
  const newSql = `CREATE TABLE ${ifNotExistsStr}${tableName} (${cleanColumns}, ${systemColumns})`;
  
  return { sql: newSql, hasUserColumns: false };
}

function rewriteInsert(sql: string, tableName: string): { sql: string; params: unknown[]; rowId: string } {
  const insertMatch = sql.match(/INSERT\s+INTO\s+["`]?(\w+)["`]?\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  
  if (!insertMatch) {
    return { sql, params: [], rowId: '' };
  }
  
  const originalColumns = insertMatch[2].split(',').map(c => c.trim());
  const values = insertMatch[3].split(',').map(c => c.trim());
  
  const userColumns: string[] = [];
  const userValues: string[] = [];
  
  for (let i = 0; i < originalColumns.length; i++) {
    const col = originalColumns[i];
    if (!col.toLowerCase().includes('id') && 
        !col.toLowerCase().includes('updated_at') && 
        !col.toLowerCase().includes('deleted')) {
      userColumns.push(col);
      userValues.push(values[i]);
    }
  }
  
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  
  const newColumns = [...userColumns, 'id', 'updated_at', 'deleted'].join(', ');
  const newValues = [...userValues, `'${uuid}'`, String(timestamp), '0'].join(', ');
  
  const newSql = `INSERT INTO ${tableName} (${newColumns}) VALUES (${newValues})`;
  
  return { sql: newSql, params: [], rowId: uuid };
}

function rewriteUpdate(sql: string, tableName: string): { sql: string; params: unknown[] } {
  const updateMatch = sql.match(/UPDATE\s+["`]?(\w+)["`]?\s+SET\s+([^W]+)(?:\s+WHERE\s+(.+))?/i);
  
  if (!updateMatch) {
    return { sql, params: [] };
  }
  
  const setClause = updateMatch[2].trim();
  const whereClause = updateMatch[3] ? ` WHERE ${updateMatch[3]}` : '';
  const timestamp = Date.now();
  
  const setParts = setClause.split(',').map(part => part.trim());
  const filteredParts: string[] = [];
  
  for (const part of setParts) {
    const col = part.split('=')[0].trim().toLowerCase();
    if (!col.includes('id') && !col.includes('updated_at') && !col.includes('deleted')) {
      filteredParts.push(part);
    }
  }
  
  const newSetClause = [...filteredParts, `updated_at = ${timestamp}`].join(', ');
  
  const newSql = `UPDATE ${tableName} SET ${newSetClause}${whereClause}`;
  
  return { sql: newSql, params: [] };
}

function rewriteDelete(sql: string, tableName: string): { sql: string; params: unknown[] } {
  const deleteMatch = sql.match(/DELETE\s+FROM\s+["`]?(\w+)["`]?\s*(?:WHERE\s+(.+))?/i);
  
  if (!deleteMatch) {
    return { sql, params: [] };
  }
  
  const timestamp = Date.now();
  const whereClause = deleteMatch[2] ? `WHERE ${deleteMatch[2]}` : '';
  
  const newSql = `UPDATE ${tableName} SET deleted = 1, updated_at = ${timestamp} ${whereClause}`;
  
  return { sql: newSql, params: [] };
}

function rewriteQuery(sql: string): string {
  // Don't rewrite DELETE statements here - they're handled by rewriteDelete
  if (sql.trim().toUpperCase().startsWith('DELETE')) {
    return sql;
  }
  
  // Only rewrite queries that have a FROM clause (i.e., querying a table)
  // This excludes queries like "SELECT 1 as num" or "SELECT datetime('now')"
  if (!/\bFROM\b/i.test(sql)) {
    return sql;
  }
  
  // Check if the query already has a WHERE clause
  const hasWhere = /\bWHERE\b/i.test(sql);
  
  if (hasWhere) {
    // Add "deleted = 0 AND" after the existing WHERE
    return sql.replace(/\bWHERE\b/i, 'WHERE deleted = 0 AND');
  } else {
    // Add WHERE deleted = 0 before ORDER BY, GROUP BY, LIMIT, or at the end
    const insertPoint = sql.search(/\b(ORDER\s+BY|GROUP\s+BY|LIMIT|HAVING|$)/i);
    if (insertPoint > 0) {
      return sql.slice(0, insertPoint) + ' WHERE deleted = 0 ' + sql.slice(insertPoint);
    }
    return sql + ' WHERE deleted = 0';
  }
}

interface ProcessedSql {
  sql: string;
  params: unknown[];
  table?: string;
  rowId?: string;
  isMutation: boolean;
}

function processSql(sql: string): ProcessedSql {
  const upperSql = sql.toUpperCase().trim();
  
  if (upperSql.startsWith('INSERT')) {
    const insertMatch = sql.match(/INSERT\s+INTO\s+["`]?(\w+)["`]?/i);
    if (insertMatch) {
      const result = rewriteInsert(sql, insertMatch[1]);
      return { 
        sql: result.sql, 
        params: result.params, 
        table: insertMatch[1], 
        rowId: result.rowId,
        isMutation: true 
      };
    }
  }
  
  if (upperSql.startsWith('UPDATE')) {
    const updateMatch = sql.match(/UPDATE\s+["`]?(\w+)["`]?/i);
    if (updateMatch) {
      const result = rewriteUpdate(sql, updateMatch[1]);
      return { 
        sql: result.sql, 
        params: result.params, 
        table: updateMatch[1],
        isMutation: true 
      };
    }
  }
  
  if (upperSql.startsWith('DELETE')) {
    const deleteMatch = sql.match(/DELETE\s+FROM\s+["`]?(\w+)["`]?/i);
    if (deleteMatch) {
      const result = rewriteDelete(sql, deleteMatch[1]);
      return { 
        sql: result.sql, 
        params: result.params, 
        table: deleteMatch[1],
        isMutation: true 
      };
    }
  }
  
  return { sql: rewriteQuery(sql), params: [], isMutation: false };
}

async function mergeDatabasesAsync(localDb: any, remoteData: Uint8Array, sqlite3Module: any): Promise<void> {
  const tempDb = new sqlite3Module.oo1.DB(':memory:');
  
  try {
    const remoteDb = new sqlite3Module.oo1.DB(':memory:');
    
    const sql = new TextDecoder().decode(remoteData);
    remoteDb.exec(sql);
    
    const localTables = execute(localDb, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_syncable_%'").rows.map((r: any) => r.name);
    const remoteTables = execute(remoteDb, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_syncable_%'").rows.map((r: any) => r.name);
    const allTables = new Set([...localTables, ...remoteTables]);
    
    for (const tableName of allTables) {
      await mergeTable(localDb, remoteDb, tableName);
    }
    
    remoteDb.close();
  } finally {
    tempDb.close();
  }
}

async function mergeTable(localDb: any, remoteDb: any, tableName: string): Promise<void> {
  const localRowsResult = execute(localDb, `SELECT * FROM ${tableName}`);
  const remoteRowsResult = execute(remoteDb, `SELECT * FROM ${tableName}`);
  
  const rowsById = new Map<string, any>();
  
  for (const row of localRowsResult.rows) {
    const id = (row as any).id;
    if (id) {
      rowsById.set(id, { source: 'local', row });
    }
  }
  
  for (const row of remoteRowsResult.rows) {
    const id = (row as any).id;
    if (!id) continue;
    
    const existing = rowsById.get(id);
    const remoteTimestamp = (row as any).updated_at || 0;
    
    if (!existing) {
      // Remote row doesn't exist locally, add it
      rowsById.set(id, { source: 'remote', row });
    } else {
      // Both have the row - compare timestamps
      const localTimestamp = (existing.row as any).updated_at || 0;
      if (remoteTimestamp > localTimestamp) {
        // Remote is newer, use remote
        rowsById.set(id, { source: 'remote', row });
      }
      // else: local is newer or same, keep local (already in map)
    }
  }
  
  const columns = localRowsResult.columns.filter((c: string) => 
    c !== 'id' && c !== 'updated_at' && c !== 'deleted'
  );
  
  for (const [id, entry] of rowsById) {
    const row = entry.row as any;
    const isDeleted = row.deleted === 1 || row.deleted === true;
    
    if (isDeleted) {
      continue;
    }
    
    const timestamp = row.updated_at || Date.now();
    
    const existingRowResult = execute(localDb, `SELECT id FROM ${tableName} WHERE id = ?`, [id]);
    
    const userColumns = columns;
    const userValues = userColumns.map((c: string) => {
      const v = row[c];
      if (typeof v === 'string') return `'${String(v).replace(/'/g, "''")}'`;
      if (v === null) return 'NULL';
      return String(v);
    });
    
    if (existingRowResult.rows.length > 0) {
      const updateColumns = userColumns.map((c: string) => `${c} = '${String(row[c] || '').replace(/'/g, "''")}'`).join(', ');
      localDb.exec(`UPDATE ${tableName} SET ${updateColumns}, updated_at = ${timestamp} WHERE id = '${id}'`);
    } else {
      const allColumns = ['id', ...userColumns, 'updated_at', 'deleted'];
      const allValues = [`'${id}'`, ...userValues, String(timestamp), '0'];
      localDb.exec(`INSERT INTO ${tableName} (${allColumns.join(', ')}) VALUES (${allValues.join(', ')})`);
    }
  }
}

async function handleRequest(request: SQLiteRequest): Promise<SQLiteResponse> {
  const { id, type, dbName, args } = request;
  
  try {
    let result: unknown;
    
    switch (type) {
      case 'init': {
        await initSqlite();
        result = { opfsDir: sqlite3?.capi.sqlite3_wasmfs_opfs_dir?.() || 'opfs' };
        break;
      }
      
      case 'createDb': {
        createDb(dbName);
        result = { success: true };
        break;
      }
      
      case 'deleteDb': {
        const db = databases.get(dbName);
        if (db) {
          db.close();
          databases.delete(dbName);
        }
        result = { success: true };
        break;
      }
      
      case 'exec': {
        const db = databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);
        
        const sql = args[0] as string;
        const params = args[1] as unknown[] | undefined;
        
        const injectResult = injectColumns(sql);
        
        if (!injectResult.hasUserColumns && injectResult.sql !== sql) {
          // CREATE TABLE - no affected rows
          db.exec(injectResult.sql);
          lastProcessedSql.set(dbName, injectResult.sql);
          lastAffectedRows.set(dbName, []);
          result = { rows: [], columns: [], affectedRows: [] };
        } else {
          const processed = processSql(sql);
          lastProcessedSql.set(dbName, processed.sql);
          
          if (processed.isMutation && processed.table) {
            // For UPDATE/DELETE, we need to find affected row IDs before executing
            let affectedIds: string[] = [];
            
            if (processed.rowId) {
              // INSERT - we have the new row ID
              affectedIds = [processed.rowId];
            } else {
              // UPDATE/DELETE - query for affected IDs first
              const whereMatch = sql.match(/WHERE\s+(.+)$/i);
              if (whereMatch) {
                const selectSql = `SELECT id FROM ${processed.table} WHERE ${whereMatch[1]}`;
                try {
                  const idsResult = execute(db, selectSql);
                  affectedIds = idsResult.rows.map((r: any) => r.id).filter(Boolean);
                } catch (e) {
                  // Ignore errors finding affected rows
                }
              }
            }
            
            // Execute the mutation
            const execResult = execute(db, processed.sql, params);
            
            // Set affected rows
            const affectedRows = affectedIds.map(id => ({ id, table: processed.table! }));
            lastAffectedRows.set(dbName, affectedRows);
            
            result = { ...execResult, affectedRows };
          } else {
            // SELECT query
            lastAffectedRows.set(dbName, []);
            result = execute(db, processed.sql, params);
          }
        }
        break;
      }
      
      case 'export': {
        const db = databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);
        result = Array.from(exportDatabase(db));
        break;
      }
      
      case 'import': {
        const db = databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);
        const data = new Uint8Array(args[0] as number[]);
        await importDatabase(db, data);
        result = { success: true };
        break;
      }
      
      case 'close': {
        const db = databases.get(dbName);
        if (db) {
          db.close();
          databases.delete(dbName);
        }
        result = { success: true };
        break;
      }
      
      case 'getTables': {
        const db = databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);
        const resultSet = execute(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_syncable_%'");
        result = { tables: resultSet.rows };
        break;
      }
      
      case 'getTableData': {
        const db = databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);
        const tableName = args[0] as string;
        const resultSet = execute(db, `SELECT * FROM ${tableName} WHERE deleted = 0`);
        result = { rows: resultSet.rows, columns: resultSet.columns };
        break;
      }

      case 'merge': {
        const db = databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);
        const remoteData = new Uint8Array(args[0] as number[]);
        await mergeDatabasesAsync(db, remoteData, sqlite3);
        result = { success: true };
        break;
      }
      
      case 'execRaw': {
        // Execute SQL without any rewriting - used for applying remote sync operations
        const db = databases.get(dbName);
        if (!db) throw new Error(`Database ${dbName} not found`);
        let sql = args[0] as string;
        // For INSERT statements, use INSERT OR REPLACE to handle conflicts
        if (sql.toUpperCase().trim().startsWith('INSERT INTO')) {
          sql = sql.replace(/^INSERT\s+INTO/i, 'INSERT OR REPLACE INTO');
        }
        db.exec(sql);
        result = { success: true };
        break;
      }
      
      case 'getLastProcessedSql': {
        result = lastProcessedSql.get(dbName) || '';
        break;
      }
      
      default:
        throw new Error(`Unknown request type: ${type}`);
    }
    
    return { id, type, success: true, result };
  } catch (error) {
    return { id, type, success: false, error: String(error) };
  }
}

self.onmessage = async (event: MessageEvent<SQLiteRequest>) => {
  const request = event.data;
  const response = await handleRequest(request);
  self.postMessage(response);
};

self.onerror = (error: string | Event) => {
  console.error('Worker error:', error);
};
