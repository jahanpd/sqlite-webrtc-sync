type DatabaseMode = 'syncing' | 'local';
export interface PeerServerConfig {
    host?: string;
    port?: number;
    path?: string;
    secure?: boolean;
    fallbackToCloud?: boolean;
}
type FallbackCallback = (reason: string) => void;
export interface DatabaseConfig {
    mode: DatabaseMode;
    peerServer?: PeerServerConfig;
    discoveryInterval?: number;
    onFallbackToCloud?: FallbackCallback;
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
    private activeServerConfig;
    private discoveryTimer;
    private operationQueue;
    private appliedOperations;
    private onPeerConnectedCallbacks;
    private onPeerDisconnectedCallbacks;
    private onSyncReceivedCallbacks;
    private onMutationCallbacks;
    private onDataChangedCallbacks;
    private onFallbackToCloudCallback?;
    private constructor();
    static create(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase>;
    private init;
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
    onPeerConnected(callback: PeerConnectedCallback): void;
    onPeerDisconnected(callback: PeerDisconnectedCallback): void;
    onSyncReceived(callback: SyncReceivedCallback): void;
    /**
     * Register a callback that fires when a mutation (INSERT, UPDATE, DELETE) occurs.
     * This is used by React hooks to trigger re-renders.
     */
    onMutation(callback: MutationCallback): void;
    /**
     * Register a callback that fires when data changes from bulk operations (merge, import).
     * This is used by React hooks to trigger re-renders when peer sync completes.
     */
    onDataChanged(callback: DataChangedCallback): void;
    private emitPeerConnected;
    private emitPeerDisconnected;
    private emitSyncReceived;
    private emitMutation;
    private emitDataChanged;
    close(): Promise<void>;
}
export declare function createDatabase(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase>;
export declare function syncableSqliteVitePlugin(): {
    name: string;
    configureServer(server: any): void;
    configurePreviewServer(server: any): void;
};
export {};
//# sourceMappingURL=index.d.ts.map