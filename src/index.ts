type DatabaseMode = 'syncing' | 'local';

export interface PeerServerConfig {
  host?: string;
  port?: number;
  path?: string;
  secure?: boolean;
}

export interface DatabaseConfig {
  mode: DatabaseMode;
  peerServer?: PeerServerConfig;
  discoveryInterval?: number;  // ms, default 5000
}

export interface QueryResult {
  rows: Record<string, unknown>[];
  columns: string[];
  affectedRows?: AffectedRow[];  // For mutations, includes row IDs
}

export interface AffectedRow {
  id: string;
  table: string;
}

export interface PeerInfo {
  id: string;
  status: 'connecting' | 'connected' | 'disconnected';
}

export interface SyncOperation {
  id: string;           // Unique operation ID
  timestamp: number;    // For ordering
  sql: string;          // The processed SQL statement
  table: string;        // Affected table
  rowId: string;        // Affected row ID
}

// Event callback types
type PeerConnectedCallback = (peerId: string) => void;
type PeerDisconnectedCallback = (peerId: string) => void;
type SyncReceivedCallback = (operation: SyncOperation) => void;

interface WorkerMessage {
  id: number;
  type: string;
  success: boolean;
  result?: unknown;
  error?: string;
}

export class SyncableDatabase {
  private dbName: string;
  private mode: DatabaseMode;
  private peerServerConfig?: PeerServerConfig;
  private discoveryInterval: number;
  private worker: Worker | null = null;
  private peer: import('peerjs').Peer | null = null;
  private peerId: string | null = null;
  private peers: Map<string, PeerConnection> = new Map();
  private pendingRequests: Map<number, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }> = new Map();
  private nextRequestId = 0;
  private isInitialized = false;
  
  // Auto-sync properties
  private discoveryTimer: ReturnType<typeof setInterval> | null = null;
  private operationQueue: SyncOperation[] = [];
  private appliedOperations: Set<string> = new Set();
  
  // Event callbacks
  private onPeerConnectedCallbacks: PeerConnectedCallback[] = [];
  private onPeerDisconnectedCallbacks: PeerDisconnectedCallback[] = [];
  private onSyncReceivedCallbacks: SyncReceivedCallback[] = [];

  private constructor(dbName: string, mode: DatabaseMode, peerServerConfig?: PeerServerConfig, discoveryInterval?: number) {
    this.dbName = dbName;
    this.mode = mode;
    this.peerServerConfig = peerServerConfig;
    this.discoveryInterval = discoveryInterval ?? 5000;
  }

  static async create(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase> {
    const db = new SyncableDatabase(dbName, config.mode, config.peerServer, config.discoveryInterval);
    await db.init();
    return db;
  }

  private async init(): Promise<void> {
    if (typeof window === 'undefined' && typeof Worker === 'undefined') {
      throw new Error('SyncableDatabase requires a browser environment');
    }

    // Compute base URL for assets - the wasm file should be served alongside index.js
    // We use import.meta.url from the main bundle to get the correct base path
    const baseUrl = new URL('./', import.meta.url).href;

    // Use Blob URL to load worker, bypassing Vite's file system restrictions
    // worker-string.ts is generated at build time from worker/index.ts
    const { workerCode } = await import('./worker-string');
    
    // The sqlite3 WASM library uses import.meta.url to resolve the WASM file location.
    // When loaded from a Blob URL, import.meta.url returns "blob:..." which can't be
    // used as a base for URL construction. We need to replace import.meta.url references
    // with the actual base URL where the assets are served.
    const modifiedWorkerCode = workerCode.replace(
      /import\.meta\.url/g,
      JSON.stringify(baseUrl + 'worker.js')
    );
    
    const workerBlob = new Blob([modifiedWorkerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);
    this.worker = new Worker(workerUrl, { type: 'module' });

    this.worker!.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { id, success, result, error } = event.data;
      const pending = this.pendingRequests.get(id);
      if (pending) {
        if (success) {
          pending.resolve(result);
        } else {
          pending.reject(new Error(error));
        }
        this.pendingRequests.delete(id);
      }
    };

    this.worker!.onerror = (error: Event) => {
      console.error('Worker error:', error);
    };

    await this.sendRequest('init', this.dbName, []);
    
    await this.sendRequest('createDb', this.dbName, []);
    
    this.isInitialized = true;

    if (this.mode === 'syncing') {
      await this.initPeer();
      this.startDiscovery();
    }
  }

  private async initPeer(): Promise<void> {
    const { Peer } = await import('peerjs');
    
    // Generate peer ID with database name prefix for discovery
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const peerIdWithPrefix = `${this.dbName}-${uniqueId}`;
    
    // Build PeerJS options
    const peerOptions: import('peerjs').PeerOptions = {
      // Use Google STUN servers as fallback ICE servers
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      }
    };
    
    // Apply custom peer server config if provided
    if (this.peerServerConfig) {
      if (this.peerServerConfig.host) peerOptions.host = this.peerServerConfig.host;
      if (this.peerServerConfig.port) peerOptions.port = this.peerServerConfig.port;
      if (this.peerServerConfig.path) peerOptions.path = this.peerServerConfig.path;
      if (this.peerServerConfig.secure !== undefined) peerOptions.secure = this.peerServerConfig.secure;
    }
    
    // Create peer and wait for it to be ready
    await new Promise<void>((resolve, reject) => {
      const peer = new Peer(peerIdWithPrefix, peerOptions);
      
      peer.on('open', (id: string) => {
        this.peerId = id;
        this.peer = peer;
        resolve();
      });

      peer.on('connection', (conn: import('peerjs').DataConnection) => {
        this.handleIncomingConnection(conn);
      });

      peer.on('error', (err: Error) => {
        console.error('Peer error:', err);
        reject(err);
      });
    });
  }

  private startDiscovery(): void {
    // Start periodic peer discovery
    this.discoveryTimer = setInterval(() => {
      this.discoverPeers().catch(err => {
        console.error('Discovery error:', err);
      });
    }, this.discoveryInterval);
    
    // Also run discovery immediately
    this.discoverPeers().catch(err => {
      console.error('Initial discovery error:', err);
    });
  }

  async discoverPeers(): Promise<void> {
    if (this.mode !== 'syncing' || !this.peerServerConfig) {
      return;
    }
    
    try {
      // Query PeerJS server for all connected peers
      const protocol = this.peerServerConfig.secure ? 'https' : 'http';
      const host = this.peerServerConfig.host || 'localhost';
      const port = this.peerServerConfig.port || 9000;
      const path = this.peerServerConfig.path || '/';
      
      const url = `${protocol}://${host}:${port}${path}peerjs/peers`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return;
      }
      
      const allPeers: string[] = await response.json();
      
      // Filter peers that share our database name prefix
      const dbPrefix = `${this.dbName}-`;
      const sameDatabasePeers = allPeers.filter(id => 
        id.startsWith(dbPrefix) && id !== this.peerId
      );
      
      // Connect to any peers we're not already connected to
      for (const remotePeerId of sameDatabasePeers) {
        if (!this.peers.has(remotePeerId)) {
          try {
            await this.connectToPeer(remotePeerId);
          } catch (err) {
            console.error(`Failed to connect to discovered peer ${remotePeerId}:`, err);
          }
        }
      }
    } catch (err) {
      // Discovery failed - might be network issue, continue silently
    }
  }

  private handleIncomingConnection(conn: import('peerjs').DataConnection): void {
    const peerId = conn.peer;
    
    conn.on('open', () => {
      const peerConn = new PeerConnection(peerId, conn, this);
      this.peers.set(peerId, peerConn);
      this.emitPeerConnected(peerId);
    });

    conn.on('close', () => {
      this.peers.delete(peerId);
      this.emitPeerDisconnected(peerId);
    });

    conn.on('error', (err: Error) => {
      console.error('Connection error:', err);
      this.peers.delete(peerId);
      this.emitPeerDisconnected(peerId);
    });
  }

  private sendRequest(type: string, dbName: string, args: unknown[], extra?: Record<string, unknown>): Promise<unknown> {
    const id = this.nextRequestId++;
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker?.postMessage({ id, type, dbName, args, ...extra });
    });
  }

  async exec(sql: string, params?: unknown[]): Promise<QueryResult> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    
    const result = await this.sendRequest('exec', this.dbName, [sql, params]) as QueryResult;
    
    // If this is a mutation in syncing mode, broadcast to peers
    if (this.mode === 'syncing' && result.affectedRows && result.affectedRows.length > 0) {
      const processedSql = (await this.sendRequest('getLastProcessedSql', this.dbName, [])) as string;
      
      for (const affected of result.affectedRows) {
        const operation: SyncOperation = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          sql: processedSql,
          table: affected.table,
          rowId: affected.id,
        };
        
        this.broadcastOperation(operation);
      }
    }
    
    return result;
  }

  private broadcastOperation(operation: SyncOperation): void {
    // Mark as applied locally
    this.appliedOperations.add(operation.id);
    
    if (this.peers.size === 0) {
      // No peers connected, queue the operation
      this.operationQueue.push(operation);
      return;
    }
    
    // Broadcast to all connected peers
    for (const peerConn of this.peers.values()) {
      peerConn.sendOperation(operation);
    }
  }

  async applyRemoteOperation(operation: SyncOperation): Promise<void> {
    // Check if already applied
    if (this.appliedOperations.has(operation.id)) {
      return;
    }
    
    // Mark as applied
    this.appliedOperations.add(operation.id);
    
    // Execute the SQL directly without reprocessing
    await this.sendRequest('execRaw', this.dbName, [operation.sql]);
    
    // Emit callback
    this.emitSyncReceived(operation);
  }

  async export(): Promise<Uint8Array> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    const data = await this.sendRequest('export', this.dbName, []) as number[];
    return new Uint8Array(data);
  }

  async import(data: Uint8Array): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    await this.sendRequest('import', this.dbName, [Array.from(data)]);
  }

  async connectToPeer(peerId: string): Promise<void> {
    if (this.mode !== 'syncing') {
      throw new Error('Cannot connect to peers in local mode');
    }

    if (!this.peer) {
      throw new Error('Peer not initialized');
    }
    
    // Don't connect to ourselves
    if (peerId === this.peerId) {
      return;
    }
    
    // Don't reconnect if already connected
    if (this.peers.has(peerId)) {
      return;
    }

    const conn = this.peer.connect(peerId);
    
    await new Promise<void>((resolve, reject) => {
      conn.on('open', () => {
        const peerConn = new PeerConnection(peerId, conn, this);
        this.peers.set(peerId, peerConn);
        this.emitPeerConnected(peerId);
        resolve();
      });
      conn.on('error', reject);
      
      // Add timeout
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
  }

  async disconnectFromPeer(peerId: string): Promise<void> {
    const peerConnection = this.peers.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      this.peers.delete(peerId);
      this.emitPeerDisconnected(peerId);
    }
  }

  async exportToPeer(peerId: string): Promise<void> {
    const peerConnection = this.peers.get(peerId);
    if (!peerConnection) {
      throw new Error(`Peer ${peerId} not connected`);
    }
    await peerConnection.requestExport();
  }

  async importFromPeer(peerId: string): Promise<void> {
    const peerConnection = this.peers.get(peerId);
    if (!peerConnection) {
      throw new Error(`Peer ${peerId} not connected`);
    }
    await peerConnection.requestImport();
  }

  async exportToAllPeers(): Promise<void> {
    const promises = Array.from(this.peers.keys()).map(peerId => 
      this.exportToPeer(peerId).catch(err => 
        console.error(`Failed to export to ${peerId}:`, err)
      )
    );
    await Promise.all(promises);
  }

  async importFromAllPeers(): Promise<void> {
    const promises = Array.from(this.peers.keys()).map(peerId => 
      this.importFromPeer(peerId).catch(err => 
        console.error(`Failed to import from ${peerId}:`, err)
      )
    );
    await Promise.all(promises);
  }

  async merge(remoteData: Uint8Array): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    await this.sendRequest('merge', this.dbName, [Array.from(remoteData)]);
  }

  getPeerId(): string | null {
    return this.peerId;
  }

  getConnectedPeers(): PeerInfo[] {
    return Array.from(this.peers.values()).map(p => ({
      id: p.getPeerId(),
      status: p.isConnected() ? 'connected' : 'disconnected',
    }));
  }
  
  isConnected(): boolean {
    return this.peers.size > 0;
  }
  
  // Offline queue management
  getQueuedOperations(): SyncOperation[] {
    return [...this.operationQueue];
  }
  
  async pushQueuedOperations(): Promise<void> {
    if (this.peers.size === 0) {
      throw new Error('No peers connected');
    }
    
    // Send all queued operations to all peers
    for (const operation of this.operationQueue) {
      for (const peerConn of this.peers.values()) {
        peerConn.sendOperation(operation);
      }
    }
    
    // Clear the queue
    this.operationQueue = [];
  }
  
  clearQueue(): void {
    this.operationQueue = [];
  }
  
  // Event registration
  onPeerConnected(callback: PeerConnectedCallback): void {
    this.onPeerConnectedCallbacks.push(callback);
  }
  
  onPeerDisconnected(callback: PeerDisconnectedCallback): void {
    this.onPeerDisconnectedCallbacks.push(callback);
  }
  
  onSyncReceived(callback: SyncReceivedCallback): void {
    this.onSyncReceivedCallbacks.push(callback);
  }
  
  // Event emitters
  private emitPeerConnected(peerId: string): void {
    for (const cb of this.onPeerConnectedCallbacks) {
      try { cb(peerId); } catch (e) { console.error('Callback error:', e); }
    }
  }
  
  private emitPeerDisconnected(peerId: string): void {
    for (const cb of this.onPeerDisconnectedCallbacks) {
      try { cb(peerId); } catch (e) { console.error('Callback error:', e); }
    }
  }
  
  private emitSyncReceived(operation: SyncOperation): void {
    for (const cb of this.onSyncReceivedCallbacks) {
      try { cb(operation); } catch (e) { console.error('Callback error:', e); }
    }
  }

  async close(): Promise<void> {
    // Stop discovery
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer);
      this.discoveryTimer = null;
    }
    
    for (const peerConn of this.peers.values()) {
      peerConn.close();
    }
    this.peers.clear();
    
    // Destroy the PeerJS instance
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    
    await this.sendRequest('close', this.dbName, []);
    this.worker?.terminate();
    this.worker = null;
    this.isInitialized = false;
  }
}

