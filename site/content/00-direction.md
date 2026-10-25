# Direction call

Written 20 October 2026, after a full rescan of OnStand (`c:\dev\neweststand\On-The-Stand`), its git history, your ops repo, and current music-tech hiring. This is the one piece of the course that needed a mentor, so it states my calls plainly. Re-read it at every checkpoint (weeks 11, 17, 26 and 36). If the evidence has changed, write a new dated section below this one. Don't edit this one.

---

## The verdict

**Yes, software engineering is still a sound path for you. But not the version your current evidence shows, and only if one specific thing turns out to be true: that you can read, reason about and write code without an AI writing it for you.** The diagnostic and the first four weeks exist to find out. Everything after that assumes the answer is yes.

**Your specialization, sharpened:** not "real-time audio/DSP plus production web". Make it **music software engineering on the web platform, with music information retrieval (MIR) as the edge.** That means production TypeScript/React as the hiring vector, audio in the browser (Web Audio, AudioWorklet, WebAssembly) as the core skill, and pitch, onset, tempo, transcription and notation as the depth nobody else in the applicant pile has. C++/JUCE comes in from week 12 as a second language, not as the main bet.

I'm overruling part of your hypothesis. The reasoning is below.

---

## What the evidence says

### 1. The junior market shrank, and AI is part of why

- Stanford's Digital Economy Lab, using ADP payroll data, found that employment of software developers aged 22–25 fell by roughly 20% from its late-2022 peak, while older developers in the same jobs held steady. Read the paper itself, not the headlines: [Canaries in the Coal Mine](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/).
- Other numbers circulating (60–73% falls in junior postings) come from weaker sources and disagree with each other. Don't build plans on them. The direction is clear even though the size isn't.
- What this means for you: the work AI does well (turning a clear spec into a standard CRUD screen) is exactly the work juniors used to be hired for. What's left for juniors is **judgment over AI output**: knowing whether code is correct, fast enough and safe, in domains where "looks right" and "is right" come apart. Real-time audio and signal processing are such domains. A tuner that's 15 cents off still looks like a tuner. A metronome that drifts 30 ms still clicks.

### 2. Music tech is small, senior-heavy, and its good doors are remote and web-shaped

What I found when I checked (October 2026; postings change, so re-check):

