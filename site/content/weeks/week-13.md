# Week 13: WebAssembly in the AudioWorklet

**Block C · Outline**

## Why this week exists

This is where your two halves meet: C++ DSP running inside the browser's audio thread. It's how serious web audio products (online DAWs, browser plugins, notation playback engines) ship heavy processing, and it's the most distinctive line you can put on a web-audio CV.

**Outcomes:** compile C++ to WebAssembly with Emscripten; load a WASM module into an AudioWorklet (where `fetch` isn't available); pass audio through WASM linear memory without per-block allocation; benchmark JS against WASM honestly, and decide.

## Read (3 h)

- [Emscripten getting started](https://emscripten.org/docs/getting_started/index.html) and [Compiling to WebAssembly](https://emscripten.org/docs/compiling/WebAssembly.html).
- Chrome, [Enter Audio Worklet](https://developer.chrome.com/blog/audio-worklet) and the [design pattern article](https://developer.chrome.com/blog/audio-worklet-design-pattern) (the WASM sections).
- Google Chrome Labs, [web-audio-samples](https://github.com/GoogleChromeLabs/web-audio-samples): find the AudioWorklet + WebAssembly examples and read their source.

## Build in OnStand (7 h)

1. Build `onstand-dsp`'s YIN-FFT (or the whole detector) to WASM in CI (Emscripten in a GitHub Actions job), publishing the `.wasm` as a build artifact that OnStand's build consumes. Decide how (a git submodule, a release download, or committing the artifact) in an ADR.
2. Load it in the worklet: compile the module on the main thread and pass it through `processorOptions` or the port. Allocate input and output buffers in WASM memory **once**.
3. Behind a flag (`?detector=wasm`), run detection in the worklet. Week 3's E2E tests must pass with the flag on.
4. **Benchmark** JS MPM, JS YIN-FFT and WASM YIN-FFT, per frame, on your laptop *and your phone* (remote debugging), with the week-4 harness's rigour: warm-up, median and p95, the same corpus.
5. **ADR-0006:** ship WASM or not. Consider the speedup on a phone, bundle size, build complexity, debuggability, and who maintains the C++.

## Lab (no AI)

From a blank file: a tiny C function `float rms(const float* x, int n)`, exported through Emscripten without any glue framework, called from a Node test via `WebAssembly.instantiate` with manual memory management (write into `HEAPF32`, call, read back). Understand exactly what Emscripten's glue normally hides.

## DSA (2 h)

*Trees*: Binary Tree Level Order Traversal; Validate Binary Search Tree; Kth Smallest Element in a BST.

## Gate

- **w13.wasm:** WASM detection runs in the worklet behind a flag; E2E passes.
- **w13.bench:** a JS vs WASM report ≥ 4, and ADR-0006 ≥ 4.

**Cut list:** the phone measurement (report laptop only, and say so). **Never cut:** the ADR. "We used WASM because it's cool" is the answer interviewers are listening for so they can mark you down.
