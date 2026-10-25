import { describe, it, expect } from "vitest";
// @ts-ignore — you create wav.ts. Spec: site/content/weeks/week-03.md, "Lab".
import { encodeWav, decodeWav } from "./wav";

const ascii = (b: Uint8Array, at: number, n: number) => String.fromCharCode(...b.slice(at, at + n));

describe("encodeWav", () => {
  it("writes a canonical 44-byte header and little-endian 16-bit samples", () => {
    const bytes: Uint8Array = encodeWav([new Float32Array([0, 1, -1])], 8000);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(44 + 6);
    const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    expect(ascii(bytes, 0, 4)).toBe("RIFF");
    expect(v.getUint32(4, true)).toBe(36 + 6);
    expect(ascii(bytes, 8, 4)).toBe("WAVE");
    expect(ascii(bytes, 12, 4)).toBe("fmt ");
    expect(v.getUint32(16, true)).toBe(16);
    expect(v.getUint16(20, true)).toBe(1); // PCM
    expect(v.getUint16(22, true)).toBe(1); // channels
    expect(v.getUint32(24, true)).toBe(8000); // sample rate
    expect(v.getUint32(28, true)).toBe(16000); // byte rate
    expect(v.getUint16(32, true)).toBe(2); // block align
    expect(v.getUint16(34, true)).toBe(16); // bits per sample
    expect(ascii(bytes, 36, 4)).toBe("data");
    expect(v.getUint32(40, true)).toBe(6);
    expect(Array.from(bytes.slice(44))).toEqual([0x00, 0x00, 0xff, 0x7f, 0x01, 0x80]); // 0, 32767, −32767
  });

  it("clips samples outside [−1, 1]", () => {
    const bytes = encodeWav([new Float32Array([2, -3])], 8000);
    const v = new DataView(bytes.buffer, bytes.byteOffset);
    expect(v.getInt16(44, true)).toBe(32767);
    expect(v.getInt16(46, true)).toBe(-32767);
  });

  it("interleaves channels", () => {
    const bytes = encodeWav([new Float32Array([1, 0]), new Float32Array([-1, 0])], 44100);
    const v = new DataView(bytes.buffer, bytes.byteOffset);
    expect(v.getUint16(22, true)).toBe(2);
    expect(v.getUint16(32, true)).toBe(4);
    expect([v.getInt16(44, true), v.getInt16(46, true), v.getInt16(48, true), v.getInt16(50, true)]).toEqual([32767, -32767, 0, 0]);
  });

  it("refuses channels of different lengths", () => {
    expect(() => encodeWav([new Float32Array(2), new Float32Array(3)], 8000)).toThrow(RangeError);
  });
});

describe("decodeWav", () => {
  it("round-trips within one quantisation step", () => {
    const x = Float32Array.from({ length: 480 }, (_, i) => 0.8 * Math.sin((2 * Math.PI * 440 * i) / 48000));
    const { sampleRate, channels } = decodeWav(encodeWav([x], 48000));
    expect(sampleRate).toBe(48000);
    expect(channels).toHaveLength(1);
    let err = 0;
    for (let i = 0; i < x.length; i++) err = Math.max(err, Math.abs(channels[0][i] - x[i]));
    expect(err).toBeLessThanOrEqual(1 / 32768 + 1e-7);
  });

  it("rejects data that is not a RIFF/WAVE file", () => {
    expect(() => decodeWav(new TextEncoder().encode("hello, this is not a wave file at all......"))).toThrow();
  });
});
