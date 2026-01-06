import type { SyncStatus } from '../types';
/**
 * Hook to get the current sync status of a database.
 *
 * @param dbName - Database name
 *
 * @example
 * ```tsx
 * function SyncBadge() {
 *   const { isConnected, peerCount, pendingOperations } = useSyncStatus('my-app');
 *
 *   return (
 *     <div>
 *       {isConnected ? `Connected (${peerCount} peers)` : 'Offline'}
 *       {pendingOperations > 0 && ` - ${pendingOperations} pending`}
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useSyncStatus(dbName: string): SyncStatus;
//# sourceMappingURL=useSyncStatus.d.ts.map