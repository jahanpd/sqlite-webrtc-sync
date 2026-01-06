import type { ColumnDef, SQLType } from './types';
interface ColumnImpl<T extends SQLType, N extends boolean> extends ColumnDef<T, N> {
    _isBoolean?: boolean;
}
export declare const column: {
    /** TEXT column -> string */
    text: () => ColumnImpl<"TEXT", false>;
    /** INTEGER column -> number */
    integer: () => ColumnImpl<"INTEGER", false>;
    /** REAL column -> number (floating point) */
    real: () => ColumnImpl<"REAL", false>;
    /** BLOB column -> Uint8Array */
    blob: () => ColumnImpl<"BLOB", false>;
    /**
     * BOOLEAN column -> boolean
     * Stored as INTEGER (0/1) in SQLite
     */
    boolean: () => ColumnImpl<"INTEGER", false>;
};
export type Column = typeof column;
export {};
//# sourceMappingURL=column.d.ts.map