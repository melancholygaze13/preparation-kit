---
title: "Actors, Global Actors, and Reentrancy: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Actors, Global Actors, and Reentrancy"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Actors, Global Actors, and Reentrancy: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What can change across await inside an actor?](#q1-actor-reentrancy) | Senior | Logical races |
| [When should you use MainActor or a custom global actor?](#q2-global-actors) | Staff | Global isolation |
| [How do isolated and nonisolated shape an API?](#q3-isolated-and-nonisolated) | Staff | Borrowed and exposed isolation |
| [When should you choose an actor versus a lock?](#q4-actors-versus-locks) | Principal | Boundary topology |

---

<a id="q1-actor-reentrancy"></a>
## Q1: What Can Change Across await Inside an Actor?

### What It Evaluates

Recognition of reentrancy and read-await-write hazards.

### Short Answer

Other work can run on the actor while the method is suspended, so all prior state
assumptions may be stale. Keep invariant transitions synchronous or revalidate with a
generation/token before commit; use in-flight state when duplicate work matters.

### Detailed Answer

Actor isolation prevents simultaneous isolated access but does not make an entire async
method atomic. Capture awaited results locally. Never force-unwrap state based on a check
made before suspension.

### Engineering Trade-offs

- Reentrancy permits progress while one operation waits.
- Generations reject stale work but add state.
- Shared in-flight tasks need cancellation ownership policy.

### Production Scenario

A cache refresh suspends, invalidation runs, then the stale refresh returns. A generation
check rejects its commit.

### Follow-up Questions

- Can two synchronous actor segments access state simultaneously?
- How should shared in-flight work handle one caller cancelling?

### Strong Answer Signals

- Revalidates after every await.
- Separates isolation from transactionality.

### Weak Answer Signals

- Calls actor methods atomic across await.
- Force-unwraps post-await actor state.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-global-actors"></a>
## Q2: When Should You Use MainActor or a Custom Global Actor?

### What It Evaluates

Correct global-isolation boundary selection.

### Short Answer

Use `@MainActor` for UI and lifecycle state whose invariant belongs to the main actor.
Use a custom global actor only when many declarations genuinely share one process-wide
isolation domain. Neither is a generic lock or fixed-thread annotation.

### Detailed Answer

Global actors simplify synchronous access within one domain but serialize unrelated work
if applied broadly. Swift 6.2 default actor isolation is per module, and isolated conformances
can keep protocol use on the correct global actor.

### Engineering Trade-offs

- Broad isolation simplifies ownership but can increase contention and coupling.
- Narrower actors improve independence but add hops and message design.

### Production Scenario

A UI-heavy app defaults its app target to `MainActor`, while networking and model libraries
retain explicit nonisolated APIs. Settings are documented at module boundaries.

### Follow-up Questions

- Does `@MainActor` mean every network operation runs on the main thread?
- When is an isolated conformance appropriate?

### Strong Answer Signals

- Aligns global isolation with invariant ownership.
- Mentions per-module settings.

### Weak Answer Signals

- Annotates everything to silence diagnostics.
- Uses `MainActor.run` around scattered property accesses.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)

---

<a id="q3-isolated-and-nonisolated"></a>
## Q3: How Do isolated and nonisolated Shape an API?

### What It Evaluates

Precise isolation contracts.

### Short Answer

An `isolated` actor parameter borrows that actor's domain so the function can perform
multiple synchronous isolated accesses without repeated hops. `nonisolated` states that
a declaration does not require actor state and can be used outside the actor boundary.

### Detailed Answer

Both are semantic promises. `nonisolated` is appropriate for immutable identifiers or
requirements independent of state, not as a diagnostic escape. `isolated deinit` permits
synchronous isolated teardown; async cleanup still needs an explicit method.

### Engineering Trade-offs

- Borrowed isolation reduces hops but couples the helper to caller execution.
- Nonisolated access improves usability but can expose only truly independent data.

### Production Scenario

A transaction helper takes an isolated database actor and performs several invariant-
preserving operations synchronously within that actor's domain.

### Follow-up Questions

- Can a nonisolated method read mutable actor state?
- Why can deinit not perform async cleanup?

### Strong Answer Signals

- Describes borrowed isolation and truthful independence.
- Rejects annotation-based silencing.

### Weak Answer Signals

- Treats `nonisolated` as unsafe escape syntax.
- Assumes isolated deinit can await.

### Related Theory

- [Constraints and Guarantees](theory.md#constraints-and-guarantees)

---

<a id="q4-actors-versus-locks"></a>
## Q4: When Should You Choose an Actor Versus a Lock?

### What It Evaluates

System-level isolation topology and synchronization judgment.

### Short Answer

Choose an actor for shared mutable state with asynchronous clients and operations that
belong to one invariant owner. Choose an audited lock or mutex for a small synchronous
critical section that cannot suspend. Prefer immutable values when sharing is unnecessary.

### Detailed Answer

Actors add async boundaries and reentrancy; locks add manual proof and must never span
await. Coarse owners simplify transactions but can bottleneck. Fine actor graphs add hops
and cannot create atomicity across several owners.

### Engineering Trade-offs

- Actors provide compiler-visible isolation with scheduling cost.
- Locks preserve synchronous APIs with deadlock/race proof burden.
- Snapshots avoid shared mutation but can be stale.

### Production Scenario

Checkout spans inventory and payment. Separate actors own local invariants, while an
orchestrator handles idempotency and compensation instead of pretending calls are atomic.

### Follow-up Questions

- How would you measure actor contention?
- Where should a cross-actor transaction live?

### Strong Answer Signals

- Chooses boundaries from invariants.
- Covers reentrancy, hops, deadlocks, and distributed consistency.

### Weak Answer Signals

- Creates an actor per class mechanically.
- Holds a lock across await.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
