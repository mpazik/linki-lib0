import { firstItem, lastItem } from "./array";

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
    expect(lastItem([1, 2, 3])).toBe(1);
  });

  it("should return undefined if the array is empty", () => {
    expect(lastItem([])).toBeUndefined();
  });
});
