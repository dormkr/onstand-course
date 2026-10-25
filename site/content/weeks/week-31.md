# Week 31: Real usage data from onstand.app

**Block E · Outline**

## Why this week exists

Since week 7, OnStand has been collecting tuner-health events. Now you use them. Product engineers are expected to turn data into a decision and then *check* the decision worked. This is also your answer to "tell me about a time you used data to make a product decision", with real users and real numbers.

## Tasks (12 h)

1. **Describe the data honestly:** how many users and sessions, the date range, which devices and browsers, what's missing (users who denied the mic never send `tuner_first_note_ms`), and your sampling caveats. With small numbers, say so and avoid percentages that pretend to precision.
2. **Find one real problem.** For example: permission-denied rates on one browser; slow time-to-first-note on low-end Android; detection rates that drop for one instrument range (which would point back to your week-15 front-end decision).
3. **Ship one change aimed at it**, with a hypothesis written *before* shipping ("time-to-first-note p50 on Android drops from X to under Y"), then measure for at least a week, or as long as the course allows, and report honestly, including "no measurable effect".
4. **Privacy check:** re-read your ADR-0005 and the privacy policy; confirm the data you used is the data you said you'd collect, and nothing else.

## Gate

- **w31.analysis:** an analysis with a hypothesis written before the change, the change shipped, and the result reported, whatever it was.
