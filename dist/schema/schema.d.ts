import type { ColumnsDefinition, TableDef, SchemaDef } from './types';
type SchemaInput = Record<string, TableDef<string, ColumnsDefinition>>;
export interface Schema<S extends SchemaDef = SchemaDef> {
    tables: S;
    /** Generate CREATE TABLE SQL for all tables */
    toSQL(): string[];
    /** Get CREATE TABLE SQL for a specific table */
    getTableSQL(tableName: keyof S): string;
}
/**
 * Define a database schema.
 *
 * @example
 * ```ts
 * const schema = defineSchema({
 *   todos: defineTable({
 *     title: column.text(),
 *     completed: column.boolean(),
 *   }),
 *   users: defineTable({
 *     name: column.text(),
 *     email: column.text(),
 *   }),
 * });
 * ```
 */
export declare function defineSchema<S extends SchemaInput>(tables: S): Schema<S>;
export {};
//# sourceMappingURL=schema.d.ts.map