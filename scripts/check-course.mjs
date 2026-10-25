// Checks the course hangs together: run `npm run check` before every push that changes content or course.json.
// - every page and week file named in course.json exists
// - every gate id appears in its week's page (so the tracker and the page can't drift apart)
// - gate ids are unique; weeks are numbered 0..N without gaps
// - internal links (#/route) point at real routes; Anki decks have exactly three fields per card
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const site = "site";
const course = JSON.parse(readFileSync(join(site, "course.json"), "utf8"));
const problems = [];

const routes = new Set(["", "course", "tracker", ...course.pages.map((p) => p.slug), ...course.weeks.map((w) => `week/${w.n}`)]);

// Calendar order is the array order. Numbered weeks must cover 0..N exactly once (a buffer week may be moved to where
// a holiday falls); other keys (F1–F4) may sit anywhere after week 0; no key may repeat.
const keys = course.weeks.map((w) => String(w.n));
keys.forEach((k, i) => { if (keys.indexOf(k) !== i) problems.push(`duplicate week key ${k}`); });
const numbered = course.weeks.filter((w) => typeof w.n === "number").map((w) => w.n).sort((a, b) => a - b);
numbered.forEach((n, i) => { if (n !== i) problems.push(`week numbers must be 0..${numbered.length - 1} with none missing; found ${n}`); });
if (course.weeks[0].n !== 0) problems.push("week 0 must come first");

const seen = new Set();
for (const w of course.weeks) {
  for (const g of w.gates) {
    if (seen.has(g.id)) problems.push(`duplicate gate id ${g.id}`);
    seen.add(g.id);
  }
}

const files = [...course.pages.map((p) => p.file), ...course.weeks.map((w) => w.file)];
for (const f of new Set(files)) {
  const path = join(site, f);
  if (!existsSync(path)) { problems.push(`missing file: ${path}`); continue; }
  const text = readFileSync(path, "utf8");
  for (const m of text.matchAll(/\]\(#\/([^)\s#]*)\)/g)) {
    if (!routes.has(m[1])) problems.push(`${path}: link to unknown route #/${m[1]}`);
  }
}

for (const w of course.weeks) {
  const path = join(site, w.file);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, "utf8");
  for (const g of w.gates) if (!text.includes(g.id)) problems.push(`${path}: gate ${g.id} is in course.json but not on the page`);
}

const ankiDir = join(site, "content", "anki");
if (existsSync(ankiDir)) {
  for (const f of readdirSync(ankiDir).filter((x) => x.endsWith(".tsv"))) {
    const lines = readFileSync(join(ankiDir, f), "utf8").split("\n").filter((l) => l && !l.startsWith("#"));
    lines.forEach((l, i) => { if (l.split("\t").length !== 3) problems.push(`${f}: card ${i + 1} does not have 3 fields`); });
  }
}

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log(`✓ course.json: ${course.weeks.length} weeks (incl. Foundations), ${seen.size} gate items, all pages present and linked correctly`);
