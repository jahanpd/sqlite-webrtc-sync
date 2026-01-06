import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function build() {
  // Main database bundle
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    // peerjs is bundled for browser use
  });

  // Worker bundle
  await esbuild.build({
    entryPoints: ['worker/index.ts'],
    bundle: true,
    outfile: 'dist/worker.js',
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
  });

  // Schema bundle (no React dependency)
  await esbuild.build({
    entryPoints: ['src/schema/index.ts'],
    bundle: true,
    outfile: 'dist/schema.js',
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
  });

  // React bundle (React as external peer dependency)
  await esbuild.build({
    entryPoints: ['src/react/index.ts'],
    bundle: true,
    outfile: 'dist/react.js',
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    external: ['react', 'react-dom'],
    // Include JSX transform
    jsx: 'automatic',
  });

  copyWASMFiles();
  copySqliteWasmPackage();
  await generateTypeDeclarations();

  console.log('Build complete!');
}

async function generateTypeDeclarations() {
  // Run tsc to generate .d.ts files
  const { execSync } = await import('child_process');
  try {
    execSync('npx tsc --emitDeclarationOnly --declaration --outDir dist', { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    console.log('Generated type declarations');
  } catch (e) {
    console.warn('Could not generate type declarations:', e.message);
  }
}

function copyWASMFiles() {
  try {
    const wasmDir = join(__dirname, 'node_modules', '@sqlite.org', 'sqlite-wasm', 'sqlite-wasm', 'jswasm');
    const outDir = join(__dirname, 'dist');
    
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    
    const files = ['sqlite3.wasm', 'sqlite3.wasm.gz'];
    for (const file of files) {
      const srcPath = join(wasmDir, file);
      const destPath = join(outDir, file);
      if (existsSync(srcPath)) {
        copyFileSync(srcPath, destPath);
        console.log(`Copied ${file}`);
      }
    }
  } catch (e) {
    console.warn('Could not copy WASM files:', e.message);
  }
}

function copySqliteWasmPackage() {
  try {
    const srcDir = join(__dirname, 'node_modules', '@sqlite.org', 'sqlite-wasm');
    const destDir = join(__dirname, 'dist', 'sqlite-wasm');
    
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    // Copy the sqlite-wasm directory to dist/sqlite-wasm
    const sqliteWasmSrc = join(srcDir, 'sqlite-wasm');
    const sqliteWasmDest = join(destDir, 'sqlite-wasm');
    
    if (existsSync(sqliteWasmSrc)) {
      copyDirSync(sqliteWasmSrc, sqliteWasmDest);
      console.log('Copied sqlite-wasm');
    }
    
    // Copy index files to dist/sqlite-wasm
    const indexFiles = ['index.mjs', 'index.d.ts', 'node.mjs'];
    for (const file of indexFiles) {
      const srcPath = join(srcDir, file);
      const destPath = join(destDir, file);
      if (existsSync(srcPath)) {
        copyFileSync(srcPath, destPath);
        console.log(`Copied ${file}`);
      }
    }
  } catch (e) {
    console.warn('Could not copy sqlite-wasm package:', e.message);
  }
}

function copyFileSync(src, dest) {
  const content = readFileSync(src);
  writeFileSync(dest, content);
}

function copyDirSync(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const entries = readdirSync(src);
  
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    
    const stat = statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

build().catch(console.error);
