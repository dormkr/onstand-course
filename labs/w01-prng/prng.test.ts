import { describe, it, expect } from "vitest";
// @ts-ignore — you create prng.ts. Spec: site/content/weeks/week-01.md, "Lab 1".
import { Rng } from "./prng";

const N = 100_000;

describe("Rng: mulberry32", () => {
  it("produces the reference sequence for seed 42", () => {
    const r = new Rng(42);
    expect([r.nextUint32(), r.nextUint32(), r.nextUint32()]).toEqual([2581720956, 1925393290, 3661312704]);
  });

  it("produces the reference sequence for seed 0", () => {
    const r = new Rng(0);
    expect([r.nextUint32(), r.nextUint32()]).toEqual([1144304738, 1416247]);
  });

  it("is deterministic: same seed, same sequence; different seed, different sequence", () => {
    const a = new Rng(7), b = new Rng(7), c = new Rng(8);
    const seq = (r: Rng) => Array.from({ length: 5 }, () => r.nextUint32());
    const sa = seq(a);
    expect(seq(b)).toEqual(sa);
    expect(seq(c)).not.toEqual(sa);
  });

  it("returns unsigned 32-bit integers", () => {
    const r = new Rng(123);
    for (let i = 0; i < 1000; i++) {
      const x = r.nextUint32();
      expect(Number.isInteger(x)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(2 ** 32);
    }
  });
});

describe("Rng.float", () => {
  it("stays in [0, 1) and averages one half", () => {
    const r = new Rng(3);
    let sum = 0, outside = 0;
    for (let i = 0; i < N; i++) {
      const x = r.float();
      if (!(x >= 0 && x < 1)) outside++;
      sum += x;
    }
    expect(outside).toBe(0);
    expect(Math.abs(sum / N - 0.5)).toBeLessThan(0.005);
  });
});

describe("Rng.int", () => {
  it("stays in [0, max)", () => {
    const r = new Rng(9);
    for (let i = 0; i < 10_000; i++) {
      const x = r.int(6);
      expect(Number.isInteger(x) && x >= 0 && x < 6).toBe(true);
    }
  });

  it("is unbiased even when max does not divide 2^32 (modulo bias)", () => {
    // With max = 3·2^30, `nextUint32() % max` makes values below 2^30 twice as likely (about 0.5 instead of 1/3).
    const r = new Rng(5), max = 3 * 2 ** 30;
    let low = 0;
    for (let i = 0; i < N; i++) if (r.int(max) < 2 ** 30) low++;
    expect(Math.abs(low / N - 1 / 3)).toBeLessThan(0.01);
  });

  it("rejects a max that is not a positive integer", () => {
    const r = new Rng(1);
    expect(() => r.int(0)).toThrow(RangeError);
    expect(() => r.int(-3)).toThrow(RangeError);
    expect(() => r.int(2.5)).toThrow(RangeError);
  });
});

describe("Rng.gaussian", () => {
  it("has mean 0, standard deviation 1, and 68% within one sigma", () => {
    const r = new Rng(1);
    let s = 0, s2 = 0, within = 0;
    for (let i = 0; i < N; i++) {
      const x = r.gaussian();
      s += x; s2 += x * x;
      if (Math.abs(x) < 1) within++;
    }
    const mean = s / N, sd = Math.sqrt(s2 / N - mean * mean);
    expect(Math.abs(mean)).toBeLessThan(0.02);
    expect(Math.abs(sd - 1)).toBeLessThan(0.02);
    expect(Math.abs(within / N - 0.6827)).toBeLessThan(0.01);
  });
});
