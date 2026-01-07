import type { SyncableDatabase, PeerServerConfig, PeerInfo, SyncOperation } from '../index';
import type { Schema, SchemaDef, InsertData, UpdateData } from '../schema';
import type { QueryStore } from './store';

// Database context value
export interface DatabaseContextValue<S extends SchemaDef = SchemaDef> {
  db: SyncableDatabase;
  schema: Schema<S>;
  store: QueryStore;
  name: string;
}

// Provider props
export interface DatabaseProviderProps<S extends SchemaDef> {
  /** Unique database name */
  name: string;
  /** Schema definition */
  schema: Schema<S>;
  /** Database mode */
  mode: 'syncing' | 'local';
  /** PeerJS server config (required for syncing mode) */
  peerServer?: PeerServerConfig;
  /** Discovery interval in ms (default: 5000) */
  discoveryInterval?: number;
  /** Children */
  children: React.ReactNode;
}

// Query result
export interface QueryResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Mutation result
export interface MutationResult<Row> {
  insert: (data: InsertData<Row>) => Promise<Row>;
  update: (id: string, data: UpdateData<Row>) => Promise<Row>;
  remove: (id: string) => Promise<Row>;
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
