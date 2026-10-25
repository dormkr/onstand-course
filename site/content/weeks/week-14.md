# Week 14: JUCE: a native tuner plugin

**25–31 January 2027 · Block C · Outline**

## Why this week exists

JUCE is the standard framework for audio plugins and many desktop audio apps; Yousician, Serato-type and DAW companies expect familiarity, and many audio job posts list it by name. A tuner plugin, a standalone app plus VST3, built from your own C++ YIN, is a concrete and verifiable native-audio artefact.

**Outcomes:** structure a JUCE `AudioProcessor` and `AudioProcessorEditor`; respect the audio-thread rules in `processBlock`; pass data to the UI thread safely; build with CMake in CI; validate with pluginval.

## Read (3 h)

- [JUCE tutorials](https://juce.com/learn/tutorials/): "Create a basic Audio/MIDI plugin" ([part 1](https://juce.com/tutorials/tutorial_create_projucer_basic_plugin/)) and the processor/editor tutorials that follow. Use CMake instead of the Projucer.
- JUCE, [CMake API](https://github.com/juce-framework/JUCE/blob/master/docs/CMake%20API.md).
- [Pamplejuce](https://github.com/sudara/pamplejuce): the README, and how its CI is organised.
- [pluginval](https://github.com/Tracktion/pluginval): what it tests at each strictness level.

## Build (in `onstand-dsp`, or a new `onstand-tuner-plugin` repo)

1. A JUCE plugin (VST3 + standalone; AU too if you have access to a Mac) that analyses its input with your C++ YIN in `processBlock`, using a preallocated ring buffer, no locks and no allocation.
2. A UI (the editor) reading the latest pitch through a lock-free single value (`std::atomic<float>`) on a timer: note, cents and a meter. Keep it simple.
3. CMake + GitHub Actions builds on at least two operating systems; pluginval at **strictness 5** in CI.
4. A screen recording of it running in a free host (the standalone build is enough; a DAW is better).

## Lab (no AI)

From a blank file: a `processBlock`-style function that applies a gain ramp without zipper noise (linear interpolation from the previous gain to the new one across the block), with Catch2 tests for block boundaries and denormal safety.

## DSA (2 h)

*Heap / Priority Queue*: Kth Largest Element in a Stream; Last Stone Weight; K Closest Points to Origin.

## Gate

- **w14.plugin:** pluginval strictness 5 passes; recording published.
- **w14.ci:** CMake builds in GitHub Actions on two OSes.

**Cut list:** the second OS (keep one). **Never cut:** pluginval.
