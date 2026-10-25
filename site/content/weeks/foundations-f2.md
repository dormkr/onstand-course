# Foundations F2: Functions, closures and the event loop

**Block F: Foundations (Band A)**

## Why this week exists

Almost every bug in OnStand's audio code is about **when** something runs: a timer that fires late, a promise that resolves after the component unmounted, a scheduler that wakes up in a throttled tab. Understanding functions as values, closures (functions that remember variables), and the event loop (the order JavaScript runs things in) is the foundation for weeks 2, 5 and 6. Interviewers ask about all three constantly.

**By Sunday you can:** write and explain closures; implement `debounce`, `once` and `memoize` from scratch; predict the order of `setTimeout`, promises and synchronous code; explain why the metronome needs the audio clock.

## Time budget (15 h)

| Block | Hours |
|---|---|
| Read + predict-then-run | 4.5 |
| Lab | 4 |
| The metronome write-up | 1.5 |
| DSA | 3 |
| Recording, Anki, retrieval | 2 |

## 1. Read (with predict-then-run, as in F1)

[JavaScript.info](https://javascript.info/), Part 1:

- Chapter 5, "Data types": **Arrays**, **Array methods**, **Map and Set**.
- Chapter 6, "Advanced working with functions": **Recursion and stack**, **Variable scope, closure**, **Scheduling: setTimeout and setInterval**, **Decorators and forwarding** (that's where `debounce` lives).
- Chapter 11, "Promises, async/await": **Introduction: callbacks**, **Promise**, **Microtasks**.
- The **[Event loop](https://javascript.info/event-loop)** article. Read it twice.

Keep logging predictions in `foundations/predict-log.md`. Aim for 20 this week, mostly on scope, closures and timing.

## 2. Lab: `labs/f2-functions/` (4 h, no AI)

Create `functions.ts` so that `npx vitest run labs/f2-functions` passes:

- `myMap`, `myFilter`, `myReduce`: written with plain `for` loops, no array methods.
- `once(fn)`: calls `fn` the first time; afterwards returns the first result without calling it again.
- `makeCounter(start = 0)`: returns `{ increment, value, reset }`, sharing a private count (a closure).
- `debounce(fn, ms)`: runs `fn` once, `ms` after the *last* call, with that call's arguments. The tests use Vitest's fake timers. Read the test file to see how, and read [Vitest: mocking timers](https://vitest.dev/guide/mocking/timers).
- `memoize(fn)`: caches results per argument, including falsy results (`0`, `""`).
- `pipe(...fns)`: composes functions left to right.

## 3. Write-up: why the metronome can't use `setInterval` (1.5 h)

In `foundations/f2-metronome.md`, in your own words (300–500 words, no AI): what would go wrong if `Metronome.tsx` played a click with `setInterval(click, 60000 / bpm)`? Use what you read about the event loop and timers. Then read OnStand's `scheduler` in `Metronome.tsx` (lines 85–106) and explain what it does instead, and why. Don't read Chris Wilson's article yet. That's week 2, and you'll compare your explanation with his.

## 4. DSA (3 h)

*Two Pointers*: Valid Palindrome; Two Sum II. *Stack*: Valid Parentheses. Same rules as F1 (35-minute timer, log, re-write the next day).

## 5. Retrieval questions (Sunday, closed book)

1. What is a closure? Write a three-line example.
2. In what order do these print: `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`?
3. What's the difference between a macrotask and a microtask?
4. Why does `setTimeout(f, 0)` not run `f` immediately?
5. What does `debounce` do differently from `throttle`?
6. Why must `memoize` use `Map.has` rather than checking whether the cached value is truthy?
7. What does `[1, 2, 3].map((x, i) => x * i)` return?
8. In one sentence: why can't the metronome trust `setInterval`?

## 6. Anki

Import `content/anki/foundations-f2.tsv` ([download](content/anki/foundations-f2.tsv)).

## 7. The gate

| Item | Pass criterion | Evidence |
|---|---|---|
| **f2.lab** Lab | `npx vitest run labs/f2-functions` all green, without AI | Commit hash |
| **f2.metronome** Write-up | `foundations/f2-metronome.md` committed; names at least two concrete failure causes | Commit URL |
| **f2.dsa** DSA | 3 problems logged | Commit |
| **f2.rec** Recording | Retrieval question 2 explained aloud, step by step (call stack, microtask queue, macrotask queue), no notes, ≤ 3 min, ≥ 4 | Video URL |

**Cut list:** `pipe`; one DSA problem. **Never cut:** the event-loop recording.
