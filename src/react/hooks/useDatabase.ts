import { useDatabaseContext } from '../context';
import type { SyncableDatabase } from '../../index';

/**
 * Get the raw SyncableDatabase instance.
 * Useful for operations not covered by other hooks (export, import, etc.)
 * 
 * @param dbName - Database name (required for multi-database support)
 * 
 * @example
 * ```tsx
 * function ExportButton() {
 *   const db = useDatabase('my-app');
 *   
 *   const handleExport = async () => {
 *     const data = await db.export();
 *     // Save to file...
 *   };
 *   
 *   return <button onClick={handleExport}>Export</button>;
 * }
 * ```
 */
export function useDatabase(dbName: string): SyncableDatabase | null {
  const context = useDatabaseContext(dbName);
  return context?.db ?? null;
}
