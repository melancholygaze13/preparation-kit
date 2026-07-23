---
title: "Actors, Global Actors, and Reentrancy: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Actors, Global Actors, and Reentrancy"
page_type: interview
interview_priority: core
estimated_read_minutes: 4
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Actors, Global Actors, and Reentrancy: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What can change across await inside an actor?](#q1-actor-reentrancy) | Senior | Stale-state bugs |
| [When should you use MainActor or a custom global actor?](#q2-global-actors) | Staff | Global isolation |
| [How do isolated and nonisolated shape an API?](#q3-isolated-and-nonisolated) | Staff | Borrowed and exposed isolation |
| [When should you choose an actor versus a lock?](#q4-actors-versus-locks) | Principal | Ownership boundaries |

---

<a id="q1-actor-reentrancy"></a>
## Q1: What Can Change Across `await` Inside an Actor?

### Short Answer

Other work can run on the actor while the method is suspended. State checked before
`await` may therefore be stale. Finish related state changes before suspending when
possible. Otherwise, check a generation number or token before saving the result.
Track running work when duplicate requests matter.

### Expanded Answer

Actor isolation prevents simultaneous isolated access but does not make an entire async
method atomic. Capture awaited results locally. Never force-unwrap state based on a check
made before suspension.

### Trade-offs

- Reentrancy permits progress while one operation waits.
- Generations reject stale work but add state.
- Shared tasks need a rule for whether one caller can cancel work used by others.

### Example

A cache refresh suspends, invalidation runs, then the stale refresh returns. A generation
check rejects its commit.

---

<a id="q2-global-actors"></a>
## Q2: When Should You Use MainActor or a Custom Global Actor?

### Short Answer

Use `@MainActor` for UI and lifecycle state whose required rules belong to the main actor.
Use a custom global actor only when many declarations genuinely share one process-wide
actor boundary. Neither is a general lock or a promise to use one fixed thread.

### Expanded Answer

Global actors simplify synchronous access within one domain but serialize unrelated work
if applied broadly. Swift 6.2 default actor isolation is per module, and isolated conformances
can keep protocol use on the correct global actor.

### Trade-offs

- Broad isolation simplifies ownership but can increase contention and coupling.
- Narrower actors improve independence but add hops and message design.

### Example

A UI-heavy app defaults its app target to `MainActor`, while networking and model libraries
retain explicit nonisolated APIs. Settings are documented at module boundaries.

---

<a id="q3-isolated-and-nonisolated"></a>
## Q3: How Do isolated and nonisolated Shape an API?

### Short Answer

An `isolated` actor parameter borrows that actor's domain so the function can perform
multiple synchronous isolated accesses without repeated hops. `nonisolated` states that
a declaration does not require actor state and can be used outside the actor boundary.

### Expanded Answer

Both make promises about allowed access. `nonisolated` is appropriate for immutable
identifiers or requirements that do not use actor state. Do not use it only to silence
a compiler error. `isolated deinit` allows synchronous cleanup on the actor. Async
cleanup still needs an explicit method.

### Trade-offs

- Borrowed isolation reduces hops but couples the helper to caller execution.
- Nonisolated access improves usability but can expose only truly independent data.

### Example

A transaction helper takes an isolated database actor and performs several related
operations synchronously on that actor.

---

<a id="q4-actors-versus-locks"></a>
## Q4: When Should You Choose an Actor Versus a Lock?

### Short Answer

Choose an actor for shared mutable state with asynchronous clients and operations that
belong to one state owner. Choose an audited lock or mutex for a small synchronous
critical section that cannot suspend. Prefer immutable values when sharing is unnecessary.

### Expanded Answer

Actors add async boundaries and allow other actor work during suspension. Locks
require careful manual reasoning and must never span `await`. Larger state owners
simplify related changes but can become bottlenecks. Many small actors add hops and
cannot make changes across several actors indivisible.

### Trade-offs

- Actors provide compiler-visible isolation with scheduling cost.
- Locks preserve synchronous APIs but require the developer to prevent deadlocks and races.
- Snapshots avoid shared mutation but can be stale.

### Example

Checkout spans inventory and payment. Separate actors protect their own state. A
coordinator makes retries safe and repairs partial failure instead of pretending
that every call succeeds as one indivisible transaction.