class PeerConnection {
  private peerId: string;
  private connection: import('peerjs').DataConnection;
  private db: SyncableDatabase;
  private pendingExport: { resolve: () => void; reject: (err: Error) => void } | null = null;
  private pendingImport: { resolve: () => void; reject: (err: Error) => void } | null = null;

  constructor(peerId: string, connection: import('peerjs').DataConnection, db: SyncableDatabase) {
    this.peerId = peerId;
    this.connection = connection;
    this.db = db;

    this.connection.on('data', async (data: unknown) => {
      const msg = data as { type: string; data?: number[]; operation?: SyncOperation };
      
      if (msg.type === 'sync-operation' && msg.operation) {
        // Real-time sync: apply remote operation
        await this.db.applyRemoteOperation(msg.operation);
      } else if (msg.type === 'exportData' && msg.data) {
        const dataArray = new Uint8Array(msg.data);
        await this.db.import(dataArray);
        this.pendingExport?.resolve();
        this.pendingExport = null;
      } else if (msg.type === 'exportRequest') {
        const exportData = await this.db.export();
        this.connection.send({ type: 'exportData', data: Array.from(exportData) });
      } else if (msg.type === 'importData' && msg.data) {
        await this.db.import(new Uint8Array(msg.data));
      }
    });

    this.connection.on('close', () => {
      this.pendingExport?.reject(new Error('Connection closed'));
      this.pendingImport?.reject(new Error('Connection closed'));
    });

    this.connection.on('error', (err: Error) => {
      this.pendingExport?.reject(err);
      this.pendingImport?.reject(err);
    });
  }
  
