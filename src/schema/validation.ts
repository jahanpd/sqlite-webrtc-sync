import type { TableDef, ColumnDef, SQLType } from './types';

type ValidationError = {
  column: string;
  message: string;
};

function getColumnType(table: TableDef, columnName: string): ColumnDef<SQLType, boolean> | null {
  return table.columns[columnName] ?? null;
}

function validateValueType(
  value: unknown,
  columnName: string,
  expectedType: SQLType
): ValidationError | null {
  if (value === null || value === undefined) {
    return null;
  }

  switch (expectedType) {
    case 'TEXT':
      if (typeof value !== 'string') {
        return {
          column: columnName,
          message: `Column "${columnName}" is TEXT but got ${typeof value}`,
        };
      }
      break;
    case 'INTEGER':
    case 'REAL':
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return {
          column: columnName,
          message: `Column "${columnName}" is ${expectedType} but got ${typeof value}`,
        };
      }
      break;
    case 'BLOB':
      if (!(value instanceof Uint8Array)) {
        return {
          column: columnName,
          message: `Column "${columnName}" is BLOB but got ${typeof value}`,
        };
      }
      break;
  }

  return null;
}

export function validateInsertData<T extends TableDef>(
  table: T,
  data: Record<string, unknown>
): void {
  const errors: ValidationError[] = [];

  for (const [columnName, columnDef] of Object.entries(table.columns)) {
    const value = data[columnName];

    const typeError = validateValueType(value, columnName, columnDef.type);
    if (typeError) {
      errors.push(typeError);
    }

    if (!columnDef.nullable && (value === undefined || value === null)) {
      errors.push({
        column: columnName,
        message: `Column "${columnName}" is required but got undefined/null`,
      });
    }
  }

  for (const columnName of Object.keys(data)) {
    // Allow 'id' as a special case - it's a system column that users can optionally provide
    if (columnName === 'id') {
      // Validate that id is a string if provided
      if (data[columnName] !== undefined && typeof data[columnName] !== 'string') {
        errors.push({
          column: columnName,
          message: `Column "id" must be a string but got ${typeof data[columnName]}`,
        });
      }
      continue;
    }
    if (!table.columns[columnName]) {
      errors.push({
        column: columnName,
        message: `Unknown column "${columnName}" in table "${table.name}"`,
      });
    }
  }

  if (errors.length > 0) {
    const messages = errors.map(e => e.message).join('; ');
    throw new Error(`Insert validation failed: ${messages}`);
  }
}

export function validateUpdateData<T extends TableDef>(
  table: T,
  data: Record<string, unknown>
): void {
  const errors: ValidationError[] = [];

  for (const [columnName, value] of Object.entries(data)) {
    const columnDef = getColumnType(table, columnName);

    if (!columnDef) {
      errors.push({
        column: columnName,
        message: `Unknown column "${columnName}" in table "${table.name}"`,
      });
      continue;
    }

    const typeError = validateValueType(value, columnName, columnDef.type);
    if (typeError) {
      errors.push(typeError);
    }
  }

  if (errors.length > 0) {
    const messages = errors.map(e => e.message).join('; ');
    throw new Error(`Update validation failed: ${messages}`);
  }
}
