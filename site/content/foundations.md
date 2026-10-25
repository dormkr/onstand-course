# Foundations block (Band A only)

**Only for a diagnostic score below 45.** Four weeks, F1–F4, before Week 1. Change `startDate` in `site/course.json` to four weeks later (a commit message starting `replan:`, plus a build-log entry). Same hours (15+), same rules, no AI at all.

A low score usually means one thing: you've been *directing* code rather than *writing* it, and the muscles that read and trace code haven't been trained. These four weeks train them on small programs, so you aren't learning the basics and OnStand's complexity at the same time.

Each week's gate: all exercises done from a blank file, timed, plus a 3-minute no-notes recording explaining one of them (Explanation rubric ≥ 4).

---

## F1: Tracing programs by hand

**Read:** [JavaScript.info](https://javascript.info/), Part 1, chapters 2 (Fundamentals) and 4 (Objects: the basics). Skim what you know; *do the tasks* at the end of each chapter without running the code first. Predict, then run.

**Do:**
- 30 "predict the output" exercises from those chapters. Write the prediction *before* running. Log your hit rate. The target by Sunday is 90%.
- Trace `clampBpm`, `clickAt` and `nextPosition` from `src/lib/metronome.ts` on paper, for five inputs each, with a variable table (one column per variable, one row per step).
- DSA: NeetCode *Arrays & Hashing*, the easy problems only, 2 per sitting, 35-minute timer.

**Gate:** 90% prediction hit rate on the last 10; recording: `clickAt` traced aloud for `position = 5.5, beatsPerBar = 4`.

## F2: Functions, closures, arrays, the event loop

**Read:** JavaScript.info Part 1, chapters 5 (Data types: arrays and array methods, Map and Set) and 6 (Advanced working with functions: closures, `setTimeout`), and Part 1, chapter 11, [Event loop](https://javascript.info/event-loop).

**Do:**
- From a blank file: `map`, `filter` and `reduce` written as plain loops; `debounce(fn, ms)`; `once(fn)`; a counter made with a closure. Write your own tests for each with Vitest (`npx vitest run`).
- Explain in writing why the metronome *can't* just use `setInterval(click, 500)`. That's half of week 2's recording; start it here.
- DSA: two more easies, plus Valid Palindrome (*Two Pointers*).

**Gate:** the blank-file set passes your tests; recording: what happens, in order, when `setTimeout(f, 0)`, a resolved `Promise.then(g)` and a synchronous `console.log` run in the same tick.

## F3: TypeScript and reading types

**Read:** the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html): "The Basics", "Everyday Types", "Narrowing", "More on Functions", "Object Types".

**Do:**
- Annotate, in comments, every type in `src/lib/loopMixer.ts`: why is `MixerContext` an interface rather than `AudioContext`? (Look at `loopMixer.test.ts` for the answer.)
- From a blank file: a typed `Result<T, E>` union with `ok()`, `err()`, and a function that parses `"YYYY-MM-DD"` into a `Result<{y, m, d}, string>`.
- DSA: Binary Search; Valid Parentheses.

**Gate:** `tsc --strict` is clean on your files; recording: explain `MixerContext` and dependency injection using `loopMixer.ts`.

## F4: Git, the terminal, and testing basics

**Read:** [Pro Git](https://git-scm.com/book/en/v2), chapters 2 (Git Basics) and 3.1–3.2 (branching and merging). The Vitest [Getting Started](https://vitest.dev/guide/) guide.

**Do:**
- In a scratch repo: create a branch, make a merge conflict on purpose, resolve it, all in the terminal (no GUI).
- Write 10 tests for `src/lib/dates.ts` in a copy of the file, including a timezone test. (`process.env.TZ` can be set at runtime in Node.)
- Re-take diagnostic sections B and E (fresh, timed, without looking at your old answers).

**Gate:** B + E re-take score ≥ 24/40. If it is, start Week 1. If not, repeat F3–F4 with new exercises and log the re-plan.
