import type { SyncableDatabase, PeerServerConfig, PeerInfo, SyncOperation } from '../index';
import type { Schema, SchemaDef, InsertData, UpdateData, TableDef } from '../schema';
import type { QueryStore } from './store';
export interface DatabaseContextValue<S extends SchemaDef = SchemaDef> {
    db: SyncableDatabase;
    schema: Schema<S>;
    store: QueryStore;
    name: string;
}
export interface DatabaseProviderProps<S extends SchemaDef> {
    name: string;
    schema: Schema<S>;
    mode: 'syncing' | 'local';
    peerServer?: PeerServerConfig;
    discoveryInterval?: number;
    /** Callback fired when connection falls back to PeerJS cloud server */
    onFallbackToCloud?: (reason: string) => void;
    children: React.ReactNode;
}
export interface QueryResult<T> {
    data: T[] | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
export interface MutationResult<Row, T extends TableDef = TableDef> {
    insert: (data: InsertData<T>) => Promise<Row | null>;
    update: (id: string, data: UpdateData<T>) => Promise<Row | null>;
    remove: (id: string) => Promise<Row | null>;
    isLoading: boolean;
    error: Error | null;
}
export interface SyncStatus {
    isConnected: boolean;
    peerCount: number;
    pendingOperations: number;
    peerId: string | null;
    mode: 'syncing' | 'local';
}
export interface PeersResult {
    peers: PeerInfo[];
    connectToPeer: (peerId: string) => Promise<void>;
    disconnectFromPeer: (peerId: string) => Promise<void>;
    pushQueue: () => Promise<void>;
    clearQueue: () => void;
}
export interface WhereClause {
    column: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN';
    value: unknown;
}
export interface OrderByClause {
    column: string;
    direction: 'asc' | 'desc';
}
export interface QueryBuilderOptions {
    where: WhereClause[];
    orderBy?: OrderByClause;
    limit?: number;
}
export interface SQLQueryOptions {
    /** SQL parameters for prepared statements */
    params?: unknown[];
    /** Tables this query depends on (for reactivity) */
    tables?: string[];
}
export type { SyncableDatabase, PeerServerConfig, PeerInfo, SyncOperation };
//# sourceMappingURL=types.d.ts.map