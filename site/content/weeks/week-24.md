# Week 24: Capstone: play to notation

**Block D · Outline**

## Why this week exists

Everything since week 3 connects here: microphone → worklet capture (week 5) → pitch (4) → onsets (10) → notes (20) → beats (21) → quantization (22–23) → score model (19) → engraved notation. Play a phrase on your flute and see it written. It's a demo anyone understands in 30 seconds, and every stage behind it has a test and a measured error. That combination, an obvious demo with rigorous evidence behind it, is the strongest portfolio piece you'll have.

## Build in OnStand (12 h)

1. **The pipeline end to end**, behind a flag: record a phrase (with or without the metronome), then show the notation, with a "what the system heard" debug view (pitch track, onsets, beats, quantized grid).
2. **Error attribution.** For each wrong note in the output, which stage caused it? Instrument the pipeline so you can answer that per note (pitch, segmentation, beat or quantization error).
3. **Evaluation:** 10 phrases from your repertoire, each with its reference MusicXML. Measure pitch accuracy, note F-measure, rhythm accuracy, and edits-to-correct. Break down errors by stage.
4. **Ship decision:** is it good enough for students to see, behind a "beta" label? Decide from the numbers in an ADR, with what "good enough" means for a learner, and what a wrong transcription could teach them.

## Publish

- A **demo video** (2–3 minutes): you play, it writes, and you explain one thing it gets wrong and why.
- A **public case study** (a blog post, or a page on your portfolio): the problem, the architecture diagram, the evaluation, the failure analysis, what you'd do next. Write for an engineer at Muse Group. This becomes one of week 30's three case studies.

## Gate

- **w24.demo:** deployed behind a flag; demo video published.
- **w24.report:** the end-to-end evaluation report ≥ 4, published as a case study.

**Cut list:** live (real-time) transcription. Offline after recording is fine and honest. **Never cut:** per-stage error attribution. It's what separates engineering from a demo.
