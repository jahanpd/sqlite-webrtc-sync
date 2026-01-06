import type { SchemaDef, InferRow, TableNames } from '../../schema';
import type { QueryResult } from '../types';
type ComparisonOperator = '=' | '!=' | '>' | '<' | '>=' | '<=';
type StringOperator = 'LIKE';
type ArrayOperator = 'IN';
type WhereOperator = ComparisonOperator | StringOperator | ArrayOperator;
/**
 * Query builder interface - provides fluent API for building queries
 */
interface QueryBuilder<S extends SchemaDef, T extends TableNames<S>> {
    /**
     * Add a WHERE clause
     * Multiple where() calls are combined with AND
     */
    where<K extends keyof InferRow<S[T]> & string>(column: K, operator: WhereOperator, value: InferRow<S[T]>[K] | InferRow<S[T]>[K][]): QueryBuilder<S, T>;
    /**
     * Add ORDER BY clause
     */
    orderBy<K extends keyof InferRow<S[T]> & string>(column: K, direction?: 'asc' | 'desc'): QueryBuilder<S, T>;
    /**
     * Add LIMIT clause
     */
    limit(n: number): QueryBuilder<S, T>;
    /**
     * Execute the query and return reactive result
     */
    exec(): QueryResult<InferRow<S[T]>>;
}
/**
 * Create a query builder for a table.
 *
 * @param dbName - Database name
 * @param tableName - Table to query
 *
 * @example
 * ```tsx
 * function TodoList() {
 *   const { data, isLoading } = useQuery('my-app', 'todos')
 *     .where('completed', '=', false)
 *     .orderBy('updated_at', 'desc')
 *     .limit(10)
 *     .exec();
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <ul>
 *       {data?.map(todo => <li key={todo.id}>{todo.title}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 */
export declare function useQuery<S extends SchemaDef, T extends TableNames<S>>(dbName: string, tableName: T): QueryBuilder<S, T>;
export {};
//# sourceMappingURL=useQuery.d.ts.map