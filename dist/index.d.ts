type DatabaseMode = 'syncing' | 'local';
export interface PeerServerConfig {
    host?: string;
    port?: number;
    path?: string;
    secure?: boolean;
}
export interface DatabaseConfig {
    mode: DatabaseMode;
    peerServer?: PeerServerConfig;
    discoveryInterval?: number;
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
    table: string;
    rowId: string;
}
type PeerConnectedCallback = (peerId: string) => void;
type PeerDisconnectedCallback = (peerId: string) => void;
type SyncReceivedCallback = (operation: SyncOperation) => void;
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
    private discoveryTimer;
    private operationQueue;
    private appliedOperations;
    private onPeerConnectedCallbacks;
    private onPeerDisconnectedCallbacks;
    private onSyncReceivedCallbacks;
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
    import(data: Uint8Array): Promise<void>;
    connectToPeer(peerId: string): Promise<void>;
    disconnectFromPeer(peerId: string): Promise<void>;
    exportToPeer(peerId: string): Promise<void>;
    importFromPeer(peerId: string): Promise<void>;
    exportToAllPeers(): Promise<void>;
    importFromAllPeers(): Promise<void>;
    merge(remoteData: Uint8Array): Promise<void>;
    getPeerId(): string | null;
    getConnectedPeers(): PeerInfo[];
    isConnected(): boolean;
    getQueuedOperations(): SyncOperation[];
    pushQueuedOperations(): Promise<void>;
    clearQueue(): void;
    onPeerConnected(callback: PeerConnectedCallback): void;
    onPeerDisconnected(callback: PeerDisconnectedCallback): void;
    onSyncReceived(callback: SyncReceivedCallback): void;
    private emitPeerConnected;
    private emitPeerDisconnected;
    private emitSyncReceived;
    close(): Promise<void>;
}
export declare function createDatabase(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase>;
export {};
//# sourceMappingURL=index.d.ts.map