import { describe, it, expect } from "vitest";
// @ts-ignore — you create yin.ts. Spec: site/content/weeks/week-04.md, "Lab".
import { Yin } from "./yin";

const SR = 48000;
const SIZE = 4096;
const RANGE = { min: 38, max: 2700 };
const cents = (a: number, b: number) => 1200 * Math.log2(a / b);

/** A deterministic tone: harmonic amplitudes, fixed phases (no randomness anywhere in these tests). */
function tone(freq: number, harmonics = [1], sr = SR, n = SIZE, offset = 0) {
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let v = 0;
    harmonics.forEach((a, h) => { v += a * Math.sin(0.7 * (h + 1) + (2 * Math.PI * freq * (h + 1) * i) / sr); });
    buf[i] = offset + (0.3 * v) / harmonics.length;
  }
  return buf;
}

/** Deterministic noise in [−a, a]. */
function noise(n: number, a: number, seed: number) {
  let s = seed >>> 0;
  return Float32Array.from({ length: n }, () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32 * 2 - 1) * a);
}

const NOTES = [41.2, 55, 82.41, 110, 196, 261.63, 440, 659.25, 880, 1318.5, 2093];

describe("Yin", () => {
  const yin = new Yin(SIZE);

  it("rejects a window size that is not an integer of at least 64", () => {
    expect(() => new Yin(32)).toThrow(RangeError);
    expect(() => new Yin(1000.5)).toThrow(RangeError);
  });

  it("defaults to the paper's threshold of 0.1", () => {
    expect(yin.threshold).toBe(0.1);
    expect(yin.size).toBe(SIZE);
  });

  it.each(NOTES)("reads a pure tone at %f Hz within 2 cents", (f) => {
    const p = yin.detect(tone(f), SR, RANGE);
    expect(p).not.toBeNull();
    expect(Math.abs(cents(p!.freq, f))).toBeLessThan(2);
  });

  it.each(NOTES)("reads a bright tone at %f Hz without octave errors", (f) => {
    const p = yin.detect(tone(f, [1, 0.8, 0.6, 0.5, 0.3]), SR, RANGE);
    expect(p).not.toBeNull();
    expect(Math.abs(cents(p!.freq, f))).toBeLessThan(2);
  });

  it.each([41.2, 55, 82.41, 98])("reads %f Hz when the fundamental is weak", (f) => {
    const p = yin.detect(tone(f, [0.15, 1, 0.7, 0.4]), SR, RANGE);
    expect(p).not.toBeNull();
    expect(Math.abs(cents(p!.freq, f))).toBeLessThan(2);
  });

  it("reports a low aperiodicity (the d′ value at the chosen lag) for a clean tone", () => {
    const p = yin.detect(tone(440, [1, 0.5]), SR, RANGE)!;
    expect(p.aperiodicity).toBeGreaterThanOrEqual(0);
    expect(p.aperiodicity).toBeLessThan(0.02);
  });

  it("returns null for silence", () => {
    expect(yin.detect(new Float32Array(SIZE), SR, RANGE)).toBeNull();
  });

  it("returns null for white noise", () => {
    for (let k = 0; k < 10; k++) expect(yin.detect(noise(SIZE, 0.2, k + 1), SR, RANGE)).toBeNull();
  });

  it("stays inside the range it is given", () => {
    expect(yin.detect(tone(110), SR, { min: 240, max: 2700 })).toBeNull(); // far below a flute
    const p = yin.detect(tone(523.25, [1, 0.3]), SR, { min: 240, max: 2700 });
    expect(Math.abs(cents(p!.freq, 523.25))).toBeLessThan(2);
  });

  it("uses its threshold: with a threshold of 0 nothing is ever periodic enough", () => {
    expect(new Yin(SIZE, 0).detect(tone(440), SR, RANGE)).toBeNull();
  });

  it("is deterministic and does not modify its input", () => {
    const buf = tone(330, [1, 0.4]);
    const copy = buf.slice();
    const a = yin.detect(buf, SR, RANGE), b = yin.detect(buf, SR, RANGE);
    expect(a).toEqual(b);
    expect(Array.from(buf)).toEqual(Array.from(copy));
  });
});
