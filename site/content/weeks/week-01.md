# Week 1: Reading code you didn't write; tests you can trust

**Block A: Own the codebase**

## Why this week exists

Yousician's audio-engineer posting asks for "experience with automated testing" and the "ability to get up to speed quickly with existing code" ([posting](https://jobs.trueventures.com/companies/yousician-2/jobs/62837949-c-audio-engineer)). Every take-home and pairing interview tests the same thing: here is code you didn't write; change it safely. For you this is literal. Most of OnStand was written by agents, so this week is about turning *their* code into code you *own*: understood, tested, and changed on purpose.

The diagnostic found the targets: the DC-offset bug (C2), the tap-tempo bounce (C3), non-deterministic tests (C4) and lost practice time (C5). This week you fix all four the professional way, with a failing test first, a PR with a written self-review, and an ADR wherever a change is a product decision rather than a bug fix.

**By Sunday you can:**

1. Read an unfamiliar module and write *characterization tests* that pin down what it does today, before you change it.
2. Make a test suite deterministic, and explain why that matters more than coverage.
3. Fix a bug test-first: a red commit, then a green one, in a PR a stranger could approve.
4. Tell a bug fix from a product decision, and record the decision in an ADR.
5. Implement a seeded PRNG and a ring buffer from a blank file, using 32-bit integer arithmetic in JavaScript.

## Time budget (16 h)

| Block | Hours |
|---|---|
| Read | 2.5 |
| Build in OnStand (tasks 1.1–1.5) | 6 |
| Lab (PRNG, ring buffer) | 4 |
| DSA | 2 |
| Retrieval, Anki, recording | 1.5 |

