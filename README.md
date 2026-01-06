# Syncable SQLite

A browser-based SQLite database with OPFS persistence and WebRTC peer-to-peer syncing.

## Features

- **SQLite in the browser** - Full SQLite powered by SQLite WASM
- **Persistent storage** - Uses OPFS (Origin Private File System) for durable storage
- **P2P syncing** - Sync databases between browsers using WebRTC (via PeerJS)
- **Automatic schema** - Tables automatically get `id`, `updated_at`, and `deleted` columns
- **Last-write-wins merge** - Conflict resolution based on timestamps
- **Soft deletes** - Deleted rows are marked, not removed, enabling proper sync
- **React integration** - Fully typed hooks with reactive queries and mutations
- **Schema-driven types** - Define your schema once, get TypeScript types everywhere

## Installation

```bash
npm install syncable-sqlite

# For React integration, ensure React 18+ is installed
npm install react react-dom
```

### Installing from GitHub

```bash
# Install directly from GitHub
npm install github:your-username/syncable-sqlite

# Or with a specific branch/tag
npm install github:your-username/syncable-sqlite#main
```

## Quick Start

### Create a Local Database

```javascript
import { createDatabase } from 'syncable-sqlite';

// Create a local-only database
const db = await createDatabase('my-database', { mode: 'local' });

// Create a table
await db.exec('CREATE TABLE tasks (title TEXT, completed INTEGER)');

// Insert data
await db.exec("INSERT INTO tasks (title, completed) VALUES ('Buy groceries', 0)");

// Query data
const result = await db.exec('SELECT * FROM tasks');
console.log(result.rows);
// [{ id: 'uuid-here', title: 'Buy groceries', completed: 0, updated_at: 1234567890, deleted: 0 }]

// Close when done
await db.close();
```

### Create a Syncing Database

```javascript
import { createDatabase } from 'syncable-sqlite';

// Create a database with peer syncing enabled
const db = await createDatabase('my-syncing-db', { 
  mode: 'syncing',
  peerServer: {
    host: 'localhost',
    port: 9000,
    path: '/',
    secure: false
  }
});

// Get this database's peer ID (share this with other peers)
const peerId = db.getPeerId();
console.log('My peer ID:', peerId);
```

## API Reference

### `createDatabase(name, config)`

Creates a new database instance.

**Parameters:**
- `name` (string) - Unique name for the database
- `config` (object)
  - `mode` ('local' | 'syncing') - Database mode
  - `peerServer` (optional) - PeerJS server configuration
    - `host` (string) - Server hostname
    - `port` (number) - Server port
    - `path` (string) - Server path
    - `secure` (boolean) - Use HTTPS/WSS

**Returns:** `Promise<SyncableDatabase>`

### `db.exec(sql, params?)`

Execute a SQL statement.

```javascript
// Create table
await db.exec('CREATE TABLE users (name TEXT, email TEXT)');

// Insert (id, updated_at, deleted are auto-generated)
await db.exec("INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com')");

// Update (updated_at is auto-updated)
await db.exec("UPDATE users SET name = 'Alicia' WHERE email = 'alice@example.com'");

// Delete (converts to soft delete)
await db.exec("DELETE FROM users WHERE email = 'alice@example.com'");

// Select (automatically excludes soft-deleted rows)
const result = await db.exec('SELECT * FROM users');
```

**Returns:** `Promise<{ rows: object[], columns: string[] }>`

### `db.export()`

Export the database as a byte array.

```javascript
const data = await db.export();
// data is a Uint8Array containing SQL statements
```

**Returns:** `Promise<Uint8Array>`

### `db.import(data)`

Import data into the database.

```javascript
const data = await otherDb.export();
await db.import(data);
```

### `db.merge(remoteData)`

Merge remote data using last-write-wins conflict resolution.

```javascript
const remoteData = await otherDb.export();
await db.merge(remoteData);
// Rows with newer updated_at timestamps win
// Deleted rows are excluded
```

### `db.getPeerId()`

Get this database's peer ID (only in syncing mode).

```javascript
const peerId = db.getPeerId();
// Share this ID with other peers so they can connect
```

**Returns:** `string | null`

### `db.connectToPeer(peerId)`

Connect to another peer (only in syncing mode).

