import { useState, useEffect } from 'react';
import { useDatabaseContext } from '../context';
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
export function useSyncStatus(dbName: string): SyncStatus {
  const context = useDatabaseContext(dbName);
  const { db } = context;
  
  // Determine mode from whether isConnected method exists on db
  const isSyncingMode = typeof db.isConnected === 'function';
  
  const [status, setStatus] = useState<SyncStatus>(() => ({
    isConnected: isSyncingMode ? db.isConnected() : false,
    peerCount: db.getConnectedPeers?.()?.length ?? 0,
    pendingOperations: db.getQueuedOperations?.()?.length ?? 0,
    peerId: db.getPeerId?.() ?? null,
    mode: isSyncingMode ? 'syncing' : 'local',
  }));
  
  useEffect(() => {
    // Update status periodically and on events
    const updateStatus = () => {
      setStatus({
        isConnected: isSyncingMode ? db.isConnected() : false,
        peerCount: db.getConnectedPeers?.()?.length ?? 0,
        pendingOperations: db.getQueuedOperations?.()?.length ?? 0,
        peerId: db.getPeerId?.() ?? null,
        mode: isSyncingMode ? 'syncing' : 'local',
      });
    };
    
    // Register event listeners for syncing mode
    const hasEvents = typeof db.onPeerConnected === 'function';
    
    if (hasEvents) {
      db.onPeerConnected?.(() => updateStatus());
      db.onPeerDisconnected?.(() => updateStatus());
      db.onSyncReceived?.(() => updateStatus());
    }
    
    // Poll for updates (covers cases where events might be missed)
    const interval = setInterval(updateStatus, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [db]);
  
  return status;
}
