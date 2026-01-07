import { defineConfig } from 'vite';
import { syncableSqliteVitePlugin } from 'syncable-sqlite';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Plugin to copy SQLite WASM assets to dist during build
// This includes the WASM file and the OPFS async proxy worker
function copySqliteAssetsPlugin() {
  return {
    name: 'copy-sqlite-assets',
    writeBundle() {
      const srcDir = resolve(__dirname, 'node_modules/syncable-sqlite/dist');
      const destDir = resolve(__dirname, 'dist/assets');
      
      mkdirSync(destDir, { recursive: true });
      
      // Files required for SQLite WASM with OPFS support
      const filesToCopy = [
        'sqlite3.wasm',                    // Main WASM binary
        'sqlite3-opfs-async-proxy.js',     // OPFS async worker (required for OPFS VFS)
      ];
      
      for (const file of filesToCopy) {
        const src = resolve(srcDir, file);
        const dest = resolve(destDir, file);
        
        if (existsSync(src)) {
          copyFileSync(src, dest);
          console.log(`Copied ${file} to dist/assets/`);
        } else {
          console.warn(`Warning: ${file} not found in ${srcDir}`);
        }
      }
    },
    configurePreviewServer(server) {
      // Set correct MIME types for SQLite assets
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          if (req.url.endsWith('.wasm')) {
            res.setHeader('Content-Type', 'application/wasm');
          } else if (req.url.endsWith('.js')) {
            // Ensure JS files have correct MIME type (needed for workers)
            res.setHeader('Content-Type', 'application/javascript');
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [syncableSqliteVitePlugin(), copySqliteAssetsPlugin()],
  server: {
    port: 3002,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    fs: {
      // Allow serving files from the parent directory (where dist/ is located)
      allow: ['..'],
    },
  },
  preview: {
    port: 3003,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['syncable-sqlite'],
  },
});
