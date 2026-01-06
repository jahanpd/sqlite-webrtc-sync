/**
 * QueryStore - Manages reactive query subscriptions and invalidation
 *
 * This is the core reactivity system that enables automatic re-renders
 * when data changes (from local mutations or remote sync).
 */
type Subscriber = () => void;
export declare class QueryStore {
    private queries;
    private tableToQueries;
    /**
     * Subscribe to a query. Returns unsubscribe function.
     *
     * @param queryKey - Unique identifier for the query
     * @param tables - Tables this query depends on
     * @param callback - Called when the query should be re-executed
     */
    subscribe(queryKey: string, tables: string[], callback: Subscriber): () => void;
    /**
     * Invalidate all queries that depend on the given tables.
     * This triggers re-fetches for all subscribed components.
     *
     * @param tables - Table names that have changed
     */
    invalidateTables(tables: string[]): void;
    /**
     * Invalidate all queries (useful for full database refresh)
     */
    invalidateAll(): void;
    /**
     * Get the number of active queries (for debugging)
     */
    getActiveQueryCount(): number;
    /**
     * Clear all subscriptions (for cleanup)
     */
    clear(): void;
}
/**
 * Generate a unique query key from table name and query options
 */
export declare function generateQueryKey(table: string, options: {
    where?: Array<{
        column: string;
        operator: string;
        value: unknown;
    }>;
    orderBy?: {
        column: string;
        direction: 'asc' | 'desc';
    };
    limit?: number;
}): string;
export {};
//# sourceMappingURL=store.d.ts.map