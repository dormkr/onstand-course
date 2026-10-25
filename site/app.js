// OnStand Course: a static site. Content is Markdown under content/, the curriculum is course.json, and
// progress lives in this browser's localStorage, with site/progress.json as the committed, public copy.
// No build step: edit a file, refresh. See README.md.

const STORE_KEY = "onstand-course:v1";
const DAY_MS = 86_400_000;
const STREAK_MINUTES = 45;
const WEEKLY_FLOOR_HOURS = 15;

const main = document.getElementById("main");
let course = null;
let seed = null; // site/progress.json, the committed copy
let state = null; // what the UI shows and edits
let showingSeed = false;
const mdCache = new Map();

// ---------- dates (all in the course timezone, as YYYY-MM-DD strings) ----------

const dayNum = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d) / DAY_MS; };
const fromDayNum = (n) => new Date(n * DAY_MS).toISOString().slice(0, 10);
const addDays = (s, k) => fromDayNum(dayNum(s) + k);
const today = () => new Date(Date.now() + course.utcOffsetHours * 3600_000).toISOString().slice(0, 10);
const fmtDay = (s) => new Date(dayNum(s) * DAY_MS).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const fmtLong = (s) => new Date(dayNum(s) * DAY_MS).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function weekRange(n) {
  if (n === 0) return { start: course.week0Start, end: addDays(course.startDate, -1) };
  const start = addDays(course.startDate, 7 * (n - 1));
  return { start, end: addDays(start, 6) };
}

function currentWeekNumber(day = today()) {
  if (dayNum(day) < dayNum(course.startDate)) return 0;
  const n = Math.floor((dayNum(day) - dayNum(course.startDate)) / 7) + 1;
  return Math.min(n, course.weeks[course.weeks.length - 1].n);
}

// ---------- storage ----------

const emptyState = () => ({ version: 1, updatedAt: null, exportedAt: null, checkins: {}, gates: {}, diagnostic: null });

function readLocal() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? normalise(JSON.parse(raw)) : null;
  } catch { return null; }
}

function save() {
  state.updatedAt = new Date().toISOString();
  showingSeed = false;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  catch { alert("This browser would not save (private mode or storage blocked). Export your progress now so you don't lose it."); }
}

function normalise(s) {
  const out = emptyState();
  if (!s || typeof s !== "object") return out;
  out.updatedAt = typeof s.updatedAt === "string" ? s.updatedAt : null;
  out.exportedAt = typeof s.exportedAt === "string" ? s.exportedAt : null;
  if (s.checkins && typeof s.checkins === "object") {
    for (const [day, c] of Object.entries(s.checkins)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(day) && c && Number.isFinite(c.minutes)) {
        out.checkins[day] = { minutes: Math.max(0, Math.round(c.minutes)), note: String(c.note ?? "").slice(0, 500) };
      }
    }
  }
  if (s.gates && typeof s.gates === "object") {
    for (const [id, g] of Object.entries(s.gates)) {
      if (g && typeof g.passedAt === "string" && typeof g.evidence === "string") out.gates[id] = { passedAt: g.passedAt, evidence: g.evidence };
    }
  }
  if (s.diagnostic && typeof s.diagnostic === "object") {
    const d = {};
    for (const k of ["A", "B", "C", "D", "E"]) d[k] = clampScore(s.diagnostic[k]);
    out.diagnostic = d;
  }
  return out;
}

const clampScore = (v) => (Number.isFinite(Number(v)) ? Math.min(20, Math.max(0, Number(v))) : 0);

// ---------- derived progress ----------

function weekStatus(w, day = today()) {
  const { start, end } = weekRange(w.n);
  const ids = w.gates.map((g) => g.id);
  const passed = ids.filter((id) => state.gates[id]).length;
  const all = ids.length > 0 && passed === ids.length;
  const lateItems = ids.filter((id) => state.gates[id] && dayNum(state.gates[id].passedAt) > dayNum(end)).length;
  let status;
  if (all) status = "passed";
  else if (dayNum(day) > dayNum(end)) status = "late";
  else if (dayNum(day) >= dayNum(start)) status = "current";
  else status = "upcoming";
  return { start, end, passed, total: ids.length, status, lateItems, daysLeft: dayNum(end) - dayNum(day) };
}

