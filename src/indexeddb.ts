import { filterUndefinedItems } from "./array";

export const openDb = (
  dbName: string,
  initOrUpgradeDb: (db: IDBDatabase, oldVersion: number) => void,
  version?: number
): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const openReq = indexedDB.open(dbName, version);
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => resolve(openReq.result);
    openReq.onupgradeneeded = (event) => {
      initOrUpgradeDb(openReq.result, event.oldVersion);
    };
  });

export const listDbs = (): Promise<string[]> => {
  if ("databases" in indexedDB) {
    return indexedDB
      .databases()
      .then((list) => list.map((db) => db.name))
      .then(filterUndefinedItems);
  }
  throw new Error("Browser does not support 'indexedDB.databases'");
};

export const transactionToPromise = (
  transaction: IDBTransaction
): Promise<void> =>
  new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = reject;
  });

export const getStore = (
  transaction: IDBTransaction,
  store: string
): IDBObjectStore => transaction.objectStore(store);

export const createStoreTransaction = (
  db: IDBDatabase,
  store: string,
  access: IDBTransactionMode = "readwrite"
): IDBObjectStore => {
  const transaction = db.transaction(store, access);
  return getStore(transaction, store);
};

export const createStoresTransaction = (
  db: IDBDatabase,
  stores: string[],
  access: IDBTransactionMode = "readwrite"
): IDBObjectStore[] => {
  const transaction = db.transaction(stores, access);
  return stores.map((store) => getStore(transaction, store));
};

const reqToPromise = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const storeGet = <T>(
  store: IDBObjectStore,
  key: IDBValidKey | IDBKeyRange
): Promise<T | undefined> => reqToPromise(store.get(key) as IDBRequest<T>);

export const storePut = <T>(
  store: IDBObjectStore,
  value: T,
  key?: IDBValidKey
): Promise<IDBValidKey> => reqToPromise(store.put(value, key));

export const storeDelete = (
  store: IDBObjectStore,
  key: IDBValidKey | IDBKeyRange
): Promise<undefined> => reqToPromise(store.delete(key));

export const storeGetAll = <T>(
  store: IDBObjectStore,
  range?: IDBValidKey | IDBKeyRange
): Promise<T[]> => reqToPromise(store.getAll(range));

export const storeGetAllKeys = (
  store: IDBObjectStore,
  range?: IDBValidKey | IDBKeyRange
): Promise<IDBValidKey[]> => reqToPromise(store.getAllKeys(range));

export const storeGetAllKeysAndValues = <T>(
  store: IDBObjectStore,
  range?: IDBValidKey | IDBKeyRange
): Promise<{ key: IDBValidKey; value: T }[]> =>
  Promise.all([
    storeGetAllKeys(store, range),
    storeGetAll<T>(store, range),
  ]).then(([keys, values]) =>
    keys.map((key, i) => ({
      key,
      value: values[i],
    }))
  );

export const storeCount = (
  store: IDBObjectStore,
  range: IDBKeyRange
): Promise<number> => reqToPromise(store.count(range));

const iterateOnRequest = (
  request: IDBRequest<IDBCursorWithValue | null>,
  handler: (cursor: IDBCursorWithValue) => void | boolean
): Promise<void> =>
  new Promise((resolve, reject) => {
    request.onerror = reject;
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor === null || handler(cursor) === false) {
        return resolve();
      }
      cursor.continue();
    };
  });

export const storeIterate = <T>(
  store: IDBObjectStore,
  range: IDBKeyRange,
  handler: (value: T, key: IDBValidKey) => void,
  direction: IDBCursorDirection = "next"
): Promise<void> =>
  iterateOnRequest(store.openCursor(range, direction), (cursor) => {
    handler(cursor.value, cursor.key);
  });

export const storeIterateKeys = (
  store: IDBObjectStore,
  range: IDBKeyRange,
  handler: (key: IDBValidKey) => void,
  direction: IDBCursorDirection = "next"
): Promise<void> =>
  iterateOnRequest(store.openCursor(range, direction), (cursor) => {
    handler(cursor.key);
  });

export const storeClear = (store: IDBObjectStore): Promise<undefined> =>
  reqToPromise(store.clear());
