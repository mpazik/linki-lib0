/**
 * A static reference for an empty object
 */
export const emptyObject = [];

export const cloneObject = <T extends object>(o: T): T => Object.assign({}, o);

// structuredClone is not widely supported yet
// export const deepCloneObject = <T extends object>(o: T): T => structuredClone(o);

export const hasProperty = (obj: object, prop: string): boolean =>
  Object.hasOwn(obj, prop);