function streak(day = today()) {
  const ok = (d) => (state.checkins[d]?.minutes ?? 0) >= STREAK_MINUTES;
  let d = ok(day) ? day : addDays(day, -1); // today still counts as open until it ends
  let n = 0;
  while (ok(d)) { n++; d = addDays(d, -1); }
  return n;
}

function minutesBetween(start, end) {
  let m = 0;
  for (const [d, c] of Object.entries(state.checkins)) if (dayNum(d) >= dayNum(start) && dayNum(d) <= dayNum(end)) m += c.minutes;
  return m;
}

function daysSinceCheckin(day = today()) {
  const days = Object.keys(state.checkins).filter((d) => state.checkins[d].minutes > 0).sort();
  const last = days.length ? days[days.length - 1] : course.week0Start;
  return Math.max(0, dayNum(day) - dayNum(last));
}

/** The falling-behind level from rules.md §5. */
function behindLevel(day = today()) {
  const late = course.weeks.filter((w) => weekStatus(w, day).status === "late").length;
  const gap = daysSinceCheckin(day);
  let level = -1;
  if (late >= 1) level = 0;
  if (late >= 2 || gap >= 3) level = 1;
  if (late >= 3 || gap >= 10) level = 2;
  if (late >= 4) level = 3;
  return { level, late, gap };
}

const LEVELS = [
  { name: "Level 0: late", cls: "warn", todo: "Drop this week's stretch tasks and finish the late gate first. The DSA thread doesn't pause." },
  { name: "Level 1: slipping", cls: "warn", todo: "Within 24 hours: a public build-log entry with the real cause and one change. Apply this week's cut list." },
  { name: "Level 2: behind", cls: "bad", todo: "Stop new content. Use the next buffer week. Write a slip report with the incident template and post it." },
  { name: "Level 3: re-plan", cls: "bad", todo: "Within 48 hours, compress or extend, in a `replan:` commit with a build-log entry. Not choosing is choosing to quit." },
];

function band(total) {
  if (total >= 85) return "D";
  if (total >= 65) return "C";
  if (total >= 45) return "B";
  return "A";
}

