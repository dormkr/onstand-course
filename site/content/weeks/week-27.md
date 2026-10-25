# Week 27: System design for juniors

**Block E: Getting hired · Outline**

## Why this week exists

Junior loops increasingly include a light design round: "how would you build X?" Nobody expects distributed-systems mastery from a new grad, but they expect you to clarify requirements, sketch components, name the trade-offs, and know what breaks first. You have an advantage here: you've *operated* a real system (OnStand's offline queue, push notifications, RLS, the service worker), so your answers can come from experience instead of templates.

## Read (3 h)

- [Tech Interview Handbook: system design](https://www.techinterviewhandbook.org/system-design/).
- [System Design Primer](https://github.com/donnemartin/system-design-primer): "How to approach a system design interview question", plus the sections on caching, consistency and availability.
- Your own OnStand code: `src/lib/offlineQueue.ts`, the service worker config in `vite.config.ts`, and the notification edge functions. You'll design *around* them.

## Tasks (12 h)

Write two design docs (2–4 pages each, with diagrams), each reviewed by a working engineer:

1. **OnStand offline sync, done properly.** Today `offlineQueue.ts` retries inserts with a dead-letter list. Design multi-device sync for practice logs and journals: conflict cases (edit on phone offline, edit on laptop), idempotency keys, ordering, what the server must guarantee, how you'd test it, and what you'd ship first.
2. **A collaborative score service.** A teacher annotates a student's score (week 19's model) while the student practises on another device. Real-time vs eventual updates, data model (operations vs snapshots), how far CRDTs or operational transforms are needed and when they're overkill, storage, permissions (reuse the RLS thinking), and the cost at 1,000 vs 1,000,000 users.

Practice each one *aloud* once, timed at 35 minutes, as if in an interview: requirements → API → data model → components → scaling → failure modes.

## Gate

- **w27.design:** both docs reviewed by an engineer, with their comments addressed in a second version.
