import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDatabaseContext } from '../context';
import { generateSQLQueryKey } from '../store';
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
export function useSQL<T = Record<string, unknown>>(
  dbName: string,
  sql: string,
  options?: SQLQueryOptions
): QueryResult<T> {
  const context = useDatabaseContext(dbName);

  const { db, store } = context ? context : {db: null, store: null};
  
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  
  // Memoize params to detect changes
  const paramsKey = useMemo(
    () => JSON.stringify(options?.params ?? []),
    [options?.params]
  );

  // Memoize tables to detect changes for reactivity (avoid infinite loops from new array references)
  const tablesKey = useMemo(
    () => JSON.stringify(options?.tables ?? []),
    [options?.tables]
  );

  // Generate query key for subscription
  const queryKey = useMemo(
    () => generateSQLQueryKey(sql, options?.params),
    [sql, paramsKey]
  );
  
  // Fetch function
  const fetchData = useCallback(async () => {
		if (!db) return
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await db.exec(sql, options?.params);
      setData(result.rows as T[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setData(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [db, sql, paramsKey]);
  
  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  
  // Initial fetch and subscription
  useEffect(() => {
		if (!store) return
    fetchData();
    
    // Only subscribe if tables are specified for reactivity
    const tables = options?.tables;
    if (tables && tables.length > 0) {
      const unsubscribe = store.subscribe(queryKey, tables, () => {
        fetchData();
      });
      
      return unsubscribe;
    }
    
    // No subscription if tables not specified
    return undefined;
  }, [fetchData, store, queryKey, tablesKey]);
  
  if (!context) {
    return {
      data: undefined,
      isLoading: true,
      error: null,
      refetch: async () => {},
    };
  }

  return { data, isLoading, error, refetch };
}
