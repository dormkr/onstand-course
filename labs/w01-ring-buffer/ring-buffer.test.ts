import { describe, it, expect } from "vitest";
// @ts-ignore — you create ring-buffer.ts. Spec: site/content/weeks/week-01.md, "Lab 2".
import { RingBuffer } from "./ring-buffer";

const arr = (out: Float32Array) => Array.from(out);

describe("RingBuffer", () => {
  it("rejects a capacity that is not a positive integer", () => {
    expect(() => new RingBuffer(0)).toThrow(RangeError);
    expect(() => new RingBuffer(-4)).toThrow(RangeError);
    expect(() => new RingBuffer(2.5)).toThrow(RangeError);
  });

  it("starts empty", () => {
    const rb = new RingBuffer(4);
    expect(rb.capacity).toBe(4);
    expect(rb.size).toBe(0);
  });

  it("returns the latest samples oldest-first", () => {
    const rb = new RingBuffer(8);
    rb.push([1, 2, 3]);
    expect(rb.size).toBe(3);
    expect(arr(rb.latest(3, new Float32Array(3)))).toEqual([1, 2, 3]);
    expect(arr(rb.latest(2, new Float32Array(2)))).toEqual([2, 3]);
  });

  it("overwrites the oldest samples when full, across the wrap point", () => {
    const rb = new RingBuffer(4);
    rb.push([1, 2, 3]);
    rb.push([4, 5, 6]);
    expect(rb.size).toBe(4);
    expect(arr(rb.latest(4, new Float32Array(4)))).toEqual([3, 4, 5, 6]);
  });

  it("keeps only the last `capacity` samples of a chunk larger than itself", () => {
    const rb = new RingBuffer(3);
    rb.push([1, 2, 3, 4, 5, 6, 7]);
    expect(arr(rb.latest(3, new Float32Array(3)))).toEqual([5, 6, 7]);
  });

  it("accepts an empty push", () => {
    const rb = new RingBuffer(3);
    rb.push([]);
    expect(rb.size).toBe(0);
  });

  it("writes into the array you pass, from index 0, and returns that same array", () => {
    const rb = new RingBuffer(4);
    rb.push([1, 2, 3, 4]);
    const out = new Float32Array(10).fill(-1);
    const got = rb.latest(2, out);
    expect(got).toBe(out);
    expect(arr(out).slice(0, 3)).toEqual([3, 4, -1]);
  });

  it("refuses to read more than it holds or than `out` can take", () => {
    const rb = new RingBuffer(4);
    rb.push([1, 2]);
    expect(() => rb.latest(3, new Float32Array(3))).toThrow(RangeError);
    expect(() => rb.latest(2, new Float32Array(1))).toThrow(RangeError);
  });

  it("clear() empties it", () => {
    const rb = new RingBuffer(4);
    rb.push([1, 2, 3]);
    rb.clear();
    expect(rb.size).toBe(0);
    rb.push([9]);
    expect(arr(rb.latest(1, new Float32Array(1)))).toEqual([9]);
  });

  it("matches a naive model over many random pushes", () => {
    let seed = 12345;
    const rand = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 2 ** 32);
    const cap = 37, rb = new RingBuffer(cap);
    let model: number[] = [];
    for (let step = 0; step < 2000; step++) {
      const chunk = Array.from({ length: Math.floor(rand() * 60) }, () => Math.round(rand() * 1000));
      rb.push(chunk);
      model = model.concat(chunk).slice(-cap);
      expect(rb.size).toBe(model.length);
      const n = Math.floor(rand() * (model.length + 1));
      expect(arr(rb.latest(n, new Float32Array(cap)).subarray(0, n))).toEqual(model.slice(model.length - n));
    }
  });
});
