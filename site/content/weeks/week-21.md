# Week 21: Beat tracking

**15–21 March 2027 · Block D · Outline**

## Why this week exists

You can't quantize rhythm without knowing where the beats are. A metronome gives them for free, but a musician playing freely (rubato, a slowing cadence, a performance without a click) doesn't. Beat tracking turns onsets into a beat grid that can bend with the player. Dan Ellis's dynamic-programming tracker is short, elegant, and a great example of dynamic programming in a real product, which is useful in DSA interviews too.

**Outcomes:** compute an onset-strength envelope; estimate tempo by autocorrelation; find beats by dynamic programming with a tempo-consistency cost; evaluate with beat F-measure.

## Read (3 h)

- D. P. W. Ellis (2007), [Beat Tracking by Dynamic Programming](https://www.ee.columbia.edu/~dpwe/pubs/Ellis07-beattrack.pdf): all of it. Implement from this paper, not from library code.
- M. Müller, FMP, [beat tracking](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C6/C6S3_BeatTracking.html).
- mir_eval, [beat metrics](https://craffel.github.io/mir_eval/#module-mir_eval.beat): F-measure with a ±70 ms window (the default), and why continuity-based metrics also exist.

## Lab (4 h)

`labs/w21-beats/`: tests first. `onsetStrength(signal, sr)` (from your week-10 spectral flux), `estimateTempo(envelope, fps)` by autocorrelation with a log-Gaussian tempo prior (around 120 BPM, as in the paper), and `trackBeats(envelope, fps, bpm, tightness)` by DP with backtracking. Tests: a synthetic click track at a fixed tempo; a click track with a gradual ritardando; a click track with missing beats (the tracker must fill them in).

## Build in OnStand (5 h)

1. Run the beat tracker on recordings made **without** the metronome; overlay the beats on the waveform in a debug view.
2. Label beats by hand (tap along in Sonic Visualiser) for 5 recordings, including one with rubato, and report F-measure. Where does it fail? (Rubato and cadences, very likely. Explain why, from the cost function.)

## DSA (2 h)

*1-D Dynamic Programming*: Climbing Stairs; House Robber; Coin Change. Notice that the beat tracker is the same shape: best score up to here, plus a transition cost.

## Gate

- **w21.lab:** visible and hidden tests pass.
- **w21.eval:** beat F-measure reported on labelled recordings, report ≥ 4.
