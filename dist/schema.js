// src/schema/column.ts
function createColumn(type, isBoolean = false) {
  const col = {
    type,
    nullable: false,
    optional() {
      return {
        type,
        nullable: true,
        optional() {
          return this;
        },
        _isBoolean: isBoolean
      };
    }
  };
  if (isBoolean) col._isBoolean = true;
  return col;
}
var column = {
  /** TEXT column -> string */
  text: () => createColumn("TEXT"),
  /** INTEGER column -> number */
  integer: () => createColumn("INTEGER"),
  /** REAL column -> number (floating point) */
  real: () => createColumn("REAL"),
  /** BLOB column -> Uint8Array */
  blob: () => createColumn("BLOB"),
  /** 
   * BOOLEAN column -> boolean 
   * Stored as INTEGER (0/1) in SQLite
   */
  boolean: () => createColumn("INTEGER", true)
};

// src/schema/table.ts
function defineTable(columns) {
  return {
    name: "",
    // Will be set by defineSchema
    columns
  };
}

// src/schema/schema.ts
function defineSchema(tables) {
  const namedTables = {};
  for (const [name, table] of Object.entries(tables)) {
    namedTables[name] = {
      ...table,
      name
    };
  }
  return {
    tables: namedTables,
    toSQL() {
      return Object.keys(namedTables).map((name) => this.getTableSQL(name));
    },
    getTableSQL(tableName) {
      const table = namedTables[tableName];
      if (!table) {
        throw new Error(`Table "${String(tableName)}" not found in schema`);
      }
      return generateCreateTableSQL(String(tableName), table.columns);
    }
  };
}
function sqliteType(type) {
  switch (type) {
    case "TEXT":
      return "TEXT";
    case "INTEGER":
      return "INTEGER";
    case "REAL":
      return "REAL";
    case "BLOB":
      return "BLOB";
    default:
      return "TEXT";
  }
}
function generateCreateTableSQL(tableName, columns) {
  const columnDefs = [];
  for (const [name, col] of Object.entries(columns)) {
    const nullable = col.nullable ? "" : " NOT NULL";
    columnDefs.push(`${name} ${sqliteType(col.type)}${nullable}`);
  }
  columnDefs.push("id TEXT PRIMARY KEY");
  columnDefs.push("updated_at INTEGER NOT NULL");
  columnDefs.push("deleted INTEGER NOT NULL DEFAULT 0");
  return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs.join(", ")})`;
}
export {
  column,
  defineSchema,
  defineTable
};
