# Week 4: Pitch detection, measured: YIN against MPM

**Block A: Own the codebase**

## Why this week exists

You asked to "rewrite the tuner and benchmark it against YIN". I changed that to **benchmark first, then decide**, because OnStand's tuner already runs the McLeod Pitch Method, and rewriting a working algorithm without measuring it is résumé-driven development. This week you implement YIN from the 2002 paper, build a benchmark harness that would hold up in a code review, measure both detectors on synthetic *and* real audio, and make the decision in an ADR that cites numbers.

This week is also your strongest interview story so far. "I implemented YIN from the paper, built a reproducible benchmark, and here is the data that decided which one ships" is what a Yousician, Muse Group or Moises interviewer wants to hear. It shows algorithmic depth, measurement discipline and judgment.

It also ends Block A, with the course's first **decision point**: did you pass weeks 1–4 without AI writing your code?

**By Sunday you can:**

1. Explain YIN's steps, and why each exists, from memory.
2. Compare YIN and MPM on the same footing: what each normalises, where each makes octave errors, and what each costs.
3. Build a benchmark with a fixed, seeded corpus, defined metrics, spread and a reproducible command.
4. Evaluate on real labelled audio (NSynth, plus your own flute) and say what synthetic data hides.
5. Write an ADR whose decision follows from evidence, including the evidence that would reverse it.

## Time budget (18 h)

This is the heaviest week of Block A. Plan for it now.

| Block | Hours |
|---|---|
| Read | 3.5 |
| Lab (YIN) | 4 |
| Build in OnStand (tasks 4.1–4.5) | 7 |
| DSA | 2 |
| Retrieval, Anki, recording, external review | 1.5 |

---

## 1. Read (3.5 h)

