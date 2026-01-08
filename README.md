# Syncable SQLite

A browser-based SQLite database with OPFS persistence and WebRTC peer-to-peer syncing.

## Features

- SQLite in the browser via WebAssembly
- Persistent storage using OPFS (Origin Private File System)
- P2P syncing via WebRTC (PeerJS)
- Automatic schema columns (`id`, `updated_at`, `deleted`)
- Last-write-wins conflict resolution
- Soft deletes for proper sync behavior
- React hooks with full TypeScript support
- Schema-driven type inference

## Installation

```bash
npm install syncable-sqlite
```

## Quick Start

```javascript
import { createDatabase } from 'syncable-sqlite';

const db = await createDatabase('my-database', { mode: 'local' });

await db.exec('CREATE TABLE tasks (title TEXT, completed INTEGER)');
await db.exec("INSERT INTO tasks (title, completed) VALUES ('Buy groceries', 0)");

const result = await db.exec('SELECT * FROM tasks');
console.log(result.rows);
// [{ id: 'uuid', title: 'Buy groceries', completed: 0, updated_at: 1234567890, deleted: 0 }]

await db.close();
```

---

## Core API

### `createDatabase(name, config)`

Creates a new database instance.

```javascript
import { createDatabase } from 'syncable-sqlite';

// Local mode
const db = await createDatabase('my-db', { mode: 'local' });

// Syncing mode (uses PeerJS cloud by default - zero config!)
const db = await createDatabase('my-db', { mode: 'syncing' });

// With custom peer server
const db = await createDatabase('my-db', {
  mode: 'syncing',
  peerServer: {
    host: 'my-server.com',
    port: 9000,
    path: '/',
    secure: true,
    fallbackToCloud: true  // optional: fall back to PeerJS cloud if server fails
  },
  discoveryInterval: 5000,  // optional, default 5000ms
  onFallbackToCloud: (reason) => {
    console.log('Using PeerJS cloud due to:', reason);
  }
});
```

### `db.exec(sql, params?)`

Execute SQL statements. Returns `{ rows, columns, affectedRows }`.

```javascript
await db.exec('CREATE TABLE users (name TEXT, email TEXT)');
await db.exec("INSERT INTO users (name, email) VALUES (?, ?)", ['Alice', 'alice@example.com']);
await db.exec("UPDATE users SET name = ? WHERE email = ?", ['Alicia', 'alice@example.com']);
await db.exec("DELETE FROM users WHERE email = ?", ['alice@example.com']);
const result = await db.exec('SELECT * FROM users WHERE name = ?', ['Alicia']);
```

### Export / Import

```javascript
// SQL dump format (for syncing/merging)
const sqlDump = await db.export();
await db.import(sqlDump);
await db.merge(remoteSqlDump);  // last-write-wins merge

// Native SQLite binary format (for file storage)
const binary = await db.exportBinary();
await db.importBinary(binary);       // replaces entire database
await db.mergeBinary(binary);        // last-write-wins merge

// Download as file
await db.saveToFile('backup.sqlite');
```

### `db.close()`

Close the database and clean up resources.

```javascript
await db.close();
```

---

## Syncing API

Available when `mode: 'syncing'`.

### Peer Management

```javascript
const peerId = db.getPeerId();                    // Get this database's peer ID
await db.connectToPeer('remote-peer-id');         // Connect to a peer
await db.disconnectFromPeer('remote-peer-id');    // Disconnect from a peer
const peers = db.getConnectedPeers();             // [{ id, status }]
const connected = db.isConnected();               // boolean
```

### Data Sync

**Live Sync (Real-time)**

When connected, mutations are automatically broadcast to peers in real-time. No additional code needed - just connect and changes sync automatically.

**Manual Sync Methods**

