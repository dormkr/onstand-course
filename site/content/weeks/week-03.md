# Week 3: Sound as numbers: the DFT, the FFT, and testing audio end to end

**Block A: Own the codebase**

## Why this week exists

Until now you've treated the tuner as code. This week you learn what it *computes*. A microphone gives you numbers 48,000 times a second; the Fourier transform tells you which frequencies those numbers contain; the FFT makes that fast enough to do 30 times a second on a phone. Every audio interview, from a Yousician C++ round to a web-audio take-home, assumes you can talk about sampling, aliasing, bins and windows without notes.

Then you close the biggest testing gap in OnStand: **nothing tests the tuner in a real browser.** Unit tests feed `PitchDetector` arrays; no test checks that a microphone, an `AnalyserNode`, React and the display together show "A" when someone plays an A. Chrome can pretend a WAV file is the microphone, and you'll write that WAV file yourself, with this week's lab code.

**By Sunday you can:**

1. Explain sampling, the Nyquist frequency and aliasing with a concrete example in hertz.
2. Derive the DFT as "correlate the signal with a sinusoid at each bin frequency", and say what a bin is in hertz.
3. Implement the radix-2 FFT from a blank file and explain why it's O(N log N).
4. Write and parse a WAV file byte by byte.
5. Run a browser end-to-end test where a fake microphone plays a known note, in CI.

## Time budget (17 h)

| Block | Hours |
|---|---|
| Read (and watch, once) | 3 |
| Build in OnStand (tasks 3.1–3.4) | 5.5 |
| Lab (DFT, FFT, WAV) | 5 |
| DSA | 2 |
| Retrieval, Anki, recording | 1.5 |

---

## 1. Read (3 h)

Do them in this order. The first is for intuition, the rest are the real material.

