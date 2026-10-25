# Week 22: Rhythm quantization I: grids and costs

**22–28 March 2027 · Block D · Outline**

## Why this week exists

This is the problem you named as your goal. Performed rhythm is continuous: a "quarter note" lasts 0.47 beats, then 0.53, then 0.61 into a fermata. Notation is discrete and rational. Quantization maps one to the other, and the naive version (snap to the nearest sixteenth, as in your diagnostic E2) produces unreadable notation: triplets turn into dotted rhythms, and a slight drag becomes a sixteenth rest. The good versions trade *accuracy* (how close to what was played) against *simplicity* (how readable the notation is). This week you build the cost-based version and read how MuseScore does it in production.

**Outcomes:** formulate quantization as an optimisation (error + complexity); choose a grid per beat (including triplets); produce durations that notation can represent; read and explain production C++.

## Read (4 h)

- MuseScore, [`importmidi_quant.cpp`](https://github.com/musescore/MuseScore/blob/master/src/importexport/midi/internal/midiimport/importmidi_quant.cpp), and skim the rest of [the MIDI import folder](https://github.com/musescore/MuseScore/tree/master/src/importexport/midi/internal/midiimport) (tuplets, voices, the meter). Draw the call graph on paper. What does it optimise? What does it do with tuplets?
- A. T. Cemgil, P. Desain, B. Kappen (2000), *Rhythm Quantization for Transcription*, Computer Music Journal (search the title for the authors' copy): the problem statement and the "grid" baseline sections, before the Bayesian part (which is week 23).

## Lab (4 h)

`labs/w22-quant/`: tests first. Input: onset times in beats (from the beat tracker or the metronome grid). For each beat, choose a subdivision from {1, 2, 3, 4, 6, 8} that minimises `Σ|error|² + λ · complexity(subdivision)`, then derive note durations as `Fraction`s (week 19) from consecutive quantized onsets, and split them across bar lines into tied notes. Tests: a straight eighth-note passage played slightly unevenly → all eighths; a passage of triplets → triplets, not 16th–8th–16th; a dotted rhythm → a dotted eighth plus a sixteenth; the effect of λ (sweep it and check the notation simplifies monotonically).

## Build in OnStand (5 h)

1. A pipeline from MIDI input (week 18) → quantized `Score` (week 19) → rendered notation, behind a flag. MIDI first, because it removes audio errors from the problem.
2. A test set: 10 performances on a MIDI keyboard (or recorded from your flute and transcribed in week 20), each with the correct notation as MusicXML. Measure **rhythm accuracy**: the share of notes whose quantized onset *and* duration match the reference.
3. **A written walkthrough** of `importmidi_quant.cpp`: the algorithm in your own words, one worked example, and one way your approach differs.

## DSA (2 h)

1-D DP, continued: Longest Increasing Subsequence; Word Break.

## Gate

- **w22.lab:** visible and hidden tests pass.
- **w22.muse:** the MuseScore walkthrough ≥ 4 on the explanation rubric (written or recorded).
