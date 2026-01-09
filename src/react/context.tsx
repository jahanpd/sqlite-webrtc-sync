import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createDatabase } from '../index';
import type { SyncableDatabase } from '../index';
import type { SchemaDef } from '../schema';
import { QueryStore } from './store';
import type { DatabaseContextValue, DatabaseProviderProps } from './types';

// Map of database name -> context
const databaseContexts = new Map<string, React.Context<DatabaseContextValue | null>>();

// Get or create a context for a database name
function getOrCreateContext(name: string): React.Context<DatabaseContextValue | null> {
  let ctx = databaseContexts.get(name);
  if (!ctx) {
    ctx = createContext<DatabaseContextValue | null>(null);
    ctx.displayName = `DatabaseContext(${name})`;
    databaseContexts.set(name, ctx);
  }
  return ctx;
}

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
export function DatabaseProvider<S extends SchemaDef>({
  name,
  schema,
  mode,
  peerServer,
  discoveryInterval,
  onFallbackToCloud,
  onPeerError,
  children,
}: DatabaseProviderProps<S>): React.ReactElement | null {
  const [contextValue, setContextValue] = useState<DatabaseContextValue<S> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const storeRef = useRef<QueryStore>(new QueryStore());
  const dbRef = useRef<SyncableDatabase | null>(null);

  // Initialize database
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // Create database
        const db = await createDatabase(name, {
          mode,
          peerServer,
          discoveryInterval,
          onFallbackToCloud,
          onPeerError,
        });

        if (!mounted) {
          await db.close();
          return;
        }

        dbRef.current = db;

        // Initialize schema - run CREATE TABLE for all tables
        const sqlStatements = schema.toSQL();
        for (const sql of sqlStatements) {
          await db.exec(sql);
        }

        // Register mutation listener to invalidate queries (for local reactivity)
        db.onMutation((tables) => {
          storeRef.current.invalidateTables(tables);
        });

        // Register sync event listener to invalidate queries (for remote sync)
        if (mode === 'syncing') {
          db.onSyncReceived((operation) => {
            storeRef.current.invalidateTables([operation.table]);
          });
        }

        // Register data changed listener to invalidate all queries (for merge/import)
        db.onDataChanged(() => {
          storeRef.current.invalidateAll();
        });

        if (!mounted) {
          await db.close();
          return;
        }

        // Set context value
        setContextValue({
          db,
          schema,
          store: storeRef.current,
          name,
        });
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    }

    init();

    return () => {
      mounted = false;
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
      }
      storeRef.current.clear();
    };
  }, [name, mode, peerServer, discoveryInterval, onFallbackToCloud, onPeerError, schema]);

  // Get context for this database name
  const Context = getOrCreateContext(name);

  if (error) {
    throw error;
  }

  return (
    <Context.Provider value={contextValue as DatabaseContextValue}>
      {children}
    </Context.Provider>
  );
}

/**
 * Get the database context for a specific database name.
 * Used internally by hooks.
 */
export function useDatabaseContext<S extends SchemaDef = SchemaDef>(
  dbName?: string
): DatabaseContextValue<S> | null {
  // If no name provided, try to find a context
  // This is a simplified approach - walks up looking for any database context
  
  // For now, we require the database name
  if (!dbName) {
    throw new Error(
      'useDatabaseContext requires a database name. ' +
      'Use useDatabaseContext("my-db-name") or access through the database object.'
    );
  }

  const Context = databaseContexts.get(dbName);
  if (!Context) {
    throw new Error(
      `No DatabaseProvider found for "${dbName}". ` +
      'Make sure to wrap your component tree with <DatabaseProvider name="${dbName}" ...>'
    );
  }

  const context = useContext(Context);
  if (!context) {
    return null;
  }

  return context as DatabaseContextValue<S>;
}

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
export function useDB<S extends SchemaDef>(dbName: string) {
  const context = useDatabaseContext<S>(dbName);

  if (!context) {
    return {
      instance: null,
      name: dbName,
      schema: null,
      _store: null,
    };
  }

  return {
    instance: context.db,
    name: context.name,
    schema: context.schema,
    _store: context.store,
  };
}
