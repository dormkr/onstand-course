# Week 10: Onsets and tempo

**Block B · Outline**

## Why this week exists

Pitch tells you *what* note; onsets tell you *when*. Everything in Block D (notes from pitch tracks, beat tracking, rhythm quantization) starts from onset detection. It's also a feature OnStand could ship on its own: "did you play in time with the metronome?" For a practice app that's arguably more valuable than a tuner.

**Outcomes:** explain onset detection functions (energy, spectral flux, phase, complex domain); implement spectral flux with peak picking; evaluate with the standard F-measure on labelled data you made yourself.

## Read (3 h)

- J. P. Bello et al. (2005), *A Tutorial on Onset Detection in Music Signals*, IEEE TSAP: [IEEE page](https://ieeexplore.ieee.org/document/1495485) (search the title for the authors' PDF). Sections I–III and V; skim IV.
- M. Müller, FMP, [Onset detection](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C6/C6S1_OnsetDetection.html).
- aubio, [`src/onset/onset.c`](https://github.com/aubio/aubio/blob/master/src/onset/onset.c) and [`src/spectral/specdesc.c`](https://github.com/aubio/aubio/blob/master/src/spectral/specdesc.c). Find the spectral flux, HFC and complex-domain functions.
- mir_eval, [onset metrics](https://craffel.github.io/mir_eval/#module-mir_eval.onset) (±50 ms window, F-measure).

## Data (do this first)

Label onsets by hand in [Sonic Visualiser](https://www.sonicvisualiser.org/) for **at least 300 onsets** of your own playing: legato and tongued scales, repeated notes (the hardest case: same pitch, new onset), slurred intervals (the soft-onset case), and a short étude excerpt. Export the labels as CSV. This dataset is yours, and Block D depends on it.

## Build in OnStand (5 h)

1. Port your lab detector into `src/lib/onsets.ts`, running offline on recordings (not real-time yet).
2. **"In time?" prototype**, behind a flag: record 8 bars with the metronome; detect onsets; report per-note timing error (ms early or late) against the click grid, adjusted for the round-trip latency you measured in week 6. Show the distribution, not just a mean.
3. Evaluation script in `bench/onsets/`, reusing week 4's harness patterns.

## Lab (4 h, no AI)

`labs/w10-onsets/`: tests first. A short-time Fourier transform (your week-3 FFT, plus a Hann window and hop size); spectral flux (half-wave rectified, on the log magnitude); adaptive-threshold peak picking (a moving median plus an offset, with a minimum distance between onsets); output onset times in seconds. Tests on synthetic clicks, tone bursts and repeated notes.

## DSA (2 h)

*Trees*: Invert Binary Tree; Maximum Depth of Binary Tree; Diameter of Binary Tree.

## Gate

- **w10.lab:** visible and hidden tests pass.
- **w10.f:** onset F-measure ≥ 0.85 at ±50 ms on your labelled flute set (report it by articulation type; slurs will be the worst); report ≥ 4.
- **w10.rec:** "Onset detection functions compared", no notes, ≥ 4. Follow-up: why are slurred notes on a flute hard for spectral flux, and which detection function helps?

**Cut list:** the "in time?" UI (keep the analysis script). **Never cut:** the hand-labelled dataset.
