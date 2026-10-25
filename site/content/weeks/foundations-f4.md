# Foundations F4: Git, testing, and the re-take

**Block F: Foundations (Band A) · The exit from Foundations**

## Why this week exists

From Week 1 on, every change you make goes through a branch, tests and a pull request. You need the terminal-level version of git (not a GUI's buttons), because when something goes wrong you need to know what's actually happening. And you need to write tests, not just run them. Then the re-take: the same kind of questions as your F1 baseline, but fresh ones, so you can see what four weeks changed.

**By Sunday you can:** branch, commit, merge and resolve a conflict in the terminal; read `git log` and `git diff`; write your own Vitest tests, including a timezone test; and show your progress in numbers.

## Time budget (15 h)

| Block | Hours |
|---|---|
| Read (Pro Git, Vitest) | 3 |
| Git practice | 3 |
| Testing `dates.ts` | 3 |
| Re-take | 2 |
| DSA | 3 |
| Retrieval, Anki | 1 |

## 1. Read

- [Pro Git](https://git-scm.com/book/en/v2): chapter 2 (**Git Basics**: all of it) and chapter 3.1–3.2 (**Branches in a Nutshell**, **Basic Branching and Merging**).
- [Vitest: Getting Started](https://vitest.dev/guide/), then re-read the [mocking timers](https://vitest.dev/guide/mocking/timers) page from F2.

## 2. Git in the terminal (3 h)

In a scratch repository (`git init` in a new folder, *not* OnStand):

1. Make three commits on `main`. Then make a branch, change line 3 of a file there, commit, switch back to `main`, change the *same line* differently, commit.
2. Merge the branch into `main`. Read the conflict markers, resolve the conflict by hand, commit the merge.
3. Use `git log --oneline --graph --all`, `git diff`, `git show <hash>`, `git restore`, and `git switch` at least once each, and write one sentence on what each did.
4. Paste the final `git log --oneline --graph --all` into your build log. That's the evidence.

## 3. Test `dates.ts` (3 h)

Copy OnStand's `src/lib/dates.ts` into `foundations/dates.ts`, and write **at least 10 tests** in `foundations/dates.test.ts` (run them with `npx vitest run foundations`):

- `localDay` on a normal date, on the 1st of a month, and on 31 December.
- `parseLocalDay` round-trips with `localDay`.
- `addDays` across a month end, a year end, and a leap day.
- **A timezone test:** set `process.env.TZ = "America/Sao_Paulo"` (or another zone) inside the test, check that `parseLocalDay("2026-10-01")` still gives the 1st, and restore TZ afterwards. Why does this function exist? Read its comment and the week-1 diagnostic's E1 hint.

One test must fail first: write it before you understand the function's edge cases, see it go red, then understand why. Note it in the file.

## 4. The re-take (2 h, Saturday or Sunday)

```sh
git status                       # must be clean
npm run unseal f4-retake         # writes the questions and the visible tests
```

Then follow `f4-retake/QUESTIONS.md`: B′ (40 minutes) and E′ (50 minutes), under the diagnostic's rules. Commit your answers *before* `npm run unseal f4-retake-key`. Score yourself, and write the comparison with your F1 baseline in the build log: B′ vs B, E′ vs E, and what changed.

## 5. DSA (3 h)

*Linked List*: Reverse Linked List; Merge Two Sorted Lists. *Trees*: Maximum Depth of Binary Tree.

## 6. Retrieval questions (Sunday, closed book)

1. What's the difference between the working tree, the staging area (index) and a commit?
2. What does `git switch -c name` do?
3. What do the `<<<<<<<`, `=======` and `>>>>>>>` markers mean in a conflict?
4. What's the difference between `git restore file` and `git restore --staged file`?
5. Why is `new Date("2026-10-01")` dangerous for a "calendar day", but `new Date(2026, 9, 1)` isn't?
6. What makes a test "deterministic"?
7. What does `expect(x).toBe(y)` compare, and when do you need `toEqual`?

## 7. Anki

Import `content/anki/foundations-f4.tsv` ([download](content/anki/foundations-f4.tsv)).

## 8. The gate: the exit from Foundations

| Item | Pass criterion | Evidence |
|---|---|---|
| **f4.git** Git | Conflict made and resolved in the terminal; the graph log in the build log | Build-log commit |
| **f4.dates** Tests | ≥ 10 passing tests for `dates.ts`, including the timezone test | Commit hash |
| **f4.retake** Re-take | **B′ + E′ ≥ 24 / 40**, compared with the F1 baseline in the build log | Commit of answers + log entry |

**If the re-take is below 24:** you don't start Week 1 yet. Repeat F3–F4 with new exercises (new NeetCode easies, new predict-then-run material from JavaScript.info chapters 7–9), shift `startDate` by two weeks in a `replan:` commit, and re-take with fresh questions you write for a friend to check. This is the rule from the [Foundations overview](#/foundations), and it's there so Week 1 doesn't bury you.

**Cut list:** the third DSA problem. **Never cut:** the re-take, the timezone test.
