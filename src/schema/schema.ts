import type { ColumnsDefinition, TableDef, SchemaDef, SQLType } from './types';

// Internal schema type with table names properly set
type SchemaInput = Record<string, TableDef<string, ColumnsDefinition>>;

export interface Schema<S extends SchemaDef = SchemaDef> {
  tables: S;
  /** Generate CREATE TABLE SQL for all tables */
  toSQL(): string[];
  /** Get CREATE TABLE SQL for a specific table */
  getTableSQL(tableName: keyof S): string;
}

/**
 * Define a database schema.
 * 
 * @example
 * ```ts
 * const schema = defineSchema({
 *   todos: defineTable({
 *     title: column.text(),
 *     completed: column.boolean(),
 *   }),
 *   users: defineTable({
 *     name: column.text(),
 *     email: column.text(),
 *   }),
 * });
 * ```
 */
export function defineSchema<S extends SchemaInput>(tables: S): Schema<S> {
  // Set table names from object keys
  const namedTables = {} as S;
  for (const [name, table] of Object.entries(tables)) {
    namedTables[name as keyof S] = {
      ...table,
      name,
    } as S[keyof S];
  }

  return {
    tables: namedTables,
    
    toSQL(): string[] {
      return Object.keys(namedTables).map(name => this.getTableSQL(name as keyof S));
    },
    
    getTableSQL(tableName: keyof S): string {
      const table = namedTables[tableName];
      if (!table) {
        throw new Error(`Table "${String(tableName)}" not found in schema`);
      }
      return generateCreateTableSQL(String(tableName), table.columns);
    },
  };
}

// Map SQL types to SQLite type strings
function sqliteType(type: SQLType): string {
  switch (type) {
    case 'TEXT': return 'TEXT';
    case 'INTEGER': return 'INTEGER';
    case 'REAL': return 'REAL';
    case 'BLOB': return 'BLOB';
    default: return 'TEXT';
  }
}

// Generate CREATE TABLE SQL from column definitions
function generateCreateTableSQL(tableName: string, columns: ColumnsDefinition): string {
  const columnDefs: string[] = [];
  
  // User-defined columns
  for (const [name, col] of Object.entries(columns)) {
    const nullable = col.nullable ? '' : ' NOT NULL';
    columnDefs.push(`${name} ${sqliteType(col.type)}${nullable}`);
  }
  
  // System columns are added by the worker's SQL rewriting,
  // but we need them in the CREATE TABLE for schema clarity
  // The worker will skip adding them if they already exist
  columnDefs.push('id TEXT PRIMARY KEY');
  columnDefs.push('updated_at INTEGER NOT NULL');
  columnDefs.push('deleted INTEGER NOT NULL DEFAULT 0');
  
  return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs.join(', ')})`;
}
