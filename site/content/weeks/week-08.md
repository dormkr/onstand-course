# Week 8: Performance: profiling and budgets

**14–20 December 2026 · Block B · Outline**

## Why this week exists

OnStand's Phase 3 snapshot recorded JavaScript chunks of 660 kB (core) and 637 kB (charts). Many of your users are on mid-range Android phones on mobile data in Kenya, where every kilobyte has a cost in time and money. Performance work is measurable, which makes it ideal portfolio material: "initial JS down 45%, LCP from 4.1 s to 2.3 s on a throttled Moto G profile" is a résumé line an interviewer can check.

**Outcomes:** profile load and runtime performance with DevTools; analyse bundles; set budgets that CI enforces; fix React render waste in the tuner.

## Read (2.5 h)

- web.dev, [Web Vitals](https://web.dev/articles/vitals) and [Optimize LCP](https://web.dev/articles/optimize-lcp).
- Chrome DevTools, [Performance panel](https://developer.chrome.com/docs/devtools/performance).
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci): getting started and assertions.
- [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) (Vite uses Rollup).
- React, [`<Profiler>`](https://react.dev/reference/react/Profiler).
- P. Adenot, [Web Audio performance notes](https://padenot.github.io/web-audio-perf/): the sections on main-thread contention.

## Build in OnStand (7 h)

1. **Baseline:** for `/` and `/dashboard`, record initial JS (gzip), LCP, TBT and INP on a throttled mobile profile, three runs each, median. Commit it as `perf/BASELINE.md`.
2. **Bundle:** visualise the build, then split by route (`lazy`), move chart libraries and `framer-motion` out of the initial path where possible, and remove dead dependencies (the Radix packages for components that no longer exist). **Target: initial JS for `/dashboard` down ≥ 40% (gzip).**
3. **Lighthouse CI** on every PR, with budgets (initial JS, LCP) a little above your new numbers, so regressions fail.
4. **Tuner render cost:** the tuner calls `setState` up to 30 times a second. Profile it. Render only what changes visibly (for example, quantise cents to integers before setting state; move the meter's position to a ref and a CSS variable). Measure renders per second and main-thread time before and after.

## Lab (2.5 h, no AI)

`labs/w08-lru/`: tests first. An `LRUCache<K, V>` with O(1) `get` and `set` (a hash map plus a doubly linked list) and a capacity, plus `memoize(fn, {max})` built on it. It's a classic interview problem, and it pairs with the caching work in the PWA.

## DSA (2 h)

Linked List, continued: Reorder List; Remove Nth Node From End; LRU Cache (compare with your lab).

## Gate

- **w08.bundle:** initial JS for `/dashboard` down ≥ 40% (gzip), with before/after in a report ≥ 4.
- **w08.lhci:** Lighthouse CI with budgets runs on every PR.
- **w08.react:** tuner renders per second and main-thread time reduced, measured.

**Cut list:** the INP measurement. **Never cut:** the baseline before any change (without it, nothing is measured).
