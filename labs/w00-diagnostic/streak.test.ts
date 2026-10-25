import { describe, it, expect, afterEach } from "vitest";
// @ts-ignore — you create this file. Until you do, this suite fails to load: that is the point.
import { longestStreak } from "./streak";

const originalTz = process.env.TZ;
afterEach(() => { process.env.TZ = originalTz; });

describe("longestStreak", () => {
  it("is 0 for no days", () => {
    expect(longestStreak([])).toBe(0);
  });

  it("is 1 for a single day", () => {
    expect(longestStreak(["2026-10-20"])).toBe(1);
  });

  it("counts a duplicated day once", () => {
    expect(longestStreak(["2026-10-20", "2026-10-20"])).toBe(1);
  });

  it("does not depend on input order", () => {
    expect(longestStreak(["2026-10-22", "2026-10-20", "2026-10-21"])).toBe(3);
  });

  it("finds the longest of several runs", () => {
    expect(longestStreak(["2026-10-01", "2026-10-02", "2026-10-04", "2026-10-05", "2026-10-06"])).toBe(3);
  });

  it("crosses a month end", () => {
    expect(longestStreak(["2026-09-30", "2026-10-01"])).toBe(2);
  });

  it("crosses a year end", () => {
    expect(longestStreak(["2026-12-31", "2027-01-01"])).toBe(2);
  });

  it("knows leap years", () => {
    expect(longestStreak(["2028-02-28", "2028-02-29", "2028-03-01"])).toBe(3);
    expect(longestStreak(["2027-02-28", "2027-03-01"])).toBe(2);
  });

  it("is not broken by a daylight-saving change in the machine's timezone", () => {
    process.env.TZ = "Europe/Berlin"; // clocks went forward on 29 March 2026 and back on 25 October 2026
    expect(longestStreak(["2026-03-28", "2026-03-29", "2026-03-30"])).toBe(3);
    expect(longestStreak(["2026-10-24", "2026-10-25", "2026-10-26"])).toBe(3);
  });

  it("does not mutate its input", () => {
    const days = ["2026-10-22", "2026-10-20", "2026-10-21"];
    longestStreak(days);
    expect(days).toEqual(["2026-10-22", "2026-10-20", "2026-10-21"]);
  });
});
