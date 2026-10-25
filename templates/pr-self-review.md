<!--
PR description and self-review. Paste into the PR body and fill in every section.
"N/A" is allowed only with a reason. Scored with the PR rubric in the course (Rubrics → Pull request).
-->

## What and why

<!-- One paragraph: the user-visible problem or the engineering reason. Link the issue, incident or ADR. -->

## How

<!-- The approach in 3–6 bullets. Name the alternative you rejected and why. -->

## Evidence it works

- [ ] A test that failed before this change and passes after: `path/to/test` → name of the test
- [ ] Full suite: `npx vitest run` → N passed
- [ ] Type check: `npx tsc --noEmit -p tsconfig.app.json` → 0 errors
- [ ] Manual check (device/browser, steps, what you saw), or why none was needed:

## Risk

<!-- What could this break? Who would notice, and how fast? How do we roll back? -->

## Self-review

Read your own diff line by line in the GitHub "Files changed" view *before* asking anyone else to. Answer each:

1. **Smallest change?** Is there a line in this diff that doesn't need to be there?
2. **Names:** would a stranger understand every new name without the PR description?
3. **Edge cases:** list the inputs you thought about (empty, huge, negative, NaN, concurrent, offline, Safari).
4. **What I'm least sure about:**
5. **What I'd ask a reviewer to look at first:**

## AI use (required)

- [ ] None
- [ ] Used after my own first attempt, for: <!-- explanation / review / a specific snippet -->
  - Lines the AI wrote: <!-- file:lines, or "none" -->
  - I can explain every one of those lines without looking: yes / no (if no, they don't ship)
