---
title: "Concurrency Testing and Observability: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Concurrency Testing and Observability"
page_type: interview
interview_priority: high
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Concurrency Testing and Observability: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you test cancellation without sleeps?](#q1-deterministic-cancellation-testing) | Senior | Swift Testing and gates |
| [How do you test actor reentrancy deterministically?](#q2-deterministic-reentrancy-testing) | Staff | Controlled interleaving |
| [How do you validate system-level isolation topology?](#q3-isolation-topology-observability) | Principal | Tests and production signals |

---

<a id="q1-deterministic-cancellation-testing"></a>
## Q1: How Do You Test Cancellation Without Sleeps?

### Short Answer

Start an owned task against a controllable dependency, await a signal that the operation
reached a known suspension point, cancel it, release the dependency, then await the task
and assert `CancellationError` plus cleanup. Inject a clock for deadline tests.

### Expanded Answer

Elapsed time does not establish the required interleaving. The fake gate must be
concurrency-safe and resume exactly once. Await every task the test starts. Use
`confirmation()` only when tested work completes inside its closure; it does not wait for discarded tasks.

### Trade-offs

- Gates add test support code but remove flakes.
- Virtual clocks require injection but make timeout matrices fast.

### Example

A search test waits until ranking starts, cancels the query, releases ranking, and verifies
no result commits and the active-operation count returns to zero.

---

<a id="q2-deterministic-reentrancy-testing"></a>
## Q2: How Do You Test Actor Reentrancy Deterministically?

### Short Answer

Inject an awaited dependency with a gate. Start the actor operation, wait until it
suspends at the gate, invoke the competing actor mutation, release the dependency, and
await the original operation. Assert the generation or token rejects the stale commit.

### Expanded Answer

Actor state should be read through an awaited snapshot API. The test controls the exact
read-await-mutate-resume sequence. Running a race many times or serializing tests does not
prove the intended interleaving or fix unsafe shared fixtures.

### Trade-offs

- Dependency injection slightly expands production seams.
- Determinism provides precise failure diagnosis and stable CI.

### Example

A cache load pauses after observing generation 1; invalidation advances to generation 2;
the load resumes and must not populate the cache.

---

<a id="q3-isolation-topology-observability"></a>
## Q3: How Do You Validate System-Level Isolation Topology?

### Short Answer

Map authoritative mutable state to actors or synchronized owners, compile boundaries
under strict concurrency, test invariant-crossing interleavings, and observe actor queueing,
hop volume, active tasks, cancellation latency, stream drops, and trace continuity.

### Expanded Answer

The goal is not one actor per type. Validate that each invariant has one owner, messages
are sendable, cross-owner workflows have idempotency/compensation, and capacity limits
compose across dependencies. Production traces should reveal lost task-local context and
work continuing after cancellation.

### Trade-offs

- Coarse isolation simplifies invariants but may queue unrelated work.
- Fine isolation increases concurrency but adds hops and distributed coordination.
- Detailed telemetry improves diagnosis but needs sampling and cardinality controls.

### Example

Checkout traces show repeated cart-inventory actor hops and payment work continuing after
request cancellation. The topology is coarsened around cart invariants and deadline propagation is fixed.
