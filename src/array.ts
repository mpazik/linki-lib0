export const firstItem = <T>(arr: T[]): T => arr[0];

export const lastItem = <T>(arr: T[]) => arr[arr.length - 1];

export const copyArray = <T>(a: T[]): T[] => a.slice();
