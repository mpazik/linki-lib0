import {
  filterDefined,
  filterNonNull,
  firstItem,
  lastItem,
  removeItem,
  splitArray,
} from "./array";

describe("firstItem", () => {
  it("should return the first item of an array", () => {
    expect(firstItem([1, 2, 3])).toBe(1);
  });

  it("should return undefined if the array is empty", () => {
    expect(firstItem([])).toBeUndefined();
  });
});

describe("lastItem", () => {
  it("should return the last item of an array", () => {
    expect(lastItem([1, 2, 3])).toBe(3);
  });

  it("should return undefined if the array is empty", () => {
    expect(lastItem([])).toBeUndefined();
  });
});

describe("filterDefined", () => {
  it("should pass only defined items", () => {
    expect(filterDefined([1, undefined, 2, null, 3])).toEqual([1, 2, null, 3]);
  });
});

describe("filterNonNull", () => {
  it("should pass only non null and defined items", () => {
    expect(filterNonNull([1, undefined, 2, null, 3])).toEqual([1, 2, 3]);
  });
});

describe("split array", () => {
  it("returns two arrays according to a predicate", () => {
    expect(splitArray([1, 2, 3, 4], (it) => it % 2 === 0)).toEqual([
      [2, 4],
      [1, 3],
    ]);
  });

  it("returns a one empty array if predicates is always false or ture", () => {
    expect(splitArray([1, 2, 3, 4], () => true)).toEqual([[1, 2, 3, 4], []]);
  });
});

describe("removeItem", () => {
  it("should return remove the item for the array", () => {
    const original = [1, 2, 3];
    removeItem(original, 2);
    expect(original).toEqual([1, 3]);
  });
});