```javascript
await db.connectToPeer('remote-peer-id-here');
```

### `db.disconnectFromPeer(peerId)`

Disconnect from a peer.

```javascript
await db.disconnectFromPeer('remote-peer-id-here');
```

### `db.getConnectedPeers()`

Get list of connected peers.

```javascript
const peers = db.getConnectedPeers();
// [{ id: 'peer-id', status: 'connected' }]
```

**Returns:** `PeerInfo[]`

### `db.exportToPeer(peerId)`

Request data from a remote peer and import it locally.

```javascript
// Pull remote peer's data into this database
await db.exportToPeer('remote-peer-id');
```

### `db.importFromPeer(peerId)`

Send this database's data to a remote peer.

```javascript
// Push this database's data to remote peer
await db.importFromPeer('remote-peer-id');
```

### `db.exportToAllPeers()` / `db.importFromAllPeers()`

Batch operations for all connected peers.

```javascript
await db.exportToAllPeers(); // Pull from all peers
await db.importFromAllPeers(); // Push to all peers
```

## Auto-Discovery & Real-Time Sync

When using syncing mode with a PeerJS server that has `--allow_discovery` enabled, databases with the same name automatically discover and connect to each other.

### Auto-Discovery

Peer IDs are formatted as `{dbName}-{uuid}`, allowing peers sharing the same database name to automatically find each other. Discovery runs every 5 seconds by default.

```javascript
// Both instances will auto-discover each other
const dbA = await createDatabase('shared-db', { mode: 'syncing', peerServer: config });
const dbB = await createDatabase('shared-db', { mode: 'syncing', peerServer: config });

// After ~5 seconds, they're connected automatically
console.log(dbA.isConnected()); // true
```

### `db.discoverPeers()`

Manually trigger peer discovery.

```javascript
await db.discoverPeers();
```

### `db.isConnected()`

Check if connected to any peers.

```javascript
if (db.isConnected()) {
  console.log('Connected to at least one peer');
}
```

**Returns:** `boolean`

### Real-Time Sync

When connected, INSERT/UPDATE/DELETE operations are automatically broadcast to all connected peers in real-time.

```javascript
// On Peer A
await dbA.exec("INSERT INTO items (name) VALUES ('new-item')");

// Peer B automatically receives the change (no manual sync needed)
```

### Offline Queue

Operations performed while disconnected are queued and can be pushed when reconnecting.

### `db.getQueuedOperations()`

Get pending operations in the offline queue.

```javascript
const queue = db.getQueuedOperations();
console.log(`${queue.length} operations queued`);
```

**Returns:** `SyncOperation[]`

### `db.pushQueuedOperations()`

Send all queued operations to connected peers.

```javascript
// After reconnecting
if (db.isConnected()) {
  await db.pushQueuedOperations();
}
```

### `db.clearQueue()`

Discard all queued operations.

```javascript
db.clearQueue();
```

### Event Callbacks

Register callbacks for sync events.

### `db.onPeerConnected(callback)`

Called when a peer connects.

```javascript
db.onPeerConnected((peerId) => {
  console.log(`Peer connected: ${peerId}`);
});
```

### `db.onPeerDisconnected(callback)`

Called when a peer disconnects.

```javascript
db.onPeerDisconnected((peerId) => {
  console.log(`Peer disconnected: ${peerId}`);
});
```

### `db.onSyncReceived(callback)`

Called when a sync operation is received from a peer.

```javascript
db.onSyncReceived((operation) => {
  console.log(`Received sync: ${operation.table} - ${operation.rowId}`);
});
```

### `db.close()`

Close the database and clean up resources.

```javascript
await db.close();
```

## Automatic Schema

When you create a table, three columns are automatically added:

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PRIMARY KEY | Auto-generated UUID |
| `updated_at` | INTEGER | Unix timestamp (ms), auto-updated |
| `deleted` | INTEGER | 0 = active, 1 = soft-deleted |

```javascript
// You write:
await db.exec('CREATE TABLE tasks (title TEXT)');

// Actual schema:
// CREATE TABLE tasks (
//   title TEXT,
//   id TEXT PRIMARY KEY,
//   updated_at INTEGER NOT NULL,
//   deleted INTEGER NOT NULL DEFAULT 0
// )
```