// ---------- rendering helpers ----------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
const isEvidence = (s) => /^https?:\/\/\S+$/.test(s) || /^[0-9a-f]{7,40}$/i.test(s);
const evidenceHtml = (s) => (/^https?:\/\//.test(s) ? `<a href="${esc(s)}" target="_blank" rel="noopener">${esc(s)}</a>` : `<code>${esc(s)}</code>`);

async function fetchText(path) {
  if (mdCache.has(path)) return mdCache.get(path);
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  const text = await res.text();
  mdCache.set(path, text);
  return text;
}

function renderMarkdown(md) {
  const html = window.marked.parse(md, { gfm: true });
  const box = document.createElement("div");
  box.className = "prose";
  box.innerHTML = html;
  const used = new Set();
  for (const h of box.querySelectorAll("h1, h2, h3, h4")) {
    let id = slug(h.textContent || ""), k = 2;
    while (used.has(id)) id = `${slug(h.textContent || "")}-${k++}`;
    used.add(id);
    h.id = id;
  }
  for (const t of box.querySelectorAll("table")) {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    t.replaceWith(wrap);
    wrap.appendChild(t);
  }
  for (const a of box.querySelectorAll("a[href^='http']")) { a.target = "_blank"; a.rel = "noopener"; }
  return box;
}

function setNav(route) {
  for (const a of document.querySelectorAll("nav a")) {
    const r = a.getAttribute("href").slice(2).split("/")[0];
    if (r === route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
}

function pill(status) {
  const map = { passed: ["ok", "passed"], late: ["bad", "late"], current: ["warn", "this week"], upcoming: ["quiet", "upcoming"] };
  const [cls, text] = map[status];
  return `<span class="pill ${cls}">${text}</span>`;
}

const hasData = (s) => !!s && (Object.keys(s.checkins || {}).length > 0 || Object.keys(s.gates || {}).length > 0 || !!s.diagnostic);

function seedNotice() {
  if (!showingSeed || !hasData(seed)) return "";
  const when = seed?.exportedAt ? ` (exported ${esc(seed.exportedAt.slice(0, 10))})` : "";
  return `<div class="banner ok"><strong>Showing the committed progress${when}.</strong><p class="small">This is the public copy from <code>progress.json</code>. Anything you record here is saved in this browser only, until you export it and commit it.</p></div>`;
}

function newerSeedNotice() {
  if (showingSeed || !seed?.exportedAt || !hasData(seed)) return "";
  const local = state.updatedAt || "";
  if (seed.exportedAt <= local) return "";
  return `<div class="banner warn"><strong>The committed progress.json is newer than this browser's data.</strong>
    <p class="small">You probably recorded progress on another device. <button class="ghost" data-action="load-seed">Load the committed copy</button></p></div>`;
}

// ---------- views ----------

function viewToday() {
  const day = today();
  const n = currentWeekNumber(day);
  const w = course.weeks.find((x) => x.n === n);
  const ws = weekStatus(w, day);
  const { level, late, gap } = behindLevel(day);
  const wk = weekRange(n);
  const hours = minutesBetween(wk.start, wk.end) / 60;
  const totalGates = course.weeks.reduce((a, x) => a + x.gates.length, 0);
  const passedGates = Object.keys(state.gates).filter((id) => course.weeks.some((x) => x.gates.some((g) => g.id === id))).length;
  const levelBanner = level >= 0
    ? `<div class="banner ${LEVELS[level].cls}"><strong>${LEVELS[level].name}</strong>: ${late} week${late === 1 ? "" : "s"} with unpassed gates, ${gap} day${gap === 1 ? "" : "s"} since your last check-in.<p>${esc(LEVELS[level].todo).replace(/`([^`]+)`/g, "<code>$1</code>")} <a href="#/rules">Rules §5</a></p></div>`
    : "";
  const lateWeeks = course.weeks.filter((x) => weekStatus(x, day).status === "late");

  main.innerHTML = `
    ${seedNotice()}${newerSeedNotice()}
    <p class="muted small">${esc(fmtLong(day))} · EAT</p>
    ${levelBanner}
    <section class="card">
      <div class="week-head">Week ${n} · ${esc(fmtDay(ws.start))} to ${esc(fmtDay(ws.end))} ${pill(ws.status)}</div>
      <h2><a href="#/week/${n}">${esc(w.title)}</a></h2>
      <p class="small">${ws.passed} of ${ws.total} gate items passed. ${ws.status === "passed" ? "This week's gate is done." : ws.daysLeft >= 0 ? `Due ${esc(fmtDay(ws.end))}, 23:59 EAT: <strong>${ws.daysLeft === 0 ? "today" : `${ws.daysLeft} day${ws.daysLeft === 1 ? "" : "s"} left`}</strong>.` : ""}</p>
      ${lateWeeks.length ? `<p class="small">Late: ${lateWeeks.map((x) => `<a href="#/week/${x.n}">week ${x.n}</a>`).join(", ")}. Late gates come before new content.</p>` : ""}
    </section>
    <div class="grid">
      <div class="stat"><div class="label">Streak</div><div class="value">${streak(day)}</div><div class="sub">days of ≥${STREAK_MINUTES} min</div></div>
      <div class="stat"><div class="label">This week</div><div class="value">${hours.toFixed(1)}h</div><div class="sub">floor ${WEEKLY_FLOOR_HOURS}h ${hours >= WEEKLY_FLOOR_HOURS ? "· met" : `· ${(WEEKLY_FLOOR_HOURS - hours).toFixed(1)}h to go`}</div></div>
      <div class="stat"><div class="label">Gates</div><div class="value">${passedGates}</div><div class="sub">of ${totalGates} items</div></div>
      <div class="stat"><div class="label">Finish</div><div class="value">${Math.max(0, dayNum(course.endDate) - dayNum(day))}</div><div class="sub">days to ${esc(fmtDay(course.endDate))}</div></div>
    </div>
    <section class="card">
      <h3>Check in</h3>
      <form id="checkin" class="form-row">
        <div><label for="ci-day">Day</label><input id="ci-day" type="date" value="${day}" max="${day}" required></div>
        <div><label for="ci-min">Minutes</label><input id="ci-min" type="number" min="0" max="960" step="5" required value="${state.checkins[day]?.minutes ?? ""}"></div>
        <div><label for="ci-note">What you did (specific)</label><input id="ci-note" type="text" maxlength="500" placeholder="e.g. bit reversal done, 3 FFT tests passing" value="${esc(state.checkins[day]?.note ?? "")}"></div>
        <div><button type="submit">Save</button></div>
      </form>
      <p class="muted small">A day counts for the streak at ${STREAK_MINUTES}+ focused minutes with a specific note. Saving a day again replaces it.</p>
    </section>
    <section class="card">
      <h3>Last 12 weeks</h3>
      ${heatmap(day)}
      <ul class="checkins">${recentCheckins(day, 7)}</ul>
    </section>`;

  document.getElementById("checkin").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = document.getElementById("ci-day").value;
    const minutes = Number(document.getElementById("ci-min").value);
    const note = document.getElementById("ci-note").value.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || dayNum(d) > dayNum(day)) return alert("Pick a day that isn't in the future.");
    if (!Number.isFinite(minutes) || minutes < 0) return alert("Minutes must be a number.");
    if (minutes >= STREAK_MINUTES && note.length < 12) return alert("Say specifically what you did. That's what makes the day count.");
    if (minutes === 0 && !note) delete state.checkins[d];
    else state.checkins[d] = { minutes, note };
    save();
    route();
  });
}

function heatmap(day) {
  // 12 weeks, Monday-first columns of 7, ending with the current week.
  const dow = (dayNum(day) + 3) % 7; // 1970-01-01 was a Thursday; Monday = 0
  const end = addDays(day, 6 - dow);
  const start = addDays(end, -83);
  let cells = "";
  for (let i = 0; i < 84; i++) {
    const d = addDays(start, i);
    const m = state.checkins[d]?.minutes ?? 0;
    const lvl = m >= 120 ? 3 : m >= STREAK_MINUTES ? 2 : m > 0 ? 1 : 0;
    const future = dayNum(d) > dayNum(day);
    cells += `<div class="day ${lvl ? `l${lvl}` : ""} ${d === day ? "today" : ""} ${future ? "future" : ""}" title="${esc(d)}: ${m} min"></div>`;
  }
  return `<div class="days" role="img" aria-label="Minutes per day for the last 12 weeks, one row per week">${cells}</div>`;
}

function recentCheckins(day, n) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const d = addDays(day, -i);
    const c = state.checkins[d];
    out += `<li><span>${esc(fmtDay(d))}</span><span>${c ? `${c.minutes} min` : "—"}</span><span class="muted">${c ? esc(c.note) : ""}</span></li>`;
  }
  return out;
}

function viewCourse() {
  const day = today();
  const cur = currentWeekNumber(day);
  let html = `${seedNotice()}<div class="prose"><h1>Course</h1>
    <p>36 weeks, ${esc(fmtDay(course.startDate))} 2026 to ${esc(fmtDay(course.endDate))} 2027, plus week 0. Weeks 1–4 are written in full; later weeks are complete outlines (sources, tasks, gates) for you to expand. Start with the <a href="#/direction">direction call</a> and the <a href="#/diagnostic">diagnostic</a>.</p></div>`;
  for (const b of course.blocks) {
    const weeks = course.weeks.filter((w) => w.block === b.id);
    html += `<h2 class="block-title">${b.id === "0" ? "" : `Block ${esc(b.id)}: `}${esc(b.title)}</h2><ul class="weeks">`;
    for (const w of weeks) {
      const s = weekStatus(w, day);
      html += `<li class="${w.n === cur ? "current" : ""}"><span class="n">${String(w.n).padStart(2, "0")}</span>
        <span><a href="#/week/${w.n}">${esc(w.title)}</a><br><span class="meta">${esc(fmtDay(s.start))} – ${esc(fmtDay(s.end))} · ${s.passed}/${s.total} gate items${w.depth === "outline" ? " · outline" : ""}</span></span>
        ${pill(s.status)}</li>`;
    }
    html += "</ul>";
  }
  main.innerHTML = html;
}

async function viewWeek(n) {
  const w = course.weeks.find((x) => x.n === n);
  if (!w) return viewNotFound();
  const s = weekStatus(w);
  main.innerHTML = `${seedNotice()}<div class="week-head">Week ${n} · Block ${esc(w.block)} · ${esc(fmtDay(s.start))} to ${esc(fmtDay(s.end))} · due 23:59 EAT ${pill(s.status)} <a href="#gate">Jump to the gate</a></div><div id="md"><p class="muted">Loading…</p></div><section class="card" id="gate"></section><div class="pager" id="pager"></div>`;
  renderGatePanel(w);
  const prev = course.weeks.find((x) => x.n === n - 1), next = course.weeks.find((x) => x.n === n + 1);
  document.getElementById("pager").innerHTML = `${prev ? `<a href="#/week/${prev.n}">← Week ${prev.n}</a>` : "<span></span>"}${next ? `<a href="#/week/${next.n}">Week ${next.n} →</a>` : ""}`;
  try {
    const md = await fetchText(w.file);
    document.getElementById("md").replaceChildren(renderMarkdown(md));
  } catch {
    document.getElementById("md").innerHTML = `<div class="prose"><h1>Week ${n}: ${esc(w.title)}</h1><p class="muted">This page hasn't been written yet (<code>site/${esc(w.file)}</code>). Use the outline template in the README to expand it.</p></div>`;
  }
}

function renderGatePanel(w) {
  const box = document.getElementById("gate");
  const s = weekStatus(w);
  let html = `<h2>Gate: week ${w.n}</h2><p class="small muted">${s.passed}/${s.total} passed. An item counts only with evidence: a public URL (PR, CI run, video, post) or a commit hash. Week ${w.n} is due ${esc(fmtDay(s.end))} 23:59 EAT.</p><ul class="gates">`;
  for (const g of w.gates) {
    const p = state.gates[g.id];
    const late = p && dayNum(p.passedAt) > dayNum(s.end);
    html += `<li class="gate ${p ? "passed" : ""}" data-id="${esc(g.id)}">
      <div><div class="kind">${esc(g.kind)}</div><div class="text">${esc(g.text)}</div></div>
      <div>${p ? `<span class="pill ${late ? "warn" : "ok"}">${late ? "passed late" : "passed"}</span> <button class="ghost" data-action="undo">Undo</button>` : `<button data-action="mark">Mark passed</button>`}</div>
      ${p ? `<div class="evidence">${esc(fmtDay(p.passedAt))} · ${evidenceHtml(p.evidence)}</div>` : ""}
    </li>`;
  }
  html += "</ul>";
  box.innerHTML = html;
}

function openEvidenceForm(li) {
  if (li.querySelector("form")) return;
  const form = document.createElement("form");
  form.innerHTML = `<input type="text" aria-label="Evidence URL or commit hash" placeholder="https://github.com/…/pull/12 or a commit hash" required>
    <input type="date" aria-label="Day passed" value="${today()}" max="${today()}" required>
    <button type="submit">Save</button>`;
  li.appendChild(form);
  form.querySelector("input").focus();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const [ev, d] = form.querySelectorAll("input");
    const evidence = ev.value.trim();
    if (!isEvidence(evidence)) return alert("Evidence must be a public http(s) URL or a 7–40 character commit hash.");
    state.gates[li.dataset.id] = { passedAt: d.value, evidence };
    save();
    route();
  });
}

