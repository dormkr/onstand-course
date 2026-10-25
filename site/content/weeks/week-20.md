# Week 20: From pitch track to notes

**Block D · Outline**

## Why this week exists

A tuner gives a pitch every 33 ms. Notation needs *notes*: a pitch, a start and an end. Turning a jittery pitch track (with vibrato, attacks, breath and slurs) into notes is the "note segmentation" problem, and it's where flute playing gets hard: slurred notes have no amplitude onset. This week you build a classical segmenter **and** run a modern ML transcription model in the browser, then measure both on your own playing. "I evaluated an ML model against a classical baseline on real data" is exactly what audio-ML product teams do.

**Outcomes:** explain pYIN's probabilistic approach and HMM smoothing; segment notes using pitch stability plus your week-10 onsets; run basic-pitch in the browser; evaluate with note-level metrics.

## Read (3 h)

- M. Mauch & S. Dixon (2014), [pYIN](https://www.eecs.qmul.ac.uk/~simond/pub/2014/MauchDixon-PYIN-ICASSP2014.pdf): all of it (it's 5 pages).
- R. M. Bittner et al. (2022), [basic-pitch](https://arxiv.org/abs/2203.09893): sections 1–3 and the evaluation.
- Spotify, [basic-pitch-ts](https://github.com/spotify/basic-pitch-ts): the README and the example.
- mir_eval, [transcription metrics](https://craffel.github.io/mir_eval/#module-mir_eval.transcription): note onset within ±50 ms, pitch within ±50 cents, and optional offset criteria.
- M. Müller, FMP, [chapter 8](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C8/C8.html) (musically informed audio decomposition, F0 tracking).

## Data

Label **note events** (onset, offset, written pitch) for 5 passages of your own playing (about 300 notes): a slurred scale, a tongued scale, an arpeggio with vibrato, an étude excerpt, and a lyrical phrase. Reuse the week-10 onset labels where you can.

## Build in OnStand (7 h)

1. **Classical segmenter** in `src/lib/notes.ts`: median-filter the pitch track; mark "stable" frames (within ±30 ¢ of a running centre for ≥ 60 ms); split at pitch changes of more than 60 ¢ *or* at detected onsets; merge fragments shorter than a minimum duration; assign each note the median pitch of its stable region.
2. **basic-pitch in the browser**, behind a flag, run offline on a recording.
3. **Evaluation script:** note-level precision, recall and F-measure (onset ±50 ms, pitch ±50 ¢) for both, per passage type, on your labelled set. Write the report.

## DSA (2 h)

Graphs, continued: Pacific Atlantic Water Flow; Course Schedule.

## Gate

- **w20.seg:** note-level F-measure for your segmenter on your flute set, report ≥ 4.
- **w20.ml:** basic-pitch evaluated on the same data, with the comparison in the report (where does each fail, and why?).
