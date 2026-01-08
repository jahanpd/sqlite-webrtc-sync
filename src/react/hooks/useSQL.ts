import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

  // Memoize tables array with stable reference (avoid infinite loops from new array references)
  const tablesKey = JSON.stringify(options?.tables ?? []);
  const tables = useMemo(
    () => options?.tables ?? [],
    [tablesKey]
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

  // Ref to always get latest fetchData without needing to resubscribe
  const fetchDataRef = useRef(fetchData);
  useEffect(() => {
    fetchDataRef.current = fetchData;
  });
  
  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  
  // Initial fetch and subscription
  useEffect(() => {
    if (!store) return;
    fetchDataRef.current();
    
    // Only subscribe if tables are specified for reactivity
    if (tables.length > 0) {
      const unsubscribe = store.subscribe(queryKey, tables, () => {
        fetchDataRef.current();
      });
      
      return unsubscribe;
    }
    
    // No subscription if tables not specified
    return undefined;
  }, [store, queryKey, tables]);
  
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
