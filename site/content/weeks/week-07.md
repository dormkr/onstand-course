# Week 7: Observability: errors, releases, and usage you can trust

**7–13 December 2026 · Block B · Outline**

## Why this week exists

Today, when OnStand crashes on someone's phone, `ErrorBoundary` writes to *their* console and you never find out (diagnostic C7). Production engineering means knowing about failures before users report them, and knowing what users actually do. Week 31 analyses real usage data, so the events have to start collecting **now**.

**Outcomes:** wire error monitoring with releases and source maps; define two or three product signals and collect them in a privacy-respecting way; write your first incident from a real production error.

## Read (2.5 h)

- Sentry, [React guide](https://docs.sentry.io/platforms/javascript/guides/react/) and [source maps](https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps/). (The free tier is enough. A self-hosted alternative is acceptable, and is an ADR option.)
- [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) (already in OnStand's CSP): what it measures and what it can't.
- Kenya's **Data Protection Act, 2019** and the [Office of the Data Protection Commissioner](https://www.odpc.go.ke/): read the summary of data-subject rights and lawful basis. Your users are in Kenya and elsewhere, so collect the minimum.
- Re-read [Postmortem Culture](https://sre.google/sre-book/postmortem-culture/).

## Build in OnStand (7 h)

1. **Error monitoring:** initialise in `main.tsx`; report from `ErrorBoundary.componentDidCatch`; tag every event with the release (the git SHA) and the section (`Tuner`, `Metronome`…). Upload source maps **from CI** on merge to `main`, never from your laptop. Scrub personal data (emails, message text) with `beforeSend`, and write a test for the scrubber.
2. **Tuner health signals (ADR-0005):** decide which events to record, for example `tuner_start` (success, permission denied, failure + reason), `tuner_first_note_ms` (time from start to the first detected note), and `tuner_session_detect_rate` (the share of non-silent windows that gave a note). Store them in a Supabase table with RLS **insert-only for the user's own rows** and no free text. That schema change needs your explicit decision: CLAUDE.md says the schema isn't to be touched lightly. Update the privacy policy text to match (phase3-snapshot.md already flags it as out of date).
3. **Alert:** a monitoring alert on a new issue type in production, sent to your email.
4. **INC-0002:** within the week, triage a real production error that monitoring caught (there will be one), and write it up. If truly none appears in 5 days, write up the most frequent warning instead, and say so.

## Lab (2.5 h, no AI)

`labs/w07-scrub/`: tests first. `scrub(event)` removes emails, phone numbers (including Kenyan formats: `+2547…`, `07…`) and any key named like a secret, recursively, without mutating its input. Property test: no output string matches the email or phone patterns.

## DSA (2 h)

*Linked List*: Reverse Linked List; Merge Two Sorted Lists; Linked List Cycle.

## Gate

- **w07.monitor:** errors arrive with the release and readable stack traces (source maps from CI).
- **w07.events:** events collecting in production; ADR-0005 ≥ 4; privacy text updated.
- **w07.inc:** INC-0002 ≥ 4.

**Cut list:** the alert rule. **Never cut:** PII scrubbing, events collecting (week 31 depends on them).
