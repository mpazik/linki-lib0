import { removeItem } from "./array";
import type { MapFunction } from "./function";

export const getOrSet = <K, V>(map: Map<K, V>, key: K, defaultValue: V): V => {
  const value = map.get(key);
  if (value) return value;

  map.set(key, defaultValue);
  return defaultValue;
};

export const addItemToMapArray = <K, V>(map: Map<K, V[]>, key: K, value: V) => {
  const array = map.get(key) ?? [];
  array.push(value);
  map.set(key, array);
};

export const removeItemFromMapArray = <K, V>(
  map: Map<K, V[]>,
  key: K,
  value: V
): void => {
  const array = map.get(key) ?? [];
  removeItem(array, value);
  map.set(key, array);
};

export const collectToMap = <K, V, T>(
  collection: T[],
  keyMapper: MapFunction<T, K>,
  valueMapper: MapFunction<T, V>
): Map<K, V> =>
  collection.reduce((map, item, i) => {
    map.set(keyMapper(item, i), valueMapper(item, i));
    return map;
  }, new Map<K, V>());
