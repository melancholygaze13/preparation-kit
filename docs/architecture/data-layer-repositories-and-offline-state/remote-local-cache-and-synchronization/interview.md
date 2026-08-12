---
title: "Remote, Local, Cache, and Synchronization: Interview Questions"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
concept: "Remote, Local, Cache, and Synchronization"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - caching
  - synchronization
  - local-first
---

# Remote, Local, Cache, and Synchronization: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose between remote, cache, and local-first reads?](#q1-how-do-you-choose-between-remote-cache-and-local-first-reads) | Senior | Source authority |
| [How would you build incremental synchronization?](#q2-how-would-you-build-incremental-synchronization) | Senior | Cursor and transaction safety |
| [How do you prevent duplicate or stale refreshes?](#q3-how-do-you-prevent-duplicate-or-stale-refreshes) | Senior | Concurrency ownership |

---

<a id="q1-how-do-you-choose-between-remote-cache-and-local-first-reads"></a>
## Q1: How do you choose between remote, cache, and local-first reads?

### Short Answer

I start with product tolerance for latency, staleness, and offline use. Remote-only fits
simple always-online data. Cache-aside reduces repeated reads. Cache-then-network gives
fast stale content plus refresh. Local-first fits durable offline workflows but adds sync.

### Expanded Answer

I name the authoritative copy and define freshness, invalidation, and failure behavior
before choosing the pattern. A discardable cache can be rebuilt; a local-first database
may own user-visible state and pending writes. The stronger offline promise earns schema,
conflict, background-work, and reconciliation cost.

### Trade-offs

Every extra copy needs authority and invalidation rules. I distinguish discardable memory
or HTTP caches from a durable database. I do not call user drafts a cache if losing them
would violate the product contract.

<a id="q2-how-would-you-build-incremental-synchronization"></a>
## Q2: How would you build incremental synchronization?

### Short Answer

Read the last committed cursor, fetch one page, validate and map it, then apply records
and the next cursor in one local transaction. Advance only after commit. Replay must be
safe, and an expired cursor needs a full-resync path that preserves pending local work.

### Expanded Answer

The UI observes the local store, so it sees committed batches. Background jobs use small
checkpoints and resume safely. I record cursor age, counts, duration, reset events, and
failure class for diagnosis.

<a id="q3-how-do-you-prevent-duplicate-or-stale-refreshes"></a>
## Q3: How do you prevent duplicate or stale refreshes?

### Short Answer

I deduplicate in-flight work by resource when callers can share it and define cancellation
per waiter. A sync actor may own cursor state, but after each `await` I recheck generation,
account, and cursor before committing because actors are reentrant.

### Expanded Answer

The coordinator records one in-flight operation and lets compatible callers await it.
Each caller can stop waiting without necessarily cancelling work still needed elsewhere.
At commit time, identity and cursor checks prevent an old response from entering a new
account or overwriting a more recent synchronization pass.

### Example

If account A starts a refresh and the user switches to account B during the request, the
response carries account and generation identity. The coordinator rejects it instead of
writing A's records into B's store.
