# Week 11: Checkpoint 1: mock interview, portfolio, retro

**4–10 January 2027 · Block B · Outline**

## Why this week exists

Ten weeks in, you need an outside measurement. Your own rubric scores have drifted generous, as everyone's do. This week a real engineer interviews you, you re-take the diagnostic's hardest sections, and you face the week-11 decision point in the [direction call](#/direction).

## Tasks

1. **Interview infrastructure (do it first).** A power backup for the router and laptop (a UPS or power bank that can run the router for 2 hours), a mobile-data fallback, a headset, and a quiet room. Test them on a real video call with a friend, *during a simulated outage* (unplug the router mid-call and switch to mobile data). Write down how long the switch took.
2. **Mock coding interview with a real engineer.** Options: [interviewing.io mocks](https://interviewing.io/mocks) (paid, with engineers from large companies); [Pramp](https://www.pramp.com/) (free, peer-to-peer); or an engineer from your network or a community ([JUCE forum](https://forum.juce.com/), The Audio Programmer Discord, Nairobi developer groups). Ask for a 45-minute easy/medium problem, no AI, and **their written score using their own rubric** (hire / lean hire / lean no hire / no hire, plus a reason).
3. **Re-take diagnostic sections B and E** (fresh problems: write five new prediction questions about code you've changed since week 0, and do two new NeetCode easy/medium problems timed). Compare with week 0 in the build log.
4. **Portfolio v0.** A README for OnStand (replace the Lovable template, which still says "Welcome to your Lovable project"): what it is, architecture in one diagram, how to run, test and deploy, the ADR list, the incident list, and the benchmark. A recruiter-readable version comes in week 30. This one is for engineers.
5. **Retro.** In the build log: what worked in weeks 1–10, what didn't, the three habits you'll keep, and one you'll change. Look at your hours and slip history honestly.

## The week-11 decision point (from the direction call)

If the mock interview scored below "lean hire" on coding: weeks 12–17 replace C++ with a second DSA block (NeetCode trees, heaps, graphs and dynamic programming at 6 problems a week, plus two more mocks), and C++ moves after week 26. Record the decision in a `replan:` commit if it changes the plan.

## Gate

- **w11.mock:** a mock interview done; the interviewer's written score linked or quoted in the build log.
- **w11.rediag:** B and E re-taken and compared with week 0.
- **w11.power:** the outage test done, and the switch time recorded.
