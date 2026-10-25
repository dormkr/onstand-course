# Week 2: CI, repo hygiene and your first incident

**2–8 November 2026 · Block A: Own the codebase · Gate due Sunday 8 November, 23:59 EAT**

## Why this week exists

Right now, every merge to OnStand's `main` deploys to onstand.app, and **nothing checks anything first**. There are 156 tests that nobody is forced to run, 44 ESLint errors that nobody is stopped by, three lockfiles, a committed `.env`, and a branch GitHub won't let you protect. I checked: `gh api repos/dormkr/On-The-Stand/branches/main/protection` answers *"Upgrade to GitHub Pro or make this repository public to enable this feature."*

Every company you'll apply to runs CI on every pull request. A junior who sets up CI, writes an honest incident report and makes a reasoned call about repo visibility is showing the habits teams hire for: protecting production from yourself. This week you build the safety net that every later week depends on.

**By Sunday you can:**

1. Write a GitHub Actions workflow from scratch and explain every line.
2. Ratchet down technical debt without a big-bang rewrite.
3. Run a blameless incident review: a timeline from evidence, root cause past the first "why", and systemic action items.
4. Make a security call from what's actually exposed, not from fear.
5. Build a deep-equality function and a tiny test runner from a blank file, and so understand what `expect(...).toEqual` and `it(...)` really do.

## Time budget (16.5 h)

| Block | Hours |
|---|---|
| Read | 2.5 |
| Build in OnStand (tasks 2.1–2.6) | 6.5 |
| Lab (deepEqual, runner) | 4 |
| DSA | 2 |
| Retrieval, Anki, recording | 1.5 |

---

## 1. Read (2.5 h)