## Sync Behavior

### Conflict Resolution

When merging databases, conflicts are resolved using **last-write-wins**:

1. Rows are matched by `id`
2. The row with the higher `updated_at` timestamp wins
3. Soft-deleted rows (`deleted = 1`) are excluded from query results

### Sync Example

```javascript
// Peer A
const dbA = await createDatabase('db-a', { mode: 'syncing', peerServer: config });
await dbA.exec('CREATE TABLE items (name TEXT)');
await dbA.exec("INSERT INTO items (name) VALUES ('from-a')");

// Peer B
const dbB = await createDatabase('db-b', { mode: 'syncing', peerServer: config });
await dbB.exec('CREATE TABLE items (name TEXT)');
await dbB.exec("INSERT INTO items (name) VALUES ('from-b')");

// Connect B to A
await dbB.connectToPeer(dbA.getPeerId());

// Sync: B pulls A's data
await dbB.exportToPeer(dbA.getPeerId());

// Sync: A pulls B's data  
await dbA.exportToPeer(dbB.getPeerId());

// Both now have: 'from-a' and 'from-b'
```

## Running a PeerJS Server

For local development or self-hosted deployments:

```bash
# Install
npm install --save-dev peer

# Run server (with discovery enabled for auto-discovery feature)
npx peerjs --port 9000 --allow_discovery
```

Then configure your database:

```javascript
const db = await createDatabase('my-db', {
  mode: 'syncing',
  peerServer: {
    host: 'localhost',
    port: 9000,
    path: '/',
    secure: false
  }
});
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Start dev server
bun server.mjs

# Start PeerJS server (for sync tests)
npx peerjs --port 9000

# Run tests
npx playwright test
```

## Requirements

- Modern browser with support for:
  - ES2022
  - Web Workers
  - OPFS (Origin Private File System)
  - WebRTC (for syncing mode)

## React Integration

Syncable SQLite provides a complete React integration with typed hooks for queries, mutations, and sync status.

### Quick Start with React

```tsx
import { defineSchema, defineTable, column } from 'syncable-sqlite/schema';
import { DatabaseProvider, useQuery, useMutation } from 'syncable-sqlite/react';

// 1. Define your schema
const schema = defineSchema({
  todos: defineTable({
    title: column.text(),
    completed: column.boolean(),
    priority: column.integer().optional(),
  }),
});

// 2. Wrap your app with DatabaseProvider
function App() {
  return (
    <DatabaseProvider 
      name="my-app" 
      schema={schema} 
      mode="local"
    >
      <TodoList />
    </DatabaseProvider>
  );
}

// 3. Use hooks in your components
function TodoList() {
  const { data, isLoading } = useQuery('my-app', 'todos')
    .where('completed', '=', false)
    .orderBy('updated_at', 'desc')
    .exec();

  const { insert } = useMutation('my-app', 'todos');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => insert({ title: 'New Todo', completed: false })}>
        Add Todo
      </button>
      <ul>
        {data?.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Schema Definition

Define your database schema with full TypeScript support:

```typescript
import { defineSchema, defineTable, column } from 'syncable-sqlite/schema';

const schema = defineSchema({
  users: defineTable({
    name: column.text(),
    email: column.text(),
    age: column.integer().optional(),  // Nullable column
    active: column.boolean(),
  }),
  posts: defineTable({
    title: column.text(),
    content: column.text(),
    authorId: column.text(),
  }),
});

// TypeScript infers the full row type including system columns:
// {
//   id: string;
//   name: string;
//   email: string;
//   age: number | null;
//   active: boolean;
//   updated_at: number;
//   deleted: number;
// }
```

**Available column types:**

| Method | SQLite Type | TypeScript Type |
|--------|-------------|-----------------|
| `column.text()` | TEXT | `string` |
| `column.integer()` | INTEGER | `number` |
| `column.real()` | REAL | `number` |
| `column.boolean()` | INTEGER | `boolean` |
| `column.blob()` | BLOB | `Uint8Array` |

All columns support `.optional()` for nullable values.

### DatabaseProvider

Wrap your app with `DatabaseProvider` to initialize the database:

```tsx
import { DatabaseProvider } from 'syncable-sqlite/react';

