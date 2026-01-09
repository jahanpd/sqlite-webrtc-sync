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
  /** Callback fired when peer connection fails (database still works locally) */
  onPeerError?: (error: Error) => void;
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

// Sync status
export interface SyncStatus {
  isConnected: boolean;
  peerCount: number;
  pendingOperations: number;
  peerId: string | null;
  mode: 'syncing' | 'local';
}

// Peers hook result
export interface PeersResult {
  peers: PeerInfo[];
  connectToPeer: (peerId: string) => Promise<void>;
  disconnectFromPeer: (peerId: string) => Promise<void>;
  pushQueue: () => Promise<void>;
  clearQueue: () => void;
}

// Query builder where clause
export interface WhereClause {
  column: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN';
  value: unknown;
}

// Query builder order by
export interface OrderByClause {
  column: string;
  direction: 'asc' | 'desc';
}

// Query builder options (internal)
export interface QueryBuilderOptions {
  where: WhereClause[];
  orderBy?: OrderByClause;
  limit?: number;
}

// Raw SQL query options
export interface SQLQueryOptions {
  /** SQL parameters for prepared statements */
  params?: unknown[];
  /** Tables this query depends on (for reactivity) */
  tables?: string[];
}

// Re-export types from main module
export type { SyncableDatabase, PeerServerConfig, PeerInfo, SyncOperation };
