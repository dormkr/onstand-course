# Rubrics

These are strict on purpose. The point of a rubric is to stop you giving yourself the benefit of the doubt. Three rules apply to all of them:

1. **Score against the lowest level that's fully true**, not the highest that's partly true.
2. **Disqualifiers cap the score**, whatever else is good.
3. **Write one sentence of evidence for every score** (a timestamp in the video, a line in the PR). A score without evidence counts as 0.

Once a month (weeks 4, 8, 11, 17, 21, 26, 30, 34) send one scored piece to a working engineer and ask for their score. If theirs is more than 1 point below yours on any rubric, you've been grading generously: for the next month, lower every self-score by 1.

---

## Explanation (recordings with no notes)

Used for every "explain it with no notes" gate. Record in one take, at most 5 minutes unless the gate says otherwise. Publish it (unlisted is fine) and link it from the build log.

| Score | Criteria (all must hold) |
|---|---|
| **5** | Covers every must-hit mechanism listed in the gate. Gives the correct *why* for each (the constraint that forces it, not just what the code does). Names at least one limitation or failure case you worked out yourself. Answers the gate's two follow-up questions correctly without stopping. |
| **4** | Every must-hit mechanism is covered correctly; the why is missing or vague for one. |
| **3** | Most mechanisms are correct (all but one or two); the whys are thin. A listener could re-implement it roughly. |
| **2** | Describes *what* happens step by step but not *why*. Or has one significant factual error. |
| **1** | Mostly paraphrases comments or names. Or has two or more factual errors. |
| **0** | Can't explain it, or didn't record. |

**Disqualifiers (cap at 2):** reading from the screen or notes, including the code's comments; pausing the recording mid-explanation; going more than 30 seconds over the time box.
**Pass mark for gates:** 4.

**Follow-up questions.** Each gate lists two. Answer them at the end of the same recording. They exist because explaining something you've rehearsed is easier than answering questions about it.

---

## Pull request

Used on every OnStand PR, together with `templates/pr-self-review.md`.

| Score | Criteria |
|---|---|
| **5** | Every 4-level criterion, plus: the diff does one thing; the "rejected alternative" is real and well argued; the risk section names a rollback; a reviewer could approve it from the description and diff alone. |
| **4** | A failing-then-passing test proves the change. Full suite, type check and CI are green. The self-review questions are answered specifically (no "looks fine"). AI use is declared. No unrelated changes. |
| **3** | Tests pass and the description explains what and why, but the self-review is generic, *or* the diff includes an unrelated change. |
| **2** | No test proves the change, but the change is correct. |
| **1** | It works, but the description is a title only. |
| **0** | Broken, or merged without CI passing. |

**Disqualifiers:** merging your own PR without CI green → 0. AI-written lines you can't explain → the PR doesn't merge until they're rewritten or removed.
**Pass mark:** 4.

---

## Architecture decision record (ADR)

Format: [Michael Nygard's original](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (Context, Decision, Status, Consequences), using `templates/adr.md`. ADRs live in OnStand at `docs/adr/NNNN-title.md`.

| Score | Criteria |
|---|---|
| **5** | Every 4-level criterion, plus: states what evidence would make you reverse the decision. |
| **4** | Context states the forces (constraints, numbers, users) without arguing for the answer. At least two real options are compared on the same criteria. The decision cites evidence (a benchmark, data, a spec section). The consequences include at least one *negative* consequence you accept. |
| **3** | There are two options, but the comparison is uneven, or the evidence is opinion. |
| **2** | Only one option was considered (a justification, not a decision). |
| **0–1** | Missing, or written after the fact to justify what was already built. |

**Pass mark:** 4.

---

## Incident write-up

Blameless format, after [Google SRE, Postmortem Culture](https://sre.google/sre-book/postmortem-culture/), using `templates/incident.md`. They live in OnStand at `docs/incidents/INC-NNNN.md`.

| Score | Criteria |
|---|---|
| **5** | Every 4-level criterion, plus: at least one action item is a *systemic* control that makes the whole class of incident impossible or loud (a CI check, an alert), not only a fix of the instance. |
| **4** | A timeline with timestamps (from git, logs or deploys, not memory). Impact is quantified (users, time window, data). Root cause has been pursued past the first "why" (at least three whys). Detection explains how it was found and how long it went unnoticed. Action items have owners and dates. No blame language. |
| **3** | Root cause is right, but the impact or timeline is vague. |
| **2** | Describes the fix rather than the failure. |
| **0–1** | Missing, or "human error" given as the root cause. |

**Pass mark:** 4.

---

## Benchmark report

Used in weeks 4, 6, 8, 10, 13 and 24.

| Score | Criteria |
|---|---|
| **5** | Every 4-level criterion, plus: a result you didn't expect, explained. |
| **4** | Anyone can reproduce it with one command, from a pinned commit. The data is described (source, size, how it was labelled). The metrics are defined before the results. Results include spread (median and p95, or confidence intervals), not only means. Machine and runtime are stated. The comparison is fair (same inputs and window, warmed up). Conclusions don't go beyond the data. |
| **3** | Reproducible, but the metrics are undefined or the comparison isn't fair. |
| **2** | Numbers without a way to reproduce them. |
| **0–1** | Screenshots of a console. |

**Pass mark:** 4.

---

## Lab code quality

Used in addition to the tests for every "rebuild from a blank file" lab.

| Score | Criteria |
|---|---|
| **2** | Clear names; no dead code or commented-out code; no needless abstraction; complexity stated correctly in a header comment; edge cases handled deliberately (and named in a comment where they aren't obvious). |
| **1** | Works and is readable, but has one of: unclear names, dead code, a wrong complexity claim. |
| **0** | Hard to follow, or passes tests by special-casing their inputs (which also fails the gate). |

---

## Retrieval quiz

Every week has closed-book retrieval questions. Answer them **in writing, before** reading anything, then check against the week's sources.

- **Pass:** ≥ 80% fully correct. A partly-right answer counts as wrong.
- Every question you miss becomes an Anki card (if it isn't one already) and comes back in next week's quiz.