```javascript
// One-way sync (replace remote with local or vice versa)
await db.exportToPeer(peerId);      // Pull remote peer's data into local
await db.importFromPeer(peerId);    // Push local data to remote peer
await db.exportToAllPeers();        // Pull from all peers
await db.importFromAllPeers();      // Push to all peers

// Merge sync (combines data using last-write-wins)
await db.mergeFromPeer(peerId);     // Pull and merge from peer
await db.mergeToPeer(peerId);       // Push to peer for merging
await db.mergeFromAllPeers();       // Merge from all connected peers
await db.mergeToAllPeers();         // Push merge to all connected peers
await db.syncWithPeer(peerId);      // Bidirectional merge (pull then push)
await db.syncWithAllPeers();        // Bidirectional merge with all peers
```

### Auto-Discovery

Peers with the same database name automatically discover each other. Discovery works with:
- **PeerJS cloud** (default): Zero configuration required
- **Custom PeerJS server**: Run with `--allow_discovery` flag

```javascript
await db.discoverPeers();  // Manually trigger discovery
```

### Offline Queue

Operations performed while disconnected are queued.

```javascript
const queue = db.getQueuedOperations();   // Get pending operations
await db.pushQueuedOperations();          // Send queued ops to peers
db.clearQueue();                          // Discard queued ops
```

### Event Callbacks

```javascript
db.onPeerConnected((peerId) => console.log('Connected:', peerId));
db.onPeerDisconnected((peerId) => console.log('Disconnected:', peerId));
db.onSyncReceived((operation) => console.log('Sync:', operation.table, operation.rowId));
db.onMutation((tables) => console.log('Mutation in:', tables));
db.onDataChanged(() => console.log('Data changed via merge/import'));
```

| Callback | Triggered When |
|----------|----------------|
| `onPeerConnected` | A peer connection is established |
| `onPeerDisconnected` | A peer disconnects |
| `onSyncReceived` | A real-time sync operation arrives from a peer |
| `onMutation` | Local SQL mutations (INSERT/UPDATE/DELETE) |
| `onDataChanged` | Data changes via `merge()`, `mergeBinary()`, `import()`, or `importBinary()` |

---

## React API

### Setup

```tsx
import { defineSchema, defineTable, column } from 'syncable-sqlite/schema';
import { DatabaseProvider, useQuery, useMutation } from 'syncable-sqlite/react';

const schema = defineSchema({
  todos: defineTable({
    title: column.text(),
    completed: column.boolean(),
    priority: column.integer().optional(),
  }),
});

function App() {
  return (
    <DatabaseProvider name="my-app" schema={schema} mode="local">
      <TodoList />
    </DatabaseProvider>
  );
}
```

### Schema Definition

```typescript
import { defineSchema, defineTable, column } from 'syncable-sqlite/schema';

const schema = defineSchema({
  users: defineTable({
    name: column.text(),
    email: column.text(),
    age: column.integer().optional(),
    active: column.boolean(),
  }),
});

// Column types:
// column.text()     -> string
// column.integer()  -> number
// column.real()     -> number
// column.boolean()  -> boolean (stored as INTEGER 0/1)
// column.blob()     -> Uint8Array
// .optional()       -> makes column nullable
```

### DatabaseProvider

```tsx
// Zero-config syncing (uses PeerJS cloud)
<DatabaseProvider name="my-app" schema={schema} mode="syncing">
  <App />
</DatabaseProvider>

// With custom peer server and fallback
<DatabaseProvider
  name="my-app"
  schema={schema}
  mode="syncing"
  peerServer={{ 
    host: 'my-server.com', 
    port: 9000, 
    secure: true,
    fallbackToCloud: true 
  }}
  discoveryInterval={5000}
  onFallbackToCloud={(reason) => console.log('Fallback:', reason)}
>
  <App />
</DatabaseProvider>
```

Nest providers for multiple databases:

```tsx
<DatabaseProvider name="app-db" schema={appSchema} mode="syncing" peerServer={config}>
  <DatabaseProvider name="cache" schema={cacheSchema} mode="local">
    <App />
  </DatabaseProvider>
</DatabaseProvider>
```

### useQuery

Reactive queries with builder pattern. Auto-refetches on mutations.

```tsx
const { data, isLoading, error, refetch } = useQuery('my-app', 'todos')
  .where('completed', '=', false)
  .where('priority', '>=', 1)
  .orderBy('updated_at', 'desc')
  .limit(10)
  .exec();
```