function viewTracker() {
  const d = state.diagnostic;
  const total = d ? ["A", "B", "C", "D", "E"].reduce((a, k) => a + d[k], 0) : null;
  let rows = "";
  for (const w of course.weeks) {
    const s = weekStatus(w);
    rows += `<tr><td><a href="#/week/${w.n}">${w.n}</a></td><td>${esc(w.title)}</td><td>${s.passed}/${s.total}${s.lateItems ? ` <span class="pill warn">${s.lateItems} late</span>` : ""}</td><td>${esc(fmtDay(s.end))}</td><td>${pill(s.status)}</td></tr>`;
  }
  main.innerHTML = `${seedNotice()}${newerSeedNotice()}
    <div class="prose"><h1>Tracker</h1></div>
    <section class="card">
      <h3>Diagnostic</h3>
      <form id="diag" class="grid">
        ${["A", "B", "C", "D", "E"].map((k) => `<div><label for="dg-${k}">${k} (/20)</label><input id="dg-${k}" type="number" min="0" max="20" step="0.5" value="${d ? d[k] : ""}"></div>`).join("")}
        <div><label>&nbsp;</label><button type="submit">Save scores</button></div>
      </form>
      ${total !== null ? `<p><strong>${total}/100 · Band ${band(total)}.</strong> <a href="#/diagnostic">What the band means</a>${d.A < 10 ? ' · <span class="pill bad">OnStand ownership flag</span>' : ""}${d.E < 8 ? ' · <span class="pill warn">extra DSA flag</span>' : ""}</p>` : `<p class="muted small">Enter your scores after grading with the sealed key.</p>`}
    </section>
    <section class="card">
      <h3>Every week</h3>
      <div class="prose"><div class="table-wrap"><table><thead><tr><th>#</th><th>Week</th><th>Gate</th><th>Due</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div></div>
    </section>
    <section class="card">
      <h3>Back up and publish</h3>
      <p class="small">Every Sunday: <strong>Export</strong>, save the file as <code>site/progress.json</code> in the course repo, then commit and push it with your build-log entry. The deployed site shows the committed copy to anyone with the link.</p>
      <p><button data-action="export">Export progress.json</button>
         <label class="visually-hidden" for="import-file">Import a progress file</label>
         <input id="import-file" type="file" accept="application/json,.json" hidden>
         <button class="ghost" data-action="import">Import…</button>
         <button class="ghost" data-action="wipe">Clear this browser's data</button></p>
    </section>`;

  document.getElementById("diag").addEventListener("submit", (e) => {
    e.preventDefault();
    const scores = {};
    for (const k of ["A", "B", "C", "D", "E"]) scores[k] = clampScore(document.getElementById(`dg-${k}`).value);
    state.diagnostic = scores;
    save();
    route();
  });
  document.getElementById("import-file").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const incoming = normalise(JSON.parse(await file.text()));
      if (!confirm(`Replace this browser's progress with the file (${Object.keys(incoming.gates).length} gate items, ${Object.keys(incoming.checkins).length} check-ins)?`)) return;
      state = incoming;
      save();
      route();
    } catch { alert("That file isn't a valid progress export."); }
  });
}

