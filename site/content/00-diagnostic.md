# Week 0: The diagnostic

**Purpose:** to set your baseline against a real junior hiring bar, on OnStand's actual code. Your score decides where the course starts for you (see [Scoring and bands](#scoring-and-bands)).

**Deadline:** Sunday 25 October 2026, 23:59 EAT. Week 1 starts Monday 26 October either way.

**Time:** about 4½ hours, in two sittings.

| Sitting | Sections | Time box |
|---|---|---|
| 1 | A (explain) + B (predict) | 2 h |
| 2 | C (find bugs) + D (fix) + E (code from a blank file) | 2 h 30 |

---

## The rules (read twice)

1. **No AI of any kind.** No Claude, ChatGPT, Copilot or editor autocomplete beyond plain word completion. In VS Code, turn off inline suggestions (`"editor.inlineSuggest.enabled": false`) and disable every AI extension for the two sittings.
2. **No web search, no docs, no notes**, except where a section says otherwise. You may read OnStand's own source where a section allows it.
3. **Time boxes are hard.** When the time runs out, stop and write "TIME" where you stopped. A truthful 50 is worth more to you than an inflated 75, because the course will be calibrated to whatever number you report.
4. **Write your answers in `diagnostic/answers.md`** in this repo, which is a template. Record Section A as audio or video.
5. **Don't open `sealed/`** until you've finished and committed your answers. The answer key is sealed there; `npm run unseal diagnostic-key` decodes it. Commit your answers *before* unsealing, because the commit timestamp is your proof that you didn't peek.

Before you begin, write the start time at the top of `answers.md`. Commit your answers at the end of each sitting.

---

## Section A: Explain it (40 minutes, 20 points)

**Allowed:** the file open in your editor. **Not allowed:** notes, AI, the web, or re-reading this course.

For each file, record a single uninterrupted explanation of **no more than 5 minutes** (phone audio is fine), as if to an interviewer who just asked, *"Walk me through how this works and why it's built this way."* No pausing the recording to look things up. Put the links or filenames in `answers.md`.

The code is heavily commented. **Reading the comments aloud is not explaining**, and the rubric scores it as a 1. Explain the *mechanism* and the *why*.

| # | File | What to cover |
|---|---|---|
| A1 | `src/lib/pitch.ts`, the `detect()` method | From samples in to a frequency out. Every step, and why each step exists. |
| A2 | `src/components/Metronome.tsx` lines 71–122, plus `src/lib/metronome.ts` | How the clicks are timed, and why it isn't simply `setInterval(click, 60000/bpm)`. How the lights stay in sync with the sound. |
| A3 | `src/hooks/usePracticeTimer.ts` | Why the state lives outside React, and how the countdown survives a background tab or a reload. |
| A4 | `src/lib/audioSession.ts` | What problem it solves on iPhone, and why the silent `<audio>` element works. |

