import { describe, it, expect } from "vitest";
// @ts-ignore — you create basics.ts. Spec: site/content/weeks/foundations-f1.md, "Lab".
import { clamp, range, chunk, countBy, freqOfMidi, centsBetween, noteName } from "./basics";

describe("clamp", () => {
  it("keeps a value inside [lo, hi]", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(400, 20, 300)).toBe(300);
    expect(clamp(20, 20, 300)).toBe(20);
  });
  it("throws a RangeError when lo > hi", () => {
    expect(() => clamp(1, 10, 0)).toThrow(RangeError);
  });
});

describe("range", () => {
  it("counts up from start to end, excluding end", () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
    expect(range(2, 3)).toEqual([2]);
    expect(range(3, 3)).toEqual([]);
  });
  it("supports a step, including negative steps", () => {
    expect(range(0, 10, 3)).toEqual([0, 3, 6, 9]);
    expect(range(5, 0, -2)).toEqual([5, 3, 1]);
    expect(range(0, 5, -1)).toEqual([]);
  });
  it("throws a RangeError for a step of 0", () => {
    expect(() => range(0, 5, 0)).toThrow(RangeError);
  });
});

describe("chunk", () => {
  it("splits an array into pieces of a given size; the last may be shorter", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunk([], 4)).toEqual([]);
  });
  it("throws a RangeError for a size that is not a positive integer", () => {
    expect(() => chunk([1], 0)).toThrow(RangeError);
    expect(() => chunk([1], 1.5)).toThrow(RangeError);
  });
  it("does not modify the input", () => {
    const xs = [1, 2, 3];
    chunk(xs, 2);
    expect(xs).toEqual([1, 2, 3]);
  });
});

describe("countBy", () => {
  it("counts items by the key a function returns", () => {
    expect(countBy(["apple", "avocado", "banana"], (s: string) => s[0])).toEqual({ a: 2, b: 1 });
    expect(countBy([1, 2, 3, 4, 5], (n: number) => (n % 2 === 0 ? "even" : "odd"))).toEqual({ odd: 3, even: 2 });
    expect(countBy([], (x: unknown) => String(x))).toEqual({});
  });
});

describe("music maths", () => {
  it("freqOfMidi: A4 (MIDI 69) is the reference, and each semitone is a factor of 2^(1/12)", () => {
    expect(freqOfMidi(69)).toBeCloseTo(440, 9);
    expect(freqOfMidi(81)).toBeCloseTo(880, 9);
    expect(freqOfMidi(60)).toBeCloseTo(261.6256, 3);
    expect(freqOfMidi(69, 442)).toBeCloseTo(442, 9);
  });
  it("centsBetween: 100 cents per semitone, 1200 per octave, positive when f is higher", () => {
    expect(centsBetween(880, 440)).toBeCloseTo(1200, 9);
    expect(centsBetween(440, 880)).toBeCloseTo(-1200, 9);
    expect(centsBetween(freqOfMidi(70), freqOfMidi(69))).toBeCloseTo(100, 9);
    expect(centsBetween(441, 440)).toBeCloseTo(3.93, 2);
  });
  it("noteName: name and octave of a MIDI note, sharps for black keys, C starts each octave", () => {
    expect(noteName(69)).toBe("A4");
    expect(noteName(60)).toBe("C4");
    expect(noteName(61)).toBe("C#4");
    expect(noteName(59)).toBe("B3");
    expect(noteName(21)).toBe("A0");
    expect(noteName(108)).toBe("C8");
  });
  it("noteName: throws a RangeError outside MIDI 0–127 or for non-integers", () => {
    expect(() => noteName(128)).toThrow(RangeError);
    expect(() => noteName(-1)).toThrow(RangeError);
    expect(() => noteName(60.5)).toThrow(RangeError);
  });
});
