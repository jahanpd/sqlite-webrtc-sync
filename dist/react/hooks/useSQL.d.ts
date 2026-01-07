import type { QueryResult, SQLQueryOptions } from '../types';
/**
 * Execute raw SQL queries with full flexibility for complex queries like JOINs,
 * subqueries, GROUP BY, HAVING, etc.
 *
 * @param dbName - Database name
 * @param sql - Raw SQL query string
 * @param options - Optional query options
 * @param options.params - SQL parameters for prepared statements
 * @param options.tables - Tables this query depends on (for reactivity)
 *
 * @example
 * ```tsx
 * // Simple query - no reactivity
 * const { data } = useSQL<{ count: number }>('my-db', 'SELECT COUNT(*) as count FROM users');
 *
 * // Query with params - re-runs when params change
 * const { data } = useSQL<User>('my-db', 'SELECT * FROM users WHERE id = ?', {
 *   params: [userId],
 *   tables: ['users'],
 * });
 *
 * // Complex join with subqueries
 * const { data } = useSQL<ContentWithPatient>(
 *   'my-db',
 *   `SELECT
 *     patients.name, content.id,
 *     (SELECT COUNT(*) FROM notes WHERE notes.content = content.id) as note_count
 *   FROM content
 *   INNER JOIN patients ON patients.id = content.patient
 *   WHERE content.deleted = 0
 *   GROUP BY content.id`,
 *   {
 *     tables: ['content', 'patients', 'notes'],
 *   }
 * );
 * ```
 */
export declare function useSQL<T = Record<string, unknown>>(dbName: string, sql: string, options?: SQLQueryOptions): QueryResult<T>;
//# sourceMappingURL=useSQL.d.ts.map