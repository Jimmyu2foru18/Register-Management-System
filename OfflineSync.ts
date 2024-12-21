import { openDB, DBSchema, IDBPDatabase, IDBPObjectStore } from 'idb';
import { Product, Transaction } from '../types';

interface OfflineDB extends DBSchema {
  transactions: {
    key: number;
    value: Transaction & { synced: boolean };
    indexes: { 'by-date': string };
  };
  products: {
    key: number;
    value: {
      id: number;
      data: Product;
      lastUpdated: string;
    };
  };
}

export class OfflineSync {
  private db!: IDBPDatabase<OfflineDB>;
  private static instance: OfflineSync;

  private constructor() { /* Singleton pattern - initialize in getInstance */ }

  static async getInstance(): Promise<OfflineSync> {
    if (!OfflineSync.instance) {
      OfflineSync.instance = new OfflineSync();
      await OfflineSync.instance.initDB();
    }
    return OfflineSync.instance;
  }

  private async initDB(): Promise<void> {
    this.db = await openDB<OfflineDB>('register-management', 1, {
      upgrade(db: IDBPDatabase<OfflineDB>) {
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', {
            keyPath: 'id',
            autoIncrement: true,
          }) as IDBPObjectStore<OfflineDB, 'transactions'>;
          (txStore as IDBPObjectStore<OfflineDB, 'transactions'>).createIndex('by-date', 'createdAt');
        }

        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
      },
    });
  }

  async saveTransaction(transaction: Transaction) {
    const txStore = this.db.transaction('transactions', 'readwrite').objectStore('transactions');
    await txStore.add({
      ...transaction,
      synced: false,
      createdAt: new Date().toISOString(),
    });
  }

  async getUnsyncedTransactions() {
    return await this.db.getAllFromIndex('transactions', 'by-date');
  }

  async markTransactionSynced(id: number) {
    const tx = await this.db.get('transactions', id);
    if (tx) {
      tx.synced = true;
      await this.db.put('transactions', tx);
    }
  }

  async cacheProducts(products: Product[]) {
    const tx = this.db.transaction('products', 'readwrite');
    await Promise.all([
      ...products.map(product =>
        tx.store.put({
          id: product.id,
          data: product,
          lastUpdated: new Date().toISOString(),
        })
      ),
      tx.done,
    ]);
  }

  async getCachedProducts() {
    return await this.db.getAll('products');
  }
} 
