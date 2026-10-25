# Week 19: Notation models: MusicXML and rendering

**1–7 March 2027 · Block D · Outline**

## Why this week exists

Rhythm quantization only matters because notation needs exact note values: "0.48 beats" must become an eighth note, and "1.5 beats across a bar line" must become a tied note. Before you can quantize *for notation*, you need a notation model. Muse Group says it's "embedding practical AI into … notation, audio, transcription" ([press release](https://www.mu.se/posts/next-chapter-francisco-partners-conclusion)). Understanding how scores are represented is the entry ticket to that work.

**Outcomes:** read MusicXML's core elements; design a minimal score model (parts, measures, voices, notes with rational durations, ties, rests); round-trip a subset of MusicXML; render it in the browser.

## Read (3 h)

- W3C, [MusicXML 4.0 tutorial](https://www.w3.org/2021/06/musicxml40/tutorial/) (the "Hello World" and basic notation sections), and the reference for [`<note>`](https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/note/), `<attributes>` (`divisions`, `key`, `time`, `clef`), `<backup>` and `<forward>`.
- [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org/) (renders MusicXML in the browser) and [VexFlow](https://www.vexflow.com/) (the engraving library under it): getting started.
- MuseScore, [developers' handbook](https://musescore.org/en/handbook/developers-handbook): skim the architecture overview to see how a production notation app splits model, layout and rendering.

## Lab (4 h)

`labs/w19-score/`: tests first. A score model with **rational durations** (a `Fraction` type with exact arithmetic: no floats for durations!), `fromMusicXml(xml)` for a subset (single part, multiple voices via `<backup>`, ties, dots, rests, time and key changes), `toMusicXml(score)`, and the round-trip test `toMusicXml(fromMusicXml(x))` ≅ `x` on your corpus. Plus `fillMeasure(notes, timeSig)`: split a duration that crosses a bar line into tied notes.

## Build in OnStand (5 h)

1. A "piece notation" view behind a flag: load MusicXML (exported from MuseScore) for a repertoire piece, render it with OSMD, and highlight the current measure during practice.
2. A Playwright visual test: render a fixed MusicXML file and compare a screenshot within a tolerance.

## DSA (2 h)

*Graphs*: Number of Islands; Clone Graph; Max Area of Island.

## Gate

- **w19.model:** the model round-trips the MusicXML subset; tests pass.
- **w19.render:** rendering in OnStand with a Playwright visual test.