Each file is scored 0–5 with the **Explanation rubric** in [Rubrics](#/rubrics). In short: 5 means every important mechanism, the right "why" for each, and a limitation you spotted yourself; 3 means most of the mechanism with little of the why; 1 means paraphrasing comments.

---

## Section B: Predict it (40 minutes, 20 points)

**Allowed:** reading OnStand's source. **Not allowed:** running anything, writing scratch code, AI, the web.

For each question, give the **exact output** and **one or two sentences of reasoning.** It's 2 points each: 2 for the right answer and right reason, 1 for the right answer with a missing or wrong reason (or right reasoning with an arithmetic slip), 0 otherwise. "PitchDetector" means an instance from `windowFor(DEFAULT_RANGE, 48000)` called with `sampleRate = 48000` and `DEFAULT_RANGE` unless stated.

**B1.** In `src/lib/metronome.ts`, start at `position = 0` with `beatsPerBar = 5` and half notes (`noteBeats = 2`). Write the first six clicks as `kind` plus beat number (e.g. `accent1`), applying `clickAt` and then `nextPosition` each time.

**B2.** The metronome is playing eighth notes in 4/4. The click at `position = 3.5` has just been scheduled. Before the next click, the user switches to 3 beats per bar. What are the `position`, `beat` (1-based) and `kind` of the next click? What does the player *hear* that's musically wrong?

**B3.** `tapTempo([0, 500, 1000, 3100, 3600])` returns what?

**B4.** `tapTempo([1000, 1000])` returns what? Describe a real user action that produces this input.

**B5.** `catchUp(10, 10.04)` returns what, and `catchUp(10, 10.051)` returns what? In the first case, what happens to the sound of a click that the scheduler then schedules with `osc.start(10)` when `ctx.currentTime` is already 10.04?

**B6.** `PitchDetector.detect()` is given a 440 Hz sine plus a 660 Hz sine at equal amplitude (0.15 each), so two flutes a perfect fifth apart. What frequency comes back (to the nearest Hz), and why?

**B7.** `detect()` is given a tone at 110 Hz *with no energy at 110 Hz*: only harmonics 2, 3, 4 and 5 (220, 330, 440, 550 Hz) at equal amplitude. What comes back, and why?

**B8.** `detect()` is given a pure 440 Hz sine with amplitude 0.005. What comes back? And with amplitude 0.006? Show the arithmetic.

**B9.** `detect()` is given a 440 Hz sine of amplitude 0.3 *riding on a DC offset of +0.5*, so every sample is positive. What comes back? Point to the line(s) responsible.

**B10.** The practice timer is set to 25 minutes. The user presses Start, plays for 50 seconds, pauses, presses Start again, plays another 50 seconds, and pauses again. How many seconds are passed to the session saver in total? What does the timer display afterwards?

---

## Section C: Find the bugs (40 minutes, 20 points)

**Allowed:** reading OnStand's source, running `git` commands, running the *existing* test suite (`bun run test` or `npx vitest run`). **Not allowed:** writing new code or tests, AI, the web.

**Scope:** `src/lib/pitch.ts`, `src/lib/pitch.test.ts`, `src/lib/metronome.ts`, `src/components/Tuner.tsx`, `src/hooks/usePracticeTimer.ts`, `src/components/ErrorBoundary.tsx`, `.gitignore`, `package.json`, and the repository as a whole (how changes reach onstand.app).

Find as many **real** problems as you can: correctness bugs, test-quality problems and production-safety gaps. There are at least eight in scope. For each, write:

1. **Where:** file and line(s).
2. **Failing scenario:** concrete inputs or user actions → what goes wrong. "Might be buggy" scores zero.
3. **Severity:** *user-visible wrong result*, *data loss*, *security/process*, or *latent*.
4. **Fix sketch:** one or two sentences.

**Scoring:** 4 points per problem that matches the key with a concrete failing scenario, and 2 if the location and problem are right but the scenario is vague. The section caps at 20 (five good findings). A false positive (something that isn't a problem, argued as one) costs 1 point, so don't pad the list.

One starter question so you don't miss the most important one: *`.gitignore` lists `.env`. Run `git ls-files .env`. Explain exactly why it prints what it prints. There are two independent reasons.*

---

## Section D: Fix something small (60 minutes, 20 points)

**Allowed:** your editor, the terminal, OnStand's source, and the test runner. **Not allowed:** AI, or the web *except* MDN's JavaScript reference.

**The bug:** the tuner returns nothing for a perfectly clear note when the signal has a DC offset (a constant shift, as from some cheap USB interfaces and Android mic paths, or a slow pressure change from breath on the mic). You may have predicted this in B9.

**Steps:**

1. In OnStand: `git switch main && git pull && git switch -c diag/dc-offset`
2. Copy `onstand-patches/diag/pitch.dc-offset.test.ts` from this course repo to `src/lib/pitch.dc-offset.test.ts` in OnStand.
3. Run `npx vitest run src/lib/pitch` and **watch it fail.** Paste the failure output into `answers.md`.
4. Fix `src/lib/pitch.ts`. Keep the change as small as it can be while still being correct.
5. Run the **whole** suite (`npx vitest run`) and the type check (`npx tsc --noEmit -p tsconfig.app.json`). Both must be clean.
6. Commit with a clear message. Push the branch and open a PR to `main`, but **don't merge it**: merging deploys onstand.app. Write the PR description using `templates/pr-self-review.md`.
7. In `answers.md`, explain in three or four sentences *why* your fix works: what the DC offset did to the NSDF, and why your change removes the effect.

**Scoring (20):** the new tests pass and nothing else breaks (6); the fix is minimal and mathematically right, as judged by the key (4); the explanation is right (4); the PR self-review scores ≥ 3 on the PR rubric (4); finished inside 60 minutes (2).

---

## Section E: Code from a blank file (50 minutes, 20 points)

**Allowed:** your editor (AI off), the terminal, and MDN's JavaScript reference. **Not allowed:** AI, other web pages, OnStand's source, or copying from anywhere.

The failing test suites are in `labs/w00-diagnostic/`. Create the implementation files the tests import and make them pass. Run them with:

```sh
npm install                  # once
npx vitest run labs/w00-diagnostic
```

**E1: `streak.ts`, 25 minutes.** Export `longestStreak(days: string[]): number`. `days` holds calendar dates as `"YYYY-MM-DD"`, unsorted, possibly with duplicates. Return the length of the longest run of consecutive calendar days. It must be correct across month ends, year ends, leap days and daylight-saving changes. (Hint: think about what `new Date("2026-03-29")` means in a timezone with DST before you lean on it.)

**E2: `grid.ts`, 25 minutes.** Export `quantize(onsetsMs: number[], bpm: number, subdivision: number): number[]`. Onsets are note start times in milliseconds, sorted ascending, with time 0 on the first beat. The grid step is one beat divided by `subdivision` (so `subdivision = 4` means sixteenths in 4/4). Snap each onset to the nearest grid index, rounding exact halves up. A grid index can hold only one note: if a later onset snaps to an index already taken, drop it. Return the kept indices, ascending.

At the top of each file, in a comment, state the time and space complexity of your solution.

**Scoring (20):** E1 visible tests pass (6); E2 visible tests pass (6); hidden tests pass, which you unseal after committing (2); complexity stated correctly (2); code quality on the rubric: names, no dead code, no needless complexity (2); both inside the time box (2).

---

## Section F: Self-report (10 minutes, not scored, but required)

Answer honestly in `answers.md`. These calibrate the course as much as the score does.

1. Of the OnStand code in this diagnostic's scope, what did *you* type by hand? What did an AI write that you then read? What did an AI write that you never read?
2. Hours per week you can give the course *for real*, after freelance work. Give a number, not a hope.
3. Maths: are you comfortable with logarithms, sine/cosine, summation notation, and complex numbers? (Yes / rusty / no, for each.)
4. Have you ever written C or C++? How much?
5. Which section felt hardest? Which felt easiest?
6. Has anyone ever reviewed your code line by line? Who, and when?

---

## Scoring and bands

Grade yourself with the sealed key and [Rubrics](#/rubrics). Then add up A + B + C + D + E (out of 100).

**The junior bar this is measured against.** A typical 2026 entry-level loop has four parts:

1. A 45–60-minute coding round, easy-to-medium problems, no AI, talking as you go. *(Section E)*
2. Reading unfamiliar code and changing it safely with tests, as a take-home or pairing. *(Sections B, C, D)*
3. A deep dive on your own project, where they pick the hardest file and ask "why?" *(Section A)*
4. Behavioural questions. *(Not tested here; weeks 30–35.)*

| Band | Score | What it means | Where you start |
|---|---|---|---|
| **D** | 85–100 | At the junior bar on fundamentals. The gaps are production depth and specialization. | Week 1. You may take any week's gate directly without the labs, and the C++ block moves up to weeks 5–10 alongside. |
| **C** | 65–84 | Near the bar, with specific gaps. Typical of a CS graduate who hasn't shipped production code. | Week 1, standard track. Every **stretch** task is mandatory. |
| **B** | 45–64 | Below the bar. Typical of someone who builds mainly with AI and hasn't had to read code closely. Fixable, and the course is designed for exactly this. | Week 1, standard track, plus the **Band B supports** listed in each week (extra drills, two DSA problems a week at "easy"). |
| **A** | 0–44 | Far from the bar. Don't take it as a judgment of your potential. It's the measurement of one week. | **Foundations block F1–F4 first** (see [Foundations](#/foundations)), then Week 1. All deadlines shift by four weeks: change `startDate` in `site/course.json` with a commit message beginning `replan:` and a build-log entry. |

**Override flags.** These apply regardless of total:

- **Section A below 10/20:** *OnStand ownership flag.* Until you pass the explanation gates in weeks 1–4, you may not present OnStand as your work in any application or interview. Say "a product I directed and am now re-engineering" instead. That's true, and interviewers respect it more than being caught out.
- **Section E below 8/20:** add one extra DSA "easy" per week until week 11.
- **F2 under 12 hours:** the 36-week plan doesn't fit your life. Re-plan to 48 weeks (move `endDate`) now, not after you fall behind.

**Record the result.** Put the band and section scores in the tracker (Week 0 gate). Write a build-log entry with your score, your band, and one sentence on what surprised you. Commit it. The number is public for a reason: you'll want to compare it with the re-run in week 11.

**If I'm still around:** send me `answers.md` and the recordings, and I'll grade them and calibrate weeks 1–4 personally. If I'm not, the key and rubrics are strict enough to do it without me.

---

## Week 0 setup (about 1 hour, any time this week)

1. Push this course repo to a **public** GitHub repo and deploy it on Cloudflare Pages (README, "Deploy on Cloudflare Pages").
2. Open the deployed site, check in for today, and bookmark the **Today** page on your phone. That's where every session starts.
3. Install [Anki](https://apps.ankiweb.net/) on your phone and laptop.
4. Turn off AI inline suggestions in your editor now, not on Monday.
5. Create `dsa/` and `dsa/LOG.md` in this repo.

## The gate: week 0

| Item | Pass criterion | Evidence |
|---|---|---|
| **w00.diag** Diagnostic | Taken under the rules; answers committed *before* unsealing the key; scored with the key and rubrics; scores entered in the Tracker | Commit hash of `answers.md` |
| **w00.deploy** Deployed | The course is public on GitHub and live on Cloudflare Pages | The site URL |
| **w00.log** Build log | A week-0 entry with your score, band and one surprise, committed and pushed; first `progress.json` exported and committed | Commit URL |
