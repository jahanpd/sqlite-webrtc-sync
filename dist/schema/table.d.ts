import type { ColumnsDefinition, TableDef } from './types';
/**
 * Define a table with its columns.
 * System columns (id, updated_at, deleted) are automatically added.
 *
 * @example
 * ```ts
 * const TodoTable = defineTable({
 *   title: column.text(),
 *   completed: column.boolean(),
 *   priority: column.integer().optional(),
 * });
 * ```
 */
export declare function defineTable<TCols extends ColumnsDefinition>(columns: TCols): TableDef<string, TCols>;
//# sourceMappingURL=table.d.ts.map