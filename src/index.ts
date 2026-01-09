type DatabaseMode = 'syncing' | 'local';

// ICE server configuration for WebRTC
export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface PeerServerConfig {
  host?: string;
  port?: number;
  path?: string;
  secure?: boolean;
  fallbackToCloud?: boolean;  // If true, fall back to PeerJS cloud on connection failure. Default: false
  iceServers?: IceServer[];   // Custom STUN/TURN servers. If not provided, uses Google STUN + PeerJS TURN
}

// Callback for when fallback to PeerJS cloud occurs
type FallbackCallback = (reason: string) => void;
// Callback for when peer connection fails
type PeerErrorCallback = (error: Error) => void;

export interface DatabaseConfig {
  mode: DatabaseMode;
  peerServer?: PeerServerConfig;
  discoveryInterval?: number;  // ms, default 5000
  onFallbackToCloud?: FallbackCallback;  // Called when fallback to PeerJS cloud occurs
  onPeerError?: PeerErrorCallback;  // Called when peer connection fails (database still works locally)
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
  params: unknown[];    // Parameters for the SQL statement
  table: string;        // Affected table
  rowId: string;        // Affected row ID
}

// Event callback types
type PeerConnectedCallback = (peerId: string) => void;
type PeerDisconnectedCallback = (peerId: string) => void;
type SyncReceivedCallback = (operation: SyncOperation) => void;
type MutationCallback = (tables: string[]) => void;
type DataChangedCallback = () => void;

interface WorkerMessage {
  id: number;
  type: string;
  success: boolean;
  result?: unknown;
  error?: string;
}

// PeerJS cloud server defaults
const PEERJS_CLOUD_HOST = '0.peerjs.com';
const PEERJS_CLOUD_PORT = 443;
const PEERJS_CLOUD_PATH = '/';
const PEERJS_CLOUD_SECURE = true;

// Connection timeout for fallback logic
const PEER_CONNECTION_TIMEOUT = 10000;

// Retry interval for peer connection (60 seconds)
const PEER_RETRY_INTERVAL = 60000;

// Default ICE servers: Google STUN + PeerJS public TURN
const DEFAULT_ICE_SERVERS: IceServer[] = [
  // Google STUN servers (free, reliable)
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  // PeerJS public TURN servers (free, for relay fallback)
  { 
    urls: ['turn:eu-0.turn.peerjs.com:3478', 'turn:us-0.turn.peerjs.com:3478'],
    username: 'peerjs',
    credential: 'peerjsp'
  }
];

interface ActiveServerConfig {
  host: string;
  port: number;
  path: string;
  secure: boolean;
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
  
  // Active server config (set after successful connection)
  private activeServerConfig: ActiveServerConfig | null = null;
  
  // Auto-sync properties
  private discoveryTimer: ReturnType<typeof setInterval> | null = null;
  private peerRetryTimer: ReturnType<typeof setInterval> | null = null;
  private operationQueue: SyncOperation[] = [];
  private appliedOperations: Set<string> = new Set();
  
  // Event callbacks
  private onPeerConnectedCallbacks: PeerConnectedCallback[] = [];
  private onPeerDisconnectedCallbacks: PeerDisconnectedCallback[] = [];
  private onSyncReceivedCallbacks: SyncReceivedCallback[] = [];
  private onMutationCallbacks: MutationCallback[] = [];
  private onDataChangedCallbacks: DataChangedCallback[] = [];
  private onFallbackToCloudCallback?: FallbackCallback;
  private onPeerErrorCallback?: PeerErrorCallback;

  private constructor(dbName: string, mode: DatabaseMode, peerServerConfig?: PeerServerConfig, discoveryInterval?: number, onFallbackToCloud?: FallbackCallback, onPeerError?: PeerErrorCallback) {
    this.dbName = dbName;
    this.mode = mode;
    this.peerServerConfig = peerServerConfig;
    this.discoveryInterval = discoveryInterval ?? 5000;
    this.onFallbackToCloudCallback = onFallbackToCloud;
    this.onPeerErrorCallback = onPeerError;
  }

