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
}

export interface QueryResult {
  rows: Record<string, unknown>[];
  columns: string[];
}

export interface PeerInfo {
  id: string;
  status: 'connecting' | 'connected' | 'disconnected';
}

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
  private worker: Worker | null = null;
  private peer: import('peerjs').Peer | null = null;
  private peerId: string | null = null;
  private peers: Map<string, PeerConnection> = new Map();
  private pendingRequests: Map<number, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }> = new Map();
  private nextRequestId = 0;
  private isInitialized = false;

  private constructor(dbName: string, mode: DatabaseMode, peerServerConfig?: PeerServerConfig) {
    this.dbName = dbName;
    this.mode = mode;
    this.peerServerConfig = peerServerConfig;
  }

  static async create(dbName: string, config: DatabaseConfig): Promise<SyncableDatabase> {
    const db = new SyncableDatabase(dbName, config.mode, config.peerServer);
    await db.init();
    return db;
  }

  private async init(): Promise<void> {
    if (typeof window === 'undefined' && typeof Worker === 'undefined') {
      throw new Error('SyncableDatabase requires a browser environment');
    }

    const workerUrl = new URL('./worker.js', import.meta.url);
    this.worker = new Worker(workerUrl, { type: 'module' });

    this.worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
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

    this.worker.onerror = (error: Event) => {
      console.error('Worker error:', error);
    };

    await this.sendRequest('init', this.dbName, []);
    
    await this.sendRequest('createDb', this.dbName, []);
    
    this.isInitialized = true;

    if (this.mode === 'syncing') {
      await this.initPeer();
    }
  }

  private async initPeer(): Promise<void> {
    const { Peer } = await import('peerjs');
    
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
      const peer = new Peer(peerOptions);
      
      peer.on('open', (id: string) => {
        this.peerId = id;
        this.peer = peer;
        resolve();
      });

      peer.on('connection', (conn: import('peerjs').DataConnection) => {
        this.handleConnection(conn);
      });

      peer.on('error', (err: Error) => {
        console.error('Peer error:', err);
        reject(err);
      });
    });
  }

  private handleConnection(conn: import('peerjs').DataConnection): void {
    const peerId = conn.peer;
    
    conn.on('open', () => {
      this.peers.set(peerId, new PeerConnection(peerId, conn, this));
    });

    conn.on('data', async (data: unknown) => {
      const msg = data as { type: string; data?: number[] };
      if (msg.type === 'exportRequest') {
        const exportData = await this.export();
        conn.send({ type: 'exportData', data: Array.from(exportData) });
      } else if (msg.type === 'importData' && msg.data) {
        await this.import(new Uint8Array(msg.data));
      }
    });

    conn.on('close', () => {
      this.peers.delete(peerId);
    });

    conn.on('error', (err: Error) => {
      console.error('Connection error:', err);
      this.peers.delete(peerId);
    });
  }

  private sendRequest(type: string, dbName: string, args: unknown[]): Promise<unknown> {
    const id = this.nextRequestId++;
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker?.postMessage({ id, type, dbName, args });
    });
  }

  async exec(sql: string, params?: unknown[]): Promise<QueryResult> {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }
    const result = await this.sendRequest('exec', this.dbName, [sql, params]) as QueryResult;
    return result;
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
    // Pass the array as a single argument wrapped in args array
    await this.sendRequest('import', this.dbName, [Array.from(data)]);
  }

  async connectToPeer(peerId: string): Promise<void> {
    if (this.mode !== 'syncing') {
      throw new Error('Cannot connect to peers in local mode');
    }

    if (!this.peer) {
      throw new Error('Peer not initialized');
    }

    const conn = this.peer.connect(peerId);
    
    await new Promise<void>((resolve, reject) => {
      conn.on('open', () => {
        this.peers.set(peerId, new PeerConnection(peerId, conn, this));
        resolve();
      });
      conn.on('error', reject);
    });
  }

  async disconnectFromPeer(peerId: string): Promise<void> {
    const peerConnection = this.peers.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      this.peers.delete(peerId);
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

  async close(): Promise<void> {
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
      const msg = data as { type: string; data?: number[] };
      if (msg.type === 'exportData' && msg.data) {
        const dataArray = new Uint8Array(msg.data);
        await this.db.import(dataArray);
        this.pendingExport?.resolve();
        this.pendingExport = null;
      } else if (msg.type === 'exportRequest') {
        const exportData = await this.db.export();
        this.connection.send({ type: 'exportData', data: Array.from(exportData) });
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
