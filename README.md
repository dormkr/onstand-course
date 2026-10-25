# OnStand Engineering Course

A self-running engineering course: a diagnostic week 0, four Foundations weeks for Band A, then 36 weeks (26 Oct 2026 → 1 Aug 2027 on the current plan; `site/course.json` is the source of truth for dates). It takes you from "knows the basics" to a junior engineering hiring bar, specializing in **music software on the web platform, with music information retrieval as the edge**. [OnStand](https://onstand.app) is the lab: every week ships real, tested, reviewed changes to it.

The course is a static website (Markdown content, a progress tracker in the browser), a set of AI-free labs with failing test suites, and a set of rules for running it alone.

---

## Start here, in this order

1. **Read the [direction call](site/content/00-direction.md).** Whether this path is right for you, which specialization, and the kill criteria.
2. **Read the [rules](site/content/rules.md)**, especially the AI policy (§2) and what happens when you fall behind (§5).
3. **Take the [diagnostic](site/content/00-diagnostic.md)** before Sunday 25 October 2026. Your band decides where you start.
4. **Foundations F1** starts Monday 26 October 2026 (Band A, chosen 25 October). Week 1 follows on 23 November.

---

## Run it locally

You need Node 20 or newer (`node -v`).

```sh
npm install            # once: vitest, typescript, marked
npm run serve          # the site on http://localhost:8787
```

Opening `site/index.html` straight from disk won't work, because browsers block `fetch()` from `file://`. Use `npm run serve`.

### Labs (the AI-free, rebuild-from-a-blank-file drills)

```sh
npx vitest run labs/w01            # this week's labs (fails until you create the files)
npx vitest labs/w01                # watch mode while you work
npm run unseal w01-hidden          # after your visible tests pass AND your work is committed
npx vitest run labs/w01            # now runs the hidden tests too
```

Each lab folder contains only `*.test.ts` files. You create the implementation file the tests import. The specification is in the week's page under "Lab".

---

## Deploy on Cloudflare Pages (about 10 minutes)

1. **Create a public GitHub repo** and push this one:

   ```sh
   git add -A && git commit -m "Course: phase 1, site skeleton, week 1"
   gh repo create dormkr/onstand-course --public --source . --push
   ```

   Public on purpose: the build log and the committed progress are your accountability ([rules §4](site/content/rules.md)). If you use a different repo name, update `repoUrl` in `site/course.json`.

2. **Connect it to Cloudflare Pages:** Cloudflare dashboard → *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → choose the repo, then:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `site`

   Every push to `main` redeploys. `site/_headers` sets a strict Content Security Policy.

   *Or*, from the terminal, without Git integration:

   ```sh
   npx wrangler pages deploy site --project-name onstand-course
   ```

3. Put the URL in your Week 0 gate as evidence.

---

## How progress tracking works

- The tracker (**Today**, **Tracker** and the gate panel on each week) saves to **this browser's localStorage**. Nothing leaves your machine until you commit it.
- **Every Sunday:** Tracker → **Export progress.json** → save it as `site/progress.json` → commit and push it with your build-log entry. The deployed site shows the committed `progress.json` to anyone who visits. That's the public part.
- On a new device or browser: the site loads the committed `progress.json` automatically. If your local data is older than the committed file, a banner offers to load it.
- **Gate items need evidence:** a public URL (PR, CI run, video, post) or a commit hash. The tracker won't accept "done" without one.
- **Deadlines** are computed from `startDate` in `site/course.json` (week N's gate is due Sunday 23:59 EAT). Change it only through a `replan:` commit ([rules §5](site/content/rules.md)).
- **Falling behind** is computed for you: the Today page shows your level (0–3) and the actions the rules require.

localStorage can be wiped (private mode, cleared site data, a new phone). The weekly export is your backup. Don't skip it.

---

## Repository layout

```
site/                      ← deployed as-is (Cloudflare output directory)
  index.html, app.js, style.css
  course.json              ← the curriculum: weeks, dates, gate items
  progress.json            ← your committed progress (created by your first export)
  content/
    00-direction.md        ← the direction call (Phase 1)
    00-diagnostic.md       ← the diagnostic (Phase 1)
    rules.md, rubrics.md, foundations.md, sources.md
    weeks/week-NN.md       ← one page per week (1–4 in full; 5–36 as outlines)
    anki/week-NN.tsv       ← Anki-importable decks
  log/BUILD_LOG.md         ← public weekly build log
  log/honesty.md           ← every AI use on course work
  vendor/marked.umd.js     ← Markdown renderer (MIT), pinned 14.1.4
labs/wNN-*/                ← failing test suites for blank-file drills
sealed/*.b64               ← hidden tests and answer keys (see below)
onstand-patches/           ← test files you copy into OnStand (e.g. the diagnostic's)
templates/                 ← PR self-review, ADR, incident, weekly log
diagnostic/answers.md      ← your diagnostic answers
dsa/                       ← your data-structures-and-algorithms practice (create it in week 1)
scripts/                   ← serve, seal, unseal
```

---

## Sealed files

`sealed/` holds hidden test suites and the diagnostic answer key, base64-encoded so you can't read them by accident. That's a speed bump, not encryption: the rule is that you don't look.

```sh
npm run unseal diagnostic-key     # prints the key (only after committing your answers)
npm run unseal w01-hidden         # writes labs/w01-*/hidden.test.ts
```

`unseal` refuses to run if you have uncommitted changes. The commit before it is your timestamp. Unsealed `hidden.test.ts` files are git-ignored, so they never get committed in plain text.

**Sealing your own** (when you expand a week and write hidden tests for it):

```sh
# write the files somewhere outside the repo, mirroring the repo paths, e.g. ../sealsrc/labs/w05-worklet/hidden.test.ts
node scripts/seal.mjs w05-hidden ../sealsrc ../sealsrc/labs/w05-worklet/hidden.test.ts
```

Write the hidden tests *before* you write the solution, and ideally before reading the week's sources in depth. Otherwise you'll write tests your solution already passes.

---

## Extending the course yourself

Weeks 5–36 are complete outlines: sources, tasks, gate and cut list. To expand one into a full week, follow the shape of `site/content/weeks/week-01.md`:

1. **Why this week exists**: link the job posting or interview loop it serves.
2. **By Sunday you can**: 3–5 outcomes, each something you could be asked to do in an interview.
3. **Time budget**: 15–18 hours in total.
4. **Read**: exact sections of primary sources (specs, papers, source files at a specific path). Link them; never summarize them for yourself in place of reading.
5. **Build in OnStand**: tasks with "Done when" criteria that a stranger could verify.
6. **Lab**: a spec and a failing test suite in `labs/wNN-*/`. Write a reference solution *outside the repo* to prove the tests are passable, then seal the hidden tests.
7. **DSA**: the next problems on the NeetCode roadmap.
8. **Retrieval questions**: 10, closed book.
9. **Anki**: `site/content/anki/week-NN.tsv` with the three header lines, 12–18 cards.
10. **Gate**: must match the week's `gates` in `site/course.json`, with pass criteria, evidence and a recording with two follow-up questions.
11. **Cut list** and **stretch**.

Then set `"depth": "full"` for that week in `course.json`.

**Changing the curriculum:** edit `site/course.json`. Gate `id`s are what progress is stored against, so **never rename an id that has progress**; add a new one instead.

**Checks before you push:**

```sh
npm run check     # every page exists, every gate id is on its week's page, links resolve, decks parse, app.js parses
```

**Anki decks:** write the cards in a small Python file and generate the TSV with `python scripts/make-deck.py cards.py site/content/anki/week-NN.tsv`. It refuses tabs and newlines inside fields, which would silently break the import.

---

## If something breaks

| Symptom | Cause / fix |
|---|---|
| "Couldn't load course.json" | You opened the file from disk. Run `npm run serve`. |
| Progress vanished | The browser's site data was cleared. Tracker → Import your last `progress.json` (or let the site load the committed one). |
| A week page says "not written yet" | Its Markdown file is missing. Check the `file` path in `course.json`. |
| `npm run unseal` refuses | Commit your work first. That's deliberate. |
| Lab tests "fail to load" | You haven't created the implementation file yet. That's the starting state. |
| A hidden test seems wrong | Prove it with a minimal failing case and write it down in the build log before you change any test. Usually the test is right. |

---

*Built 20 October 2026 for Dor, Nairobi. The direction call is dated; re-read it at weeks 11, 17, 26 and 36.*
