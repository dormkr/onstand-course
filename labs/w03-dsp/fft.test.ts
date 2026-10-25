import { describe, it, expect } from "vitest";
// @ts-ignore — you create dft.ts and fft.ts. Spec: site/content/weeks/week-03.md, "Lab".
import { dft } from "./dft";
// @ts-ignore
import { fft, ifft, isPowerOfTwo } from "./fft";

/** Deterministic test signal (a tiny LCG, so the tests never depend on Math.random). */
function signal(n: number, seed = 1) {
  let s = seed >>> 0;
  const next = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32) * 2 - 1;
  return { re: Float64Array.from({ length: n }, next), im: Float64Array.from({ length: n }, next) };
}
const maxDiff = (a: ArrayLike<number>, b: ArrayLike<number>) => {
  let m = 0;
  for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - b[i]));
  return m;
};

describe("isPowerOfTwo", () => {
  it("recognises powers of two, including 1", () => {
    expect([1, 2, 4, 1024, 65536].every(isPowerOfTwo)).toBe(true);
    expect([0, 3, 6, 1000, -4, 2.5].some(isPowerOfTwo)).toBe(false);
  });
});

describe("dft (O(N²), from the definition)", () => {
  it("transforms an impulse into a flat spectrum", () => {
    const { re, im } = dft(new Float64Array([1, 0, 0, 0]), new Float64Array(4));
    expect(maxDiff(re, [1, 1, 1, 1])).toBeLessThan(1e-12);
    expect(maxDiff(im, [0, 0, 0, 0])).toBeLessThan(1e-12);
  });

  it("puts a cosine at bin k into bins k and N−k, each with magnitude N/2", () => {
    const N = 16, k = 3;
    const x = Float64Array.from({ length: N }, (_, n) => Math.cos((2 * Math.PI * k * n) / N));
    const { re, im } = dft(x, new Float64Array(N));
    for (let b = 0; b < N; b++) {
      const mag = Math.hypot(re[b], im[b]);
      expect(mag).toBeCloseTo(b === k || b === N - k ? N / 2 : 0, 9);
    }
  });

  it("leaves its inputs untouched and works for lengths that are not powers of two", () => {
    const re = new Float64Array([1, 2, 3]), im = new Float64Array(3);
    const out = dft(re, im);
    expect(Array.from(re)).toEqual([1, 2, 3]);
    expect(out.re[0]).toBeCloseTo(6, 12);
  });
});

describe("fft (in place, radix-2)", () => {
  it("matches the DFT on a random complex signal", () => {
    const { re, im } = signal(256);
    const want = dft(re, im);
    fft(re, im);
    expect(maxDiff(re, want.re)).toBeLessThan(1e-9);
    expect(maxDiff(im, want.im)).toBeLessThan(1e-9);
  });

  it("inverts exactly with ifft", () => {
    const { re, im } = signal(1024, 7);
    const re0 = re.slice(), im0 = im.slice();
    fft(re, im);
    ifft(re, im);
    expect(maxDiff(re, re0)).toBeLessThan(1e-12);
    expect(maxDiff(im, im0)).toBeLessThan(1e-12);
  });

  it("conserves energy (Parseval: Σ|x|² = Σ|X|² / N)", () => {
    const { re, im } = signal(512, 3);
    let ex = 0;
    for (let i = 0; i < 512; i++) ex += re[i] ** 2 + im[i] ** 2;
    fft(re, im);
    let eX = 0;
    for (let i = 0; i < 512; i++) eX += re[i] ** 2 + im[i] ** 2;
    expect(eX / 512).toBeCloseTo(ex, 8);
  });

  it("gives a conjugate-symmetric spectrum for a real signal", () => {
    const N = 64, re = signal(N, 9).re, im = new Float64Array(N);
    fft(re, im);
    for (let k = 1; k < N; k++) {
      expect(re[N - k]).toBeCloseTo(re[k], 10);
      expect(im[N - k]).toBeCloseTo(-im[k], 10);
    }
  });

  it("treats length 1 as a no-op", () => {
    const re = new Float64Array([5]), im = new Float64Array([2]);
    fft(re, im);
    expect([re[0], im[0]]).toEqual([5, 2]);
  });

  it("refuses lengths that are not powers of two, and mismatched arrays", () => {
    expect(() => fft(new Float64Array(6), new Float64Array(6))).toThrow(RangeError);
    expect(() => fft(new Float64Array(8), new Float64Array(4))).toThrow(RangeError);
  });
});