Operators: `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IN`

### useSQL

Raw SQL for complex queries (JOINs, GROUP BY, subqueries).

```tsx
interface Stats { category: string; count: number; }

const { data, isLoading, error, refetch } = useSQL<Stats>(
  'my-app',
  `SELECT category, COUNT(*) as count 
   FROM products 
   WHERE deleted = 0 
   GROUP BY category`,
  { tables: ['products'] }  // for reactivity
);

// With parameters
const { data } = useSQL<User>('my-app', 'SELECT * FROM users WHERE id = ?', {
  params: [userId],
  tables: ['users'],
});
```

### useMutation

```tsx
const { insert, update, remove, isLoading, error } = useMutation('my-app', 'todos');

const todo = await insert({ title: 'Test', completed: false });  // returns full row
const updated = await update(todo.id, { completed: true });
const removed = await remove(todo.id);  // soft delete
```

### useSyncStatus

```tsx
const { isConnected, peerCount, pendingOperations, peerId, mode } = useSyncStatus('my-app');
```

### usePeers

```tsx
const { peers, connectToPeer, disconnectFromPeer, pushQueue, clearQueue } = usePeers('my-app');
```

### useDatabase

Direct access to the database instance.

```tsx
const db = useDatabase('my-app');
const data = await db.export();
```

### useIsDatabaseReady

```tsx
const isReady = useIsDatabaseReady('my-app');
if (!isReady) return <Loading />;
```

---

## Automatic Schema

Tables automatically receive these columns:

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PRIMARY KEY | Auto-generated UUID |
| `updated_at` | INTEGER | Unix timestamp (ms), auto-updated |
| `deleted` | INTEGER | 0 = active, 1 = soft-deleted |

SQL is automatically rewritten:
- INSERT: Generates `id`, `updated_at`, sets `deleted=0`
- UPDATE: Updates `updated_at`
- DELETE: Converts to `UPDATE ... SET deleted=1`
- SELECT: Adds `WHERE deleted = 0`

---

## Conflict Resolution

Merge uses **last-write-wins**:
1. Rows matched by `id`
2. Higher `updated_at` timestamp wins
3. Deleted rows excluded from results

---

## Vite Configuration

```javascript
import { defineConfig } from 'vite';
import { syncableSqliteVitePlugin } from 'syncable-sqlite';

export default defineConfig({
  plugins: [syncableSqliteVitePlugin()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['syncable-sqlite'],
  },
});
```

For production, copy WASM assets to dist:

```javascript
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function copySqliteAssetsPlugin() {
  return {
    name: 'copy-sqlite-assets',
    writeBundle() {
      const srcDir = resolve(__dirname, 'node_modules/syncable-sqlite/dist');
      const destDir = resolve(__dirname, 'dist/assets');
      mkdirSync(destDir, { recursive: true });
      
      ['sqlite3.wasm', 'sqlite3-opfs-async-proxy.js'].forEach(file => {
        const src = resolve(srcDir, file);
        if (existsSync(src)) copyFileSync(src, resolve(destDir, file));
      });
    },
  };
}
```

---

## PeerJS Server

By default, syncing mode uses the **PeerJS public cloud server** - no setup required!

For production or private deployments, run your own server:

```bash
npm install --save-dev peer
npx peerjs --port 9000 --allow_discovery
```

Then configure:

```javascript
const db = await createDatabase('my-db', {
  mode: 'syncing',
  peerServer: {
    host: 'your-server.com',
    port: 9000,
    secure: true,
    fallbackToCloud: true  // optional: use PeerJS cloud as backup
  }
});
```

### Server Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `host` | string | PeerJS cloud | Your PeerJS server hostname |
| `port` | number | 443 | Server port |
| `path` | string | `/` | Server path |
| `secure` | boolean | true | Use HTTPS/WSS |
| `fallbackToCloud` | boolean | false | Fall back to PeerJS cloud on connection failure |

---

## Requirements

- Modern browser with ES2022, Web Workers, OPFS, WebRTC support

## License

MIT
