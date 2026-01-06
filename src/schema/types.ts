// SQL column types
export type SQLType = 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB';

// Column definition
export interface ColumnDef<T extends SQLType = SQLType, Nullable extends boolean = false> {
  type: T;
  nullable: Nullable;
  optional(): ColumnDef<T, true>;
}

// Table columns definition (user-defined columns only)
export type ColumnsDefinition = Record<string, ColumnDef<SQLType, boolean>>;

// Table definition
export interface TableDef<TName extends string = string, TCols extends ColumnsDefinition = ColumnsDefinition> {
  name: TName;
  columns: TCols;
}

// Schema definition
export type SchemaDef = Record<string, TableDef>;

// Map SQL types to TypeScript types
export type SQLTypeToTS<T extends SQLType> = 
  T extends 'TEXT' ? string :
  T extends 'INTEGER' ? number :
  T extends 'REAL' ? number :
  T extends 'BLOB' ? Uint8Array :
  never;

// System columns added to every row
export interface SystemColumns {
  id: string;
  updated_at: number;
  deleted: number;
}

// Infer TypeScript type from a column definition
export type InferColumnType<C extends ColumnDef<SQLType, boolean>> = 
  C['nullable'] extends true 
    ? SQLTypeToTS<C['type']> | null 
    : SQLTypeToTS<C['type']>;

// Infer row type from table definition (includes system columns)
export type InferRow<T extends TableDef> = SystemColumns & {
  [K in keyof T['columns']]: T['columns'][K] extends ColumnDef<SQLType, boolean>
    ? InferColumnType<T['columns'][K]>
    : never
};

// Infer full schema types
export type InferSchema<S extends SchemaDef> = {
  [K in keyof S]: InferRow<S[K]>
};

// Type for insert data (omits system columns)
export type InsertData<Row> = Omit<Row, keyof SystemColumns>;

// Type for update data (partial insert data)
export type UpdateData<Row> = Partial<InsertData<Row>>;

// Extract table names from schema
export type TableNames<S extends SchemaDef> = keyof S & string;

// Extract row type for a specific table
export type RowType<S extends SchemaDef, T extends keyof S> = InferRow<S[T]>;
