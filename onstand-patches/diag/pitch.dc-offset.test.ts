import { describe, it, expect } from "vitest";
import { PitchDetector, windowFor, DEFAULT_RANGE } from "./pitch";

/**
 * Diagnostic, section D. Copy to On-The-Stand/src/lib/pitch.dc-offset.test.ts.
 *
 * A DC offset is a constant added to every sample. Some USB interfaces and phone mic paths add one, and breath or
 * handling noise adds slow shifts that behave like one over a 4096-sample window. A tuner must still read the note.
 * Signals here are deterministic (fixed phase, no noise) so a failure always reproduces.
 */

const SR = 48000;
const size = windowFor(DEFAULT_RANGE, SR);
const det = new PitchDetector(size);
const cents = (a: number, b: number) => 1200 * Math.log2(a / b);

function toneWithOffset(freq: number, offset: number, amplitude = 0.3) {
  const buf = new Float32Array(size);
  for (let i = 0; i < size; i++) buf[i] = offset + amplitude * Math.sin((2 * Math.PI * freq * i) / SR);
  return buf;
}

describe("pitch detection with a DC offset", () => {
  it.each([
    [41.2, 0.4],
    [82.41, 0.3],
    [440, 0.5],
    [1318.5, 0.6],
  ])("reads %f Hz riding on an offset of %f within 2 cents", (freq, offset) => {
    const p = det.detect(toneWithOffset(freq, offset), SR, DEFAULT_RANGE);
    expect(p).not.toBeNull();
    expect(Math.abs(cents(p!.freq, freq))).toBeLessThan(2);
    expect(p!.clarity).toBeGreaterThan(0.95);
  });

  it("reads a negative offset too", () => {
    const p = det.detect(toneWithOffset(220, -0.4), SR, DEFAULT_RANGE);
    expect(p).not.toBeNull();
    expect(Math.abs(cents(p!.freq, 220))).toBeLessThan(2);
  });

  it("treats a constant signal (pure offset, no tone) as silence", () => {
    expect(det.detect(new Float32Array(size).fill(0.5), SR, DEFAULT_RANGE)).toBeNull();
  });

  it("treats a tiny tone on a large offset as silence, not a note", () => {
    // The tone's own RMS is about 0.0028, under MIN_RMS; the offset must not lift it over the silence gate.
    expect(det.detect(toneWithOffset(440, 0.5, 0.004), SR, DEFAULT_RANGE)).toBeNull();
  });
});
