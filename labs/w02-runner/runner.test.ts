import { describe as vDescribe, it as vIt, expect as vExpect } from "vitest";
// @ts-ignore — you create runner.ts. Spec: site/content/weeks/week-02.md, "Lab 2".
import { createRunner } from "./runner";

vDescribe("createRunner", () => {
  vIt("runs tests in declaration order and reports passes and failures with full names", async () => {
    const { describe, it, expect, run } = createRunner();
    const order: string[] = [];
    describe("maths", () => {
      it("adds", () => { order.push("adds"); expect(1 + 1).toBe(2); });
      describe("nested", () => {
        it("fails", () => { order.push("fails"); expect(1).toBe(2); });
      });
    });
    it("top level", () => { order.push("top"); });
    const report = await run();
    vExpect(order).toEqual(["adds", "fails", "top"]);
    vExpect(report.passed).toEqual(["maths > adds", "top level"]);
    vExpect(report.failed.map((f: { name: string }) => f.name)).toEqual(["maths > nested > fails"]);
  });

  vIt("keeps going after a failure, and records the failure message", async () => {
    const { it, expect, run } = createRunner();
    it("a", () => { expect("x").toBe("y"); });
    it("b", () => {});
    const report = await run();
    vExpect(report.passed).toEqual(["b"]);
    vExpect(report.failed[0].message).toMatch(/x/);
    vExpect(report.failed[0].message).toMatch(/y/);
  });

  vIt("toBe uses Object.is; toEqual compares deeply", async () => {
    const { it, expect, run } = createRunner();
    it("toBe NaN", () => { expect(NaN).toBe(NaN); });
    it("toBe objects by identity", () => { expect({ a: 1 }).toBe({ a: 1 }); });
    it("toEqual objects by value", () => { expect({ a: [1, 2] }).toEqual({ a: [1, 2] }); });
    const report = await run();
    vExpect(report.passed).toEqual(["toBe NaN", "toEqual objects by value"]);
    vExpect(report.failed.map((f: { name: string }) => f.name)).toEqual(["toBe objects by identity"]);
  });

  vIt("supports .not", async () => {
    const { it, expect, run } = createRunner();
    it("not passes", () => { expect(1).not.toBe(2); });
    it("not fails", () => { expect(1).not.toBe(1); });
    const report = await run();
    vExpect(report.passed).toEqual(["not passes"]);
  });

  vIt("toThrow checks that a function throws, optionally an error class", async () => {
    const { it, expect, run } = createRunner();
    it("throws", () => { expect(() => { throw new RangeError("no"); }).toThrow(); });
    it("throws the class", () => { expect(() => { throw new RangeError("no"); }).toThrow(RangeError); });
    it("wrong class", () => { expect(() => { throw new Error("no"); }).toThrow(RangeError); });
    it("does not throw", () => { expect(() => 1).toThrow(); });
    const report = await run();
    vExpect(report.passed).toEqual(["throws", "throws the class"]);
    vExpect(report.failed.map((f: { name: string }) => f.name)).toEqual(["wrong class", "does not throw"]);
  });

  vIt("awaits async tests, sequentially", async () => {
    const { it, run } = createRunner();
    const log: string[] = [];
    it("slow", async () => { await new Promise((r) => setTimeout(r, 30)); log.push("slow"); });
    it("fast", () => { log.push("fast"); });
    await run();
    vExpect(log).toEqual(["slow", "fast"]);
  });

  vIt("fails an async test that rejects", async () => {
    const { it, run } = createRunner();
    it("rejects", async () => { throw new Error("boom"); });
    const report = await run();
    vExpect(report.failed[0]).toMatchObject({ name: "rejects", message: "boom" });
  });

  vIt("times out a test that never settles", async () => {
    const { it, run } = createRunner({ timeoutMs: 50 });
    it("hangs", () => new Promise(() => {}));
    it("after", () => {});
    const t0 = Date.now();
    const report = await run();
    vExpect(Date.now() - t0).toBeLessThan(1000);
    vExpect(report.failed[0].name).toBe("hangs");
    vExpect(report.failed[0].message).toMatch(/time/i);
    vExpect(report.passed).toEqual(["after"]);
  });

  vIt("runs beforeEach hooks, outer ones first, for every test in scope", async () => {
    const { describe, it, beforeEach, run } = createRunner();
    const log: string[] = [];
    beforeEach(() => { log.push("outer"); });
    describe("group", () => {
      beforeEach(() => { log.push("inner"); });
      it("t1", () => { log.push("t1"); });
    });
    it("t2", () => { log.push("t2"); });
    await run();
    vExpect(log).toEqual(["outer", "inner", "t1", "outer", "t2"]);
  });
});
