export type MapFunction<T, S> = (value: T, index: number) => S;
export type AsyncTransform<T, S> = (value: T) => Promise<S>;
export type Transform<T, S> = (value: T) => S;
export type Action = () => void;
export type Predicate<T> = (value: T) => boolean;
export type Consumer<T> = (value: T) => void;
export type Function<T, S> = (value: T) => S;
export type Supplier<T> = () => T;

export const apply = (action: Action): void => action();
export const applyWith =
  <T>(param: T) =>
  (consumer: Consumer<T>): void =>
    consumer(param);

export const nop: Action = () => {};
export const identity = <T>(value: T): T => value;
export const ignore: Transform<unknown, void> = () => {};

export const equalStrict = (a: unknown, b: unknown) => a === b;

export const equalDeep = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor) return false;

    let length, i;
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return false;
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!equalDeep(a[i], b[i])) return false;
      return true;
    }

    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      const key = keys[i];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!equalDeep(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
};
