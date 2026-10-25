# Week 12: C++ for audio developers

**Block C: Systems and native · Outline**

## Why this week exists

Yousician's audio role develops "audio processing and DSP utilities" in modern C++ and asks for "some knowledge of audio signal processing and real-time programming" ([posting](https://jobs.trueventures.com/companies/yousician-2/jobs/62837949-c-audio-engineer)); Muse Group's Audacity role is C++; JUCE is C++. Even if your first job is web-focused, C++ makes you credible on the real-time thread, and it's the language of weeks 13–14.

**Setup (Windows):** use [WSL2 with Ubuntu](https://learn.microsoft.com/en-us/windows/wsl/install), clang, CMake and Catch2. The sanitizers (ASan, TSan) work best there; MSVC has no ThreadSanitizer.

**Outcomes:** write modern C++ (RAII, value semantics, `std::vector`, `std::span`, move semantics, `std::atomic`); build with CMake; test with Catch2; run ASan and TSan; explain why audio code avoids allocation, locks and system calls.

## Read (4 h)

- [learncpp.com](https://learncpp.com/): chapters on references and pointers, classes, [move semantics and smart pointers](https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-move-semantics/), and `std::vector`. Skim what transfers from TypeScript; slow down on lifetimes.
- T. Doumler, [Using locks in real-time audio processing, safely](https://timur.audio/using-locks-in-real-time-audio-processing-safely).
- Re-read R. Bencina, [Real-time audio programming 101](http://www.rossbencina.com/code/real-time-audio-programming-101-time-waits-for-nothing), this time as a C++ programmer.
- clang, [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) and [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html): the introductions and usage.
- [Catch2](https://github.com/catchorg/Catch2): the tutorial.

## Build (a new repo, `onstand-dsp`, public)

1. A CMake project with a library target and a Catch2 test target; GitHub Actions running the tests under ASan, then under TSan.
2. Port your **ring buffer** (week 1) and **SPSC ring buffer** (week 5) to C++ (`std::atomic<size_t>` indices, the correct memory orders: explain `acquire` and `release` in comments).
3. Port **YIN** (week 4) to C++, with your TypeScript tests translated, and results that agree with the TypeScript version within 0.01 cents on the week-4 clean corpus (export the corpus as WAV files with your week-3 encoder).

## Lab (no AI)

Write the SPSC ring buffer in C++ from a blank file, tests first: a producer thread and a consumer thread exchange 10 million samples with a checksum, TSan clean.

## DSA (2 h)

Trees, continued: Same Tree; Subtree of Another Tree; Lowest Common Ancestor of a BST. Solve **one** of them in C++.

## Gate

- **w12.spsc:** the SPSC ring buffer passes tests under ASan and TSan in CI.
- **w12.rec:** "RAII, ownership, and why no allocation on the audio thread", no notes, ≥ 4. Follow-up: what does `std::memory_order_release` on the write index guarantee to the consumer?

**Cut list:** the YIN port (move it to week 13, which needs it). **Never cut:** the sanitizers in CI.
