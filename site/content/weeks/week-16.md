# Week 16: Open-source PR #1

**8–14 February 2027 · Block C · Outline**

## Why this week exists

A PR merged by maintainers you've never met is evidence nobody can dismiss: it shows you can read a stranger's codebase, follow their conventions, communicate in writing, and take review. For music tech in particular, open source is the hiring pipeline: MuseScore, Audacity, Tone.js, Surge and Strudel contributors get noticed by the companies that use them.

## How to choose (day 1, 3 hours, and don't skip it)

Candidates, from most to least beginner-friendly for your skills (check activity before choosing: a recent merge in the last month, responsive maintainers):

- [Strudel](https://codeberg.org/uzu/strudel) (live-coding music in the browser; TypeScript; on Codeberg)
- [Tone.js](https://github.com/Tonejs/Tone.js/issues) (web audio framework; you read its clock in week 6)
- [webmidi.js](https://github.com/djipco/webmidi/issues) (useful before week 18)
- [Meyda](https://github.com/meyda/meyda/issues) (audio feature extraction in JS)
- [pitchy](https://github.com/ianprime0509/pitchy) (an MPM implementation in JS: you know more about MPM than most people now)
- [OpenSheetMusicDisplay](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/issues) (useful before week 19)

**Process:**

1. Read the project's CONTRIBUTING and code of conduct. Build it and run its tests locally.
2. Pick an issue labelled *good first issue* or *help wanted*, **or** a real bug you can reproduce (your DSP knowledge is an edge: look for numerical bugs, missing tests, wrong docs about audio maths).
3. **Comment first:** "I'd like to work on this. My plan is X. Does that fit?" Wait for a reply (start two candidates in parallel if one is slow).
4. A small, focused PR with tests, following *their* conventions, not yours. Use the self-review template on yourself first.
5. Respond to review within 24 hours, politely and specifically. Expect at least one round.

## Gate

- **w16.pr:** a merged PR URL in a real open-source music project.

If nothing is merged by Sunday because review is slow (common), the gate stays open, and it must close before week 25's PR is attempted. Log it as late, honestly; that isn't the same as failing.

**Also this week:** the DSA thread continues (*Backtracking*: Subsets; Combination Sum; Permutations).
