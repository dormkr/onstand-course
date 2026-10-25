# Week 6: Clocks, latency and jitter: the metronome measured

**Block B · Outline**

## Why this week exists

A metronome that's 20 ms off is worse than no metronome: it trains you wrong. OnStand's scheduler follows the "Tale of Two Clocks" pattern, but nobody has *measured* it. Timing correctness is a core skill for audio engineers, and "how would you test that a metronome is accurate?" is a natural interview question for any music company. This week you answer it with data, and compare OnStand's design with Tone.js, the most widely used web music framework.

**Outcomes:** render audio faster than real time with `OfflineAudioContext` and assert sample-exact timing; measure output and round-trip latency on real devices; read and explain Tone.js's clock architecture.

## Read (3 h)

- MDN, [OfflineAudioContext](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext); [`outputLatency`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency); [`currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/currentTime).
- W3C Web Audio, [`AudioScheduledSourceNode.start()`](https://webaudio.github.io/web-audio-api/#dom-audioscheduledsourcenode-start): what happens to times in the past.
- Tone.js source: [`Clock.ts`](https://github.com/Tonejs/Tone.js/blob/dev/Tone/core/clock/Clock.ts), [`TickSource.ts`](https://github.com/Tonejs/Tone.js/blob/dev/Tone/core/clock/TickSource.ts), [`Ticker.ts`](https://github.com/Tonejs/Tone.js/blob/dev/Tone/core/clock/Ticker.ts). How does Tone avoid `setTimeout` throttling? (Look for the worker.)
- Re-read [A Tale of Two Clocks](https://web.dev/articles/audio-scheduling).

## Build in OnStand (7 h)

1. **Refactor for testability.** Extract the scheduling loop so it can schedule into any `BaseAudioContext`, including an `OfflineAudioContext`. Keep behaviour identical (characterization tests first, as in week 1).
2. **Offline timing test (Playwright, in a real browser):** render 60 s of the metronome at 20, 60, 97, 120, 173 and 300 BPM, in 4/4 and 7/8, with each note value. Detect click onsets in the rendered buffer (threshold on the envelope, a simple onset detector). Assert that **p99 |actual − expected| ≤ 1 sample** and that there's no cumulative drift (the last click's error ≈ the first's). If it fails, find the cause (hint: floating-point accumulation in `nextTime += interval`) and fix it, test-first.
3. **Real-device latency:** measure round-trip latency (output → mic) on two devices (your phone and laptop) with a loopback method: play an impulse, record it, and cross-correlate. Report it against `baseLatency` and `outputLatency`. Do the beat lights line up with the sound on Bluetooth headphones?
4. **Tone.js comparison:** a 1–2 page write-up of how Tone schedules (Ticker → Clock → TickSource), what it does about background-tab throttling, and what OnStand should adopt (or deliberately not).

## Lab (3 h, no AI)

`labs/w06-clock/`: write tests first, then the implementation. A `TempoMap` that converts between seconds and ticks for a piecewise-constant tempo (a list of `{tick, bpm}` changes), with `secondsAt(tick)` and `tickAt(seconds)` exact inverses to 1e-9, and O(log n) lookup (binary search over change points). This is the core of every DAW's transport, and you'll reuse it in week 18 (MIDI) and week 22 (quantization).

## DSA (2 h)

Sliding Window, continued: Permutation in String; Minimum Window Substring (hard: give it 45 minutes, then study the solution).

## Gate

- **w06.jitter:** the offline timing test passes for every tempo and meter (p99 ≤ 1 sample, no drift).
- **w06.latency:** a latency report on two real devices, ≥ 4 on the benchmark rubric.
- **w06.tone:** the Tone.js comparison written and committed.

**Cut list:** the 7/8 cases; DSA problem 2. **Never cut:** the drift check.
