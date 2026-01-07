import { useDatabaseContext } from '../context';

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
export function useIsDatabaseReady(dbName: string): boolean {
  const context = useDatabaseContext(dbName);
  return context !== null;
}
