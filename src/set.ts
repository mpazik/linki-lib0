import { filter } from "./iterator";

export const setDifference = <T>(setA: Set<T>, setB: Set<T>): Set<T> =>
  new Set(filter(setA, (x) => !setB.has(x)));

export const setIntersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> =>
  new Set(filter(setA, (x) => setB.has(x)));
