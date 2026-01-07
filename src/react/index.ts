// Context and Provider
export { DatabaseProvider, useDatabaseContext, useDB } from './context';

// Hooks
export { useDatabase } from './hooks/useDatabase';
export { useQuery } from './hooks/useQuery';
export { useSQL } from './hooks/useSQL';
export { useMutation } from './hooks/useMutation';
export { useSyncStatus } from './hooks/useSyncStatus';
export { usePeers } from './hooks/usePeers';
export { useIsDatabaseReady } from './hooks/useIsDatabaseReady';

// Types
export type {
  DatabaseProviderProps,
  DatabaseContextValue,
  QueryResult,
  MutationResult,
  SyncStatus,
  PeersResult,
  WhereClause,
  OrderByClause,
  SQLQueryOptions,
} from './types';

// Re-export schema types for convenience
export type {
  Schema,
  SchemaDef,
  TableDef,
  InferRow,
  InferSchema,
  InsertData,
  UpdateData,
  TableNames,
  RowType,
} from '../schema';
