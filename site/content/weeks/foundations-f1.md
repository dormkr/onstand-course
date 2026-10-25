# Foundations F1: Tracing programs by hand

**Block F: Foundations (Band A) · First of four weeks before Week 1**

## Why this week exists

Every skill later in this course rests on one ability: looking at code and knowing, before you run it, what it will do. That's what an interviewer tests when they say "walk me through this", and it's what lets you check an AI's output instead of trusting it. If you've mostly *directed* code, this muscle is weak. That isn't a character flaw; it's simply untrained. This week trains it on small programs, then on real OnStand functions, with a measured baseline at the start so you can see it grow.

**By Sunday you can:**

1. Predict the output of short JavaScript programs before running them, and be right at least 9 times in 10.
2. Trace a function by hand with a variable table, step by step.
3. Write small, correct functions from a blank file, test-first.
4. Say exactly where you stand, as a number, against the diagnostic.

## Time budget (15 h)

| Block | Hours |
|---|---|
| Baseline (Monday) | 1.5 |
| Read + predict-then-run | 5 |
| Trace OnStand functions | 2 |
| Lab | 3 |
| DSA | 2.5 |
| Recording, Anki, retrieval | 1 |

**AI policy:** none at all in the Foundations weeks: no chat, no inline suggestions, no "just explain this line". If you're stuck for 20 minutes, write down the exact question in `foundations/questions.md`, move on, and come back to it. Most questions answer themselves a day later.

---

## 1. Monday: the baseline (90 minutes, before anything else)

