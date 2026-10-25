# Foundations F3: Reading and writing TypeScript

**Block F: Foundations (Band A)**

## Why this week exists

OnStand is written in TypeScript, and so is every lab from Week 1 on. Types are also the fastest way to *read* unfamiliar code: a function's signature tells you what it needs and what it promises. This week you learn to read types fluently and to use them to make bad states impossible, not just annotated.

**By Sunday you can:** read any type in OnStand's `src/lib`; model "success or failure" without exceptions (a `Result` type); narrow union types; write an exhaustive `switch` that the compiler checks; explain dependency injection using `loopMixer.ts`.

## Time budget (15 h)

| Block | Hours |
|---|---|
| Read (TypeScript Handbook) | 4 |
| Annotate `loopMixer.ts` | 2 |
| Lab | 4 |
| DSA | 3 |
| Recording, Anki, retrieval | 2 |

## 1. Read

The [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html): **The Basics**, **Everyday Types**, **Narrowing** (especially "Discriminated unions" and "Exhaustiveness checking"), **More on Functions** (up to "Function overloads"), **Object Types**. For each code sample, predict whether it compiles before you check.

## 2. Annotate `loopMixer.ts` (2 h)

Copy OnStand's `src/lib/loopMixer.ts` to `foundations/loopMixer.annotated.ts`. Above **every** type, interface and signature, write a comment in your own words: what it describes, and why it's shaped that way. Answer these in the file:

1. Why is the constructor parameter a `MixerContext` and not an `AudioContext`? (Look at `loopMixer.test.ts`: what does the test pass in?)
2. What is `StartableSource`, and why does it list only some of `AudioBufferSourceNode`'s members?
3. What does `private readonly` buy you in `private readonly gains = new Map<string, GainNode>()`?
4. Why does `play` return `number | null`?

## 3. Lab: `labs/f3-types/` (4 h, no AI)

Create `types.ts` so that `npx vitest run labs/f3-types` passes **and** `npx tsc --noEmit --strict --target es2022 --module esnext --moduleResolution bundler labs/f3-types/types.ts` reports no errors:

- `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }`, plus `ok(value)`, `err(error)` and `describeResult(r)` (which uses narrowing on `r.ok`).
- `parseDay(s): Result<{ y; m; d }, string>`: strict `YYYY-MM-DD`; reject dates that don't exist (leap years: divisible by 4, except centuries, except every 400 years); the error message must say what's wrong.
- `parseBpm(s): Result<number, string>`: whole numbers 20–300, with surrounding spaces allowed; nothing else (no decimals, no `1e2`, no units).
- `type ClickKind = "accent" | "beat" | "sub"` and `gainFor(kind)` with an **exhaustive** `switch`: the `default` branch assigns `kind` to a variable of type `never`, so adding a fourth kind becomes a compile error. Test that: add `"ghost"` to the union temporarily, see the error, and screenshot it for the gate.

## 4. DSA (3 h)

*Binary Search*: Binary Search; Search Insert Position. *Stack*: Min Stack.

## 5. Retrieval questions (Sunday, closed book)

1. What's the difference between `type` and `interface`, in practice?
2. What is a discriminated union? Give one from your lab.
3. What does `never` mean, and how does it make a `switch` exhaustive?
4. Why return a `Result` instead of throwing?
5. What does `unknown` force you to do that `any` doesn't?
6. What is dependency injection, and how does `LoopMixer` use it?
7. Is 1900 a leap year? Is 2000?
8. What does the `?` in `resume?(): Promise<void>` mean?

## 6. Anki

Import `content/anki/foundations-f3.tsv` ([download](content/anki/foundations-f3.tsv)).

## 7. The gate

| Item | Pass criterion | Evidence |
|---|---|---|
| **f3.lab** Lab | Tests green and `tsc --strict` clean; screenshot of the `never` error | Commit hash |
| **f3.annotate** Annotation | `foundations/loopMixer.annotated.ts` committed with all four questions answered | Commit URL |
| **f3.dsa** DSA | 3 problems logged | Commit |
| **f3.rec** Recording | `MixerContext` and dependency injection in `loopMixer.ts`, no notes, ≤ 4 min, ≥ 4 | Video URL |

**Cut list:** Min Stack. **Never cut:** the exhaustive `switch` experiment.
