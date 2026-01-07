import React from 'react';
import type { SyncableDatabase } from '../index';
import type { SchemaDef } from '../schema';
import { QueryStore } from './store';
import type { DatabaseContextValue, DatabaseProviderProps } from './types';
/**
 * DatabaseProvider - Provides database access to child components
 *
 * @example
 * ```tsx
 * <DatabaseProvider name="my-app" schema={schema} mode="syncing" peerServer={config}>
 *   <App />
 * </DatabaseProvider>
 * ```
 */
export declare function DatabaseProvider<S extends SchemaDef>({ name, schema, mode, peerServer, discoveryInterval, children, }: DatabaseProviderProps<S>): React.ReactElement | null;
/**
 * Get the database context for a specific database name.
 * Used internally by hooks.
 */
export declare function useDatabaseContext<S extends SchemaDef = SchemaDef>(dbName?: string): DatabaseContextValue<S> | null;
/**
 * Hook to get a database context object with scoped hooks.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const db = useDatabaseContext('my-db');
 *   const { data } = db.useQuery('todos').exec();
 * }
 * ```
 */
export declare function useDB<S extends SchemaDef>(dbName: string): {
    instance: null;
    name: string;
    schema: null;
    _store: null;
} | {
    instance: SyncableDatabase;
    name: string;
    schema: import(".").Schema<S>;
    _store: QueryStore;
};
//# sourceMappingURL=context.d.ts.map