function exportProgress() {
  state.exportedAt = new Date().toISOString();
  save();
  const blob = new Blob([JSON.stringify(state, null, 2) + "\n"], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "progress.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function viewPage(slugName) {
  const page = course.pages.find((p) => p.slug === slugName);
  if (!page) return viewNotFound();
  main.innerHTML = `<p class="muted">Loading…</p>`;
  try {
    const md = await fetchText(page.file);
    main.replaceChildren(renderMarkdown(md));
    if (slugName === "log") main.prepend(logDraftCard());
  } catch {
    main.innerHTML = `<div class="prose"><h1>${esc(page.title)}</h1><p class="muted">Couldn't load <code>site/${esc(page.file)}</code>.</p></div>`;
  }
}

function logDraftCard() {
  const card = document.createElement("section");
  card.className = "card";
  card.innerHTML = `<h3>Draft this week's entry</h3><p class="small muted">Generated from the tracker. Paste it at the top of <code>site/log/BUILD_LOG.md</code>, finish the blanks honestly, commit, push.</p><p><button data-action="draft">Generate</button></p>`;
  return card;
}

function draftLogEntry() {
  const day = today();
  const n = currentWeekNumber(day);
  const w = course.weeks.find((x) => x.n === n);
  const s = weekStatus(w, day);
  const r = weekRange(n);
  const hours = (minutesBetween(r.start, r.end) / 60).toFixed(1);
  const { level } = behindLevel(day);
  const passed = w.gates.filter((g) => state.gates[g.id]).map((g) => `  - ${g.text}: ${state.gates[g.id].evidence}`).join("\n") || "  - none";
  const open = w.gates.filter((g) => !state.gates[g.id]).map((g) => `  - ${g.text}: <why>`).join("\n") || "  - none";
  const text = `## Week ${String(n).padStart(2, "0")}: ${w.title} · ${day}

- **Hours:** ${hours} (floor ${WEEKLY_FLOOR_HOURS}) · **Streak:** ${streak(day)} day${streak(day) === 1 ? "" : "s"} · **Status:** ${level < 0 ? "on track" : LEVELS[level].name}
- **Gates passed (${s.passed}/${s.total}):**
${passed}
- **Gates not passed:**
${open}

**Shipped:** <links>

**What slipped and the real cause:**

**Retrieval quiz:** NN% · **Anki:** NN reviews

**Next week's biggest risk:**

**One thing I can do now that I couldn't last week:**
`;
  const card = main.querySelector(".card");
  card.querySelector("textarea")?.remove();
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.rows = 18;
  ta.setAttribute("aria-label", "Draft build-log entry");
  card.appendChild(ta);
  ta.select();
  navigator.clipboard?.writeText(text).then(() => { card.querySelector("button").textContent = "Copied. Generate again"; }).catch(() => {});
}

function viewNotFound() {
  main.innerHTML = `<div class="prose"><h1>Not found</h1><p><a href="#/">Back to today</a></p></div>`;
}

// ---------- router ----------

async function route() {
  const hash = location.hash || "#/";
  if (!hash.startsWith("#/")) return;
  const [name, arg] = hash.slice(2).split("/");
  setNav(name || "");
  window.scrollTo(0, 0);
  if (!name) viewToday();
  else if (name === "course") viewCourse();
  else if (name === "week") await viewWeek(Number(arg));
  else if (name === "tracker") viewTracker();
  else await viewPage(name);
  document.getElementById("foot-status").textContent =
    `${course.title} · progress ${showingSeed ? "from progress.json (committed)" : "saved in this browser"}${state.exportedAt ? ` · last exported ${state.exportedAt.slice(0, 10)}` : " · never exported"}`;
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href^='#']");
  if (a && !a.getAttribute("href").startsWith("#/")) {
    // In-page anchors: scroll without leaving the current route.
    e.preventDefault();
    document.getElementById(a.getAttribute("href").slice(1))?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const li = btn.closest(".gate");
  if (action === "mark") openEvidenceForm(li);
  else if (action === "undo" && confirm("Remove this gate item's pass and its evidence?")) { delete state.gates[li.dataset.id]; save(); route(); }
  else if (action === "export") exportProgress();
  else if (action === "import") document.getElementById("import-file").click();
  else if (action === "wipe" && confirm("Delete all progress stored in this browser? Export first if you haven't.")) { try { localStorage.removeItem(STORE_KEY); } catch { /* blocked */ } state = seed ? normalise(seed) : emptyState(); showingSeed = !!seed; route(); }
  else if (action === "load-seed" && confirm("Replace this browser's progress with the committed progress.json?")) { state = normalise(seed); save(); route(); }
  else if (action === "draft") draftLogEntry();
});

document.querySelector(".menu-toggle").addEventListener("click", (e) => {
  const nav = document.getElementById("nav");
  const open = nav.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
});
document.getElementById("nav").addEventListener("click", (e) => {
  if (e.target.closest("a")) { document.getElementById("nav").classList.remove("open"); document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false"); }
});

window.addEventListener("hashchange", route);

async function boot() {
  try {
    course = await (await fetch("course.json", { cache: "no-cache" })).json();
  } catch {
    main.innerHTML = `<p>Couldn't load <code>course.json</code>. If you opened index.html straight from disk, run <code>npm run serve</code> instead.</p>`;
    return;
  }
  try {
    const res = await fetch("progress.json", { cache: "no-cache" });
    if (res.ok) seed = await res.json();
  } catch { /* no committed progress yet */ }
  const local = readLocal();
  if (local) state = local;
  else if (seed) { state = normalise(seed); showingSeed = true; }
  else state = emptyState();
  route();
}

boot();
