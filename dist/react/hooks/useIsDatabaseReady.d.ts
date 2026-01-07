/**
 * Hook to check if the database provider is ready.
 * Returns false during initialization, true when database is fully loaded.
 *
 * @param dbName - Database name
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isReady = useIsDatabaseReady('my-app');
 *
 *   if (!isReady) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   return <ActualContent />;
 * }
 * ```
 */
export declare function useIsDatabaseReady(dbName: string): boolean;
//# sourceMappingURL=useIsDatabaseReady.d.ts.map