<DatabaseProvider
  name="my-app"           // Unique database name
  schema={schema}         // Your schema definition
  mode="syncing"          // 'local' or 'syncing'
  peerServer={{           // Required for syncing mode
    host: 'localhost',
    port: 9000,
    path: '/',
    secure: false,
  }}
>
  <App />
</DatabaseProvider>
```

**Multiple databases:** Nest providers for multiple databases:

```tsx
<DatabaseProvider name="app-db" schema={appSchema} mode="syncing" peerServer={config}>
  <DatabaseProvider name="cache" schema={cacheSchema} mode="local">
    <App />
  </DatabaseProvider>
</DatabaseProvider>
```

### useQuery Hook

Reactive queries with a builder pattern:

```tsx
import { useQuery } from 'syncable-sqlite/react';

function MyComponent() {
  const { data, isLoading, error, refetch } = useQuery('my-app', 'todos')
    .where('completed', '=', false)      // WHERE clause
    .where('priority', '>', 1)           // Multiple WHERE = AND
    .orderBy('updated_at', 'desc')       // ORDER BY
    .limit(10)                           // LIMIT
    .exec();                             // Execute query

  // data is typed as Todo[] | undefined
  // Automatically re-fetches when data changes (local or remote)
}
```

**Supported operators:** `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IN`

### useMutation Hook

Insert, update, and remove with full type safety:

```tsx
import { useMutation } from 'syncable-sqlite/react';

function AddTodo() {
  const { insert, update, remove, isLoading, error } = useMutation('my-app', 'todos');

  // Insert returns the full row with generated id
  const handleAdd = async () => {
    const newTodo = await insert({ 
      title: 'Buy groceries', 
      completed: false 
    });
    console.log('Created:', newTodo.id);
  };

  // Update by id, returns updated row
  const handleComplete = async (id: string) => {
    const updated = await update(id, { completed: true });
  };

  // Remove (soft delete), returns removed row
  const handleDelete = async (id: string) => {
    const removed = await remove(id);
  };
}
```

### useSyncStatus Hook

Monitor connection and sync status:

```tsx
import { useSyncStatus } from 'syncable-sqlite/react';

function SyncIndicator() {
  const { 
    isConnected,        // boolean - any peers connected?
    peerCount,          // number - count of connected peers
    pendingOperations,  // number - queued offline operations
    peerId,             // string | null - this database's peer ID
    mode                // 'syncing' | 'local'
  } = useSyncStatus('my-app');

  return (
    <div>
      {isConnected ? `🟢 ${peerCount} peers` : '🔴 Offline'}
      {pendingOperations > 0 && ` (${pendingOperations} pending)`}
    </div>
  );
}
```

### usePeers Hook

Manage peer connections:

```tsx
import { usePeers } from 'syncable-sqlite/react';

function PeerManager() {
  const { 
    peers,              // PeerInfo[] - list of connected peers
    connectToPeer,      // (peerId: string) => Promise<void>
    disconnectFromPeer, // (peerId: string) => Promise<void>
    pushQueue,          // () => Promise<void> - push offline queue
    clearQueue          // () => void - discard offline queue
  } = usePeers('my-app');

  return (
    <div>
      <h3>Connected Peers</h3>
      <ul>
        {peers.map(peer => (
          <li key={peer.id}>
            {peer.id} ({peer.status})
            <button onClick={() => disconnectFromPeer(peer.id)}>
              Disconnect
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### useDatabase Hook

Direct access to the database instance:

```tsx
import { useDatabase } from 'syncable-sqlite/react';

function ExportButton() {
  const db = useDatabase('my-app');

  const handleExport = async () => {
    const data = await db.export();
    // Save to file, send to server, etc.
  };

  return <button onClick={handleExport}>Export Database</button>;
}
```

### Reactivity

Queries automatically re-run when:
- **Local mutations** - `insert`, `update`, `remove` invalidate related queries
- **Remote sync** - Changes from peers trigger query refresh
- **Manual refetch** - Call `refetch()` to manually refresh

```tsx
// This query automatically updates when:
// 1. You call insert/update/remove on 'todos'
// 2. A connected peer modifies 'todos'
const { data, refetch } = useQuery('my-app', 'todos').exec();
```

## License

MIT
