import { describe, it, expect, vi, afterEach } from "vitest";
// @ts-ignore — you create functions.ts. Spec: site/content/weeks/foundations-f2.md, "Lab".
import { myMap, myFilter, myReduce, once, makeCounter, debounce, memoize, pipe } from "./functions";

afterEach(() => { vi.useRealTimers(); });

describe("map, filter and reduce, written as plain loops", () => {
  it("myMap passes (item, index) and returns a new array", () => {
    const xs = [1, 2, 3];
    expect(myMap(xs, (x: number, i: number) => x * 10 + i)).toEqual([10, 21, 32]);
    expect(xs).toEqual([1, 2, 3]);
  });
  it("myFilter keeps the items the predicate accepts", () => {
    expect(myFilter([1, 2, 3, 4], (x: number) => x % 2 === 0)).toEqual([2, 4]);
    expect(myFilter([], () => true)).toEqual([]);
  });
  it("myReduce folds from the left with an initial value", () => {
    expect(myReduce([1, 2, 3], (acc: number, x: number) => acc + x, 0)).toBe(6);
    expect(myReduce(["a", "b"], (acc: string, x: string) => acc + x, ">")).toBe(">ab");
    expect(myReduce([], (acc: number) => acc, 42)).toBe(42);
  });
});

describe("once", () => {
  it("calls the function the first time only, and returns that first result every time", () => {
    const f = vi.fn((x: number) => x * 2);
    const g = once(f);
    expect(g(5)).toBe(10);
    expect(g(7)).toBe(10);
    expect(f).toHaveBeenCalledTimes(1);
  });
});

describe("makeCounter (a closure)", () => {
  it("keeps its own private count", () => {
    const a = makeCounter(), b = makeCounter(10);
    expect(a.increment()).toBe(1);
    expect(a.increment()).toBe(2);
    expect(b.increment()).toBe(11);
    expect(a.value()).toBe(2);
    a.reset();
    expect(a.value()).toBe(0);
    expect(b.value()).toBe(11);
  });
});

describe("debounce", () => {
  it("runs once, ms after the last call, with the last call's arguments", () => {
    vi.useFakeTimers();
    const f = vi.fn();
    const d = debounce(f, 200);
    d("a"); vi.advanceTimersByTime(100);
    d("b"); vi.advanceTimersByTime(100);
    d("c");
    expect(f).not.toHaveBeenCalled();
    vi.advanceTimersByTime(199);
    expect(f).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(f).toHaveBeenCalledTimes(1);
    expect(f).toHaveBeenCalledWith("c");
  });
  it("runs again for a later, separate burst", () => {
    vi.useFakeTimers();
    const f = vi.fn();
    const d = debounce(f, 50);
    d(1); vi.advanceTimersByTime(60);
    d(2); vi.advanceTimersByTime(60);
    expect(f.mock.calls).toEqual([[1], [2]]);
  });
});

describe("memoize", () => {
  it("computes once per distinct argument", () => {
    const slow = vi.fn((n: number) => n * n);
    const fast = memoize(slow);
    expect(fast(4)).toBe(16);
    expect(fast(4)).toBe(16);
    expect(fast(5)).toBe(25);
    expect(slow).toHaveBeenCalledTimes(2);
  });
  it("caches results that are falsy, too", () => {
    const f = vi.fn((n: number) => n - n);
    const m = memoize(f);
    m(3); m(3);
    expect(f).toHaveBeenCalledTimes(1);
  });
});

describe("pipe", () => {
  it("applies functions left to right", () => {
    const f = pipe((x: number) => x + 1, (x: number) => x * 2, (x: number) => `=${x}`);
    expect(f(3)).toBe("=8");
  });
  it("with no functions, returns its input", () => {
    expect(pipe()(7)).toBe(7);
  });
});
