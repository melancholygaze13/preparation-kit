---
title: "Access Duration and Exclusivity Enforcement: Interview Questions"
domain: "Swift"
topic: "Memory Safety"
concept: "Access Duration and Exclusivity Enforcement"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Access Duration and Exclusivity Enforcement: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When do two accesses conflict?](#q1-conflict-conditions) | Senior | Location, duration, mutation |
| [Why can exclusivity trap at runtime?](#q2-dynamic-enforcement) | Senior | Dynamic aliasing |
| [How does exclusivity differ from thread safety?](#q3-thread-safety) | Staff | Concurrency ownership |

---

<a id="q1-conflict-conditions"></a>
## Q1: When Do Two Accesses Conflict?

### What It Evaluates

Precise use of Swift's exclusivity model.

### Short Answer

They conflict when they access the same memory location, their durations overlap, and at least one
is a write. `inout` calls and mutating methods create long-term access, so code executed during the
call can overlap even when individual source expressions look separate.

### Detailed Answer

Two reads are allowed. A write plus read/write conflicts. Resolve by removing aliasing, shortening
the access, copying the intended snapshot, returning a result, or moving mutation into one owner.

### Engineering Trade-offs

- Scoped mutation can be efficient and expressive.
- Long access across arbitrary code increases reentrancy and alias risk.

### Production Scenario

A mutating state transition calls a delegate that reads the same state. The API computes the change,
ends temporary access, commits, then notifies through an immutable snapshot.

### Follow-up Questions

- Which accesses are long-term?
- Can different syntax still alias one location?

### Strong Answer Signals

- Names all three conflict conditions.
- Includes reentrancy.

### Weak Answer Signals

- Explains only simultaneous threads.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-dynamic-enforcement"></a>
## Q2: Why Can Exclusivity Trap at Runtime?

### What It Evaluates

Static versus dynamic proof boundaries.

### Short Answer

Some alias relationships are known only when the program runs, so compile-time analysis cannot
prove a conflict. Swift dynamically tracks relevant accesses and traps if their actual storage
overlaps. The trap prevents unsafe continuation; it is not an error to catch.

### Detailed Answer

Globals, computed properties, captured values, and indirect aliases often hide identity. Reproduce
the concrete path, identify both access starts, and redesign the boundary instead of disabling checks.

### Engineering Trade-offs

- Dynamic checks preserve safety for flexible code.
- More explicit ownership and values improve static diagnostics and predictability.

### Production Scenario

Two key paths resolve to the same property and enter a helper as separate `inout` arguments. A runtime
trap reveals the alias; the API changes to one aggregate update.

### Follow-up Questions

- Is an exclusivity trap memory-safe?
- Why are computed properties harder to prove disjoint?

### Strong Answer Signals

- Connects runtime checks to unresolved aliasing.
- Rejects suppression as a fix.

### Weak Answer Signals

- Calls the trap random compiler behavior.

### Related Theory

- [Constraints and Guarantees](theory.md#constraints-and-guarantees)

---

<a id="q3-thread-safety"></a>
## Q3: How Does Exclusivity Differ from Thread Safety?

### What It Evaluates

Separation of memory access and concurrent coordination.

### Short Answer

Exclusivity governs overlapping access to one storage location and can fail on one thread. Thread
safety governs concurrently shared state, ordering, and invariants. Passing exclusivity checks does
not serialize tasks or make a multi-step update atomic.

### Detailed Answer

Actors, locks, or atomics establish concurrency policy. Code must still respect exclusivity within
those boundaries. Atomics protect defined individual operations, not arbitrary aggregate invariants.

### Engineering Trade-offs

- Exclusivity supports value mutation safety.
- Synchronization adds ordering and contention appropriate to shared owners.

### Production Scenario

Two callbacks independently mutate a dictionary and never trigger a local exclusivity trap, yet race.
An actor takes ownership and serializes complete state transitions.

### Follow-up Questions

- Where does `Sendable` fit?
- When is a lock preferable to an actor?

### Strong Answer Signals

- Separates single-thread overlap from data races.
- Selects an explicit shared-state owner.

### Weak Answer Signals

- Claims exclusivity makes collections thread-safe.

### Related Theory

- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)
