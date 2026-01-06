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
export declare function usePeers(dbName: string): PeersResult;
//# sourceMappingURL=usePeers.d.ts.map