| # | Source | Read | Why |
|---|---|---|---|
| R1 | A. de Cheveigné & H. Kawahara (2002), *YIN, a fundamental frequency estimator for speech and music*, JASA. [Author's PDF](http://recherche.ircam.fr/equipes/pcm/cheveign/ps/2002_JASA_YIN_proof.pdf) | **All of section II** (steps 1–6) and the error-rate tables in section III. Skim the rest (1.5 h) | The primary source. Your lab implements steps 1–5 exactly as written. Note *where* the paper says to interpolate. |
| R2 | P. McLeod (2008), *Fast, Accurate Pitch Detection Tools for Music Analysis*, PhD thesis. [PDF](https://www.cs.otago.ac.nz/research/publications/oucs-2008-03.pdf) | §2.3.2–2.3.3 (autocorrelation vs square difference, pp. 12–18); §4.1, 4.3, 4.4 (the NSDF, parabolic interpolation, clarity, pp. 45–53); §6.3 (peak picking, pp. 93–98) (1.2 h) | The method OnStand ships, from its author. §6.3 is where the "0.9 × highest" rule comes from. §5.2.2 (vibrato) is optional, and worth it for a flutist. |
| R3 | aubio, [`src/pitch/pitchyin.c`](https://github.com/aubio/aubio/blob/master/src/pitch/pitchyin.c) and [`pitchyinfft.c`](https://github.com/aubio/aubio/blob/master/src/pitch/pitchyinfft.c) | Both files (30 min) | A production YIN in C, and its FFT version. Compare `pitchyin.c` with your lab. What does `pitchyinfft.c` change, and why is it faster? |
| R4 | mir_eval, [melody metrics](https://craffel.github.io/mir_eval/#module-mir_eval.melody) | The definitions of raw pitch accuracy, raw chroma accuracy, voicing recall and voicing false alarm (15 min) | Use the field's standard names for your metrics, so your report is legible to MIR people. |
| R5 | [NSynth dataset](https://magenta.tensorflow.org/datasets/nsynth) | "Description", "Features" and "Files" (10 min) | Your real-audio test set: labelled single notes, including acoustic flute. |

---

## 2. Lab: YIN from a blank file (4 h, no AI)

Do the lab **before** the OnStand tasks: the benchmark needs your YIN.

`labs/w04-yin/`. Run with `npx vitest run labs/w04`. Visible → commit → `npm run unseal w04-hidden`. The hidden suite includes a **precision** test: over a sweep of clean tones, the 95th-percentile error must be below 0.3 cents. An implementation that interpolates in the wrong place passes the visible tests but fails this one. Read R1's step 5 carefully.

Export `class Yin` from `yin.ts`:

- `constructor(size: number, threshold = 0.1)`: `size` is the analysis buffer length, an integer ≥ 64, or throw `RangeError`. Expose `readonly size` and `readonly threshold`. Allocate every work array here, never in `detect`.
- `detect(buf: Float32Array, sampleRate: number, range: { min: number; max: number }): { freq: number; aperiodicity: number } | null`:
  1. **Silence gate:** if the RMS of `buf[0..size)` is below 0.004 (OnStand's `MIN_RMS`), return `null`.
  2. **Lags:** τ_max = min(⌊size/2⌋, ⌈sampleRate / range.min⌉), τ_min = max(2, ⌊sampleRate / range.max⌋), integration window W = size − τ_max − 1.
  3. **Step 1–2 (paper):** the difference function d(τ) = Σ_{j<W} (x_j − x_{j+τ})² for τ = 1 … τ_max + 1 (the naive O(W·τ_max) loop is fine for the lab), and the cumulative-mean-normalised d′(τ) with d′(0) = 1. Guard against division by zero.
  4. **Step 3 (absolute threshold):** the first τ in [τ_min, τ_max] where d′(τ) < threshold, then keep going while d′ keeps falling, to reach the bottom of that dip. If no τ qualifies, return `null` (for a tuner, "not periodic enough" means no note).
  5. **Step 4–5 (interpolation):** parabolic interpolation around the chosen τ, on the function the paper specifies, then freq = sampleRate / τ_interpolated. Reject results outside [0.97·min, 1.03·max].
  6. Return `{ freq, aperiodicity: d′(τ) }`.
- Never modify `buf`.

Header comment: time and space complexity of `detect`.

**Transfer question** (a comment at the end of `yin.ts`): the hidden tests check that YIN reads a note riding on a DC offset of +0.5, which OnStand's MPM couldn't do before your week-1 fix. Why is the difference function immune to DC, mathematically?

---

## 3. Build in OnStand (7 h)

### Task 4.1: Bring YIN into OnStand (30 min)

Copy your lab YIN to `src/lib/yin.ts` with its tests (`src/lib/yin.test.ts`, which can reuse the lab's visible tests). It isn't wired to the UI. PR as usual.

### Task 4.2: The benchmark harness (3 h)

Build `bench/pitch/` in OnStand. Everything here must be **deterministic** (your `src/test/rng.ts` from week 1) and **runnable with one command** (`bun run bench:pitch`).

**Detectors** behind one interface: `type Detector = (buf: Float32Array, sampleRate: number, range: PitchRange) => number | null`. Wrap MPM (`PitchDetector`), your naive YIN, and (task 4.3) YIN-FFT.

**The synthetic corpus.** Use exactly this, so your numbers can be compared with the ones I verified when writing this week:

| Parameter | Value |
|---|---|
| Sample rate, window, range | 48 kHz; `windowFor(DEFAULT_RANGE, 48000)` (4096); `DEFAULT_RANGE` (38–2700 Hz) |
| Notes | every semitone, MIDI 28 (E1, 41.2 Hz) to 96 (C7, 2093 Hz) |
| Timbres (harmonic amplitudes) | pure `[1]`; flute-like `[1, 0.5, 0.25, 0.1]`; bright `[1, 0.8, 0.6, 0.5, 0.3]`; weak fundamental `[0.15, 1, 0.7, 0.4]`, only up to MIDI 60 (240 frames per condition in total) |
| Phase | an independent random phase per harmonic; drop any harmonic at or above Nyquist; accumulate phase sample by sample |
| Level | scale so that the clean signal's RMS is 0.3 |
| Noise | white Gaussian at **40, 20 and 10 dB SNR**, relative to the clean signal's RMS |
| Vibrato set | the same, with ±20 cents at 5.5 Hz (score raw pitch accuracy only: an 85 ms window doesn't have one "true" frequency) |
| Unvoiced set | 200 frames of Gaussian noise, sd 0.1 |
| Seeds | a new `Rng(2026)` for each (detector, SNR) run, iterating notes → timbres; `Rng(7)` for the unvoiced set |

**Metrics** (define them in the report *before* showing results), per detector and condition:

- **Raw pitch accuracy (RPA):** the share of voiced frames whose estimate is within ±50 cents of the truth.
- **Octave errors:** the share within ±50 cents of an octave above or below.
- **Unvoiced misses:** voiced frames that returned `null`.
- **Fine error:** the median and p95 of |cents|, over frames counted in RPA (steady sets only).
- **Voicing false alarms:** unvoiced frames that returned a pitch.
- **Cost:** the median and p95 ms per frame, after a warm-up, on your machine (state CPU, OS and runtime).

**Targets, for YIN** (my reference implementation met all of these on 20 October 2026, so they're achievable):

| Condition | Target |
|---|---|
| 40 dB steady | RPA ≥ 99%; fine median ≤ 0.1 ¢; p95 ≤ 0.5 ¢ |
| 20 dB steady | RPA ≥ 99%; fine p95 ≤ 8 ¢ |
| 10 dB steady | RPA ≥ 95% |
| Unvoiced | ≤ 2 false alarms in 200 |
| Cost (YIN-FFT, task 4.3) | median ≤ 2× MPM's median, on the same machine and run |

MPM has no targets: you report its numbers. Don't assume either detector will "win".

### Task 4.3: YIN-FFT (1.5 h)

Naive YIN is O(W·τ_max), many times slower than MPM per frame. Make it competitive. Expand d(τ) = Σ x_j² + Σ x_{j+τ}² − 2·Σ x_j·x_{j+τ}, compute the energy terms with prefix sums and the cross term with an FFT (as `pitch.ts` already does for MPM, and as aubio's `pitchyinfft.c` does). It must agree with naive YIN within 0.01 cents on the whole clean corpus. That agreement is a test, not an eyeball check. Then measure it.

### Task 4.4: Real audio (1.5 h)

1. **NSynth.** Download the test split ([nsynth-test.jsonwav.tar.gz](http://download.magenta.tensorflow.org/datasets/nsynth/nsynth-test.jsonwav.tar.gz), about 1 GB, so do it at off-peak hours). Use your week-3 `decodeWav`. Select `instrument_source_str = "acoustic"` and `instrument_family_str` in {flute, bass, keyboard}. Take one window starting at 0.5 s (the steady part). Note that NSynth is **16 kHz**, so call `windowFor(range, 16000)`. Truth = MIDI `pitch`. Report RPA, octave errors and unvoiced misses per family, per detector. *Don't* commit the dataset. Commit the script and a list of the note IDs you used.
2. **Your flute.** Record 20 sustained notes across your range (C4 to at least C7), 3 s each, as 48 kHz WAV, using the phone and mic you'd actually practise with. Label each with the written note. You're not perfectly in tune, so score **RPA (±50 ¢) only**, plus each detector's agreement with the other in cents. Commit these. They're yours, and they're the most relevant test data in this course. You'll add to this set in weeks 10 and 20.

### Task 4.5: A regression floor in CI, and ADR-0003 (30 min + 1 h)

1. Add `bench/pitch/regression.test.ts`, a fast subset (every 4th note, 20 dB) that **fails CI** if MPM's RPA drops below 99% or its p95 fine error rises above 5 ¢. The next refactor of `pitch.ts` can't silently make the tuner worse.
2. Write the report, `bench/pitch/REPORT.md` (benchmark rubric ≥ 4), and `docs/adr/0003-pitch-detector.md`: keep MPM, switch to YIN, or a hybrid (for example, one detector's confidence gating the other's estimate). Options compared on the same criteria: accuracy by condition, behaviour on *your* flute, cost per frame, latency (window length), code you'd have to maintain. **The decision must follow from your table**, and it must say what result would reverse it.

---

## 4. DSA thread (2 h, no AI)

NeetCode roadmap, *Binary Search*: Binary Search; Search a 2D Matrix; Koko Eating Bananas. **Band B:** the first two plus one *Stack* easy you haven't done. **Bands C and D:** add Find Minimum in Rotated Sorted Array.

---

## 5. Retrieval questions (Sunday, closed book)

1. List YIN's steps 1–5 from memory, in one line each.
2. Why does YIN normalise d(τ) by its cumulative mean? What goes wrong at small τ without it?
3. Why does the absolute-threshold step take the *first* dip below the threshold, not the deepest one? What error does that prevent?
4. Where does the YIN paper say to do parabolic interpolation, and why does it matter for precision?
5. The NSDF and d′: which one is 1 for perfect periodicity, and which one is 0?
6. Why is the difference function immune to a DC offset while plain autocorrelation isn't?
7. Define raw pitch accuracy and voicing false alarm the way mir_eval does.
8. Why can't you score fine error on vibrato frames against the note's centre frequency?
9. NSynth is 16 kHz. What does that change about the window you need for a bass's low E (41.2 Hz), in samples and in milliseconds?
10. What did your ADR decide, and what result would reverse it?

## 6. Anki

Import `content/anki/week-04.tsv` ([download](content/anki/week-04.tsv)). Before Sunday, review weeks 1–3 cards too. The week-4 decision point depends on retention.

---

## 7. The gate

| Item | Pass criterion | Evidence |
|---|---|---|
| **w04.yin** Lab | Visible and hidden tests pass (including precision); code quality 2/2 | Commit hash |
| **w04.bench** Harness | One-command, seeded; YIN meets every target in the table; `REPORT.md` ≥ 4 on the benchmark rubric | PR URL |
| **w04.real** Real audio | NSynth (3 families) and your 20 flute notes evaluated for every detector, in the report | PR URL |
| **w04.adr** ADR-0003 | ≥ 4; the decision follows from the data | ADR URL |
| **w04.rec** Recording | YIN closed-book, no notes, ≤ 5 min, ≥ 4 | Video URL |
| **w04.ext** External review | One recording or PR from weeks 1–4 scored by a working engineer against the course rubric (see [Rubrics](#/rubrics)) | Link, or their written score |
| **w04.kill** Decision point | Written in the build log (below) | Log commit |

**Recording must-hits for w04.rec:** the difference function and what a dip means; cumulative-mean normalisation and why; the absolute threshold, taking the first dip; interpolating on the right function; how it differs from MPM's NSDF, and one case each handles better.
**Follow-up questions:**
1. Your benchmark shows one detector making octave errors at 10 dB. Using its steps, explain mechanically *why* it went an octave wrong.
2. Make the case *against* the decision your ADR took, as strongly as you can in 60 seconds.

**Finding an external reviewer.** Ask in a community where audio and web developers are (the [JUCE forum](https://forum.juce.com/), [The Audio Programmer](https://www.youtube.com/@TheAudioProgrammer) Discord, a Nairobi developer community, or your university's alumni working as engineers). Send one PR or recording, the rubric, and a specific question. Most engineers will give 15 minutes to a precise request; few will give any to a vague one.

### The week-4 decision point

Write this in your build log, honestly:

> Weeks 1–4: did I pass every gate without AI writing the code? (Check `site/log/honesty.md`.) Which gates needed the slip protocol? What did the external reviewer score compared with my own score?

If two or more gates were passed only with AI-written code, or not passed at all after the slip protocol, the [direction call](#/direction)'s kill criteria apply: talk to a working engineer before you start week 5. Otherwise, write "continuing", and why.

### Cut list (in order)

1. NSynth keyboard (keep flute and bass).
2. The vibrato set.
3. DSA problem 3.

**Never cut:** your own flute recordings, the targets, the regression floor in CI, the decision point.

### Stretch (mandatory for Band C)

- Implement step 6 of the paper (best local estimate) and measure whether it helps on *your flute recordings* specifically.
- Run each detector on the windowed version of the signal (Hann) and explain the result.

### Band B supports

- Before coding, compute d(τ) by hand for a 6-sample signal `[0, 1, 0, −1, 0, 1]` at τ = 1…4, then d′(τ). Check your code against it.
- Do the YIN recording twice: once on Wednesday (expect a 2–3), and once on Sunday.
