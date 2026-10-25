# Week 18: MIDI: the protocol and the file format

**Block D: Music data, notation and quantization · Outline**

**AI policy changes from this week** ([Rules §2](#/rules)): in labs, AI is allowed *after* your own first version, and declared. Gates, DSA and mock prep stay AI-free.

## Why this week exists

MIDI is how music software talks about notes: rhythm quantization (weeks 22–23) operates on MIDI-like note events, MuseScore imports MIDI through the code you'll read in week 22, and a MIDI keyboard is the cleanest input for testing transcription without the noise of audio. Parsing a binary format by hand is also a classic take-home exercise.

**Outcomes:** read the Standard MIDI File format (chunks, variable-length quantities, running status, meta events); build a tempo map from SMF events (your week-6 `TempoMap`); receive live MIDI in the browser.

## Read (3 h)

- MIDI Association, [Standard MIDI Files specification](https://midi.org/standard-midi-files-specification) (free account), or the readable [CCRMA summary](https://ccrma.stanford.edu/~craig/14q/midifile/MidiFileFormat.html): header, track chunks, delta times, VLQ, running status, the meta events for tempo (`FF 51`), time signature (`FF 58`) and key signature (`FF 59`).
- W3C, [Web MIDI API](https://www.w3.org/TR/webmidi/): `requestMIDIAccess`, `MIDIInput`, `onmidimessage`, timestamps. Check browser support on [caniuse](https://caniuse.com/midi) and plan for browsers without it.
- [webmidi.js](https://github.com/djipco/webmidi): the README and how it normalises messages.

## Lab (4 h)

`labs/w18-smf/`: tests first. `parseSmf(bytes)` → `{ format, ticksPerQuarter, tracks: Event[][] }`, with VLQ decoding, running status, note on/off (velocity 0 as note off), and tempo, time-signature and end-of-track meta events. Then `toNotes(smf)` → `{ pitch, startSec, durSec, velocity }[]`, using your `TempoMap`. Corpus: export 5 short files from MuseScore (with a tempo change, a time-signature change, overlapping notes and a pickup bar), and check them against MuseScore's own display.

## Build in OnStand (5 h)

1. A MIDI input mode behind a flag: notes from a connected keyboard (or a virtual MIDI port on your laptop) are recorded with their timestamps.
2. "Upload a MIDI file" for a piece: parse it and show the note list and tempo map (no notation yet; that's week 19).

## DSA (2 h)

*Tries*: Implement Trie; Design Add and Search Words Data Structure.

## Gate

- **w18.smf:** the parser passes visible and hidden tests on the corpus.
- **w18.webmidi:** live MIDI input works behind a flag, with a recorded demo.
