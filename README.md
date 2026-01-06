# Syncable SQLite

A browser-based SQLite database with OPFS persistence and WebRTC peer-to-peer syncing.

## Features

- **SQLite in the browser** - Full SQLite powered by SQLite WASM
- **Persistent storage** - Uses OPFS (Origin Private File System) for durable storage
- **P2P syncing** - Sync databases between browsers using WebRTC (via PeerJS)
- **Automatic schema** - Tables automatically get `id`, `updated_at`, and `deleted` columns
- **Last-write-wins merge** - Conflict resolution based on timestamps
- **Soft deletes** - Deleted rows are marked, not removed, enabling proper sync

## Installation

```bash
npm install syncable-sqlite
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

# Run server
npx peerjs --port 9000
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

## License

MIT
