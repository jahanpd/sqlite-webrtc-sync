export type SQLType = 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB';
export interface ColumnDef<T extends SQLType = SQLType, Nullable extends boolean = false> {
    type: T;
    nullable: Nullable;
    optional(): ColumnDef<T, true>;
    required(): ColumnDef<T, false>;
}
export type ColumnsDefinition = Record<string, ColumnDef<SQLType, boolean>>;
export interface TableDef<TName extends string = string, TCols extends ColumnsDefinition = ColumnsDefinition> {
    name: TName;
    columns: TCols;
}
export type SchemaDef = Record<string, TableDef>;
export type SQLTypeToTS<T extends SQLType> = T extends 'TEXT' ? string : T extends 'INTEGER' ? number : T extends 'REAL' ? number : T extends 'BLOB' ? Uint8Array : never;
export interface SystemColumns {
    id: string;
    updated_at: number;
    deleted: number;
}
export type InferColumnType<C extends ColumnDef<SQLType, boolean>> = C['nullable'] extends true ? SQLTypeToTS<C['type']> | null : SQLTypeToTS<C['type']>;
export type InferRow<T extends TableDef> = SystemColumns & {
    [K in keyof T['columns']]: T['columns'][K] extends ColumnDef<SQLType, boolean> ? InferColumnType<T['columns'][K]> : never;
};
export type InferSchema<S extends SchemaDef> = {
    [K in keyof S]: InferRow<S[K]>;
};
type RequiredColumnValues<T extends TableDef> = {
    [K in keyof T['columns']]: T['columns'][K] extends ColumnDef<SQLType, false> ? InferColumnType<T['columns'][K]> : never;
};
type OptionalColumnValues<T extends TableDef> = {
    [K in keyof T['columns']]: T['columns'][K] extends ColumnDef<SQLType, true> ? InferColumnType<T['columns'][K]> | undefined : never;
};
export type InsertData<T extends TableDef> = RequiredColumnValues<T> & Partial<OptionalColumnValues<T>> & {
    id?: string;
};
export type UpdateData<T extends TableDef> = Partial<RequiredColumnValues<T> & OptionalColumnValues<T>>;
export type TableNames<S extends SchemaDef> = keyof S & string;
export type RowType<S extends SchemaDef, T extends keyof S> = InferRow<S[T]>;
export {};
//# sourceMappingURL=types.d.ts.map