---
title: "Actors, Isolation, and Sendability: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Actors, Isolation, and Sendability"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Actors, Isolation, and Sendability: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What can change across await inside an actor?](#q1-actor-reentrancy) | Senior | Stale state and commits |
| [What does Sendable guarantee?](#q2-sendability) | Senior | Safe transfer versus atomicity |
| [How should a system choose actor boundaries?](#q3-isolation-topology) | Principal | Ownership and transaction scope |

---

<a id="q1-actor-reentrancy"></a>
## Q1: What Can Change Across await Inside an Actor?

### What It Evaluates

Recognition of actor reentrancy.

### Short Answer

Other calls can run on the actor while the method is suspended, so every assumption
about actor state may be stale afterward. Capture independent results locally and
revalidate before commit; use generations or in-flight task state when duplicate or
stale work matters. Actor isolation is not one transaction across await.

### Detailed Answer

Never force-unwrap actor state based on a pre-await check. Keep invariant-critical
transitions synchronous when possible and separate external effects from commit.

### Engineering Trade-offs

- Reentrancy prevents actors from blocking all progress.
- Generation checks reject stale work but add state.
- In-flight deduplication saves work while complicating cancellation ownership.

### Production Scenario

A cache checks absence, awaits download, then stores after invalidation. A generation
token rejects the stale result and an in-flight table deduplicates concurrent requests.

### Follow-up Questions

- Can two actor methods execute state access simultaneously?
- Why can a post-await force unwrap fail?
- How should duplicate work be cancelled?

### Strong Answer Signals

- Revalidates every suspension.
- Separates isolation from transactionality.
- Models stale and duplicate results.

### Weak Answer Signals

- Assumes actor methods run uninterrupted.
- Reads then force-unwraps after await.
- Adds detached tasks to bypass isolation.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-sendability"></a>
## Q2: What Does Sendable Guarantee?

### What It Evaluates

Understanding of transfer safety.

### Short Answer

`Sendable` states that a value can cross concurrency domains without introducing
unsafe shared mutable state. It does not make a shared variable atomic, serialize
method calls, or make every operation thread-safe. Immutable value types commonly
qualify; mutable reference types need isolation or proven synchronization.

### Detailed Answer

Avoid `@unchecked Sendable` as a diagnostic silencer. It is justified only when an
implementation's audited locking establishes the promise the compiler cannot prove.

### Engineering Trade-offs

- Values simplify transfer and snapshots.
- Actors own mutation but add async boundaries.
- Locked references support synchronous APIs with a higher proof burden.

### Production Scenario

A mutable class is marked unchecked to cross tasks and races. Moving state to an actor
and sending immutable snapshots makes ownership compiler-visible.

### Follow-up Questions

- Are all structs automatically Sendable?
- When is unchecked conformance legitimate?
- Does Sendable imply deep immutability?

### Strong Answer Signals

- Separates transfer from synchronization.
- Audits nested references.
- Treats unchecked conformance as exceptional.

### Weak Answer Signals

- Equates Sendable with atomicity.
- Marks arbitrary mutable classes unchecked.
- Ignores stored property semantics.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q3-isolation-topology"></a>
## Q3: How Should a System Choose Actor Boundaries?

### What It Evaluates

Principal-level isolation architecture.

### Short Answer

Place one actor around authoritative mutable state and the operations that preserve
its invariants. Send immutable messages or snapshots across boundaries. Minimize chatty
actor graphs, avoid splitting one transaction across owners, define global-actor use
and module default isolation explicitly, and budget hops and concurrency per dependency.

### Detailed Answer

Actors should own state, not merely forward calls. Cross-owner workflows need an
orchestrator, idempotency, and compensation rather than pretending several actors form one lock.

### Engineering Trade-offs

- Coarse actors simplify invariants but can bottleneck.
- Fine actors increase parallelism but add hops and coordination.
- Immutable snapshots improve decoupling but can be stale.

### Production Scenario

One checkout invariant spans cart, inventory, and payment actors. An orchestrator owns
the workflow with idempotency and compensation instead of nested cross-actor mutation.

### Follow-up Questions

- How do you measure actor contention?
- When is MainActor appropriate?
- How are isolation migrations staged?

### Strong Answer Signals

- Aligns actors with invariant ownership.
- Covers distributed transaction limitations.
- Includes budgets, settings, and migration.

### Weak Answer Signals

- Creates an actor per class mechanically.
- Uses MainActor as a universal lock.
- Splits one invariant across chatty owners.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
