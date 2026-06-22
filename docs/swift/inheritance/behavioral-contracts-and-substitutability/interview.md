---
title: "Behavioral Contracts and Substitutability: Interview Questions"
domain: "Swift"
topic: "Inheritance"
concept: "Behavioral Contracts and Substitutability"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Behavioral Contracts and Substitutability: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What makes a subclass substitutable?](#q1-substitutability) | Senior | Preconditions and postconditions |
| [Why is equality difficult in open hierarchies?](#q2-hierarchy-equality) | Senior | Symmetry and subtype state |
| [How do effects and isolation affect substitutability?](#q3-effects-and-isolation) | Staff | Operational contracts |

---

<a id="q1-substitutability"></a>
## Q1: What Makes a Subclass Substitutable?

### Short Answer

Any caller written to the base contract must remain correct with the subclass. The
subclass must not reject valid base inputs, weaken promised results, violate invariants,
or change failure, effects, ordering, idempotency, and complexity beyond the contract.
Signature compatibility is necessary but insufficient.

### Expanded Answer

If callers downcast or branch on subtype before normal operations, either the base
contract is incomplete or the hierarchy combines types that are not substitutable.

### Trade-offs

- Strong base contracts enable polymorphism.
- Broad contracts constrain future subtype behavior.
- Composition permits independent capabilities without one universal promise.

### Example

A storage subtype rejects filenames accepted by the base interface. Splitting a
capability or making constraints part of the base contract removes the runtime surprise.

---

<a id="q2-hierarchy-equality"></a>
## Q2: Why Is Equality Difficult in Open Hierarchies?

### Short Answer

A subtype may add state it considers equality-relevant while the base comparison
cannot know that state. Base-versus-subtype comparisons can then violate symmetry or
transitivity, and hashing can disagree. Prefer one stable identity rule for the whole
hierarchy, or use final/value-like types when equality depends on complete representation.

### Expanded Answer

Collections require equality and hashing coherence. Exact-dynamic-type equality avoids
some contradictions but may violate callers' base-domain expectations. The policy must
be explicit rather than patched per subtype.

### Trade-offs

- Stable IDs give uniform entity equality.
- Structural equality fits closed final values.
- Open subtype-specific equality is flexible but difficult to make lawful.

### Example

A base account compares IDs while a premium subtype also compares tier. Opposite
comparison directions disagree. The hierarchy adopts ID equality and moves tier comparison elsewhere.

---

<a id="q3-effects-and-isolation"></a>
## Q3: How Do Effects and Isolation Affect Substitutability?

### Short Answer

Callers depend on latency, failure, cancellation, ordering, reentrancy, and executor
requirements as well as return values. An override that adds blocking I/O or escapes
actor-isolated mutable state can violate the base contract. Global-actor isolation
propagates through subclasses, and state must be revalidated after suspension.

### Expanded Answer

Some effects are type-system-visible through `async`, `throws`, or isolation; others
need documentation and contract tests. Per-module default isolation should not be
assumed to define an exported cross-package contract.

### Trade-offs

- Explicit effects improve correctness but constrain all implementations.
- Hidden effects preserve signatures while breaking operations.
- Composition can isolate effectful policy from a synchronous base model.

### Example

A local cache override starts remote refresh inside a synchronous lookup. Tail latency
and reentrancy break callers. An injected async loader makes the effect explicit.
