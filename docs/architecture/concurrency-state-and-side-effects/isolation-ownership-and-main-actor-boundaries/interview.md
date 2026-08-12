---
title: "Isolation Ownership and Main-Actor Boundaries: Interview Questions"
domain: "Architecture"
topic: "Concurrency, State, and Side Effects"
concept: "Isolation Ownership and Main-Actor Boundaries"
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
  - actor-isolation
  - main-actor
  - ownership
---

# Isolation Ownership and Main-Actor Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose an isolation owner?](#q1-how-do-you-choose-an-isolation-owner) | Senior | State ownership |
| [What belongs on the main actor?](#q2-what-belongs-on-the-main-actor) | Senior | UI boundary |
| [Can an actor still have logical races?](#q3-can-an-actor-still-have-logical-races) | Senior | Reentrancy |

---

<a id="q1-how-do-you-choose-an-isolation-owner"></a>
## Q1: How do you choose an isolation owner?

### Short Answer

I start from the mutable state and its rule. UI-facing state normally belongs to the
main actor. Shared service state may need a custom actor. Immutable values need no actor.
I expose operations that preserve the owner's rule and pass `Sendable` values across the
boundary.

### Expanded Answer

I use the smallest sufficient owner. A stateless network client does not need an actor
just because its methods are async. A token coordinator may need one because credential
state and refresh deduplication must change together. I avoid returning mutable internal
objects that let callers bypass the owner.

### Trade-offs

A custom actor prevents concurrent access to its state but adds async calls, transfer
constraints, reentrancy decisions, and testing cost. A lock can fit a small synchronous
critical section, but it moves more proof onto the team.

<a id="q2-what-belongs-on-the-main-actor"></a>
## Q2: What belongs on the main actor?

### Short Answer

Presentation state and operations that access UI frameworks belong on the main actor.
Suspending network I/O is fine there because suspension does not block the actor. I move
CPU-heavy synchronous work out and return an immutable result for the UI to commit.

### Expanded Answer

I annotate the UI-facing type or API instead of scattering main-queue dispatch calls.
That makes the boundary visible and compiler-checked. I also inspect module settings:
Swift 6.2 can use default main-actor isolation, so an omitted annotation may not mean the
type is nonisolated.

<a id="q3-can-an-actor-still-have-logical-races"></a>
## Q3: Can an actor still have logical races?

### Short Answer

Yes. An actor prevents simultaneous access to its isolated state, but an actor method can
suspend at `await`. Another operation may run and change state before the first resumes.
I revalidate state after suspension before committing.

### Expanded Answer

The actor protects memory access, while the feature still defines which completion is
allowed to win. An in-flight-task registry can deduplicate work, and a generation or
version can reject obsolete results. The check belongs after the suspension, immediately
before the state change.

### Example

Two callers can both observe an empty cache, suspend for the same download, and later
write results in completion order. The cache can store one in-flight task per key, or it
can accept duplicate work but validate which result is allowed to commit.
