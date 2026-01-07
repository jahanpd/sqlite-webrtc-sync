import type { TableDef } from './types';
export declare function validateInsertData<T extends TableDef>(table: T, data: Record<string, unknown>): void;
export declare function validateUpdateData<T extends TableDef>(table: T, data: Record<string, unknown>): void;
//# sourceMappingURL=validation.d.ts.map