| # | Source | Read | Why |
|---|---|---|---|
| R1 | GitHub, [Actions quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart), then [Workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions) | Quickstart in full; in the syntax page: `on`, `jobs.<id>.runs-on`, `steps`, `timeout-minutes`, `concurrency`, `env` (40 min) | You write the workflow yourself, and every key in it must be one you've read about. |
| R2 | [oven-sh/setup-bun](https://github.com/oven-sh/setup-bun) | The README (5 min) | OnStand uses Bun, and Cloudflare builds from the Bun lockfile. |
| R3 | git, [gitignore](https://git-scm.com/docs/gitignore) ("Description", "Pattern format", "Notes") and [git rm](https://git-scm.com/docs/git-rm) (`--cached`) | Those sections (20 min) | The two causes of the `.env` incident, straight from the manual. |
| R4 | Vite, [Env variables and modes](https://vite.dev/guide/env-and-mode); Supabase, [API keys](https://supabase.com/docs/guides/api/api-keys) | Vite: the `VITE_` prefix and the security note. Supabase: publishable vs secret keys (20 min) | To judge what the committed `.env` actually exposed. |
| R5 | GitHub, [About secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) | All (10 min) | What push protection can and can't catch. |
| R6 | Google SRE Book, [Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) | All (25 min) | The standard your incident write-up is graded against. |
| R7 | Chris Wilson, [A Tale of Two Clocks](https://web.dev/articles/audio-scheduling) | All (30 min) | This week's recording is the metronome scheduler, and this article is where its design comes from. |

---

## 2. Build in OnStand (6.5 h)

Same rules as week 1: one branch and one PR per task, the self-review template, no direct pushes to `main`.

### Task 2.1: One package manager, one lockfile (30 min)

OnStand has `bun.lock` (text, current), `bun.lockb` (binary, last changed in the original template commit) and `package-lock.json` (last changed 1 October). CLAUDE.md says Bun is the package manager and Cloudflare builds from the Bun lockfile.

1. Confirm which lockfile Cloudflare actually uses: read the build log of the last production deploy in the Cloudflare dashboard. Don't guess.
2. Delete the stale ones, run `bun install` and check `bun.lock` doesn't change. Add a line to the README saying Bun is the package manager.
3. PR description: which file Cloudflare used, with a link or a screenshot of the build log line.

**Done when:** merged, and the next Cloudflare deploy succeeds.

### Task 2.2: The CI workflow (2 h)

Write `.github/workflows/ci.yml` yourself. No copying a template wholesale. Every line must be explainable. Requirements:

- Runs on `pull_request` and on `push` to `main`.
- One job, `checks`, on `ubuntu-latest`, with `timeout-minutes: 15`, and `concurrency` so a new push cancels the previous run of the same PR.
- Steps: checkout → `oven-sh/setup-bun` (pin the Bun version you use locally; `bun -v` says 1.4.2) → `bun install --frozen-lockfile` → type check (`bunx tsc --noEmit -p tsconfig.app.json`) → lint ratchet (task 2.3) → tests (`bun run test`, the Vitest suite, *not* `bun test`) → build (`bun run build`).
- The build needs the `VITE_SUPABASE_*` values (see task 2.4). Put them in the repository's **Actions variables** (Settings → Secrets and variables → Actions → *Variables*, not *Secrets*: they're publishable) and pass them in through `env:`. Explain in the PR why *variables* is the right choice here.

Then prove it works in both directions:

1. Open a PR with the workflow: it must be **green**.
2. Open a second PR that breaks a test on purpose (for example, change an expected tempo in `metronome.test.ts`). It must go **red**, and the failing test's name must be readable in the Actions log. Screenshot it, link the run, then close that PR without merging.

**Done when:** merged; both run URLs are in the PR description.

### Task 2.3: A lint ratchet (1 h)

You can't fix 44 lint errors in one PR without risking the app, and you can't ignore them either. A **ratchet** lets the count go down and never up.

1. Write `scripts/lint-ratchet.mjs` yourself: run ESLint with the JSON formatter (`npx eslint . -f json`), count errors (not warnings), compare with the number in `.lint-baseline`, then exit 1 if the count went **up**, and print a reminder to lower the baseline if it went **down**.
2. Set `.lint-baseline` to today's count (`npx eslint .` reports `51 problems (44 errors, 7 warnings)`; check again, since this week's merges may change it).
3. Fix **at least 10** errors in a separate PR, and lower the baseline in the same PR. Choose errors in code you understand. Any fix that changes behaviour needs a test.

**Done when:** the ratchet runs in CI, and the baseline is ≤ the original minus 10.

### Task 2.4: INC-0001: `.env` committed (1.5 h)

You found this in the diagnostic (C1). Now handle it as an incident.

1. **Assess the exposure first.** List every variable in `.env` (names only) and classify each as publishable or secret, using R4. Search the *whole history* for anything worse: `git log -p --all -S "service_role"`, `git log -p --all -S "sk_"`, `git log -p --all -- .env`. Better still, run a secret scanner such as [gitleaks](https://github.com/gitleaks/gitleaks) over the history, if you can install it. Record exactly what you searched and what you found.
2. **Decide on rotation**, with reasons. A key that ships in every visitor's JavaScript bundle can't be made secret by rotating it. Write that reasoning down, and check whether anything secret was ever in the file.
3. **Before you remove `.env` from git:** the Cloudflare Pages build reads it today. Add the three `VITE_SUPABASE_*` values to the Cloudflare Pages project's environment variables (Production *and* Preview) first, and confirm a preview deploy builds. **If you skip this step, the merge itself is your second incident.**
4. **Fix:** rewrite the `.gitignore` line as UTF-8 (check with `file .gitignore` or a hex dump, `xxd .gitignore | tail -2`), then `git rm --cached .env`, add a `.env.example` with the variable names and empty values, and add a CI step that fails if any `.env` file other than `.env.example` is tracked. Write that one-line check yourself.
5. **Write `docs/incidents/INC-0001-env-committed.md`** with `templates/incident.md`. Build the timeline from `git log --format='%h %ad %an %s' --date=iso -- .env .gitignore`, from the commit that first added `.env` to the commit that added the broken ignore line. Root cause, three whys deep. Hint: *why* did a UTF-16 line end up in `.gitignore`, and why did nothing notice for months? At least one action item must make this whole class of mistake fail loudly.

**Done when:** merged; a preview and the production deploy both build; INC-0001 scores ≥ 4 on the incident rubric.

### Task 2.5: Protect `main` (ADR-0002) (1 h)

GitHub refuses branch protection on OnStand because it's a private repo on a free plan. That leaves three options. Decide between them with `templates/adr.md` as `docs/adr/0002-protecting-main.md`:

| Option | Think about |
|---|---|
| **A. Make OnStand public** | Employers can read your code, which is a portfolio asset for weeks 30–35. The full history becomes public, so task 2.4's scan must be clean first. Supabase RLS becomes your only defence, which it should be anyway (verify with the security checks in `phase3-snapshot.md`). Can a competitor copy it? |
| **B. GitHub Pro** (paid, monthly) | Costs money every month. Keeps the code private. |
| **C. No protection, discipline only** | Free. Relies on you never pushing to `main` directly at 1 a.m. before a deadline. |

Whatever you choose, enforcement must be **verifiable by a command**, not by memory. For A or B, after enabling *"Require a pull request before merging"* and *"Require status checks to pass"* (with `checks`), this must show the rule:

```sh
gh api repos/dormkr/On-The-Stand/branches/main/protection --jq '.required_status_checks.contexts'
```

If you choose C, the ADR must explain what you'll do instead, and why the risk is acceptable. I'd mark C at most 3 on the rubric, because it's the option that relies on willpower.

**Done when:** the ADR scores ≥ 4, and the command output is in the gate evidence (or the C mitigation is in place).

### Task 2.6: The PR log continues

Add this week's PRs to `docs/pr-log.md`, each scored on the PR rubric.

---

## 3. Lab: rebuild from a blank file (4 h, no AI)

The failing tests are in `labs/w02-runner/`. Run them with `npx vitest run labs/w02`. Visible tests pass → commit → `npm run unseal w02-hidden`.

### Lab 1: `deep-equal.ts` (1.5 h)

Export `deepEqual(a: unknown, b: unknown): boolean`, the core of `toEqual`, but stricter:

- **Primitives:** `Object.is` semantics (`NaN` equals `NaN`; `0` and `-0` differ).
- **Arrays:** same length, equal elements in order. **Plain objects:** the same own enumerable keys, in any order, with equal values. A key set to `undefined` is *not* the same as a missing key.
- **Prototype:** values with different prototypes are never equal (an array vs an object, a class instance vs a plain object).
- **Built-ins:** `Date` by time; `RegExp` by source and flags; `Map` by entries (keys by identity, values deeply); `Set` by members, deeply and in any order, with each member matched at most once; typed arrays element-by-element and only against the same type.
- **Cycles:** must terminate, and two structurally identical cyclic graphs are equal. (Hint: remember which pairs you're already comparing.)
- **Functions:** by identity.

Header comment: time and space complexity, including the `Set` case.

### Lab 2: `runner.ts` (2.5 h)

Export `createRunner(options?: { timeoutMs?: number })` (default 1000 ms), returning `{ describe, it, beforeEach, expect, run }`:

- `describe(name, body)` runs `body` immediately to *register* the tests inside it. Names nest: `"outer > inner > test"`.
- `it(name, fn)` registers a test. `fn` may be sync, or return a promise.
- `beforeEach(fn)` applies to every test in the current `describe` and its children, outer hooks first, and may be async. Hooks never leak into sibling `describe`s.
- `expect(actual)` has `.toBe(x)` (`Object.is`), `.toEqual(x)` (your `deepEqual`), `.toThrow(ErrorClass?)` (for a function), and `.not` for all three. A failed expectation throws an `Error` whose message contains both values.
- `run()` runs the tests **sequentially, in declaration order**, never stopping at a failure, and resolves to `{ passed: string[], failed: { name, message }[] }`. A test that doesn't settle within the timeout fails with a message containing "time". A test whose `beforeEach` throws fails with that message, and its body doesn't run.

**Transfer question** (a comment at the end of `runner.ts`): Vitest runs test *files* in parallel worker threads, but the tests inside one file sequentially by default. Using your runner, explain one bug that running tests inside a file in parallel would expose in OnStand's `usePracticeTimer` tests. (Hint: module-level state.)

---

## 4. DSA thread (2 h, no AI)

Same rules: a 25-minute timer, your own tests, `dsa/LOG.md`. NeetCode roadmap, *Two Pointers*:

1. Valid Palindrome
2. Two Sum II (Input Array Is Sorted)
3. 3Sum

**Band B:** replace 3Sum with one more *Arrays & Hashing* easy, and do 3Sum next week. **Bands C and D:** add Container With Most Water.

---

## 5. Retrieval questions (Sunday, closed book)

1. Write from memory the minimal YAML for a workflow that runs `bun run test` on every pull request.
2. What does `concurrency` with `cancel-in-progress` do, and why do you want it on PRs?
3. Why are Actions *variables* right for `VITE_SUPABASE_PUBLISHABLE_KEY`, while a Supabase *service-role* key would have to be a *secret*?
4. What does a lint ratchet allow and forbid? Why is it better than "fix all 44 now"?
5. Give the three whys for INC-0001 as you wrote them.
6. Name the two things that had to change before `.env` could leave git without breaking the production build.
7. Why does `deepEqual` need a "seen pairs" record? What happens without one on `a.self = a`?
8. In your runner, how do hooks from an outer `describe` reach a test in an inner one?
9. In the metronome, what are the two clocks, and which one decides when a click sounds?
10. Why is `LOOKAHEAD` (150 ms) much larger than `SCHEDULER_INTERVAL` (25 ms)? What breaks if they're equal?

## 6. Anki

Import `content/anki/week-02.tsv` ([download](content/anki/week-02.tsv)). Add every quiz miss from weeks 1 and 2.

---

## 7. The gate

| Item | Pass criterion | Evidence |
|---|---|---|
| **w02.ci** CI | Workflow merged; a green run, and a red run on a deliberately broken PR with the failing test's name visible | Both run URLs |
| **w02.protect** Protected `main` | ADR-0002 ≥ 4; the `gh api` command shows the required check (or the C mitigation is in place and the ADR justifies it) | ADR URL + command output in the PR |
| **w02.env** `.env` fixed | `git ls-files` shows no `.env`; the CI step fails if one is added; preview and production builds green | PR URL |
| **w02.inc** INC-0001 | ≥ 4 on the incident rubric | Commit URL |
| **w02.lab** Labs | Visible and hidden tests pass; code quality 2/2 | Commit hash |
| **w02.rec** Recording | Metronome scheduler, no notes, ≤ 5 min, ≥ 4 | Video URL |
| **w02.quiz** Retrieval | ≥ 80% | Commit of written answers |

**Recording must-hits for w02.rec:** the five A2 mechanisms from the diagnostic key (two clocks; look-ahead scheduling at exact audio times; refs for live changes; `catchUp`; lights driven by a queue and output latency).
**Follow-up questions:**
1. A user's phone throttles `setTimeout` to once per second in the background. Using the actual constants, what does the user hear, and why?
2. Why do the lights subtract `outputLatency`, and what would the user see on Bluetooth headphones if they didn't?

### Cut list (in order)

1. Task 2.3's ten lint fixes (keep the ratchet itself; do the fixes next week).
2. Task 2.1's README line.
3. DSA problem 3 (keep two).

**Never cut:** the red CI run (a check you've never seen fail is a check you don't know works), task 2.4 step 3, the recording.

### Stretch (mandatory for Band C)

- Turn on GitHub **push protection** for secrets (if available for your repo after task 2.5), and test it with a fake key pattern on a throwaway branch. Then delete the branch.
- Make CI upload the Vitest results as a JUnit artifact (`--reporter=junit`), so failures can be browsed.

### Band B supports

- Before writing `ci.yml`, write in plain English, one line per step, what the runner machine does from the start to the end of the job. Only then turn it into YAML.
- Write Lab 1 in two passes: primitives, arrays and objects first (commit), then the built-ins and cycles.