| Company | What's open or recent | What it tells you |
|---|---|---|
| **Ableton** (Berlin) | No engineering openings at all ([jobs page](https://www.ableton.com/en/jobs/)) | The prestige C++ DAW shops hire rarely, and rarely juniors. |
| **Yousician** (Helsinki) | "C++ Audio Engineer", now closed: "Some knowledge of audio signal processing and real-time programming", "Experience with automated testing", "Ability to get up to speed quickly with existing code" ([posting](https://jobs.trueventures.com/companies/yousician-2/jobs/62837949-c-audio-engineer)) | **The closest company to OnStand on earth** (it listens to you play and gives feedback). Note that it asks for testing and reading existing code, the skills weeks 1–2 drill. |
| **Muse Group** (MuseScore, Audacity, Ultimate Guitar, StaffPad) | Remote-first "across 40+ countries"; recent roles include *Full Stack Producer (Music Notation, Audio ML)*, *Audio Software Developer (C++)* for Audacity, and *Engraving Specialist and QA Engineer* for MuseScore ([vacancies](https://www.mu.se/vacancies)). Says it is "embedding practical AI into … notation, audio, transcription" ([press](https://www.mu.se/posts/next-chapter-francisco-partners-conclusion)) | **Your single best-fit employer.** Remote worldwide, notation plus audio ML, open source, so you can get PRs merged before you apply. Weeks 16, 19, 22–25 point straight at it. |
| **UJAM** (Bremen/remote) | "Senior Web Engineer – Web Audio & Online DAWs": React, Node, and "real-time processing with AudioWorklets" ([posting](https://ujam.jobs.personio.de/job/2527951), may have closed) | Web audio is a real job category. It's senior today, but the skill list is exactly weeks 5–8 and 13. |
| **Zoom** (US) | "Audio Software Engineer": JavaScript, Web Audio API, WebRTC; "Immigration sponsorship is not available" ([posting](https://careers.zoom.us/jobs/audio-software-engineer-san-jose-california-united-states-1b8fd37b-45db-420a-92e7-f67613119373)) | Big tech wants web audio too, but US-only roles are closed to you from Nairobi. Filter on location first. |
| **BandLab** (Singapore) | Backend, iOS and ML recommendation roles, some remote ([relocate.me](https://blog.relocate.me/companies-hiring/bandlab)) | Music-tech companies hire many *ordinary* product engineers. Production web skill is how you get in, and the audio depth is what gets you remembered. |
| **Moises** (remote, Brazil/US) | Remote research internships in source separation and MIR, aimed at PhD students ([listing](https://startup.jobs/phd-research-internships-music-generation-source-separation-and-enhancement-music-information-retrieval-moises-7650288)) | Pure audio-ML research roles want PhDs. You aren't competing there. You *can* compete at shipping and evaluating ML audio inside a product. |

**What I conclude from the table:**

1. **Pure DSP/plugin C++ roles are the hardest door for you.** They're few, senior, mostly on-site in Berlin, Helsinki, London or the US, often with visa barriers, and you'd be up against people with DSP master's degrees. Don't make that your first door.
2. **Remote-first companies that need web, audio *and* musicianship are your door.** Muse Group is the clearest case, along with web-based notation and practice tools and the web teams of larger music companies.
3. **In 2026, MIR and audio ML have overtaken classical DSP as the product frontier.** You won't train foundation models. You need to *run* models in the browser, *measure* them honestly (mir_eval-style metrics), and *repair* what they get wrong. Rhythm quantization for notation, your stated end goal, is exactly that last kind of problem. It's a good target because neither AI nor the existing tools solve it well.

### 3. Where you actually stand: my read before the diagnostic

What OnStand proves:

- You can take a product from idea to real users. You run a PR workflow with merges, real audits, a security-hardening pass, a rebrand, a PWA, push notifications and a CSP. Most CS graduates have never shipped anything to a stranger.
- You have the domain. You're a classical flutist who built the tool your own practice needed. That's the founder story every music-ed company tells about itself.
- You have product judgment and written communication, as `DESIGN_BRIEF.md`, the phase logs and the audits show.

What OnStand does **not** prove, and an interviewer will find it inside ten minutes:

- **Authorship.** Of 724 commits, 597 are by Lovable's bot (`gpt-engineer-app[bot]`) and 106 are under your machine's git identity (`dengma1`), with messages and scope that read like agent sessions (`handoff.md` opens with "You are taking over from another agent"). Roughly 20 are under `dormkr`, and most of those are merges or small edits. The tuner (`src/lib/pitch.ts`), the best engineering in the repo, arrived in one 7 October commit, "Tools: a real tuner…".
- **That you can operate it.** Ask yourself honestly: could you explain, without notes, why `detect()` zero-pads to twice the window before the FFT? Why it takes the *first* peak above 0.9× the highest rather than the highest? If you can't, OnStand is currently a liability in an interview, because it invites questions you can't answer.

None of this is a moral judgment. Directing agents to ship a product is a real and valuable skill, and in 2026 every employer wants it. **But the junior bar is "can verify and own what the AI produced", and you can't verify what you couldn't have written.** That's why the course has an AI policy (see [Rules](#/rules)) and why every gate includes an explanation without notes.

If the diagnostic shows you *did* understand all of it, I'm wrong, and you skip ahead. Its scoring bands say exactly how far.

---

## Your hypothesis, graded

> "Real-time audio/DSP plus production web engineering."

| Part | Verdict | Why |
|---|---|---|
| Production web engineering | **Keep. Make it the primary hiring vector.** | Most of the openings above are web, full-stack or backend. You already have a real app and you're in the right ecosystem (TypeScript, React, Supabase, Cloudflare). What's missing is the production half: tests, CI, monitoring, performance, incident handling. Weeks 1–8 build exactly that. |
| Real-time audio | **Keep. It's the core skill.** | AudioWorklet, the audio thread's rules, clocks and latency, WASM. This is what separates you from a generic React developer. Weeks 3–6, 13 and 15. |
| DSP | **Narrow it to "DSP for MIR".** | You need the DFT/FFT, windows, autocorrelation, filters, onset functions and pitch estimation, measured honestly. You don't need to become a filter-design or plugin-DSP specialist first. Weeks 3, 4, 10 and 15. |
| *(missing)* MIR, notation, audio ML | **Add.** | Pitch tracks to notes, beat tracking, quantization, MusicXML/MIDI, running and evaluating a transcription model. This is where Muse Group is heading and where your musicianship is a real advantage. Weeks 18–25. |
| *(missing)* C++ | **Add, second.** | Yousician, Audacity and Serato-type roles need it, and it makes you credible on the real-time thread. From week 12, after you can write TypeScript unaided. |
| *(missing)* Interview fundamentals | **Add, continuous.** | Junior loops still run data-structures-and-algorithms rounds, without AI. Your prompt left this out, and leaving it out would fail you at the first screen. Three problems a week from week 1. |

**The job titles to aim at, in order:** (1) frontend or full-stack engineer at a music company, with audio features; (2) audio/web-audio engineer, junior or intern; (3) QA, tools or "producer" hybrids at notation companies, where musicianship plus code is the bar (MuseScore's *Engraving Specialist and QA Engineer* is the template); (4) C++ audio developer, from month 9 onward, if the C++ block goes well.

---

## Nairobi: what it changes

- **Time zone is an asset.** EAT (UTC+3) overlaps a full Berlin, Helsinki or London working day. Say so in applications: "full overlap with CET/EET".
- **Filter for location before you fall in love with a posting.** Many US roles are US-only (Zoom, above). Search "remote worldwide", "remote EMEA", "Europe or Africa". Companies that hire through an employer-of-record (Deel, Remote.com and similar) can hire you in Kenya. Muse Group already hires across 40+ countries.
- **Pay is a range, and the sources are weak.** Local junior estimates run from about KSh 40–80k a month ([one example](https://mctaba.com/blog/software-engineer-salary-in-kenya-in-2026-the-honest-guide); treat it as rough, since its author sells courses) up to about [KSh 790k a year](https://www.payscale.com/research/KE/Job=Junior_Software_Engineer/Salary) (self-reported). Remote junior roles for foreign companies pay several times more. That gap is why the remote route is worth the extra effort, and why you shouldn't price yourself on local numbers in remote interviews.
- **Your degree timing matters.** Formal graduation is July 2027, and many screens filter on a degree. The course runs 36 weeks, Oct 2026 → end of June 2027, so you finish as you graduate. Applications start in week 17 (February 2027) for internships and new-grad roles, because hiring cycles run months ahead.
- **Infrastructure:** interviews don't wait for KPLC. Before your first mock interview (week 11), have a power backup for the router and laptop and a mobile-data fallback that you've tested on a video call.
- **Money comes first, and the course is sized for it.** Your ops repo shows you need freelance income now. The course assumes **15 hours a week minimum, 18 target**, not full time. Freelance web work isn't a distraction from this course. It's paid practice, provided you start running it with the same engineering discipline (tests, CI, real deploys). Don't let it eat the course, though: the hours are a floor (see [Rules](#/rules)).

---

## Decision points (kill criteria)

A plan without exits turns into a sunk-cost trap. These are pre-committed:

| When | Check | If it fails |
|---|---|---|
| Week 0 | Diagnostic score | Below 45: do the four-week Foundations block first ([Diagnostic](#/diagnostic) explains it). Not a failure, just a different start. |
| Week 4 | Did you pass gates 1–4 **without AI writing the code**, with your honesty log to prove it? | If you couldn't do two of them unaided even after the slip protocol: stop and talk to a working engineer before continuing. Consider the adjacent paths below seriously. |
| Week 11 | First mock interview with a real engineer, scored with their rubric | Below "lean hire" on coding: weeks 12–17 swap C++ for a second DSA block, and C++ moves after week 26. |
| Week 17 | Is there at least one merged open-source PR, and have the first applications gone out? | No merged PR: week 25's PR becomes mandatory before any further applications. |
| Week 26 | Are callbacks coming in (the target is ≥1 per 15 tailored applications)? | No callbacks after 45 applications: the problem is either the materials or the targeting. Week 30 becomes an external review of your CV and portfolio by two working engineers. |

**Adjacent paths that use the same course, if the pure-engineering door stays shut:** QA/test engineer at a music company (weeks 1–8 are directly relevant); solutions or support engineer for an audio SDK; developer relations for music APIs; founder of OnStand, if you treat it as a distribution and pricing problem. That last one is a different project, not this course. None of these is a consolation prize, and all of them pay better than staying unemployed while you insist on one door.

---

## Changes I made to your plan, and why

You asked me to change anything that falls below my standard. Here's the list:

1. **An AI policy, enforced by an honesty log.** Without one, every gate in your design can be passed by an agent, and the course would certify the AI, not you. Labs, gates and the diagnostic are AI-free. Production work on OnStand may use AI *after* you've written your own first attempt, and every PR self-review states what the AI did. The policy loosens at week 18, because employers *want* AI fluency. They just want it on top of competence, not in place of it. Details in [Rules](#/rules).
2. **"Rewrite the tuner" became "benchmark first, then decide".** Your tuner isn't the naive autocorrelation you may remember. It's already the McLeod Pitch Method with an FFT, and it's good. Rewriting it to YIN without measurement would be résumé-driven development. Week 4 builds a benchmark harness, implements YIN from the paper, and makes you decide from data in an ADR. That's the habit employers pay for.
3. **Added a data-structures-and-algorithms thread from week 1.** Your prompt had none. Junior screens still have them.
4. **C++ moved to week 12, after TypeScript fluency.** Learning C++ memory management while you're still learning to read code unaided splits your attention and stalls both.
5. **The tracker uses localStorage plus a committed `progress.json`, not Supabase.** Building auth for a solo course site is procrastination dressed up as engineering. The *public* part of accountability comes from git history (commits can't be quietly backdated) and the deployed site showing your committed progress to anyone.
6. **Recordings must be published** (unlisted is fine) and linked from the public build log, and once a month one goes to a real engineer for scoring. A private self-scored video is too easy to grade generously.
7. **Hidden tests.** Each lab has a visible suite and a sealed second suite you unseal only after the visible one passes. That catches code written to satisfy the tests rather than solve the problem.
8. **Rhythm quantization moved to weeks 22–24.** It needs onset detection (week 10), beat tracking (week 21) and a notation model (week 19) first. Starting it early would mean faking those dependencies.
9. **Buffer weeks** at weeks 9 (Christmas), 17 (partly) and 26. Plans without slack fail on the first illness or power outage, and then people quit.
10. **Kill criteria** (above). You told me to be direct. The direct thing is to tell you now what would mean this isn't working.

---

## Sources

- Brynjolfsson, Chandar, Chen, *Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of AI*, Stanford Digital Economy Lab: <https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/>
- Yousician C++ Audio Engineer (closed): <https://jobs.trueventures.com/companies/yousician-2/jobs/62837949-c-audio-engineer>
- Muse Group vacancies: <https://www.mu.se/vacancies>
- Muse Group press release: <https://www.mu.se/posts/next-chapter-francisco-partners-conclusion>
- UJAM Web Audio role: <https://ujam.jobs.personio.de/job/2527951>
- Zoom Audio Software Engineer: <https://careers.zoom.us/jobs/audio-software-engineer-san-jose-california-united-states-1b8fd37b-45db-420a-92e7-f67613119373>
- Ableton jobs: <https://www.ableton.com/en/jobs/>
- BandLab roles: <https://blog.relocate.me/companies-hiring/bandlab>
- Moises internships: <https://startup.jobs/phd-research-internships-music-generation-source-separation-and-enhancement-music-information-retrieval-moises-7650288>
- Kenyan pay (low-confidence): <https://mctaba.com/blog/software-engineer-salary-in-kenya-in-2026-the-honest-guide>, <https://www.payscale.com/research/KE/Job=Junior_Software_Engineer/Salary>
- OnStand facts: `git log` in `On-The-Stand` (724 commits counted 20 Oct 2026), `src/lib/pitch.ts`, `handoff.md`.