| # | Source | Read | Why |
|---|---|---|---|
| R0 | 3Blue1Brown, [But what is the Fourier Transform?](https://www.3blue1brown.com/lessons/fourier-transforms) | Watch once (20 min) | Intuition before formulas. Don't take notes; just watch. |
| R1 | S. W. Smith, *DSP Guide*, [ch. 3: ADC and DAC](https://www.dspguide.com/ch3.htm) | "Quantization" and "The Sampling Theorem" (30 min) | Sampling, Nyquist, aliasing, quantization noise. That's why 16-bit WAV has 1/32768 steps. |
| R2 | M. Müller, FMP notebook, [DFT and FFT](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C2/C2_DFT-FFT.html) | The DFT section and the FFT section; read the maths, skip running the Python (50 min) | The clearest derivation of the DFT as inner products, and the FFT's divide-and-conquer recursion. |
| R3 | J. O. Smith, *Mathematics of the DFT*, [The DFT derived](https://ccrma.stanford.edu/~jos/mdft/DFT_Derived.html) | That page and the next two linked pages (30 min) | The same idea from the "projection onto sinusoids" angle. Read until you can say what a frequency bin is. |
| R4 | S. W. Smith, *DSP Guide*, [ch. 12: The FFT](https://www.dspguide.com/ch12.htm) | "How the FFT works" (25 min) | Bit reversal and butterflies, with pictures. You'll implement exactly this. |
| R5 | McGill, [WAVE file format](http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html) | "Wave file format", "PCM data", "Examples" (15 min) | The byte layout for the lab's WAV writer. |
| R6 | W3C Web Audio, [AnalyserNode](https://webaudio.github.io/web-audio-api/#AnalyserNode) | The interface, `fftSize`, and `getFloatTimeDomainData` (15 min) | What the tuner actually reads from: the time-domain buffer, not the analyser's FFT. Why? |
| R7 | Playwright, [Test configuration](https://playwright.dev/docs/test-configuration) and [Web server](https://playwright.dev/docs/test-webserver); WebRTC project, [Testing](https://webrtc.github.io/webrtc-org/testing/) (the fake-media command-line flags) | Those pages (25 min) | The flags `--use-fake-ui-for-media-stream`, `--use-fake-device-for-media-stream` and `--use-file-for-fake-audio-capture=…` are what make the E2E test possible. |

---

## 2. Build in OnStand (5.5 h)

### Task 3.1: A dev-only harness page for the tools (1 h)

The tuner and metronome live inside the signed-in dashboard, so an E2E test would need a real account, a real database and a sign-in flow. That's a fine test for later (week 7). This week, give the tools a page of their own that **exists only in development builds**.

1. Follow the pattern already in `src/App.tsx` for the design system page (`const DesignSystem = import.meta.env.DEV ? lazy(...) : null`). Add `src/pages/ToolsLab.tsx`, which renders `<Metronome />` and `<Tuner />`, at `/lab/tools`, under the same `import.meta.env.DEV` condition.
2. Prove it isn't in production: run `bun run build`, then `grep -rl "ToolsLab" dist/` must print nothing. Put that output in the PR.
3. ADR-lite (a paragraph in the PR, not a file): why a dev-only route rather than a test account? What does this test *not* cover?

### Task 3.2: Fixture audio from your own WAV writer (30 min)

After the lab passes, add `e2e/fixtures/make-fixtures.ts` to OnStand. It imports *your* `encodeWav` (copied from the lab into `e2e/fixtures/wav.ts`) and writes:

- `a4-440.wav`: 48 kHz, mono, 5 s, a 440 Hz tone at amplitude 0.5, with harmonics 2 and 3 at 0.25 and 0.1 (a pure sine is too easy).
- `e2-82.wav`: 82.41 Hz with a **weak fundamental** (0.15, 1, 0.7, 0.4 for harmonics 1–4), the phone-mic case.
- `silence.wav`: 5 s of zeros.

Commit the generated files (they're small, and the test shouldn't depend on regenerating them), and add a script line to run the generator.

### Task 3.3: Playwright end to end (2.5 h)

1. `bun add -d @playwright/test`, then `bunx playwright install chromium`.
2. Write `playwright.config.ts` yourself:
   - `webServer` runs `bun run dev` and waits for `http://localhost:8080`.
   - **One project per fixture** (Chromium only), each with `launchOptions.args` of `--use-fake-ui-for-media-stream`, `--use-fake-device-for-media-stream` and `--use-file-for-fake-audio-capture=<absolute path to the fixture>`. Use `path.resolve`, because relative paths fail silently.
   - `trace: "retain-on-failure"`.
3. Write `e2e/tuner.spec.ts`:
   - **A4 project:** open `/lab/tools`, click *Start Listening*, then wait (with `expect.poll` or `toHaveText`, never a fixed `waitForTimeout`) until the note shows `A`, and the `role="meter"` element's `aria-valuenow` is within ±5 cents.
   - **E2 project:** the note is `E`, and the octave line says `Octave 2`.
   - **Silence project:** after 2 s the display still says "Play a note".
4. Write `e2e/metronome.spec.ts`: start at 120 BPM, check that the beat lights advance, stop, and check the BPM persists after a reload (it's in localStorage).
5. Watch each test fail once on purpose (change the expected note) before trusting it.

**If the fake capture produces silence:** check the file is 16-bit PCM WAV (your encoder writes exactly that), the path is absolute, and the permission flag is present. Chromium loops the file. Write in the PR what you had to debug. That's a real skill, and it's interview material.

### Task 3.4: E2E in CI (1.5 h)

Add a second job, `e2e`, to `ci.yml`: install with `--frozen-lockfile`, `bunx playwright install --with-deps chromium`, `bunx playwright test`, and **upload the `test-results/` folder as an artifact on failure** (`actions/upload-artifact`, `if: failure()`). Keep it separate from `checks` so a slow browser test doesn't hide a fast type error. Make it a required check if you protected `main` in week 2.

**Done when:** a PR shows both jobs green, and a deliberately broken E2E run shows the uploaded trace (link it).

---

## 3. Lab: rebuild from a blank file (5 h, no AI)

`labs/w03-dsp/`. Run with `npx vitest run labs/w03`. Visible → commit → `npm run unseal w03-hidden`.

**`dft.ts`:** `dft(re: Float64Array, im: Float64Array): { re: Float64Array; im: Float64Array }`. Straight from the definition, X[k] = Σₙ x[n]·e^(−2πikn/N). O(N²). Inputs untouched; any length.

**`fft.ts`:**
- `isPowerOfTwo(n)`: true for 1, 2, 4, …; false for 0, negatives and non-integers.
- `fft(re, im)`: **in place**, iterative radix-2 decimation-in-time: bit-reversal permutation, then butterflies of size 2, 4, …, N. Throw `RangeError` if the length isn't a power of two or the arrays differ in length. Length 1 is a no-op. **No recursion and no allocation inside the transform**, except an optional twiddle table that you build once.
- `ifft(re, im)`: the inverse, in place, including the 1/N scaling.

**`wav.ts`:**
- `encodeWav(channels: Float32Array[], sampleRate: number): Uint8Array`: a canonical 44-byte header, 16-bit PCM, little-endian, channels interleaved. Clip to [−1, 1], then `Math.round(s * 32767)`. Throw `RangeError` if the channels have different lengths.
- `decodeWav(bytes: Uint8Array): { sampleRate: number; channels: Float32Array[] }`: 16-bit PCM only (throw on anything else). Walk the chunks (`fmt `, then skip anything that isn't `data`), remembering that RIFF chunks with an **odd size** are followed by one padding byte. Decode as `int / 32767`, but never below −1. Must work when `bytes` is a view into a larger buffer (`byteOffset ≠ 0`).

**The benchmark (gate w03.bench).** Write `labs/w03-dsp/bench.ts` yourself and run it with `npx tsx labs/w03-dsp/bench.ts`. Measure your FFT at N = 4096 against (a) your DFT and (b) OnStand's FFT (copy `PitchDetector`'s private `fft` logic into a standalone function for a fair comparison, or time `detect()` and subtract the non-FFT work, and say which you did). Requirements: warm up first; at least 200 timed runs per FFT; report the **median and p95**, plus machine, Node version and N. Targets: **your FFT ≥ 50× faster than your DFT; within 3× of OnStand's.** If you're slower than 3×, find out why (hint: computing `Math.cos` inside the inner loop), fix it, and report both versions. Write it up as `labs/w03-dsp/BENCH.md` and score it with the benchmark rubric.

**Transfer question** (in `BENCH.md`): the tuner reads a 4096-sample window at 48 kHz. What's the frequency resolution of a 4096-point DFT of that window, in Hz per bin? Why is that far too coarse to tune a double bass by picking the biggest bin, and how does `pitch.ts` get sub-cent precision anyway?

---

## 4. DSA thread (2 h, no AI)

NeetCode roadmap, *Stack*: Valid Parentheses; Min Stack; Evaluate Reverse Polish Notation. **Band B:** do 3Sum (left over from last week) instead of Min Stack. **Bands C and D:** add Daily Temperatures.

---

## 5. Retrieval questions (Sunday, closed book)

1. At 48 kHz, what's the Nyquist frequency? A 30 kHz tone is sampled at 48 kHz without a filter: what frequency appears?
2. A 4096-point DFT at 48 kHz: what's the bin spacing in Hz, and what frequency does bin 10 represent?
3. Write the DFT formula from memory. What does X[0] tell you about a signal?
4. Why does a real-valued signal give a conjugate-symmetric spectrum, and what does that mean for how many bins carry information?
5. What does bit reversal do, and why is it needed in an iterative radix-2 FFT?
6. Why is the FFT O(N log N)? Count the butterflies.
7. State Parseval's theorem in the form your test checks.
8. What are the 4-byte tags of a canonical WAV file, in order? What's special about chunks with an odd size?
9. Which Chromium flags make a WAV file act as the microphone, and which one skips the permission prompt?
10. Why does the tuner use `getFloatTimeDomainData` rather than the AnalyserNode's own FFT output?

## 6. Anki

Import `content/anki/week-03.tsv` ([download](content/anki/week-03.tsv)).

---

## 7. The gate

| Item | Pass criterion | Evidence |
|---|---|---|
| **w03.lab** Labs | Visible and hidden tests pass; code quality 2/2 | Commit hash |
| **w03.bench** Benchmark | Your FFT ≥ 50× your DFT; within 3× of OnStand's; `BENCH.md` ≥ 4 on the benchmark rubric | Commit URL of `BENCH.md` |
| **w03.e2e** E2E | Three tuner projects + metronome spec green in CI; a broken run's trace uploaded | Run URLs |
| **w03.rec** Recording | The FFT on paper or a whiteboard, no notes, ≤ 5 min, ≥ 4 | Video URL |
| **w03.quiz** Retrieval | ≥ 80% | Commit |

**Recording must-hits for w03.rec:** the DFT as correlation with sinusoids; splitting into even and odd indices; the twiddle factor and the butterfly (`a ± w·b`); bit reversal and why it's needed; counting the work: log₂N stages of N/2 butterflies.
**Follow-up questions:**
1. Why does `pitch.ts` zero-pad to at least 2N before using the FFT for autocorrelation? Relate it to circular convolution.
2. Draw the butterfly diagram for N = 4 and say which inputs end up where after bit reversal.

### Cut list (in order)

1. The metronome spec (task 3.3, step 4): do it in week 4's stretch.
2. The E2 project (keep A4 and silence).
3. DSA problem 3.

**Never cut:** the E2E test in CI, the benchmark with spread (median and p95), the recording.

### Stretch (mandatory for Band C)

- Add a Hann window to your FFT lab (`hann(n)`), and plot a 1000 Hz tone's magnitude spectrum with and without it (a table of dB values is enough). Explain spectral leakage in `BENCH.md`.
- Add a fourth E2E project: a 440 Hz tone with a +0.3 DC offset. It passes because of your week-1 fix. That's a regression test across the whole stack.

### Band B supports

- Before the FFT, hand-compute a 4-point DFT of `[1, 2, 0, −1]` on paper, then check it against your `dft`.
- Write the WAV header by hand on paper (offset, size, value) before coding `encodeWav`.
