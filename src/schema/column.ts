import type { ColumnDef, SQLType } from './types';

type ColumnBase<T extends SQLType> = {
  type: T;
  nullable: true;
  optional(): ColumnDef<T, true>;
  required(): ColumnDef<T, false>;
  _isBoolean?: boolean;
};

type RequiredColumn<T extends SQLType> = {
  type: T;
  nullable: false;
  optional(): ColumnDef<T, true>;
  required(): ColumnDef<T, false>;
  _isBoolean?: boolean;
};

function createColumn<T extends SQLType>(type: T, isBoolean = false): ColumnBase<T> {
  const col: ColumnBase<T> = {
    type,
    nullable: true,
    optional() { return this; },
    required(): RequiredColumn<T> {
      return {
        type,
        nullable: false,
        optional() { return this as unknown as ColumnDef<T, true>; },
        required() { return this; },
      } as RequiredColumn<T>;
    },
  };
  if (isBoolean) col._isBoolean = true;
  return col;
}

export const column = {
  text: () => createColumn('TEXT'),
  integer: () => createColumn('INTEGER'),
  real: () => createColumn('REAL'),
  blob: () => createColumn('BLOB'),
  boolean: () => createColumn('INTEGER', true),
};

export type Column = typeof column;
