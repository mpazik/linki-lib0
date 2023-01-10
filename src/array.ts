/**
 * A static reference for an empty array
 */
import { defined, nonNull } from "./function";

export const emptyArray = [];

export const firstItem = <T>(arr: T[]): T => arr[0];

export const lastItem = <T>(arr: T[]) => arr[arr.length - 1];

// returns void to highlight that the original array was mutated
export const removeItem = <T>(array: T[], item: T): void => {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
};

export const cloneArray = <T>(a: T[]): T[] => a.slice();

export const filterDefined = <T>(array: (T | undefined)[]): T[] =>
  array.filter(defined) as T[];

export const filterNonNull = <T>(array: (T | undefined | null)[]): T[] =>
  array.filter(nonNull) as T[];

export const range = (from: number, to: number): number[] =>
  Array.from({ length: to + 1 - from }, (_, i) => from + i);

export const splitArray = <T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  const trueArray: T[] = [];
  const falseArray: T[] = [];
  for (const item of array) {
    if (predicate(item)) {
      trueArray.push(item);
    } else {
      falseArray.push(item);
    }
  }
  return [trueArray, falseArray];
};

export const normaliseArray = <T>(item: undefined | T | T[]): T[] =>
  item === undefined ? [] : Array.isArray(item) ? item : [item];
