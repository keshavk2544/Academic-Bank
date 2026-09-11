
import { getAdminFirestore } from '@/lib/firebase-admin';

export interface LoginTransaction {
  cookies: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface ERPSession {
  qumsCookies: string;
  createdAt: string;
  expiresAt: string;
}

/**
 * Common interface for session storage to abstract environment differences.
 */
export interface SessionStore {
  saveTransaction(id: string, data: LoginTransaction): Promise<void>;
  getTransaction(id: string): Promise<LoginTransaction | null>;
  deleteTransaction(id: string): Promise<void>;
  
  saveSession(id: string, data: ERPSession): Promise<void>;
  getSession(id: string): Promise<ERPSession | null>;
  deleteSession(id: string): Promise<void>;
}

/**
 * In-memory implementation for development/preview.
 * Uses a global variable to persist data across Next.js hot-reloads.
 */
class InMemoryStore implements SessionStore {
  private transactions = new Map<string, LoginTransaction>();
  private sessions = new Map<string, ERPSession>();

  async saveTransaction(id: string, data: LoginTransaction) {
    this.transactions.set(id, data);
  }
  async getTransaction(id: string) {
    const data = this.transactions.get(id);
    if (!data) return null;
    if (new Date() > new Date(data.expiresAt)) {
      this.transactions.delete(id);
      return null;
    }
    return data;
  }
  async deleteTransaction(id: string) {
    this.transactions.delete(id);
  }

  async saveSession(id: string, data: ERPSession) {
    this.sessions.set(id, data);
  }
  async getSession(id: string) {
    const data = this.sessions.get(id);
    if (!data) return null;
    if (new Date() > new Date(data.expiresAt)) {
      this.sessions.delete(id);
      return null;
    }
    return data;
  }
  async deleteSession(id: string) {
    this.sessions.delete(id);
  }
}

// Persist the in-memory store instance across HMR in development
const GLOBAL_IN_MEMORY_STORE_KEY = 'qums_session_store_v2';

function getInMemoryStoreInstance(): InMemoryStore {
  const globalAny = global as any;
  if (!globalAny[GLOBAL_IN_MEMORY_STORE_KEY]) {
    console.log('[STORE] Initializing fresh Global In-Memory Store.');
    globalAny[GLOBAL_IN_MEMORY_STORE_KEY] = new InMemoryStore();
  }
  return globalAny[GLOBAL_IN_MEMORY_STORE_KEY];
}

/**
 * Firestore implementation for production/App Hosting.
 */
class FirestoreStore implements SessionStore {
  private get db() {
    return getAdminFirestore();
  }

  async saveTransaction(id: string, data: LoginTransaction) {
    await this.db.collection('loginTransactions').doc(id).set(data);
  }
  async getTransaction(id: string) {
    try {
      const snap = await this.db.collection('loginTransactions').doc(id).get();
      if (!snap.exists) return null;
      return snap.data() as LoginTransaction;
    } catch (e) {
      console.error('[STORE-FIRESTORE] Error getting transaction:', e);
      return null;
    }
  }
  async deleteTransaction(id: string) {
    await this.db.collection('loginTransactions').doc(id).delete().catch(() => {});
  }

  async saveSession(id: string, data: ERPSession) {
    await this.db.collection('erpSessions').doc(id).set(data);
  }
  async getSession(id: string) {
    try {
      const snap = await this.db.collection('erpSessions').doc(id).get();
      if (!snap.exists) return null;
      return snap.data() as ERPSession;
    } catch (e) {
      console.error('[STORE-FIRESTORE] Error getting session:', e);
      return null;
    }
  }
  async deleteSession(id: string) {
    await this.db.collection('erpSessions').doc(id).delete().catch(() => {});
  }
}

let firestoreInstance: FirestoreStore | null = null;

export function getSessionStore(): SessionStore {
  // If we're explicitly in production and not in a preview environment, use Firestore
  if (process.env.NODE_ENV === 'production') {
    if (!firestoreInstance) {
      firestoreInstance = new FirestoreStore();
    }
    return firestoreInstance;
  }
  
  // Otherwise, use the Global In-Memory store for stability during development
  return getInMemoryStoreInstance();
}
