---
title: "Effects, Dependencies, and Cancellation: Interview Questions"
domain: "Architecture"
topic: "Unidirectional Data Flow"
concept: "Effects, Dependencies, and Cancellation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-11
tags:
  - unidirectional-data-flow
  - effects
  - cancellation
---

# Effects, Dependencies, and Cancellation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How should a reducer handle async work?](#q1-how-should-a-reducer-handle-async-work) | Senior | Effect boundary |
| [How do you cancel effects safely?](#q2-how-do-you-cancel-effects-safely) | Senior | Identity and stale results |
| [How do you model a long-running stream?](#q3-how-do-you-model-a-long-running-stream) | Senior | Lifetime and backpressure |
| [Where should durable work live?](#q4-where-should-durable-work-live) | Staff | Scope and recovery |

---

<a id="q1-how-should-a-reducer-handle-async-work"></a>
## Q1: How should a reducer handle async work?

### Short Answer

The reducer synchronously updates state and returns an effect description. An effect
runtime calls an injected capability and sends its outcome back as an action. The
effect never mutates store state directly, so all changes remain ordered through the
reducer.

### Expanded Answer

I inject narrow clients for network, persistence, clocks, and identifiers. Successes
and meaningful failures map to domain actions. Cancellation is expected control flow
and usually emits no user-visible failure.

<a id="q2-how-do-you-cancel-effects-safely"></a>
## Q2: How do you cancel effects safely?

### Short Answer

I give the effect a stable ID and define its concurrency policy, such as latest-wins
for search. I cancel obsolete work, make the operation cooperate, and guard result
acceptance with request identity. Cancellation alone does not guarantee that an old
callback cannot arrive.

### Expanded Answer

The ID includes feature scope so two feature instances do not cancel each other.
I avoid letting an old cancellation path reset newer state. Tests deliberately finish
requests out of order and verify that only the current result is accepted.

<a id="q3-how-do-you-model-a-long-running-stream"></a>
## Q3: How do you model a long-running stream?

### Short Answer

The feature starts one subscription at a clear lifecycle action and cancels it when
the scope ends. Values return as actions. I also define buffering or coalescing so a
high-frequency producer cannot overwhelm reducer and UI work.

### Expanded Answer

Repeated appearance must not create duplicate notification or socket subscriptions.
For location or progress, I may keep only the latest value or coalesce updates. The
loss policy and error or reconnection behavior are product decisions.

<a id="q4-where-should-durable-work-live"></a>
## Q4: Where should durable work live?

### Short Answer

Work that must survive feature teardown or process termination belongs in a durable
operation service or repository, not a presentation store. The store starts or
observes the operation by stable ID and renders its persisted status.

### Expanded Answer

Uploads, payments, and offline mutations need persisted intent, idempotency, retry
policy, and recovery. Keeping a store alive does not provide process durability. A
recreated store should be able to resume observation and show an honest queued,
running, confirmed, or failed state.
