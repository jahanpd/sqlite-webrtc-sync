// src/schema/column.ts
function createColumn(type, isBoolean = false) {
  const col = {
    type,
    nullable: true,
    optional() {
      return this;
    },
    required() {
      return {
        type,
        nullable: false,
        optional() {
          return this;
        },
        required() {
          return this;
        }
      };
    }
  };
  if (isBoolean) col._isBoolean = true;
  return col;
}
var column = {
  text: () => createColumn("TEXT"),
  integer: () => createColumn("INTEGER"),
  real: () => createColumn("REAL"),
  blob: () => createColumn("BLOB"),
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

// src/schema/validation.ts
function getColumnType(table, columnName) {
  return table.columns[columnName] ?? null;
}
function validateValueType(value, columnName, expectedType) {
  if (value === null || value === void 0) {
    return null;
  }
  switch (expectedType) {
    case "TEXT":
      if (typeof value !== "string") {
        return {
          column: columnName,
          message: `Column "${columnName}" is TEXT but got ${typeof value}`
        };
      }
      break;
    case "INTEGER":
    case "REAL":
      if (typeof value !== "number" || Number.isNaN(value)) {
        return {
          column: columnName,
          message: `Column "${columnName}" is ${expectedType} but got ${typeof value}`
        };
      }
      break;
    case "BLOB":
      if (!(value instanceof Uint8Array)) {
        return {
          column: columnName,
          message: `Column "${columnName}" is BLOB but got ${typeof value}`
        };
      }
      break;
  }
  return null;
}
function validateInsertData(table, data) {
  const errors = [];
  for (const [columnName, columnDef] of Object.entries(table.columns)) {
    const value = data[columnName];
    const typeError = validateValueType(value, columnName, columnDef.type);
    if (typeError) {
      errors.push(typeError);
    }
    if (!columnDef.nullable && (value === void 0 || value === null)) {
      errors.push({
        column: columnName,
        message: `Column "${columnName}" is required but got undefined/null`
      });
    }
  }
  for (const columnName of Object.keys(data)) {
    if (!table.columns[columnName]) {
      errors.push({
        column: columnName,
        message: `Unknown column "${columnName}" in table "${table.name}"`
      });
    }
  }
  if (errors.length > 0) {
    const messages = errors.map((e) => e.message).join("; ");
    throw new Error(`Insert validation failed: ${messages}`);
  }
}
function validateUpdateData(table, data) {
  const errors = [];
  for (const [columnName, value] of Object.entries(data)) {
    const columnDef = getColumnType(table, columnName);
    if (!columnDef) {
      errors.push({
        column: columnName,
        message: `Unknown column "${columnName}" in table "${table.name}"`
      });
      continue;
    }
    const typeError = validateValueType(value, columnName, columnDef.type);
    if (typeError) {
      errors.push(typeError);
    }
  }
  if (errors.length > 0) {
    const messages = errors.map((e) => e.message).join("; ");
    throw new Error(`Update validation failed: ${messages}`);
  }
}
export {
  column,
  defineSchema,
  defineTable,
  validateInsertData,
  validateUpdateData
};
