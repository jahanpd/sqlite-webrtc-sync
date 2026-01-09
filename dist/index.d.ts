type DatabaseMode = 'syncing' | 'local';
export interface IceServer {
    urls: string | string[];
    username?: string;
    credential?: string;
}
export interface PeerServerConfig {
    host?: string;
    port?: number;
    path?: string;
    secure?: boolean;
    fallbackToCloud?: boolean;
    iceServers?: IceServer[];
}
type FallbackCallback = (reason: string) => void;
type PeerErrorCallback = (error: Error) => void;
export interface DatabaseConfig {
    mode: DatabaseMode;
    peerServer?: PeerServerConfig;
    discoveryInterval?: number;
    onFallbackToCloud?: FallbackCallback;
    onPeerError?: PeerErrorCallback;
}
export interface QueryResult {
    rows: Record<string, unknown>[];
    columns: string[];
    affectedRows?: AffectedRow[];
}
export interface AffectedRow {
    id: string;
    table: string;
}
export interface PeerInfo {
    id: string;
    status: 'connecting' | 'connected' | 'disconnected';
}
export interface SyncOperation {
    id: string;
    timestamp: number;
    sql: string;
    params: unknown[];
    table: string;
    rowId: string;
}
type PeerConnectedCallback = (peerId: string) => void;
type PeerDisconnectedCallback = (peerId: string) => void;
type SyncReceivedCallback = (operation: SyncOperation) => void;
type MutationCallback = (tables: string[]) => void;
type DataChangedCallback = () => void;
export declare class SyncableDatabase {
    private static instances;
    private static pendingCreations;
    private dbName;
    private mode;
    private peerServerConfig?;
    private discoveryInterval;
    private worker;
    private peer;
    private peerId;
    private peers;
    private pendingRequests;
    private nextRequestId;
    private isInitialized;
    private isClosed;
    private refCount;
    private closeTimeout;
    private static readonly CLOSE_DELAY;
    private activeServerConfig;
    private discoveryTimer;
    private peerRetryTimer;
    private operationQueue;
    private appliedOperations;
    private onPeerConnectedCallbacks;
    private onPeerDisconnectedCallbacks;
    private onSyncReceivedCallbacks;
    private onMutationCallbacks;
    private onDataChangedCallbacks;
    private onFallbackToCloudCallback?;
    private onPeerErrorCallback?;
    private constructor();
    /**
     * Create or get existing database instance.
     * Uses singleton pattern to prevent duplicate instances (e.g., from React Strict Mode).
     */
    static create(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase>;
    private init;
    /**
     * Attempts to initialize peer connection with automatic retry on failure.
     * This is non-blocking - the database works locally even if peer connection fails.
     */
    private initPeerWithRetry;
    /**
     * Schedules periodic retry of peer connection.
     */
    private schedulePeerRetry;
    /**
     * Clears the peer retry timer.
     */
    private clearPeerRetryTimer;
    /**
     * Attempts to initialize peer connection. Throws on failure.
     */
    private tryInitPeer;
    private initPeer;
    private startDiscovery;
    discoverPeers(): Promise<void>;
    private handleIncomingConnection;
    private sendRequest;
    exec(sql: string, params?: unknown[]): Promise<QueryResult>;
    private broadcastOperation;
    applyRemoteOperation(operation: SyncOperation): Promise<void>;
    export(): Promise<Uint8Array>;
    exportBinary(): Promise<Uint8Array>;
    saveToFile(filename?: string): Promise<void>;
    import(data: Uint8Array): Promise<void>;
    importBinary(data: Uint8Array): Promise<void>;
    connectToPeer(peerId: string): Promise<void>;
    disconnectFromPeer(peerId: string): Promise<void>;
    exportToPeer(peerId: string): Promise<void>;
    importFromPeer(peerId: string): Promise<void>;
    exportToAllPeers(): Promise<void>;
    importFromAllPeers(): Promise<void>;
    mergeFromPeer(peerId: string): Promise<void>;
    mergeToPeer(peerId: string): Promise<void>;
    mergeFromAllPeers(): Promise<void>;
    mergeToAllPeers(): Promise<void>;
    syncWithPeer(peerId: string): Promise<void>;
    syncWithAllPeers(): Promise<void>;
    merge(remoteData: Uint8Array): Promise<void>;
    mergeBinary(binaryData: Uint8Array): Promise<void>;
    getPeerId(): string | null;
    getConnectedPeers(): PeerInfo[];
    isConnected(): boolean;
    getQueuedOperations(): SyncOperation[];
    pushQueuedOperations(): Promise<void>;
    clearQueue(): void;
    /**
     * Register a callback that fires when a peer connects.
     * @returns Unsubscribe function to remove the callback
     */
    onPeerConnected(callback: PeerConnectedCallback): () => void;
    /**
     * Register a callback that fires when a peer disconnects.
     * @returns Unsubscribe function to remove the callback
     */
    onPeerDisconnected(callback: PeerDisconnectedCallback): () => void;
    /**
     * Register a callback that fires when a sync operation is received from a peer.
     * @returns Unsubscribe function to remove the callback
     */
    onSyncReceived(callback: SyncReceivedCallback): () => void;
    /**
     * Register a callback that fires when a mutation (INSERT, UPDATE, DELETE) occurs.
     * This is used by React hooks to trigger re-renders.
     * @returns Unsubscribe function to remove the callback
     */
    onMutation(callback: MutationCallback): () => void;
    /**
     * Register a callback that fires when data changes from bulk operations (merge, import).
     * This is used by React hooks to trigger re-renders when peer sync completes.
     * @returns Unsubscribe function to remove the callback
     */
    onDataChanged(callback: DataChangedCallback): () => void;
    private emitPeerConnected;
    /**
     * Flush all queued operations to a specific peer.
     * Called automatically when a peer connects.
     */
    private flushQueueToPeer;
    private emitPeerDisconnected;
    private emitSyncReceived;
    private emitMutation;
    private emitDataChanged;
    close(): Promise<void>;
    private doClose;
}
export declare function createDatabase(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase>;
export declare function syncableSqliteVitePlugin(): {
    name: string;
    configureServer(server: any): void;
    configurePreviewServer(server: any): void;
};
export {};
//# sourceMappingURL=index.d.ts.map