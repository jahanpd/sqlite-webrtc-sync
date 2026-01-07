/**
 * QueryStore - Manages reactive query subscriptions and invalidation
 * 
 * This is the core reactivity system that enables automatic re-renders
 * when data changes (from local mutations or remote sync).
 */

type Subscriber = () => void;

interface QueryEntry {
  subscribers: Set<Subscriber>;
  tables: Set<string>;
}

export class QueryStore {
  // Map of query key -> query entry
  private queries = new Map<string, QueryEntry>();
  
  // Map of table name -> Set of query keys that depend on it
  private tableToQueries = new Map<string, Set<string>>();

  /**
   * Subscribe to a query. Returns unsubscribe function.
   * 
   * @param queryKey - Unique identifier for the query
   * @param tables - Tables this query depends on
   * @param callback - Called when the query should be re-executed
   */
  subscribe(queryKey: string, tables: string[], callback: Subscriber): () => void {
    // Get or create query entry
    let entry = this.queries.get(queryKey);
    if (!entry) {
      entry = {
        subscribers: new Set(),
        tables: new Set(tables),
      };
      this.queries.set(queryKey, entry);
      
      // Register table -> query mapping
      for (const table of tables) {
        let queryKeys = this.tableToQueries.get(table);
        if (!queryKeys) {
          queryKeys = new Set();
          this.tableToQueries.set(table, queryKeys);
        }
        queryKeys.add(queryKey);
      }
    }
    
    // Add subscriber
    entry.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      entry!.subscribers.delete(callback);
      
      // Clean up if no more subscribers
      if (entry!.subscribers.size === 0) {
        this.queries.delete(queryKey);
        
        // Remove table -> query mappings
        for (const table of entry!.tables) {
          const queryKeys = this.tableToQueries.get(table);
          if (queryKeys) {
            queryKeys.delete(queryKey);
            if (queryKeys.size === 0) {
              this.tableToQueries.delete(table);
            }
          }
        }
      }
    };
  }

  /**
   * Invalidate all queries that depend on the given tables.
   * This triggers re-fetches for all subscribed components.
   * 
   * @param tables - Table names that have changed
   */
  invalidateTables(tables: string[]): void {
    const affectedQueries = new Set<string>();
    
    // Find all queries that depend on these tables
    for (const table of tables) {
      const queryKeys = this.tableToQueries.get(table);
      if (queryKeys) {
        for (const key of queryKeys) {
          affectedQueries.add(key);
        }
      }
    }
    
    // Notify all subscribers of affected queries
    for (const queryKey of affectedQueries) {
      const entry = this.queries.get(queryKey);
      if (entry) {
        for (const callback of entry.subscribers) {
          callback();
        }
      }
    }
  }

  /**
   * Invalidate all queries (useful for full database refresh)
   */
  invalidateAll(): void {
    for (const entry of this.queries.values()) {
      for (const callback of entry.subscribers) {
        callback();
      }
    }
  }

  /**
   * Get the number of active queries (for debugging)
   */
  getActiveQueryCount(): number {
    return this.queries.size;
  }

  /**
   * Clear all subscriptions (for cleanup)
   */
  clear(): void {
    this.queries.clear();
    this.tableToQueries.clear();
  }
}

/**
 * Generate a unique query key from table name and query options
 */
export function generateQueryKey(
  table: string,
  options: {
    where?: Array<{ column: string; operator: string; value: unknown }>;
    orderBy?: { column: string; direction: 'asc' | 'desc' };
    limit?: number;
  }
): string {
  const parts = [table];
  
  if (options.where && options.where.length > 0) {
    const wherePart = options.where
      .map(w => `${w.column}${w.operator}${JSON.stringify(w.value)}`)
      .join('&');
    parts.push(`where:${wherePart}`);
  }
  
  if (options.orderBy) {
    parts.push(`order:${options.orderBy.column}:${options.orderBy.direction}`);
  }
  
  if (options.limit !== undefined) {
    parts.push(`limit:${options.limit}`);
  }
  
  return parts.join('|');
}

/**
 * Generate a unique query key for raw SQL queries
 */
export function generateSQLQueryKey(sql: string, params?: unknown[]): string {
  const parts = ['sql', sql];
  
  if (params && params.length > 0) {
    parts.push(`params:${JSON.stringify(params)}`);
  }
  
  return parts.join('|');
}
