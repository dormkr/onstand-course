# Week 5: AudioWorklet and the real-time thread

**Block B: Real-time and production · Outline: expand it before you start (see README, "Extending")**

## Why this week exists

UJAM's web-audio posting asks for "real-time processing with AudioWorklets". The tuner currently reads an `AnalyserNode` from the main thread with `requestAnimationFrame`, so React rendering, garbage collection and other UI work all compete with audio capture. Real audio software keeps capture on the audio thread and hands data across with a lock-free structure. This is the most portable idea in audio engineering: the same rules apply in JUCE (week 14).

**Outcomes:** explain the render quantum and why the audio thread must never block or allocate; write an AudioWorkletProcessor; move samples between threads with a single-producer single-consumer (SPSC) ring buffer; decide about SharedArrayBuffer with measurements.

## Read (3 h)

- W3C Web Audio: [the rendering loop](https://webaudio.github.io/web-audio-api/#rendering-loop), and the `AudioWorklet`, `AudioWorkletGlobalScope` and `AudioWorkletProcessor` sections of the [spec](https://webaudio.github.io/web-audio-api/).
- MDN, [Using AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet).
- H. Choi, [Audio Worklet design pattern](https://developer.chrome.com/blog/audio-worklet-design-pattern): the SharedArrayBuffer + ring buffer + worker pattern.
- R. Bencina, [Real-time audio programming 101: time waits for nothing](http://www.rossbencina.com/code/real-time-audio-programming-101-time-waits-for-nothing). This is the rulebook; read it twice.
- P. Adenot, [ringbuf.js](https://github.com/padenot/ringbuf.js): the README, then `src/ringbuf.js` line by line.
- web.dev, [COOP and COEP](https://web.dev/articles/coop-coep); MDN [`crossOriginIsolated`](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated); [caniuse: SharedArrayBuffer](https://caniuse.com/sharedarraybuffer).

## Build in OnStand (7 h)

1. **Processor logic as a plain class.** `src/audio/captureCore.ts` takes a 128-frame input block and writes it into a ring buffer with preallocated storage. It has no Web Audio types, so Vitest can test it. Then a thin `public/worklets/capture.js` registers the processor and calls the core.
2. **SPSC ring buffer over a SharedArrayBuffer**, with `Atomics` for the read and write indices (your week-1 ring buffer is the single-threaded ancestor). Test wrap-around, full and empty states, and that the reader never sees a torn write.
3. **Cross-origin isolation, decided with data.** SharedArrayBuffer needs COOP `same-origin` and COEP `require-corp` (or `credentialless`). Add them to a preview deploy's `public/_headers` and **list what breaks** (Supabase storage images? fonts? Google sign-in pop-ups? OAuth?). Then write **ADR-0004**: SAB with isolation vs `postMessage` of transferable chunks (no isolation needed). Measure both: main-thread time per second, and dropped blocks under a busy UI.
4. **Tuner on the worklet** behind a flag (`?capture=worklet`): the detector reads the latest 4096 samples from the ring buffer instead of `AnalyserNode`. Your week-3 E2E projects must pass in both modes.
5. **No allocation in the processor.** A test calls the core 10,000 times, asserts that the same buffer instances are used throughout, and, under `node --expose-gc`, that the heap grows by less than 1 MB.

## Lab (3 h, no AI)

`labs/w05-spsc/`. **Write the failing tests first**, from the spec, before any implementation. Then write a reference solution outside the repo, then seal hidden tests (README, "Sealing your own"). The spec: an SPSC ring buffer of `Float32` over a given `SharedArrayBuffer`; `push(block)` returns the number written (never blocks); `pop(out)` returns the number read; `availableRead()` and `availableWrite()`. Test it across a real `Worker` (Node `worker_threads`) with 1,000,000 samples and a checksum.

## DSA (2 h)

*Sliding Window*: Best Time to Buy and Sell Stock; Longest Substring Without Repeating Characters; Longest Repeating Character Replacement.

## Retrieval (write your own 10; these 5 are mandatory)

1. What is the render quantum in frames, and how many milliseconds is that at 48 kHz?
2. Name four things you must never do on the audio thread, and why each is dangerous.
3. What do COOP and COEP each do, and why does SharedArrayBuffer require them?
4. In an SPSC ring buffer, which index does each side write, and why does that make it lock-free?
5. What did ADR-0004 decide, and with which numbers?

## Gate (matches the tracker)

- **w05.worklet:** the tuner capture runs on the worklet (behind a flag) with the SPSC ring buffer; unit and E2E tests pass.
- **w05.alloc:** the allocation test passes.
- **w05.adr:** ADR-0004 ≥ 4, with the measurements in it.
- **w05.rec:** "Why the audio thread must never block", no notes, ≥ 4. Follow-ups: (1) what a glitch is, physically, at 128 frames; (2) why a mutex is worse than a missed block.

**Cut list:** the `postMessage` measurement (keep SAB only, and say so in the ADR); DSA problem 3. **Never cut:** the allocation test, the E2E runs in both modes.
