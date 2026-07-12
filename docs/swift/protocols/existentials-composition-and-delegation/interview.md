---
title: "Existentials, Composition, and Delegation: Interview Questions"
domain: "Swift"
topic: "Protocols"
concept: "Existentials, Composition, and Delegation"
page_type: interview
interview_priority: high
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-07-12
---

# Existentials, Composition, and Delegation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should an API use a generic versus any Protocol?](#q1-generic-versus-existential) | Senior | Type relationships and erasure |
| [How should a delegate contract define ownership and concurrency?](#q2-delegate-contract) | Staff | Lifecycle and isolation |
| [When is weak delegation the wrong lifetime model?](#q3-weak-delegate-lifetime) | Senior | Required delivery |

---

<a id="q1-generic-versus-existential"></a>
## Q1: When Should an API Use a Generic Versus any Protocol?

### Short Answer

Use a generic or `some P` when one concrete type and its input/output relationships must
be preserved. Use `any P` for mixed-type storage, runtime replacement, or a deliberate
module boundary where concrete identity is not part of the contract.

### Expanded Answer

An existential stores a value with type metadata and witnesses and can introduce boxing
or dynamic dispatch. Generics support specialization and associated relationships but can
increase code size and expose generic structure in APIs.

### Trade-offs

- Generics preserve information and optimize well.
- Existentials simplify runtime composition and stable boundaries.

### Example

A rendering pipeline is generic internally, then erases renderers at a plugin registry
where implementations are selected from configuration.

---

<a id="q2-delegate-contract"></a>
## Q2: How Should a Delegate Contract Define Ownership and Concurrency?

### Short Answer

Specify whether the delegate is weak or retained, its callback actor/queue, ordering,
cardinality, reentrancy, failure, cancellation, and what happens when no delegate exists.
Class-bound weak delegates avoid cycles but can disappear.

### Expanded Answer

Optional Objective-C requirements fit interoperability, not required business operations.
For structured results, async functions or sequences often express lifetime and cancellation
better. Sendable values must cross any isolation boundary.

### Trade-offs

- Delegates support runtime one-to-one collaboration.
- Async APIs make completion ownership explicit but may require adapters.

### Example

A weak upload delegate disappears and completion is lost. The operation returns an async
result while progress remains a documented main-actor stream.

---

<a id="q3-weak-delegate-lifetime"></a>
## Q3: When Is Weak Delegation the Wrong Lifetime Model?

### Short Answer

Weak delegation is wrong when completion or state delivery is required for correctness.
The delegate can disappear at any time. Use an owned async result, retained collaborator,
or another lifecycle where the component responsible for delivery remains alive.

### Expanded Answer

Weak references solve one possible retain cycle. They do not define cancellation,
completion, or fault handling. Choose ownership from the delivery contract, then break
cycles deliberately.
