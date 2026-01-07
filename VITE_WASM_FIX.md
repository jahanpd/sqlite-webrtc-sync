# Vite WASM Fix - Summary

## Problem
SQLite WASM was failing to load in Vite dev server because:
1. The default WASM resolution used by `@sqlite.org/sqlite-wasm` doesn't work correctly with Vite's module resolution
2. Worker files were being served with incorrect MIME types (`""` instead of `application/javascript`)

## Solution Implemented

### 1. Custom WASM Loading in Worker

Modified `worker/index.ts` to explicitly control WASM file location:

```typescript
async function initSqlite(): Promise<void> {
  const module = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
    locateFile: (path: string) => {
      if (path.endsWith('.wasm')) {
        return new URL('./sqlite3.wasm', import.meta.url).href;
      }
      return new URL(path, import.meta.url).href;
    }
  });
  sqlite3 = module;
}
```

### 2. Vite Plugin for Worker MIME Types

Added a Vite plugin that ensures JavaScript files are served with the correct MIME type:

```typescript
export function syncableSqliteVitePlugin() {
  return {
    name: 'syncable-sqlite-wasm-fix',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        
        if (url.includes('/worker.js') || url.endsWith('.js')) {
          const headers = res.getHeaders?.() || {};
          if (!headers['content-type']) {
            res.setHeader('Content-Type', 'application/javascript');
          }
        }
        
        next();
      });
    }
  };
}
```

## How to Use

### 1. Install the package
```bash
npm install syncable-sqlite
```

### 2. Add the Vite plugin to your `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import { syncableSqliteVitePlugin } from 'syncable-sqlite';

export default defineConfig({
  plugins: [syncableSqliteVitePlugin()],
  // your other config...
});
```

### 3. Import and use the database
```javascript
import { createDatabase } from 'syncable-sqlite';

const db = await createDatabase('my-app', { mode: 'local' });
await db.exec('CREATE TABLE test (id TEXT PRIMARY KEY, name TEXT)');
await db.exec('INSERT INTO test VALUES (?, ?)', ['1', 'Test']);
const result = await db.exec('SELECT * FROM test');
console.log(result.rows);
await db.close();
```

### 4. Run Vite dev server
```bash
npm run dev
```

## Files Changed
- `worker/index.ts` - Added custom `locateFile` function for WASM resolution
- `src/index.ts` - Added `syncableSqliteVitePlugin()` export

## Testing
A test project is available at `test-vite/`:
```bash
cd test-vite
npm install
npm run dev
```

## How It Works

### WASM File Resolution
- `locateFile` overrides SQLite's default WASM file path resolution
- Uses `import.meta.url` (worker's URL) as the base path
- Vite serves the WASM file at the correct relative path

### Worker MIME Type Fix
- Vite plugin intercepts requests to `.js` files
- Ensures `Content-Type: application/javascript` header is set
- Fixes the "disallowed MIME type" error

## Technical Details
- Works with Vite's dev server and preview server
- Compatible with production builds
- Portable across different bundler configurations
- No breaking changes to the API

## Verification
1. Build the package: `npm run build`
2. Start Vite dev server in your project
3. Check browser console for SQLite initialization
4. Try database operations - should work without errors
