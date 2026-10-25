import { describe, it, expect } from "vitest";
// @ts-ignore — you create types.ts. Spec: site/content/weeks/foundations-f3.md, "Lab".
import { ok, err, parseDay, parseBpm, gainFor, describeResult } from "./types";

describe("Result helpers", () => {
  it("ok and err build the two variants", () => {
    expect(ok(5)).toEqual({ ok: true, value: 5 });
    expect(err("bad")).toEqual({ ok: false, error: "bad" });
  });
  it("describeResult narrows on the ok flag", () => {
    expect(describeResult(ok(3))).toBe("ok: 3");
    expect(describeResult(err("nope"))).toBe("error: nope");
  });
});

describe("parseDay", () => {
  it("parses a valid YYYY-MM-DD", () => {
    expect(parseDay("2026-10-26")).toEqual({ ok: true, value: { y: 2026, m: 10, d: 26 } });
    expect(parseDay("2028-02-29")).toEqual({ ok: true, value: { y: 2028, m: 2, d: 29 } });
  });
  it("rejects the wrong shape", () => {
    for (const s of ["2026-1-26", "26-10-2026", "2026/10/26", "", "2026-10-26T00:00"]) {
      expect(parseDay(s).ok).toBe(false);
    }
  });
  it("rejects dates that do not exist", () => {
    for (const s of ["2026-02-29", "2026-13-01", "2026-04-31", "2026-00-10", "2026-10-00", "1900-02-29"]) {
      expect(parseDay(s).ok).toBe(false);
    }
  });
  it("explains what is wrong", () => {
    const r = parseDay("2026-02-30");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.length).toBeGreaterThan(5);
  });
});

describe("parseBpm", () => {
  it("accepts whole numbers from 20 to 300, with surrounding spaces", () => {
    expect(parseBpm("120")).toEqual({ ok: true, value: 120 });
    expect(parseBpm(" 20 ")).toEqual({ ok: true, value: 20 });
    expect(parseBpm("300")).toEqual({ ok: true, value: 300 });
  });
  it("rejects anything else", () => {
    for (const s of ["19", "301", "12.5", "abc", "", "1e2", "-120", "120bpm"]) {
      expect(parseBpm(s).ok).toBe(false);
    }
  });
});

describe("gainFor (exhaustive switch over a union)", () => {
  it("maps each click kind to its gain", () => {
    expect(gainFor("accent")).toBe(0.5);
    expect(gainFor("beat")).toBe(0.35);
    expect(gainFor("sub")).toBe(0.14);
  });
});
