import { useState, useEffect, useCallback } from 'react';
import { useDatabaseContext } from '../context';
import type { PeerInfo } from '../../index';
import type { PeersResult } from '../types';

/**
 * Hook for managing peer connections.
 * 
 * @param dbName - Database name
 * 
 * @example
 * ```tsx
 * function PeerManager() {
 *   const { peers, connectToPeer, disconnectFromPeer, pushQueue } = usePeers('my-app');
 *   const [remotePeerId, setRemotePeerId] = useState('');
 *   
 *   return (
 *     <div>
 *       <input 
 *         value={remotePeerId}
 *         onChange={e => setRemotePeerId(e.target.value)}
 *         placeholder="Peer ID"
 *       />
 *       <button onClick={() => connectToPeer(remotePeerId)}>Connect</button>
 *       
 *       <h3>Connected Peers</h3>
 *       <ul>
 *         {peers.map(peer => (
 *           <li key={peer.id}>
 *             {peer.id} ({peer.status})
 *             <button onClick={() => disconnectFromPeer(peer.id)}>Disconnect</button>
 *           </li>
 *         ))}
 *       </ul>
 *       
 *       <button onClick={pushQueue}>Push Offline Queue</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePeers(dbName: string): PeersResult {
  const context = useDatabaseContext(dbName);

  if (!context) {
    return {
      peers: [],
      connectToPeer: async () => { throw new Error('Database still initializing'); },
      disconnectFromPeer: async () => { throw new Error('Database still initializing'); },
      pushQueue: async () => { throw new Error('Database still initializing'); },
      clearQueue: () => {},
    };
  }

  const { db } = context;
  
  const [peers, setPeers] = useState<PeerInfo[]>(() => 
    db.getConnectedPeers?.() ?? []
  );
  
  // Update peers list on changes
  useEffect(() => {
    const updatePeers = () => {
      setPeers(db.getConnectedPeers?.() ?? []);
    };
    
    // Register event listeners
    const hasEvents = typeof db.onPeerConnected === 'function';
    
    if (hasEvents) {
      db.onPeerConnected?.(() => updatePeers());
      db.onPeerDisconnected?.(() => updatePeers());
    }
    
    // Poll for updates as backup
    const interval = setInterval(updatePeers, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [db]);
  
  const connectToPeer = useCallback(async (peerId: string) => {
    await db.connectToPeer(peerId);
    setPeers(db.getConnectedPeers?.() ?? []);
  }, [db]);
  
  const disconnectFromPeer = useCallback(async (peerId: string) => {
    await db.disconnectFromPeer(peerId);
    setPeers(db.getConnectedPeers?.() ?? []);
  }, [db]);
  
  const pushQueue = useCallback(async () => {
    await db.pushQueuedOperations?.();
  }, [db]);
  
  const clearQueue = useCallback(() => {
    db.clearQueue?.();
  }, [db]);
  
  return { peers, connectToPeer, disconnectFromPeer, pushQueue, clearQueue };
}
