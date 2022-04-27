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

export const filterUndefinedItems = <T>(array: (T | undefined)[]): T[] =>
  array.filter((it) => it !== undefined) as T[];

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