Take **sections B and E** of the [diagnostic](#/diagnostic) exactly as written: B for 40 minutes (predict 10 behaviours; read OnStand's code, run nothing), then E for 50 minutes (two functions from a blank file). Same rules: no AI, no web except MDN for E, hard time boxes.

1. Write your answers in `diagnostic/answers.md` (sections B and E) and commit.
2. Then: `npm run unseal diagnostic-key` (B answers) and `npm run unseal w00-hidden` (E hidden tests). Score honestly with the [rubrics](#/rubrics).
3. Enter B and E in the Tracker's diagnostic form, and leave A, C and D at 0.
4. Write a short build-log entry: the two numbers and one sentence on what surprised you.

**A low score is the point of a baseline, not a problem.** F4 re-takes a fresh, sealed version, and the comparison between the two is what matters.

---

## 2. Read and predict (5 h, spread across the week)

Read **[JavaScript.info](https://javascript.info/)**, Part 1:

- Chapter 2, **"JavaScript Fundamentals"**: all of it. Go quickly through what you know, and slowly through *type conversions*, *comparisons*, *logical operators* and *loops*.
- Chapter 4, **"Objects: the basics"**: up to and including "Object references and copying".

**The method that makes this work (predict-then-run):** at every code example and every task at the end of a section, *before running it*, write down what you think it prints. Then run it (in your browser's console or `node`). Log each one in `foundations/predict-log.md`:

```
| # | Source (chapter/section) | My prediction | Actual | Right? | Why I was wrong (if I was) |
```

Do **at least 30**. The gate is 9 or more of your **last 10** right. The early misses are the useful part: every "why I was wrong" line is a misconception you just found.

---

## 3. Trace OnStand by hand (2 h)

Open `src/lib/metronome.ts` in OnStand. For each function below, trace **five inputs** on paper or in `foundations/f1-traces.md`, with a variable table: one column per variable, one row per step, writing every value as it changes.

| Function | Inputs to trace |
|---|---|
| `clampBpm(n)` | 120, 7, 999, 120.5, −3 |
| `clickAt(position, beatsPerBar)` | (0, 4), (1.5, 4), (3, 3), (5.5, 4), (−1, 4) |
| `nextPosition(position, noteBeats, beatsPerBar)` | (3.5, 0.5, 4), (2, 2, 3), (0, 0.25, 4), (3.75, 0.25, 4), (2.5, 0.5, 2) |

Then check yourself by running them (`npx tsx` with a tiny script that imports the functions, or a Vitest test). Mark each trace right or wrong. Anything wrong is a misconception to write down. `(5.5, 4)` in `clickAt` is this week's recording.

---

## 4. Lab: `labs/f1-basics/` (3 h, no AI)

Create `labs/f1-basics/basics.ts` so that `npx vitest run labs/f1-basics` passes. Write each function, run the tests, and read every failure message carefully: learning to read a test failure is half of this lab.

- `clamp(n, lo, hi)`: keep `n` within `[lo, hi]`; throw `RangeError` if `lo > hi`.
- `range(start, end, step = 1)`: like Python's `range` (excludes `end`; negative steps count down); throw `RangeError` for a step of 0.
- `chunk(xs, size)`: split into arrays of `size`, the last possibly shorter; `RangeError` unless `size` is a positive integer; don't modify `xs`.
- `countBy(xs, keyFn)`: an object counting items by the key `keyFn` returns.
- `freqOfMidi(midi, a4 = 440)`: frequency of a MIDI note: `a4 × 2^((midi − 69) / 12)`.
- `centsBetween(f, g)`: `1200 × log2(f / g)`.
- `noteName(midi)`: `"A4"`, `"C#4"` and so on: sharps for black keys; octave = ⌊midi / 12⌋ − 1, so MIDI 60 is C4. `RangeError` outside the integers 0–127.

Write the time and space complexity of each function in a comment above it.

---

## 5. DSA (2.5 h, no AI)

From the [NeetCode roadmap](https://neetcode.io/roadmap), *Arrays & Hashing* and one *Sliding Window* easy: **Contains Duplicate, Valid Anagram, Two Sum, Best Time to Buy and Sell Stock.**

Rules: a **35-minute** timer each, TypeScript, in `dsa/`, with a few tests of your own. When the timer ends, stop, watch the NeetCode explanation, then re-write the solution from memory the next day. Log it in `dsa/LOG.md`: the problem, your time, solved or not, and the idea you missed.

---

## 6. Retrieval questions (Sunday, closed book, in writing)

1. What do `"5" + 3`, `"5" - 3` and `"5" * "2"` evaluate to, and why?
2. Difference between `==` and `===`? Give one comparison where they disagree.
3. What does `null ?? "x"` give? And `0 ?? "x"`? And `0 || "x"`?
4. What does this print: `let a = {n: 1}; let b = a; b.n = 2; console.log(a.n);`? Why?
5. Write a `for` loop that prints 10, 8, 6, 4, 2.
6. What does `Math.round(2.5)` give? And `Math.round(-2.5)`?
7. What does `clickAt(5.5, 4)` return? Trace it from memory.
8. Why does `clampBpm` call `Math.round` *before* clamping, and does the order matter?
9. What is MIDI note 60, and what frequency is it, roughly?
10. What does a variable table show that reading code silently doesn't?

## 7. Anki

Import `content/anki/foundations-f1.tsv` ([download](content/anki/foundations-f1.tsv)). Review it daily (10 minutes).

---

## 8. The gate

| Item | Pass criterion | Evidence |
|---|---|---|
| **f1.baseline** Baseline | B and E taken under the rules, committed before unsealing, scored, entered in the Tracker | Commit hash of the answers |
| **f1.predict** Predict-then-run | ≥ 30 logged; ≥ 9 of the last 10 right | Commit of `foundations/predict-log.md` |
| **f1.lab** Lab | `npx vitest run labs/f1-basics` all green, written without AI | Commit hash |
| **f1.dsa** DSA | 4 problems logged | Commit of `dsa/LOG.md` |
| **f1.rec** Recording | `clickAt(5.5, 4)` traced aloud, no notes, ≤ 3 min, ≥ 4 on the explanation rubric | Video URL |

**Recording must-hits for f1.rec:** the modulo that normalises the position, including why it adds `beatsPerBar` and takes the modulo again; how `beat` is computed (and what the `1e-9` is for); how "on the beat" is decided; why the kind comes out as `sub` and the beat as 2.
**Follow-up questions:** (1) what does `clickAt(-1, 4)` return, and why does the double modulo matter there? (2) Why might comparing floating-point positions with `===` be dangerous here?

**Cut list (in order):** the 4th DSA problem; the `nextPosition` traces. **Never cut:** the baseline, the predict-then-run log.
