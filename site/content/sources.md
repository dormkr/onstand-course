# Source library

Every primary source the course links, grouped by topic, with the week that uses it. These links were checked on 20 October 2026. If one dies, search for the exact title and replace the link in a commit; don't swap in a summary.

**The rule:** read the source itself. Blog summaries of the YIN paper aren't the YIN paper.

---

## Specifications

| Source | Weeks |
|---|---|
| W3C, [Web Audio API](https://www.w3.org/TR/webaudio/) (editor's draft: [webaudio.github.io/web-audio-api](https://webaudio.github.io/web-audio-api/)), especially [AnalyserNode](https://webaudio.github.io/web-audio-api/#AnalyserNode), [the rendering loop](https://webaudio.github.io/web-audio-api/#rendering-loop) and [`start()`](https://webaudio.github.io/web-audio-api/#dom-audioscheduledsourcenode-start) | 3, 5, 6 |
| W3C, [Web MIDI API](https://www.w3.org/TR/webmidi/) (editor's draft: [webaudio.github.io/web-midi-api](https://webaudio.github.io/web-midi-api/)) | 18 |
| W3C, [Media Capture and Streams](https://www.w3.org/TR/mediacapture-streams/) (`getUserMedia`, constraints) | 3, 5 |
| W3C, [Audio EQ Cookbook](https://www.w3.org/TR/audio-eq-cookbook/) (Robert Bristow-Johnson's biquads) | 15 |
| W3C, [MusicXML 4.0](https://www.w3.org/2021/06/musicxml40/) and its [tutorial](https://www.w3.org/2021/06/musicxml40/tutorial/); source repo [w3c/musicxml](https://github.com/w3c/musicxml) | 19, 22–24 |
| MIDI Association, [Standard MIDI Files specification](https://midi.org/standard-midi-files-specification) (free account required); readable summary: [CCRMA MIDI file format](https://ccrma.stanford.edu/~craig/14q/midifile/MidiFileFormat.html) | 18 |
| WAVE format: [McGill MMSP, WAVE file format](http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html) | 3 |

## Papers and theses

| Source | Weeks |
|---|---|
| A. de Cheveigné & H. Kawahara (2002), *YIN, a fundamental frequency estimator for speech and music*, JASA 111(4). [Author's PDF](http://recherche.ircam.fr/equipes/pcm/cheveign/ps/2002_JASA_YIN_proof.pdf) | 4 |
| P. McLeod (2008), *Fast, Accurate Pitch Detection Tools for Music Analysis*, PhD thesis, Otago: the MPM/NSDF that OnStand's tuner uses, plus Tartini, a pitch tool for music students. [PDF](https://www.cs.otago.ac.nz/research/publications/oucs-2008-03.pdf) | 1, 4 |
| M. Mauch & S. Dixon (2014), *pYIN: a fundamental frequency estimator using probabilistic threshold distributions*, ICASSP. [PDF](https://www.eecs.qmul.ac.uk/~simond/pub/2014/MauchDixon-PYIN-ICASSP2014.pdf) | 20 |
| J. P. Bello et al. (2005), *A Tutorial on Onset Detection in Music Signals*, IEEE TSAP 13(5). [IEEE](https://ieeexplore.ieee.org/document/1495485) (if you lack access, search the title for the authors' PDF) | 10 |
| D. P. W. Ellis (2007), *Beat Tracking by Dynamic Programming*, JNMR 36(1). [PDF](https://www.ee.columbia.edu/~dpwe/pubs/Ellis07-beattrack.pdf) | 21 |
| R. M. Bittner et al. (2022), *A Lightweight Instrument-Agnostic Model for Polyphonic Note Transcription and Multipitch Estimation* (basic-pitch), ICASSP. [arXiv](https://arxiv.org/abs/2203.09893) | 20, 24 |
| E. Nakamura, K. Yoshii, S. Sagayama (2017), *Rhythm Transcription of Polyphonic Piano Music Based on Merged-Output HMM for Multiple Voices*. [arXiv](https://arxiv.org/abs/1701.08343) | 23 |
| A. T. Cemgil, P. Desain, B. Kappen (2000), *Rhythm Quantization for Transcription*, Computer Music Journal 24(2). Search the title; the authors' copies circulate | 23 |
| E. Brynjolfsson, B. Chandar, R. Chen (2025), *Canaries in the Coal Mine?*, Stanford Digital Economy Lab. [Page](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/) | 0 |

## Textbooks (free online)

| Source | Weeks |
|---|---|
| M. Müller, *Fundamentals of Music Processing*, as notebooks (FMP): [overview](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C0/C0.html), [DFT/FFT](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C2/C2_DFT-FFT.html), [F0 tracking](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C8/C8S2_FundFreqTracking.html), [onset detection](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C6/C6S1_OnsetDetection.html), [beat tracking](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C6/C6S3_BeatTracking.html), [chords/C5](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C5/C5.html), [alignment/C3](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C3/C3.html) | 3, 4, 10, 20, 21 |
| J. O. Smith III, [Mathematics of the DFT](https://ccrma.stanford.edu/~jos/mdft/) (e.g. [the DFT derived](https://ccrma.stanford.edu/~jos/mdft/DFT_Derived.html), [sampling theory](https://ccrma.stanford.edu/~jos/mdft/Sampling_Theory.html)) and [Spectral Audio Signal Processing](https://ccrma.stanford.edu/~jos/st/) | 3, 4, 15 |
| S. W. Smith, [The Scientist and Engineer's Guide to DSP](https://www.dspguide.com/pdfbook.htm): [ch. 2](https://www.dspguide.com/ch2.htm), [3](https://www.dspguide.com/ch3.htm), [8](https://www.dspguide.com/ch8.htm), [12](https://www.dspguide.com/ch12.htm) | 3, 15 |
| [JavaScript.info](https://javascript.info/) | F1–F2 |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | F3 |
| [Pro Git](https://git-scm.com/book/en/v2) | F4, 2 |
| [learncpp.com](https://learncpp.com/) | 12 |

## Engineering essays and guides

| Source | Weeks |
|---|---|
| C. Wilson, [A Tale of Two Clocks](https://web.dev/articles/audio-scheduling) (Web Audio scheduling) | 2, 6 |
| R. Bencina, [Real-time audio programming 101: time waits for nothing](http://www.rossbencina.com/code/real-time-audio-programming-101-time-waits-for-nothing) | 5, 12 |
| T. Doumler, [Using locks in real-time audio processing, safely](https://timur.audio/using-locks-in-real-time-audio-processing-safely) | 12 |
| P. Adenot, [Web Audio API performance and debugging notes](https://padenot.github.io/web-audio-perf/) | 5, 8 |
| H. Choi, [Audio Worklet design pattern](https://developer.chrome.com/blog/audio-worklet-design-pattern) | 5 |
| MDN, [Using AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet); [COOP/COEP (web.dev)](https://web.dev/articles/coop-coep); [`crossOriginIsolated`](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated) | 5 |
| M. Fowler, [Eradicating Non-Determinism in Tests](https://martinfowler.com/articles/nonDeterminism.html); [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) | 1 |
| M. Feathers, [Characterization Testing](https://michaelfeathers.silvrback.com/characterization-testing) | 1 |
| Google, [Engineering Practices: code review](https://google.github.io/eng-practices/review/developer/), [small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), [the reviewer's guide](https://google.github.io/eng-practices/review/reviewer/) | 1, 2 |
| M. O'Neill, [Efficiently Generating a Number in a Range](https://www.pcg-random.org/posts/bounded-rands.html) | 1 |
| M. Nygard, [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions); [adr.github.io](https://adr.github.io/) | 1+ |
| Google SRE Book, [Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) | 2, 7 |
| web.dev, [Web Vitals](https://web.dev/articles/vitals); Chrome DevTools, [Performance panel](https://developer.chrome.com/docs/devtools/performance) | 8 |

## Tools and their documentation

| Source | Weeks |
|---|---|
| [Vitest guide](https://vitest.dev/guide/), [mocking timers](https://vitest.dev/guide/mocking/timers), [`vi` API](https://vitest.dev/api/vi.html) | 1+ |
| Playwright: [configuration](https://playwright.dev/docs/test-configuration), [web server](https://playwright.dev/docs/test-webserver), [CI](https://playwright.dev/docs/ci-intro), [browser launch options](https://playwright.dev/docs/api/class-browsertype); WebRTC project, [testing with fake media](https://webrtc.github.io/webrtc-org/testing/); [Chromium switches list](https://peter.sh/experiments/chromium-command-line-switches/) | 3 |
| GitHub Actions: [quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart), [workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions); [oven-sh/setup-bun](https://github.com/oven-sh/setup-bun); [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [branch protection API](https://docs.github.com/en/rest/branches/branch-protection); [secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) | 2 |
| git, [gitignore](https://git-scm.com/docs/gitignore), [git rm](https://git-scm.com/docs/git-rm) | 2 |
| Vite, [env variables and modes](https://vite.dev/guide/env-and-mode); Supabase, [API keys](https://supabase.com/docs/guides/api/api-keys) | 2 |
| Sentry, [React](https://docs.sentry.io/platforms/javascript/guides/react/) and [source maps](https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps/); [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/); [Plausible docs](https://plausible.io/docs) | 7, 31 |
| [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) | 8 |
| Cloudflare Pages, [headers](https://developers.cloudflare.com/pages/configuration/headers/) | 0, 5 |
| [Emscripten](https://emscripten.org/docs/getting_started/index.html) | 13 |
| JUCE: [repository](https://github.com/juce-framework/JUCE), [tutorials](https://juce.com/learn/tutorials/), [CMake API](https://github.com/juce-framework/JUCE/blob/master/docs/CMake%20API.md); [Pamplejuce](https://github.com/sudara/pamplejuce) (JUCE + CMake + CI template); [pluginval](https://github.com/Tracktion/pluginval); [Catch2](https://github.com/catchorg/Catch2) | 12, 14 |
| [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/); [basic-pitch-ts](https://github.com/spotify/basic-pitch-ts) | 20 |
| [mir_eval](https://craffel.github.io/mir_eval/) ([melody metrics](https://craffel.github.io/mir_eval/#module-mir_eval.melody), [repo](https://github.com/craffel/mir_eval)) | 4, 10, 20–24 |
| [Anki: importing text files](https://docs.ankiweb.net/importing/text-files.html#file-headers) | all |

## Open-source code to read (exact files)

| Source | Weeks |
|---|---|
| aubio: [`src/pitch/pitchyin.c`](https://github.com/aubio/aubio/blob/master/src/pitch/pitchyin.c), [`pitchyinfft.c`](https://github.com/aubio/aubio/blob/master/src/pitch/pitchyinfft.c), [`pitchmcomb.c`](https://github.com/aubio/aubio/blob/master/src/pitch/pitchmcomb.c), [`src/onset/onset.c`](https://github.com/aubio/aubio/blob/master/src/onset/onset.c), [`src/spectral/specdesc.c`](https://github.com/aubio/aubio/blob/master/src/spectral/specdesc.c) | 4, 10 |
| pitchy (a JS MPM): [`index.js`](https://github.com/ianprime0509/pitchy/blob/main/index.js); pitchfinder (YIN, AMDF and more in JS): [repo](https://github.com/peterkhayes/pitchfinder) | 4 |
| Tone.js: [`Tone/core/clock/`](https://github.com/Tonejs/Tone.js/tree/dev/Tone/core/clock), especially [`Clock.ts`](https://github.com/Tonejs/Tone.js/blob/dev/Tone/core/clock/Clock.ts), [`TickSource.ts`](https://github.com/Tonejs/Tone.js/blob/dev/Tone/core/clock/TickSource.ts), [`Ticker.ts`](https://github.com/Tonejs/Tone.js/blob/dev/Tone/core/clock/Ticker.ts) | 6, 16 |
| padenot, [ringbuf.js](https://github.com/padenot/ringbuf.js) (wait-free SPSC ring buffer for AudioWorklet) | 5 |
| Google Chrome Labs, [web-audio-samples](https://github.com/GoogleChromeLabs/web-audio-samples) ([live](https://googlechromelabs.github.io/web-audio-samples/)) | 5 |
| MuseScore: [`importmidi_quant.cpp`](https://github.com/musescore/MuseScore/blob/master/src/importexport/midi/internal/midiimport/importmidi_quant.cpp) and [the whole MIDI import folder](https://github.com/musescore/MuseScore/tree/master/src/importexport/midi/internal/midiimport); [developers' handbook](https://musescore.org/en/handbook/developers-handbook); [CONTRIBUTING](https://github.com/musescore/MuseScore/blob/master/CONTRIBUTING.md) | 22, 25 |
| [Strudel](https://codeberg.org/uzu/strudel) (live-coding music in the browser), [webmidi.js](https://github.com/djipco/webmidi), [Meyda](https://github.com/meyda/meyda), [essentia.js](https://github.com/MTG/essentia.js), [OpenSheetMusicDisplay](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay), [VexFlow](https://github.com/0xfe/vexflow), [Audacity](https://github.com/audacity/audacity), [Surge XT](https://github.com/surge-synthesizer/surge), [madmom](https://github.com/CPJKU/madmom) | 16, 19, 25 |

## Data

| Source | Weeks |
|---|---|
| [NSynth](https://magenta.tensorflow.org/datasets/nsynth) (labelled single notes, includes flute; [test split](http://download.magenta.tensorflow.org/datasets/nsynth/nsynth-test.jsonwav.tar.gz)) | 4 |
| [mirdata](https://github.com/mir-dataset-loaders/mirdata) (loaders and download links for most MIR datasets); [MedleyDB](https://github.com/marl/medleydb) | 10, 20, 21 |
| **Your own recordings.** You're a flutist. A labelled set of your own playing (pitches, onsets, beats) is the most relevant data in this course. Start collecting it in week 4. | 4+ |

## Hiring evidence

| Source | Used in |
|---|---|
| Yousician, [C++ Audio Engineer](https://jobs.trueventures.com/companies/yousician-2/jobs/62837949-c-audio-engineer) | Direction call, weeks 1, 12 |
| [Muse Group vacancies](https://www.mu.se/vacancies) and [press release](https://www.mu.se/posts/next-chapter-francisco-partners-conclusion) | Direction call, weeks 19, 25, 35 |
| UJAM, [Senior Web Engineer – Web Audio & Online DAWs](https://ujam.jobs.personio.de/job/2527951) | Direction call, weeks 5, 13 |
| Zoom, [Audio Software Engineer](https://careers.zoom.us/jobs/audio-software-engineer-san-jose-california-united-states-1b8fd37b-45db-420a-92e7-f67613119373) | Direction call |
| [Tech Interview Handbook](https://www.techinterviewhandbook.org/coding-interview-prep/); [NeetCode roadmap](https://neetcode.io/roadmap); mock interviews: [interviewing.io](https://www.interviewing.io/), [Pramp](https://www.pramp.com/) | 1+, 11, 28–33 |
| Communities where audio developers are: [JUCE forum](https://forum.juce.com/), [The Audio Programmer](https://www.youtube.com/@TheAudioProgrammer), [ADC (Audio Developer Conference)](https://adc.io/), [ISMIR](https://ismir.net/), [DAFx](https://www.dafx.de/) | 11, 17, 29 (mock interviewers and referrals) |