  sendOperation(operation: SyncOperation): void {
    if (this.connection.open) {
      this.connection.send({ type: 'sync-operation', operation });
    }
  }

  async requestExport(): Promise<void> {
    if (!this.connection.open) {
      throw new Error(`Peer ${this.peerId} not connected`);
    }

    this.connection.send({ type: 'exportRequest' });

    return new Promise((resolve, reject) => {
      this.pendingExport = { resolve, reject };
      setTimeout(() => {
        if (this.pendingExport) {
          this.pendingExport.reject(new Error('Export request timed out'));
          this.pendingExport = null;
        }
      }, 30000);
    });
  }

  async requestImport(): Promise<void> {
    if (!this.connection.open) {
      throw new Error(`Peer ${this.peerId} not connected`);
    }

    const exportData = await this.db.export();
    this.connection.send({ type: 'importData', data: Array.from(exportData) });

    return new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  isConnected(): boolean {
    return this.connection.open;
  }

  getPeerId(): string {
    return this.peerId;
  }

  close(): void {
    this.connection.close();
  }
}

export async function createDatabase(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase> {
  return SyncableDatabase.create(dbName, config);
}

export function syncableSqliteVitePlugin() {
  return {
    name: 'syncable-sqlite-wasm-fix',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url || '';
        
        if (url.includes('/worker.js') || url.endsWith('.js')) {
          const headers = res.getHeaders?.() || {};
          if (!headers['content-type']) {
            res.setHeader('Content-Type', 'application/javascript');
          }
        }
        
        next();
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
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
