# Week 23: Rhythm quantization II: probabilistic models

**29 March – 4 April 2027 · Block D · Outline**

## Why this week exists

Grid quantization judges each beat alone. Musicians don't: whether a rhythm is "dotted" or "triplet" depends on the bar's context, the meter and what came before. Hidden Markov models capture that context: hidden states are metrical positions, observations are the onset times you heard, and the Viterbi algorithm finds the most likely rhythm. This is where the state of the art in rhythm transcription lives (Nakamura et al.), and it's the same Viterbi you'd use in speech recognition or pYIN's note tracking.

**Outcomes:** formulate rhythm transcription as an HMM (metrical positions as states, inter-onset intervals as observations); implement Viterbi in log space; learn transition probabilities from scores; compare with the week-22 grid quantizer on the same data.

## Read (4 h)

- E. Nakamura, K. Yoshii, S. Sagayama (2017), [Rhythm Transcription of Polyphonic Piano Music Based on Merged-Output HMM for Multiple Voices](https://arxiv.org/abs/1701.08343): the introduction, the metrical HMM section (the monophonic model is what you build), and the evaluation measures. The merged-output part is optional.
- A. T. Cemgil, P. Desain, B. Kappen (2000), *Rhythm Quantization for Transcription*: the Bayesian formulation (prior over rhythms × likelihood of the performance).
- Re-read the Viterbi section of [pYIN](https://www.eecs.qmul.ac.uk/~simond/pub/2014/MauchDixon-PYIN-ICASSP2014.pdf): the same algorithm.

## Lab (5 h)

`labs/w23-hmm/`: tests first. States: positions within a bar on a fine grid (say 48 per whole note, which covers sixteenths and triplets). Transition probabilities: from counts in a training set of scores. Use your MusicXML corpus plus public-domain flute pieces exported from MuseScore; Laplace-smooth the counts. Observations: inter-onset intervals in beats, Gaussian around the interval implied by the state transition. Viterbi in log space with backtracking. Tests: synthetic performances generated *from* the model are decoded correctly at low noise; triplets vs dotted rhythms resolved by context; numerically stable for 500-note sequences.

## Build in OnStand (4 h)

Add the HMM quantizer as a second option in the week-22 pipeline. Run both on the same 10 performances: rhythm accuracy, plus "edits to correct", the number of note changes a human would need to fix the notation. Where does the HMM win, and where does it lose?

## DSA (2 h)

*2-D Dynamic Programming*: Unique Paths; Longest Common Subsequence. (Then notice that Viterbi is DP over a trellis.)

## Gate

- **w23.hmm:** visible and hidden tests pass.
- **w23.bench:** HMM vs grid on the same performances, report ≥ 4.
