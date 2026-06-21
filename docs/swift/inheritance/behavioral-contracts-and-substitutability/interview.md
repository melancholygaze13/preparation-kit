---
title: "Behavioral Contracts and Substitutability: Interview Questions"
domain: "Swift"
topic: "Inheritance"
concept: "Behavioral Contracts and Substitutability"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Whether “is-a” is understood as a behavioral promise.

### Short Answer

Any caller written to the base contract must remain correct with the subclass. The
subclass must not reject valid base inputs, weaken promised results, violate invariants,
or change failure, effects, ordering, idempotency, and complexity beyond the contract.
Signature compatibility is necessary but insufficient.

### Detailed Answer

If callers downcast or branch on subtype before normal operations, either the base
contract is incomplete or the hierarchy combines types that are not substitutable.

### Engineering Trade-offs

- Strong base contracts enable polymorphism.
- Broad contracts constrain future subtype behavior.
- Composition permits independent capabilities without one universal promise.

### Production Scenario

A storage subtype rejects filenames accepted by the base interface. Splitting a
capability or making constraints part of the base contract removes the runtime surprise.

### Follow-up Questions

- Can a subtype strengthen a result?
- How do you test substitutability?
- What does repeated downcasting indicate?

### Strong Answer Signals

- Covers inputs, outputs, effects, and invariants.
- Uses base-level contract tests.
- Questions subtype-dependent callers.

### Weak Answer Signals

- Defines substitutability as shared fields.
- Relies only on compilation.
- Accepts subtype switches everywhere.

### Related Theory

- [Preconditions and Postconditions](theory.md#preconditions-and-postconditions)

---

<a id="q2-hierarchy-equality"></a>
## Q2: Why Is Equality Difficult in Open Hierarchies?

### What It Evaluates

Recognition of equality laws across dynamic types.

### Short Answer

A subtype may add state it considers equality-relevant while the base comparison
cannot know that state. Base-versus-subtype comparisons can then violate symmetry or
transitivity, and hashing can disagree. Prefer one stable identity rule for the whole
hierarchy, or use final/value-like types when equality depends on complete representation.

### Detailed Answer

Collections require equality and hashing coherence. Exact-dynamic-type equality avoids
some contradictions but may violate callers' base-domain expectations. The policy must
be explicit rather than patched per subtype.

### Engineering Trade-offs

- Stable IDs give uniform entity equality.
- Structural equality fits closed final values.
- Open subtype-specific equality is flexible but difficult to make lawful.

### Production Scenario

A base account compares IDs while a premium subtype also compares tier. Opposite
comparison directions disagree. The hierarchy adopts ID equality and moves tier comparison elsewhere.

### Follow-up Questions

- Which equality laws must hold?
- How must hashing align?
- Would exact-type equality fit the domain?

### Strong Answer Signals

- Names symmetry and transitivity.
- Aligns hashing.
- Selects one hierarchy-wide rule.

### Weak Answer Signals

- Lets each subtype independently redefine equality.
- Ignores base/subtype comparisons.
- Uses mutable fields in hash identity.

### Related Theory

- [Equality and Identity](theory.md#equality-and-identity)

---

<a id="q3-effects-and-isolation"></a>
## Q3: How Do Effects and Isolation Affect Substitutability?

### What It Evaluates

Modern operational reasoning beyond method signatures.

### Short Answer

Callers depend on latency, failure, cancellation, ordering, reentrancy, and executor
requirements as well as return values. An override that adds blocking I/O or escapes
actor-isolated mutable state can violate the base contract. Global-actor isolation
propagates through subclasses, and state must be revalidated after suspension.

### Detailed Answer

Some effects are type-system-visible through `async`, `throws`, or isolation; others
need documentation and contract tests. Per-module default isolation should not be
assumed to define an exported cross-package contract.

### Engineering Trade-offs

- Explicit effects improve correctness but constrain all implementations.
- Hidden effects preserve signatures while breaking operations.
- Composition can isolate effectful policy from a synchronous base model.

### Production Scenario

A local cache override starts remote refresh inside a synchronous lookup. Tail latency
and reentrancy break callers. An injected async loader makes the effect explicit.

### Follow-up Questions

- Does actor isolation make an async override transactional?
- How should cancellation be specified?
- What changes across module isolation settings?

### Strong Answer Signals

- Treats operational behavior as contract.
- Understands actor reentrancy.
- Makes exported isolation explicit.

### Weak Answer Signals

- Considers only types and return values.
- Assumes `async` means background work.
- Uses unchecked sendability to silence hierarchy errors.

### Related Theory

- [Effects and Failure](theory.md#effects-and-failure)
- [Concurrency Contract](theory.md#concurrency-contract)
