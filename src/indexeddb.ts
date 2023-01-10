import { filterDefined } from "./array";

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

export const deleteDb = (dbName: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(dbName);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
    req.onblocked = () => reject(req.error);
  });

export const listDbs = (): Promise<string[]> => {
  if ("databases" in indexedDB) {
    return indexedDB
      .databases()
      .then((list) => list.map((db) => db.name))
      .then(filterDefined);
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

export const transactWithStore = (
  db: IDBDatabase,
  store: string,
  access?: IDBTransactionMode
): IDBObjectStore => {
  const transaction = db.transaction(store, access);
  return getStore(transaction, store);
};

export const transactWithStores = (
  db: IDBDatabase,
  stores: string[],
  access?: IDBTransactionMode
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
  store: IDBObjectStore | IDBIndex,
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
  store: IDBObjectStore | IDBIndex,
  range?: IDBValidKey | IDBKeyRange
): Promise<T[]> => reqToPromise(store.getAll(range));

export const storeGetAllKeys = (
  store: IDBObjectStore | IDBIndex,
  range?: IDBValidKey | IDBKeyRange
): Promise<IDBValidKey[]> => reqToPromise(store.getAllKeys(range));

export const storeGetAllKeysAndValues = <T>(
  store: IDBObjectStore | IDBIndex,
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
  range?: IDBKeyRange
): Promise<number> => reqToPromise(store.count(range));

const iterateRequest = (
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

export const storeIterateHavingCursor = (
  store: IDBObjectStore | IDBIndex,
  handler: (cursor: IDBCursorWithValue) => void | boolean,
  range?: IDBKeyRange,
  direction?: IDBCursorDirection
): Promise<void> => iterateRequest(store.openCursor(range, direction), handler);

export const storeIterate = <T>(
  store: IDBObjectStore | IDBIndex,
  handler: (value: T, key: IDBValidKey) => void,
  range?: IDBKeyRange,
  direction?: IDBCursorDirection
): Promise<void> =>
  storeIterateHavingCursor(
    store,
    (cursor) => {
      handler(cursor.value, cursor.key);
    },
    range,
    direction
  );

export const storeIterateKeys = (
  store: IDBObjectStore | IDBIndex,
  handler: (key: IDBValidKey) => void,
  range?: IDBKeyRange,
  direction?: IDBCursorDirection
): Promise<void> =>
  storeIterateHavingCursor(
    store,
    (cursor) => {
      handler(cursor.key);
    },
    range,
    direction
  );

export const storeClear = (store: IDBObjectStore): Promise<void> =>
  reqToPromise(store.clear());