**AI policy this week:** none for the labs, DSA, quiz or recording. On OnStand, write your own first version; AI may then review it, declared in the PR ([Rules §2](#/rules)).

---

## 1. Read (2.5 h): exactly these, in this order

| # | Source | Read | Why |
|---|---|---|---|
| R1 | Martin Fowler, [Eradicating Non-Determinism in Tests](https://martinfowler.com/articles/nonDeterminism.html) | All of it (30 min) | The name for what's wrong with `pitch.test.ts`, and the fix patterns, especially "Time" and "Lack of isolation". |
| R2 | Michael Feathers, [Characterization Testing](https://michaelfeathers.silvrback.com/characterization-testing) | All of it (10 min) | How to test code you don't understand yet: assert what it *does*, then decide what it *should* do. |
| R3 | Vitest, [Mocking → Timers](https://vitest.dev/guide/mocking/timers) and the [`vi` API](https://vitest.dev/api/vi.html) entries for `useFakeTimers`, `setSystemTime` and `advanceTimersByTime` | Those sections (20 min) | `usePracticeTimer` reads `Date.now()`; you'll control time in tests. OnStand's `src/hooks/__tests__/practiceBugs.test.tsx` already does this, so read it next. |
| R4 | OnStand `src/hooks/__tests__/practiceBugs.test.tsx` | All of it (20 min) | The house style for timer tests. Copy its patterns; don't invent new ones. |
| R5 | Google Engineering Practices, [The CL author's guide](https://google.github.io/eng-practices/review/developer/), then [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html) | Both (30 min) | What a reviewable PR looks like at a company that does a lot of code review. Your PR self-reviews are graded against this standard. |
| R6 | Melissa O'Neill, [Efficiently Generating a Number in a Range](https://www.pcg-random.org/posts/bounded-rands.html) | Up to and including "Classic Modulo (Biased)" and "Debiased Modulo" (20 min) | Why `x % max` is wrong for random integers. Lab 1 tests for it. |
| R7 | [Box–Muller transform](https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform) | "Basic form" only (10 min) | Gaussian noise from uniform numbers. Week 4's benchmark corpus needs it. |
| R8 | [Circular buffer](https://en.wikipedia.org/wiki/Circular_buffer) | Intro and "Circular buffer mechanics" (10 min) | Lab 2. The same structure is behind `AnalyserNode` and, in week 5, the AudioWorklet. |

Don't read beyond these. Reading is the most comfortable way to avoid building.

---

## 2. Build in OnStand (6 h)

The rules for every task: **one branch and one PR per task**, the description written with `templates/pr-self-review.md` (from this course repo), never a direct push to `main`. Merging deploys onstand.app, so after each merge, check the changed feature on your own phone. There's no CI yet; that's week 2. Until then, run `npx vitest run` and `npx tsc --noEmit -p tsconfig.app.json` yourself and paste the results into the PR.

### Task 1.1: Ship the DC-offset fix (45 min)

If your diagnostic Section D PR is open, finish its self-review and merge it. If you didn't get to it, do Section D now under the same rules (no AI, 60 minutes). After the deploy, open the tuner on onstand.app on your phone and play a note to confirm nothing regressed. Write what you saw in the PR as a comment.

**Done when:** merged, the deployed tuner checked on a real device, and that comment posted.

### Task 1.2: Make the pitch tests deterministic (1.5 h)

`src/lib/pitch.test.ts` uses `Math.random()` for phase and noise, so every run tests different signals. When it fails in CI one day, you won't be able to reproduce the failure. And "ignores noise" allows 1 false hit in 20 *by design*, which makes it a flaky test written down as a feature.

1. Finish Lab 1 first. Then copy **your own** `Rng` into OnStand as `src/test/rng.ts` (test-only code belongs in `src/test/`).
2. Replace every `Math.random()` in `pitch.test.ts` with draws from an `Rng` created with a fixed seed in each test (not shared across tests: why not? Put the answer in the PR).
3. Rewrite "ignores noise" as an exact assertion: with your seed, **zero** hits in 20 windows. If a seed gives a hit, *don't* pick another seed until one passes. Investigate it: print the clarity and frequency of the false hit, and write what you found in the PR. A noise window with clarity ≥ 0.85 is information about the detector.
4. Prove it: `grep -rn "Math.random" src --include="*.test.*"` prints nothing, and this loop prints `20`:

   ```sh
   for i in $(seq 20); do npx vitest run src/lib/pitch.test.ts > /dev/null && echo ok; done | grep -c ok
   ```

**Done when:** merged, with the grep and loop output in the PR.

### Task 1.3: Fix tap tempo test-first (1 h)

The bug (diagnostic C3/B4): two taps in the same millisecond, from a double-fired touch or a bouncing button, set the tempo to 300 BPM.

1. **Red commit.** Add tests to `src/lib/metronome.test.ts` *only*, then commit with the message `test: tap tempo ignores bounced taps (failing)`. These must fail:
   - `tapTempo([1000, 1000])` → `null` (one real tap).
   - `tapTempo([0, 500, 1000, 1000])` → `120` (the last tap bounced).
   - `tapTempo([0, 500, 520, 1000])` → `120` (a bounce at 520 is not a tap).
2. **Green commit.** Fix `tapTempo`. The rule: a tap less than `MIN_TAP_GAP_MS = 100` after the previous *kept* tap is a bounce and is ignored. Export the constant. Every existing metronome test must still pass.
3. In the PR, explain why 100 ms is safe: what's the fastest tempo a person can tap, and how does it relate to `MAX_BPM`?

**Done when:** merged, and the PR shows the red commit before the green one (link both commits).

### Task 1.4: Practice time, characterized, then decided (2 h)

Two behaviours lose practice time, and neither is obviously a bug. Each is a *product decision* someone made implicitly:

- `usePracticeTimer.ts` `save()` drops any stretch under 60 s, so five 50-second stretches log nothing (diagnostic B10).
- `PracticeTimer.tsx` saves `Math.round(elapsedSeconds / 60)` minutes *per stretch*, so rounding errors add up across pauses (two 89-second stretches log 2 minutes, not 3).

Also note that `PracticeTimer.tsx` computes `weekStart` with `getDay()`, which makes **Sunday** the first day of the week, while the dashboard's streak line runs Monday to Sunday ("Streak line: this week, Monday to Sunday", commit `c03adb6`). Check whether that's a real inconsistency for users before you act on it.

1. **Characterization tests first.** In `src/hooks/__tests__/`, write tests that pin down *today's* behaviour with fake timers: two 50-second stretches → the saver is never called; one 89-second plus one 89-second stretch → the saver receives 89 and 89. Name them `characterizes: …`. They should pass *now*.
2. **Find evidence.** What does the database actually store? (Hint: look at `add_practice_minutes` in `supabase/migrations/` and the `practice_goals` table.) Can you find out from production data how often people pause before a minute is up? If you can't, that fact goes in the ADR, together with what you'd need to log (week 7 builds that).
3. **Write `docs/adr/0001-recording-practice-time.md`** in OnStand using `templates/adr.md`. Compare at least three options. For example: (A) keep things as they are; (B) carry unsaved seconds across pauses and save whenever the total reaches a full minute, keeping the remainder; (C) store seconds on the server instead of minutes (a migration, which CLAUDE.md says needs a deliberate decision). Score it with the ADR rubric. It must reach 4.
4. **Implement the decision** in its own PR. Flip the characterization tests into specification tests that describe the new behaviour, in a commit whose message says the behaviour changed on purpose and links the ADR.

**Done when:** the ADR scores ≥ 4, and the implementation PR is merged with tests.

### Task 1.5: A PR log (15 min)

Create `docs/pr-log.md` in OnStand: one line per PR (number, title, rubric score, the one thing you'd do differently). Score every PR this week on the PR rubric *before* merging it. You'll use this log in week 30's case studies, so keep it from now on.

---

## 3. Lab: rebuild from a blank file (4 h, no AI)

The failing tests are in `labs/w01-prng/` and `labs/w01-ring-buffer/` of this repo. Create the files they import. Run them with `npx vitest run labs/w01`. When the visible tests pass, **commit**, then run `npm run unseal w01-hidden` and make the hidden tests pass too.

### Lab 1: `labs/w01-prng/prng.ts` (2 h)

Export `class Rng` with:

- `constructor(seed: number)`: the state is `seed` as an unsigned 32-bit integer (`>>> 0`).
- `nextUint32(): number`: the **mulberry32** step. Every operation is on 32-bit integers:
  1. Add `0x6D2B79F5` to the state, keeping it unsigned 32-bit. Let `t` be the new state.
  2. `t = (t XOR (t >>> 15)) × (t OR 1)`, as a 32-bit multiply (`Math.imul`).
  3. `t = t XOR (t + ((t XOR (t >>> 7)) × (t OR 61)))`, with the multiply again 32-bit.
  4. Return `(t XOR (t >>> 14))` as unsigned 32-bit.
- `float(): number`: uniform in [0, 1). Use the 32 bits directly; don't call `Math.random`.
- `int(max: number): number`: uniform integer in [0, max), for integer `max` in 1…2³². **No modulo bias.** Throw `RangeError` for anything else.
- `gaussian(): number`: standard normal (mean 0, sd 1) via Box–Muller. It must never return `NaN` or `±Infinity`. What happens if `float()` returns exactly 0?

Header comment: time and space per call.

**Things to understand, not just type:** why `Math.imul` and not `*` (what goes wrong with large products in a 64-bit float?); what `>>> 0` does to a negative number; why rejection sampling is unbiased.

### Lab 2: `labs/w01-ring-buffer/ring-buffer.ts` (2 h)

Export `class RingBuffer` holding the most recent `capacity` samples in a `Float32Array`:

- `constructor(capacity)`: a positive integer, or throw `RangeError`.
- `readonly capacity`, `get size()`: how many samples are held, up to `capacity`.
- `push(samples: ArrayLike<number>)`: append, overwriting the oldest when full. A chunk longer than `capacity` keeps only its last `capacity` samples.
- `latest(n, out: Float32Array): Float32Array`: copy the `n` most recent samples, **oldest first**, into `out[0..n)` and return `out`. Throw `RangeError` if `n > size` or `n > out.length`. It must not allocate.
- `clear()`

It must cope with audio rates: the hidden tests push 128-sample blocks for several minutes of audio. No `Array.prototype.shift`, and no new arrays per push.

**Transfer question** (answer in a comment at the bottom of the file): `AnalyserNode.getFloatTimeDomainData()` gives the tuner the most recent `fftSize` samples. Which of your two methods is it, and what does the browser do that corresponds to `push`?

---

## 4. DSA thread (2 h, no AI)

Work in `dsa/` in this repo, one file per problem with your own tests, TypeScript, and a **25-minute timer** per problem. When the timer goes off, stop. Then watch the NeetCode explanation and write three lines in `dsa/LOG.md`: the problem, your time, and what you missed.

From [NeetCode's roadmap](https://neetcode.io/roadmap), *Arrays & Hashing*:

1. Contains Duplicate
2. Valid Anagram
3. Two Sum

**Band B:** add one more *easy* from the same section. **Bands C and D:** add Group Anagrams and Top K Frequent Elements.

---

## 5. Retrieval questions (Sunday, closed book, in writing)

Answer before you re-read anything. Mark them with the sources. A partly-right answer is wrong. You pass at ≥ 80% (8 of 10).

1. Name the two independent reasons `.env` was tracked by git in OnStand.
2. In one sentence each: what's a characterization test, and when is it the *right* first test to write?
3. Why is a test that passes 19 times in 20 worse than one that always fails?
4. Why does `pitch.ts` zero-pad the window to at least 2N before the FFT?
5. What does `x >>> 0` do to `-1`? Why do PRNGs in JavaScript need `Math.imul`?
6. Explain modulo bias with a concrete example, using small numbers.
7. What does the NSDF's first strong peak, rather than its highest peak, protect against?
8. In a ring buffer of capacity 4 that has received `[1,2,3,4,5,6]`, what does `latest(3)` return, and where is the write index?
9. What separates a bug fix from a product decision? Give one example of each from this week.
10. What's the mean-removal fix for the DC offset doing in signal terms, and why does it also matter for the RMS silence gate?

Every question you get wrong goes into Anki and comes back next week.

## 6. Anki

Import `content/anki/week-01.tsv` ([download](content/anki/week-01.tsv)) in Anki with **File → Import**. The file's headers set the separator, HTML and tags ([how Anki reads text files](https://docs.ankiweb.net/importing/text-files.html#file-headers)). Review every day, about 10 minutes. Add your own cards for every quiz miss.

---

## 7. The gate

| Item | Pass criterion | Evidence |
|---|---|---|
| **w01.dc** DC fix | Merged; the diagnostic's DC test passes on `main`; checked on a real device | PR URL |
| **w01.det** Determinism | No `Math.random` in tests; 20/20 identical runs | PR URL (output in the description) |
| **w01.tap** Tap tempo | Red commit, then green, in one PR; all metronome tests pass | PR URL |
| **w01.adr** ADR-0001 | ≥ 4 on the ADR rubric; decision implemented with specification tests | ADR commit or PR URL |
| **w01.lab** Labs | Visible *and* hidden tests pass; code quality 2/2 | Commit hash |
| **w01.rec** Recording | `detect()` explained, no notes, ≤ 5 min, ≥ 4 on the Explanation rubric | Video URL |
| **w01.quiz** Retrieval | ≥ 80%; deck imported | Commit of your written answers |

**Recording must-hits for w01.rec:** the five A1 mechanisms from the diagnostic key (RMS gate; zero-padded FFT autocorrelation; NSDF with prefix sums; first key maximum ≥ 0.9 × highest; parabolic interpolation and clarity), plus what your DC fix changed.
**Follow-up questions to answer at the end of the recording:**
1. If the window were 1024 samples instead of 4096, which notes would the tuner lose, and why?
2. What would happen if the detector picked the *highest* key maximum instead of the first strong one? Give a note where it would go wrong.

### Cut list (if you're behind, in this order)

1. The Sunday-week investigation in task 1.4 (move it to week 2's stretch).
2. DSA problem 3. (Never drop below two: interviews don't care that you were busy.)
3. Task 1.5. Start the PR log next week, with this week's PRs backfilled.

**Never cut:** the labs, the recording, the red-then-green discipline in task 1.3.

### Stretch (mandatory for Band C)

- Add a property-based test for `clickAt`/`nextPosition`, using your `Rng` to generate random positions, note values and bar lengths. The property: the `beat` returned is always in `[0, beatsPerBar)`, and an `accent` only ever happens at position 0.
- Fix the transposition bug from diagnostic C6 test-first, as its own PR.

### Band B supports

- Before task 1.4, write a one-page plain-English summary of `usePracticeTimer.ts`: every exported function and every module-level variable, one sentence each. Do it from the code, without AI. This is the same skill as A3, slowed down.
- Do the DSA problems twice: once on day 1 and once on day 5, from a blank file.
