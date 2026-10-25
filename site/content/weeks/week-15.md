# Week 15: Filters: biquads and the tuner's front end

**1–7 February 2027 · Block C · Outline**

## Why this week exists

In week 1 you fixed the DC-offset bug by subtracting the window mean. That handles a constant offset, but not handling noise, wind or breath rumble, which are low-frequency energy that *moves*. The proper tool is a high-pass filter, and the biquad is the building block of almost every equaliser and filter in audio software. "Implement a biquad from the RBJ cookbook" is a classic audio-interview exercise.

**Outcomes:** explain difference equations, poles and zeros at an intuitive level, and frequency response; implement RBJ biquads; test filters by measuring their response; decide between mean removal and a high-pass filter with data.

## Read (3 h)

- W3C, [Audio EQ Cookbook](https://www.w3.org/TR/audio-eq-cookbook/): all of it. It's short and dense.
- S. W. Smith, *DSP Guide*, [ch. 2–3 refresher](https://www.dspguide.com/ch2.htm), then the recursive-filter chapter (19) in the [book contents](https://www.dspguide.com/pdfbook.htm).
- J. O. Smith, [Spectral Audio Signal Processing](https://ccrma.stanford.edu/~jos/st/) / *Introduction to Digital Filters* (linked from JOS's site): the sections on the frequency response of a two-pole, two-zero filter.

## Lab (4 h, no AI)

`labs/w15-biquad/`: tests first. A `Biquad` class with `lowpass`, `highpass` and `peaking` constructors from the cookbook (`f0`, `Q`, `gainDb`, `fs`), `process(input, output)` in Direct Form II Transposed, state kept between blocks, and `response(f)` returning the magnitude at a frequency. The tests measure magnitude by **filtering sine waves** and comparing with `response`: −3 dB at f0 for Q = 1/√2, pass-band ≈ 0 dB, the expected slope in the stop band, and identical results whether a signal is processed in one block or in 128-sample blocks.

## Build in OnStand (5 h)

1. **The test signals:** extend the week-4 corpus with *rumble* (a 5–20 Hz random-walk component at −6 dB relative to the tone) and *DC steps* (an offset that jumps mid-window).
2. Put a high-pass biquad (try 30 Hz and 60 Hz cutoffs) in front of each detector, as a stateful filter in the capture path, not per window.
3. Measure RPA and fine error with no filter, with mean removal, and with high-pass at each cutoff, on the new signals *and* the old corpus, so you can see what the filter costs on low notes (E1 = 41.2 Hz!).
4. **ADR-0007:** what the tuner's front end should be, per instrument range. Note the conflict between a 60 Hz cutoff and a double bass, and how the instrument range could choose the cutoff.

## DSA (2 h)

Heap, continued: Task Scheduler; Design Twitter (medium/hard: give it 45 minutes, then study the solution).

## Gate

- **w15.lab:** visible and hidden tests pass.
- **w15.hp:** the front-end comparison report and ADR-0007 ≥ 4.

**Cut list:** the peaking filter. **Never cut:** the block-size independence test, and checking the cost on low notes.
