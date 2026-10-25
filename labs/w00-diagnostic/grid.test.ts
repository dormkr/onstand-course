import { describe, it, expect } from "vitest";
// @ts-ignore — you create this file.
import { quantize } from "./grid";

// At 120 BPM a beat is 500 ms; subdivision 4 makes the grid step 125 ms.

describe("quantize", () => {
  it("returns nothing for no onsets", () => {
    expect(quantize([], 120, 4)).toEqual([]);
  });

  it("puts onsets exactly on beats at their beat index", () => {
    expect(quantize([0, 500, 1000], 120, 1)).toEqual([0, 1, 2]);
  });

  it("snaps slightly early and late onsets to the nearest sixteenth", () => {
    expect(quantize([0, 130, 240, 380], 120, 4)).toEqual([0, 1, 2, 3]);
  });

  it("rounds an exact half step up", () => {
    expect(quantize([62.5], 120, 4)).toEqual([1]);
  });

  it("keeps the first note when two snap to the same index", () => {
    expect(quantize([0, 20, 130], 120, 4)).toEqual([0, 1]);
    expect(quantize([100, 120], 120, 4)).toEqual([1]);
  });

  it("handles triplet grids", () => {
    // 90 BPM: beat 666.67 ms, triplet step 222.22 ms
    expect(quantize([0, 230, 440, 670], 90, 3)).toEqual([0, 1, 2, 3]);
  });

  it("leaves gaps where there are rests", () => {
    expect(quantize([0, 1000, 1500], 120, 2)).toEqual([0, 4, 6]);
  });

  it("does not mutate its input", () => {
    const onsets = [0, 20, 130];
    quantize(onsets, 120, 4);
    expect(onsets).toEqual([0, 20, 130]);
  });
});
