# Rules

You'll be running this course alone for months. These rules do the job a mentor would have done. They're written in advance, while you're motivated, so the tired version of you doesn't get to renegotiate them.

---

## 1. Time

- **Floor: 15 focused hours a week. Target: 18.** Freelance work, classes and practice come out of the rest of your week, not out of this.
- A **day counts for the streak** if you log at least **45 focused minutes** and one line of what you did. "Read about FFTs" doesn't count; "implemented bit reversal, 3 tests passing" does.
- The streak is a smoke alarm, not the goal. Missing a day is fine. **Three missed days in a row** triggers the check-in in §5.
- A typical week:

| Block | Hours | What |
|---|---|---|
| OnStand production work | 6 | The week's "Build in OnStand" tasks |
| Lab: rebuild from a blank file | 4 | AI-free |
| Reading primary sources | 2.5 | The exact sections linked, no more |
| DSA thread | 2 | 3 problems, timed |
| Retrieval, Anki, recording | 1.5 | Daily Anki takes about 10 minutes |
| Weekly review + build log | 1 | Sunday |

---

## 2. AI policy

Your diagnostic and your git history decide this, not a dislike of AI. Employers in 2026 expect you to use AI well, and they test whether you can work without it. You can only check what an AI wrote if you could have written it.

| Phase | Labs, gates, retrieval, DSA | OnStand production work | Writing (ADRs, incidents, posts) |
|---|---|---|---|
| **Weeks 0–8** | **No AI.** Inline suggestions off. | You write the first version. Then AI may *review* or *explain*. Any line it writes must be declared in the PR, and you must be able to explain it without looking. | You write it. AI may proofread for English only. |
| **Weeks 9–17** | No AI. | As above, plus AI may write tests *after* you've written your own test plan. | Same. |
| **Weeks 18–36** | No AI for gates, DSA or mock prep. Labs: AI allowed after your own first version, declared. | Work like a professional: AI is a tool, every PR declares its use, and the explanation gates still apply. | Same. |

**The honesty log.** `site/log/honesty.md` gets one line every time you use AI on course work: date, what for, and which phase rule allowed it. Breaking the policy isn't the failure; hiding it is. If you break it, log it, and re-do that piece of work without AI before its gate counts.

**Why this is strict:** with AI unrestricted, every gate in this course could be passed by an agent, and you'd finish with a certificate for Claude. The interview will be you, a shared editor and no assistant.

---

## 3. Gates

- Each week ends with a gate: failing tests made to pass, benchmarks against target numbers, rubric scores, and an explanation recorded with no notes. Later in the course, external checks too.
- **A gate item counts only with evidence** in the tracker: a public URL (PR, commit, CI run, video, post) or a commit hash. "I did it" isn't evidence.
- **Hidden tests:** unseal them only after the visible tests pass *and* your attempt is committed (`npm run unseal <name>` refuses to run with uncommitted changes). If hidden tests fail, fix the code, not the tests.
- **No skipping gates.** You may *read* ahead, but you may not *attempt* week N+1's gate until week N's has passed.
- **A week's gate is due Sunday 23:59 EAT** of that week. Dates come from `site/course.json` (`startDate`) and are shown in the tracker.

---

## 4. Public accountability

- **The course repo is public on GitHub** and deployed on Cloudflare Pages. The deployed site shows your committed `progress.json`, so anyone with the link sees your real state.
- **Weekly build log, every Sunday,** in `site/log/BUILD_LOG.md` (template in `templates/weekly-log.md`): what shipped, which gates passed (with links), what slipped and why, the hours logged, next week's single biggest risk. Commit and push it the same day.
- **Once a month,** post a short version publicly where engineers will see it (LinkedIn, X, Mastodon or a dev community). Its purpose is accountability first and visibility second. Hiring managers *do* read these.
- **Export the tracker every Sunday** (Tracker → Export) to `site/progress.json` and commit it with the log. A week without a commit is visible in the history. That's the point.

---

## 5. When you fall behind

"Behind" means a gate is past its deadline. It's measured in **weeks of unpassed gates**, so it's unambiguous.

| Level | Trigger | What you do, in order |
|---|---|---|
| **0: Late** | A gate is past its Sunday deadline. | Next week starts anyway. Drop next week's **stretch** tasks and spend that time finishing the late gate. The DSA thread doesn't pause. |
| **1: Slipping** | Two gates late, *or* three days in a row with no check-in. | Write a public build-log entry within 24 hours: what slipped, the real cause (not "I was busy": *what* took the time), one change. Apply that week's **cut list** (every week has one). |
| **2: Behind** | Three gates late, *or* 10 days without a check-in. | **Stop new content.** Use the next buffer week (9, 17, 26) early, if needed. Write a slip report with the incident template (timeline, root cause, action items), commit it to `site/log/`, and post it publicly. |
| **3: Re-plan** | Four or more gates late, *or* level 2 reached twice. | Re-plan in the open: either **compress** (the cut lists in weeks 12–16 can drop C++/JUCE to outline-only) or **extend** (move `startDate` or `endDate` in `course.json` in a commit whose message starts with `replan:`, with a build-log entry explaining it). Choose within 48 hours. Not choosing is choosing to quit. |

**Never allowed:**
- Changing a deadline without a `replan:` commit and a log entry.
- Marking a gate passed without evidence.
- Rewriting history (`git push --force` on the course repo).
- Lowering a target number. If a benchmark target turns out to be wrong, write an ADR saying why, with data, and *then* change it.

---

## 6. Weekly review (Sunday, 30 minutes)

1. Tracker: which gate items passed, with evidence? Mark them.
2. Hours this week vs the floor.
3. Retrieval quiz score; missed questions become Anki cards.
4. Write the build log (template), export progress, commit, push.
5. Read next week's page fully. Write its single biggest risk in the log.

---

## 7. When you finish the course, or abandon it

Either way, write a final entry: what you can do now that you couldn't in October 2026, with links. If you abandon it, say why, honestly. That entry is worth more to the next version of you than a silent stop.
