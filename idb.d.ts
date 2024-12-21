declare module 'idb' {
  export interface IDBPDatabase<T> {
    transaction<K extends keyof T>(
      storeNames: K | K[],
      mode?: IDBTransactionMode
    ): IDBPTransaction<T, K>;
    createObjectStore<K extends keyof T>(
      name: K,
      options?: IDBObjectStoreParameters
    ): IDBPObjectStore<T, K>;
    close(): void;
    objectStoreNames: DOMStringList;
  }

  export interface IDBPTransaction<T, K extends keyof T> {
    store: IDBPObjectStore<T, K>;
    done: Promise<void>;
  }

  export interface IDBPObjectStore<T, K extends keyof T> {
    add(value: T[K], key?: IDBValidKey): Promise<IDBValidKey>;
    put(value: T[K], key?: IDBValidKey): Promise<IDBValidKey>;
    get(key: IDBValidKey): Promise<T[K]>;
    getAll(): Promise<T[K][]>;
    getAllFromIndex(indexName: string): Promise<T[K][]>;
  }

  export interface DBSchema {
    [key: string]: {
      key: any;
      value: any;
      indexes?: { [key: string]: string };
    };
  }

  export function openDB<T extends DBSchema>(
    name: string,
    version: number,
    {
      upgrade,
    }: {
      upgrade?: (db: IDBPDatabase<T>) => void;
    }
  ): Promise<IDBPDatabase<T>>;
} 