  static async create(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase> {
    const db = new SyncableDatabase(dbName, config.mode, config.peerServer, config.discoveryInterval, config.onFallbackToCloud, config.onPeerError);
    await db.init();
    return db;
  }

  private async init(): Promise<void> {
    console.log(`[SyncableDatabase] Starting initialization for database: ${this.dbName}`);
    
    if (typeof window === 'undefined' && typeof Worker === 'undefined') {
      throw new Error('SyncableDatabase requires a browser environment');
    }

    // Compute base URL for assets - the wasm file should be served alongside index.js
    // We use import.meta.url from the main bundle to get the correct base path
    const baseUrl = new URL('./', import.meta.url).href;
    console.log(`[SyncableDatabase] Base URL for assets: ${baseUrl}`);

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
    console.log(`[SyncableDatabase] Worker blob URL created`);
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

    console.log(`[SyncableDatabase] Sending init request to worker...`);
    await this.sendRequest('init', this.dbName, []);
    console.log(`[SyncableDatabase] SQLite WASM initialized successfully`);
    
    console.log(`[SyncableDatabase] Creating database: ${this.dbName}`);
    await this.sendRequest('createDb', this.dbName, []);
    console.log(`[SyncableDatabase] Database created successfully`);
    
    this.isInitialized = true;
    console.log(`[SyncableDatabase] Initialization complete for database: ${this.dbName}`);

    if (this.mode === 'syncing') {
      // Non-blocking peer initialization - database works even if peer fails
      this.initPeerWithRetry();
    }
  }

  /**
   * Attempts to initialize peer connection with automatic retry on failure.
   * This is non-blocking - the database works locally even if peer connection fails.
   */
  private initPeerWithRetry(): void {
    console.log(`[SyncableDatabase] Initializing peer connection...`);
    
    this.tryInitPeer().catch(err => {
      const error = err instanceof Error ? err : new Error(String(err));
      console.warn(`[SyncableDatabase] Peer connection failed, will retry in ${PEER_RETRY_INTERVAL / 1000}s:`, error.message);
      
      // Notify via callback
      if (this.onPeerErrorCallback) {
        try {
          this.onPeerErrorCallback(error);
        } catch (e) {
          console.error('Peer error callback threw:', e);
        }
      }
      
      // Schedule retry
      this.schedulePeerRetry();
    });
  }

  /**
   * Schedules periodic retry of peer connection.
   */
  private schedulePeerRetry(): void {
    // Clear existing timer if any
    if (this.peerRetryTimer) {
      clearInterval(this.peerRetryTimer);
    }
    
    this.peerRetryTimer = setInterval(() => {
      // Only retry if not already connected
      if (!this.peer) {
        console.log('[SyncableDatabase] Retrying peer connection...');
        this.tryInitPeer().catch(retryErr => {
          console.warn('[SyncableDatabase] Peer retry failed:', retryErr instanceof Error ? retryErr.message : String(retryErr));
        });
      } else {
        // Connected, stop retrying
        this.clearPeerRetryTimer();
      }
    }, PEER_RETRY_INTERVAL);
  }

  /**
   * Clears the peer retry timer.
   */
  private clearPeerRetryTimer(): void {
    if (this.peerRetryTimer) {
      clearInterval(this.peerRetryTimer);
      this.peerRetryTimer = null;
    }
  }

  /**
   * Attempts to initialize peer connection. Throws on failure.
   */
  private async tryInitPeer(): Promise<void> {
    await this.initPeer();
    
    // If we get here, connection succeeded - clear retry timer
    this.clearPeerRetryTimer();
    
    // Start discovery
    this.startDiscovery();
  }

  private async initPeer(): Promise<void> {
    const { Peer } = await import('peerjs');
    
    // Generate peer ID with database name prefix for discovery
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const peerIdWithPrefix = `${this.dbName}-${uniqueId}`;
    
    // Helper to create and connect a peer with given options
    const connectPeer = (options: import('peerjs').PeerOptions, serverConfig: ActiveServerConfig): Promise<void> => {
      return new Promise((resolve, reject) => {
        const peer = new Peer(peerIdWithPrefix, options);
        let connected = false;
        
        const timeout = setTimeout(() => {
          if (!connected) {
            peer.destroy();
            reject(new Error('Connection timeout'));
          }
        }, PEER_CONNECTION_TIMEOUT);
        
        peer.on('open', (id: string) => {
          connected = true;
          clearTimeout(timeout);
          this.peerId = id;
          this.peer = peer;
          this.activeServerConfig = serverConfig;
          resolve();
        });

        peer.on('connection', (conn: import('peerjs').DataConnection) => {
          this.handleIncomingConnection(conn);
        });

        peer.on('error', (err: Error) => {
          clearTimeout(timeout);
          if (!connected) {
            peer.destroy();
            reject(err);
          } else {
            console.error('Peer error:', err);
          }
        });
      });
    };
    
    // Get ICE servers config (user-provided or defaults)
    const iceServers = this.peerServerConfig?.iceServers || DEFAULT_ICE_SERVERS;
    const iceConfig = { iceServers };
    
    // Build server config and PeerJS options
    const hasUserServerConfig = this.peerServerConfig && 
      (this.peerServerConfig.host || this.peerServerConfig.port || this.peerServerConfig.path);
    
    if (hasUserServerConfig) {
      // User provided custom server config - try it first
      const userServerConfig: ActiveServerConfig = {
        host: this.peerServerConfig!.host || PEERJS_CLOUD_HOST,
        port: this.peerServerConfig!.port || PEERJS_CLOUD_PORT,
        path: this.peerServerConfig!.path || PEERJS_CLOUD_PATH,
        secure: this.peerServerConfig!.secure ?? PEERJS_CLOUD_SECURE,
      };
      
      const userPeerOptions: import('peerjs').PeerOptions = {
        host: userServerConfig.host,
        port: userServerConfig.port,
        path: userServerConfig.path,
        secure: userServerConfig.secure,
        config: iceConfig,
      };
      
      try {
        await connectPeer(userPeerOptions, userServerConfig);
        console.log(`[SyncableDatabase] Connected to peer server: ${userServerConfig.host}:${userServerConfig.port}`);
        return;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.warn(`[SyncableDatabase] Failed to connect to user peer server (${userServerConfig.host}:${userServerConfig.port}): ${errorMessage}`);
        
        // Check if fallback is enabled
        if (this.peerServerConfig?.fallbackToCloud) {
          console.log('[SyncableDatabase] Falling back to PeerJS cloud server...');
          
          // Notify via callback
          if (this.onFallbackToCloudCallback) {
            try {
              this.onFallbackToCloudCallback(errorMessage);
            } catch (e) {
              console.error('Fallback callback error:', e);
            }
          }
        } else {
          // No fallback - re-throw the error
          throw err;
        }
      }
    }
    
    // Use PeerJS cloud defaults (either no user config, or fallback after user config failed)
    const cloudServerConfig: ActiveServerConfig = {
      host: PEERJS_CLOUD_HOST,
      port: PEERJS_CLOUD_PORT,
      path: PEERJS_CLOUD_PATH,
      secure: PEERJS_CLOUD_SECURE,
    };
    
    // Use PeerJS cloud for signaling, but still apply ICE servers config
    const cloudPeerOptions: import('peerjs').PeerOptions = {
      config: iceConfig,
    };
    
    await connectPeer(cloudPeerOptions, cloudServerConfig);
    console.log('[SyncableDatabase] Connected to PeerJS cloud server');
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
    if (this.mode !== 'syncing' || !this.activeServerConfig) {
      return;
    }
    
    try {
      // Query PeerJS server for all connected peers using the active server config
      const { host, port, path, secure } = this.activeServerConfig;
      const protocol = secure ? 'https' : 'http';
      
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
    
    // If this is a mutation, notify listeners and optionally broadcast to peers
    if (result.affectedRows && result.affectedRows.length > 0) {
      // Collect unique affected tables
      const affectedTables = [...new Set(result.affectedRows.map(r => r.table))];
      
      // If syncing mode, get the processed SQL/params BEFORE emitting mutation
      // (emitMutation can trigger React re-renders which may overwrite lastProcessedSql)
      let syncOperation: SyncOperation | null = null;
      if (this.mode === 'syncing') {
        const [processedSql, processedParams] = await Promise.all([
          this.sendRequest('getLastProcessedSql', this.dbName, []),
          this.sendRequest('getLastProcessedParams', this.dbName, []),
        ]);
        
        syncOperation = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          sql: processedSql as string,
          params: processedParams as unknown[],
          table: affectedTables[0],
          rowId: result.affectedRows[0]?.id || '',
        };
      }
      
      // Emit mutation event for reactivity (useSQL re-renders)
      this.emitMutation(affectedTables);
      
      // Broadcast to peers after emitting mutation
      if (syncOperation) {
        this.broadcastOperation(syncOperation);
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
    
    // Execute the SQL directly without reprocessing, passing params for binding
    await this.sendRequest('execRaw', this.dbName, [operation.sql, operation.params || []]);
    
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

  async exportBinary(): Promise<Uint8Array> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    const data = await this.sendRequest('exportBinary', this.dbName, []) as number[];
    return new Uint8Array(data);
  }

  async saveToFile(filename?: string): Promise<void> {
    if (typeof document === 'undefined') {
      throw new Error('saveToFile is only available in browser environments');
    }
    const data = await this.exportBinary();
    const timestamp = new Date().toISOString().split('T')[0];
    const actualFilename = filename ?? `${this.dbName}-${timestamp}.sqlite`;
    const blob = new Blob([data.buffer as ArrayBuffer], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = actualFilename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async import(data: Uint8Array): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    await this.sendRequest('import', this.dbName, [Array.from(data)]);
    this.emitDataChanged();
  }

  async importBinary(data: Uint8Array): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    await this.sendRequest('importBinary', this.dbName, [Array.from(data)]);
    this.emitDataChanged();
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
      let connected = false;
      
      conn.on('open', () => {
        connected = true;
        const peerConn = new PeerConnection(peerId, conn, this);
        this.peers.set(peerId, peerConn);
        this.emitPeerConnected(peerId);
        resolve();
      });
      
      // Handle connection close for outgoing connections
      conn.on('close', () => {
        if (this.peers.has(peerId)) {
          this.peers.delete(peerId);
          this.emitPeerDisconnected(peerId);
        }
      });
      
      conn.on('error', (err) => {
        if (!connected) {
          reject(err);
        } else {
          console.error('Connection error:', err);
          this.peers.delete(peerId);
          this.emitPeerDisconnected(peerId);
        }
      });
      
      // Add timeout
      setTimeout(() => {
        if (!connected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
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

  async mergeFromPeer(peerId: string): Promise<void> {
    const peerConnection = this.peers.get(peerId);
    if (!peerConnection) {
      throw new Error(`Peer ${peerId} not connected`);
    }
    await peerConnection.requestMerge();
  }

  async mergeToPeer(peerId: string): Promise<void> {
    const peerConnection = this.peers.get(peerId);
    if (!peerConnection) {
      throw new Error(`Peer ${peerId} not connected`);
    }
    await peerConnection.pushMerge();
  }

  async mergeFromAllPeers(): Promise<void> {
    const promises = Array.from(this.peers.keys()).map(peerId => 
      this.mergeFromPeer(peerId).catch(err => 
        console.error(`Failed to merge from ${peerId}:`, err)
      )
    );
    await Promise.all(promises);
  }

  async mergeToAllPeers(): Promise<void> {
    const promises = Array.from(this.peers.keys()).map(peerId => 
      this.mergeToPeer(peerId).catch(err => 
        console.error(`Failed to merge to ${peerId}:`, err)
      )
    );
    await Promise.all(promises);
  }

  async syncWithPeer(peerId: string): Promise<void> {
    await this.mergeFromPeer(peerId);
    await this.mergeToPeer(peerId);
  }

  async syncWithAllPeers(): Promise<void> {
    const promises = Array.from(this.peers.keys()).map(peerId => 
      this.syncWithPeer(peerId).catch(err => 
        console.error(`Failed to sync with ${peerId}:`, err)
      )
    );
    await Promise.all(promises);
  }

  async merge(remoteData: Uint8Array): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    await this.sendRequest('merge', this.dbName, [Array.from(remoteData)]);
    this.emitDataChanged();
  }

  async mergeBinary(binaryData: Uint8Array): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    await this.sendRequest('mergeBinary', this.dbName, [Array.from(binaryData)]);
    this.emitDataChanged();
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
  
  /**
   * Register a callback that fires when a mutation (INSERT, UPDATE, DELETE) occurs.
   * This is used by React hooks to trigger re-renders.
   */
  onMutation(callback: MutationCallback): void {
    this.onMutationCallbacks.push(callback);
  }
  
  /**
   * Register a callback that fires when data changes from bulk operations (merge, import).
   * This is used by React hooks to trigger re-renders when peer sync completes.
   */
  onDataChanged(callback: DataChangedCallback): void {
    this.onDataChangedCallbacks.push(callback);
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
  
  private emitMutation(tables: string[]): void {
    for (const cb of this.onMutationCallbacks) {
      try { cb(tables); } catch (e) { console.error('Callback error:', e); }
    }
  }
  
  private emitDataChanged(): void {
    for (const cb of this.onDataChangedCallbacks) {
      try { cb(); } catch (e) { console.error('Callback error:', e); }
    }
  }

  async close(): Promise<void> {
    // Stop discovery
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer);
      this.discoveryTimer = null;
    }
    
    // Stop peer retry timer
    this.clearPeerRetryTimer();
    
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
  private pendingMerge: { resolve: () => void; reject: (err: Error) => void } | null = null;

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
      } else if (msg.type === 'mergeRequest') {
        // Remote wants our data for merging
        const exportData = await this.db.export();
        this.connection.send({ type: 'mergeData', data: Array.from(exportData) });
      } else if (msg.type === 'mergeData' && msg.data) {
        // Response to our mergeRequest - merge their data into ours
        await this.db.merge(new Uint8Array(msg.data));
        this.pendingMerge?.resolve();
        this.pendingMerge = null;
      } else if (msg.type === 'pushMergeData' && msg.data) {
        // Remote is pushing their data for us to merge
        await this.db.merge(new Uint8Array(msg.data));
      }
    });

    this.connection.on('close', () => {
      this.pendingExport?.reject(new Error('Connection closed'));
      this.pendingImport?.reject(new Error('Connection closed'));
      this.pendingMerge?.reject(new Error('Connection closed'));
    });

    this.connection.on('error', (err: Error) => {
      this.pendingExport?.reject(err);
      this.pendingImport?.reject(err);
      this.pendingMerge?.reject(err);
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

  async requestMerge(): Promise<void> {
    if (!this.connection.open) {
      throw new Error(`Peer ${this.peerId} not connected`);
    }

    this.connection.send({ type: 'mergeRequest' });

    return new Promise((resolve, reject) => {
      this.pendingMerge = { resolve, reject };
      setTimeout(() => {
        if (this.pendingMerge) {
          this.pendingMerge.reject(new Error('Merge request timed out'));
          this.pendingMerge = null;
        }
      }, 30000);
    });
  }

  async pushMerge(): Promise<void> {
    if (!this.connection.open) {
      throw new Error(`Peer ${this.peerId} not connected`);
    }

    const exportData = await this.db.export();
    this.connection.send({ type: 'pushMergeData', data: Array.from(exportData) });

    // Small delay to allow message to be processed
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
