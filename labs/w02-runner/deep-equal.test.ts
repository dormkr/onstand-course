import { describe, it, expect } from "vitest";
// @ts-ignore — you create deep-equal.ts. Spec: site/content/weeks/week-02.md, "Lab 1".
import { deepEqual } from "./deep-equal";

describe("deepEqual: primitives use Object.is", () => {
  it("compares numbers, strings, booleans, null and undefined", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual("a", "a")).toBe(true);
    expect(deepEqual(true, false)).toBe(false);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(1, "1")).toBe(false);
  });
  it("treats NaN as equal to NaN, and 0 as different from -0", () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
    expect(deepEqual(0, -0)).toBe(false);
  });
});

describe("deepEqual: arrays and objects", () => {
  it("compares arrays element by element, in order", () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(deepEqual([1, 2], [2, 1])).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });
  it("compares plain objects by own keys, ignoring key order", () => {
    expect(deepEqual({ a: 1, b: { c: [1] } }, { b: { c: [1] }, a: 1 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });
  it("is strict about a key set to undefined versus a missing key", () => {
    expect(deepEqual({ a: undefined }, {})).toBe(false);
  });
  it("does not consider an array equal to an object with the same indices", () => {
    expect(deepEqual([1], { 0: 1 })).toBe(false);
  });
  it("does not consider instances of different classes equal", () => {
    class P { x = 1; }
    expect(deepEqual(new P(), { x: 1 })).toBe(false);
  });
});

describe("deepEqual: built-ins", () => {
  it("compares Dates by time", () => {
    expect(deepEqual(new Date(5), new Date(5))).toBe(true);
    expect(deepEqual(new Date(5), new Date(6))).toBe(false);
  });
  it("compares Maps by entries, deeply", () => {
    expect(deepEqual(new Map([["a", [1]]]), new Map([["a", [1]]]))).toBe(true);
    expect(deepEqual(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false);
  });
  it("compares Sets by members, deeply, ignoring order", () => {
    expect(deepEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(deepEqual(new Set([{ a: 1 }]), new Set([{ a: 1 }]))).toBe(true);
    expect(deepEqual(new Set([1]), new Set([2]))).toBe(false);
  });
  it("compares typed arrays element by element, and only with the same type", () => {
    expect(deepEqual(new Float32Array([1, 2]), new Float32Array([1, 2]))).toBe(true);
    expect(deepEqual(new Float32Array([1, 2]), new Float32Array([1, 3]))).toBe(false);
    expect(deepEqual(new Float32Array([1]), new Float64Array([1]))).toBe(false);
  });
});

describe("deepEqual: cycles", () => {
  it("terminates on cyclic structures", () => {
    const a: Record<string, unknown> = { n: 1 }; a.self = a;
    const b: Record<string, unknown> = { n: 1 }; b.self = b;
    expect(deepEqual(a, b)).toBe(true);
    const c: Record<string, unknown> = { n: 2 }; c.self = c;
    expect(deepEqual(a, c)).toBe(false);
  });
});
