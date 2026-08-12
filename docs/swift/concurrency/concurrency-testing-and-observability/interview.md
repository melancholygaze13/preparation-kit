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
last_reviewed: 2026-08-12
---

# Concurrency Testing and Observability: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you test cancellation without sleeps?](#q1-deterministic-cancellation-testing) | Senior | Swift Testing and gates |
| [How do you test actor reentrancy deterministically?](#q2-deterministic-reentrancy-testing) | Staff | Controlled interleaving |
| [How do you validate isolation across a system?](#q3-isolation-topology-observability) | Principal | Tests and production signals |

---

<a id="q1-deterministic-cancellation-testing"></a>
## Q1: How Do You Test Cancellation Without Sleeps?

### Short Answer

Start an owned task with a controllable dependency. Wait for a signal that the
operation reached a known suspension point. Cancel it, release the dependency, and
await the task. Assert `CancellationError` and the expected cleanup. Inject a clock
for deadline tests.

### Expanded Answer

Elapsed time does not establish the required event order. The fake gate must be
concurrency-safe and resume exactly once. Await every task the test starts. Use
`confirmation()` only when tested work completes inside its closure; it does not wait for discarded tasks.

### Trade-offs

- Gates add test support code but remove timing-based failures.
- Virtual clocks require dependency injection but make many timeout cases fast.

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

- Dependency injection adds a small controllable boundary to production code.
- Exact ordering provides precise failure diagnosis and stable CI.

### Example

A cache load pauses after observing generation 1; invalidation advances to generation 2;
the load resumes and must not populate the cache.

---

<a id="q3-isolation-topology-observability"></a>
## Q3: How Do You Validate Isolation Across a System?

### Short Answer

Map each piece of shared mutable state to an actor or synchronized owner. Compile
module boundaries under strict concurrency. Test the orderings that could break a
required rule. Monitor actor queues, hops, active tasks, cancellation delay, dropped
stream values, and broken traces.

### Expanded Answer

The goal is not one actor per type. Check that each rule has one owner and messages
are sendable. Work that crosses owners needs a safe retry or recovery plan. Capacity
limits must also work together across dependencies. Production traces should reveal
lost task-local context and work that continues after cancellation.

### Trade-offs

- Fewer, larger isolation boundaries simplify coordination but may queue unrelated work.
- Smaller isolation boundaries increase concurrency but add hops and coordination across owners.
- Detailed metrics improve diagnosis but need sampling and limits on distinct labels.

### Example

Checkout traces show repeated hops between cart and inventory actors. They also show
payment work continuing after request cancellation. The team moves related cart state
into one actor and passes the deadline through every call.
