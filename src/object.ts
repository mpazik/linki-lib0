export const cloneObject = <T extends object>(o: T): T => Object.assign({}, o);

// structuredClone is not widely supported yet
// export const deepCloneObject = <T extends object>(o: T): T => structuredClone(o);

export const hasProperty = (obj: object, prop: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, prop);
