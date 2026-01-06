import { useState, useEffect, useCallback, useRef } from 'react';
import { useDatabaseContext } from '../context';
import { generateQueryKey } from '../store';
import type { SchemaDef, InferRow, TableNames } from '../../schema';
import type { QueryResult, QueryBuilderOptions } from '../types';

// Operator types for type-safe where clauses
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
  where<K extends keyof InferRow<S[T]> & string>(
    column: K,
    operator: WhereOperator,
    value: InferRow<S[T]>[K] | InferRow<S[T]>[K][]
  ): QueryBuilder<S, T>;
  
  /**
   * Add ORDER BY clause
   */
  orderBy<K extends keyof InferRow<S[T]> & string>(
    column: K,
    direction?: 'asc' | 'desc'
  ): QueryBuilder<S, T>;
  
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
 * Internal query builder implementation
 */
function createQueryBuilder<S extends SchemaDef, T extends TableNames<S>>(
  dbName: string,
  tableName: T,
  options: QueryBuilderOptions = { where: [] }
): QueryBuilder<S, T> {
  return {
    where(column, operator, value) {
      return createQueryBuilder<S, T>(dbName, tableName, {
        ...options,
        where: [...options.where, { column, operator, value }],
      });
    },
    
    orderBy(column, direction = 'asc') {
      return createQueryBuilder<S, T>(dbName, tableName, {
        ...options,
        orderBy: { column, direction },
      });
    },
    
    limit(n) {
      return createQueryBuilder<S, T>(dbName, tableName, {
        ...options,
        limit: n,
      });
    },
    
    exec() {
      // This is a hook call - must be called at component top level
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useQueryExec<S, T>(dbName, tableName, options);
    },
  };
}

/**
 * Internal hook that executes the query and manages state
 */
function useQueryExec<S extends SchemaDef, T extends TableNames<S>>(
  dbName: string,
  tableName: T,
  options: QueryBuilderOptions
): QueryResult<InferRow<S[T]>> {
  const context = useDatabaseContext<S>(dbName);
  const { db, store } = context;
  
  const [data, setData] = useState<InferRow<S[T]>[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Stable reference to options for dependency tracking
  const optionsRef = useRef(options);
  optionsRef.current = options;
  
  // Generate query key for subscription
  const queryKey = generateQueryKey(String(tableName), options);
  
  // Build SQL from options
  const buildSQL = useCallback(() => {
    let sql = `SELECT * FROM ${String(tableName)}`;
    const params: unknown[] = [];
    
    // WHERE clauses
    if (options.where.length > 0) {
      const whereClauses = options.where.map((w) => {
        if (w.operator === 'IN') {
          const arr = w.value as unknown[];
          const placeholders = arr.map(() => '?').join(', ');
          params.push(...arr);
          return `${w.column} IN (${placeholders})`;
        } else {
          params.push(w.value);
          return `${w.column} ${w.operator} ?`;
        }
      });
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    // ORDER BY
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy.column} ${options.orderBy.direction.toUpperCase()}`;
    }
    
    // LIMIT
    if (options.limit !== undefined) {
      sql += ` LIMIT ${options.limit}`;
    }
    
    return { sql, params };
  }, [tableName, options]);
  
  // Fetch function
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { sql, params } = buildSQL();
      const result = await db.exec(sql, params);
      
      setData(result.rows as InferRow<S[T]>[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setData(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [db, buildSQL]);
  
  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  
  // Initial fetch and subscription
  useEffect(() => {
    fetchData();
    
    // Subscribe to store for reactivity
    const unsubscribe = store.subscribe(queryKey, [String(tableName)], () => {
      fetchData();
    });
    
    return unsubscribe;
  }, [fetchData, store, queryKey, tableName]);
  
  return { data, isLoading, error, refetch };
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
export function useQuery<S extends SchemaDef, T extends TableNames<S>>(
  dbName: string,
  tableName: T
): QueryBuilder<S, T> {
  return createQueryBuilder<S, T>(dbName, tableName);
}
