---
title: "Existentials, Composition, and Delegation: Interview Questions"
domain: "Swift"
topic: "Protocols"
concept: "Existentials, Composition, and Delegation"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Existentials, Composition, and Delegation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should an API use a generic versus any Protocol?](#q1-generic-versus-existential) | Senior | Type relationships and erasure |
| [How should a delegate contract define ownership and concurrency?](#q2-delegate-contract) | Staff | Lifecycle and isolation |

---

<a id="q1-generic-versus-existential"></a>
## Q1: When Should an API Use a Generic Versus any Protocol?

### What It Evaluates

Understanding of static polymorphism and existential erasure.

### Short Answer

Use a generic or `some P` when one concrete type and its input/output relationships must
be preserved. Use `any P` for heterogeneous storage, runtime replacement, or a deliberate
module boundary where concrete identity is not part of the contract.

### Detailed Answer

An existential stores a value with type metadata and witnesses and can introduce boxing
or dynamic dispatch. Generics support specialization and associated relationships but can
increase code size and expose generic structure in APIs.

### Engineering Trade-offs

- Generics preserve information and optimize well.
- Existentials simplify runtime composition and stable boundaries.

### Production Scenario

A rendering pipeline is generic internally, then erases renderers at a plugin registry
where implementations are selected from configuration.

### Follow-up Questions

- What does implicit opening of an existential permit?
- When is a custom type eraser still useful?

### Strong Answer Signals

- Chooses based on relationships and boundary needs.
- Mentions allocation/dispatch as measured trade-offs.

### Weak Answer Signals

- Calls `any` simply more flexible.
- Chooses generics solely for speed.

### Related Theory

- [Mental Model](theory.md#mental-model)

---

<a id="q2-delegate-contract"></a>
## Q2: How Should a Delegate Contract Define Ownership and Concurrency?

### What It Evaluates

Applied lifecycle design beyond protocol syntax.

### Short Answer

Specify whether the delegate is weak or retained, its callback actor/queue, ordering,
cardinality, reentrancy, failure, cancellation, and what happens when no delegate exists.
Class-bound weak delegates avoid cycles but can disappear.

### Detailed Answer

Optional Objective-C requirements fit interoperability, not required business operations.
For structured results, async functions or sequences often express lifetime and cancellation
better. Sendable values must cross any isolation boundary.

### Engineering Trade-offs

- Delegates support runtime one-to-one collaboration.
- Async APIs make completion ownership explicit but may require adapters.

### Production Scenario

A weak upload delegate disappears and completion is lost. The operation returns an async
result while progress remains a documented main-actor stream.

### Follow-up Questions

- Why must weak delegates be class-bound?
- When is an optional requirement justified?

### Strong Answer Signals

- Covers absence, teardown, actor, and cancellation.
- Selects async alternatives when appropriate.

### Weak Answer Signals

- Says delegates should always be weak.
- Leaves callback context undocumented.

### Related Theory

- [How It Works](theory.md#how-it-works)
