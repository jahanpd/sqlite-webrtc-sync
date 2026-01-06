import type { ColumnDef, SQLType } from './types';

// Internal column implementation
interface ColumnImpl<T extends SQLType, N extends boolean> extends ColumnDef<T, N> {
  _isBoolean?: boolean;
}

// Create a column definition
function createColumn<T extends SQLType>(type: T, isBoolean = false): ColumnImpl<T, false> {
  const col: ColumnImpl<T, false> = {
    type,
    nullable: false as const,
    optional(): ColumnDef<T, true> {
      return {
        type,
        nullable: true as const,
        optional() { return this; },
        _isBoolean: isBoolean,
      } as ColumnDef<T, true> & { _isBoolean?: boolean };
    },
  };
  if (isBoolean) col._isBoolean = true;
  return col;
}

// Column builders
export const column = {
  /** TEXT column -> string */
  text: () => createColumn('TEXT'),
  
  /** INTEGER column -> number */
  integer: () => createColumn('INTEGER'),
  
  /** REAL column -> number (floating point) */
  real: () => createColumn('REAL'),
  
  /** BLOB column -> Uint8Array */
  blob: () => createColumn('BLOB'),
  
  /** 
   * BOOLEAN column -> boolean 
   * Stored as INTEGER (0/1) in SQLite
   */
  boolean: () => createColumn('INTEGER', true),
};

export type Column = typeof column;
