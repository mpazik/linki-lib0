import type { Consumer, Predicate, Transform } from "./function";

export const haveSameItem = <T>(a: Iterable<T>, b: Iterable<T>): boolean => {
  for (const itemA of a)
    for (const itemB of b) if (itemA === itemB) return true;
  return false;
};

export const connect = <T>(...iterables: Iterable<T>[]): Iterable<T> => ({
  *[Symbol.iterator]() {
    for (const iterable of iterables) {
      for (const item of iterable) {
        yield item;
      }
    }
  },
});

export const partition = <T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>
): [T[], T[]] => {
  const a: T[] = [];
  const b: T[] = [];
  for (const item of iterable) {
    (predicate(item) ? a : b).push(item);
  }
  return [a, b];
};

export const every = <T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>
): boolean => {
  for (const item of iterable) {
    if (!predicate(item)) return false;
  }
  return true;
};

export const forEach = <T>(
  iterable: Iterable<T>,
  consumer: Consumer<T>
): void => {
  for (const item of iterable) consumer(item);
};

export const filter = <T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>
): Iterable<T> => ({
  *[Symbol.iterator]() {
    for (const item of iterable) {
      if (predicate(item)) {
        yield item;
      }
    }
  },
});

export const map = <T, S>(
  iterable: Iterable<T>,
  map: Transform<T, S>
): Iterable<S> => ({
  *[Symbol.iterator]() {
    for (const item of iterable) {
      yield map(item);
    }
  },
});
