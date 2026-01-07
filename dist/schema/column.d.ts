import type { ColumnDef, SQLType } from './types';
type ColumnBase<T extends SQLType> = {
    type: T;
    nullable: true;
    optional(): ColumnDef<T, true>;
    required(): ColumnDef<T, false>;
    _isBoolean?: boolean;
};
export declare const column: {
    text: () => ColumnBase<"TEXT">;
    integer: () => ColumnBase<"INTEGER">;
    real: () => ColumnBase<"REAL">;
    blob: () => ColumnBase<"BLOB">;
    boolean: () => ColumnBase<"INTEGER">;
};
export type Column = typeof column;
export {};
//# sourceMappingURL=column.d.ts.map