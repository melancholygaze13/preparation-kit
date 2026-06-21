---
title: "Behavioral Contracts and Substitutability: Theory"
domain: "Swift"
topic: "Inheritance"
concept: "Behavioral Contracts and Substitutability"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
tags: [substitutability, contracts, polymorphism, invariants]
---

# Behavioral Contracts and Substitutability: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> A subclass is correct only if any caller using the base contract remains correct
> when given the subclass.

- Do not strengthen accepted-input requirements or weaken promised results.
- Preserve invariants, failure categories, side-effect ordering, idempotency, and complexity commitments.
- Equality and hashing must remain coherent across a hierarchy used in sets or dictionaries.
- Isolation, sendability, and suspension behavior are part of modern behavioral contracts.
- If callers switch on concrete subtype to be safe, the base abstraction is not doing its job.

## Mental Model

Inheritance says “is substitutable for,” not “shares some fields.” Test every base-level
operation against subtypes without giving the caller special knowledge.

## How It Works

### Preconditions and Postconditions

If a base method accepts every nonnegative amount, a subtype cannot reject amounts
above an arbitrary smaller limit unless that restriction is already part of the base
contract. If the base promises a completed result, a subtype cannot silently return
partial work. Subtypes can provide stronger results when callers do not need new assumptions.

### Effects and Failure

An override that adds network I/O, starts unstructured work, changes synchronous
ordering, or introduces new common failures can violate callers even when the type
signature compiles. `async` and `throws` are visible effects, but latency, cancellation,
reentrancy, and external mutation also require documentation.

### Equality and Identity

Class hierarchies make equality difficult when subtypes add equality-relevant state.
Symmetry can fail if base equality ignores subtype fields while subtype equality does
not. Prefer stable domain identifiers or final value-like classes; avoid open `Hashable`
hierarchies unless one equality rule applies uniformly.

### Concurrency Contract

A globally isolated base class establishes an execution boundary inherited by its
subclasses. Overrides must not smuggle mutable state outside that isolation. Across
`await`, revalidate actor state as usual; inheritance does not make a suspended override atomic.

### Core Invariants

- Base callers need no subtype-specific branch for correctness.
- Accepted input and promised output remain compatible.
- Failure, effects, and ordering stay within the advertised contract.
- Equality is reflexive, symmetric, and transitive across supported dynamic types.
- Isolation and lifecycle rules remain valid for every subtype.

### Constraints and Guarantees

- Signature compatibility is compiler-checked; full behavioral substitutability is not.
- Access control limits declarations, not semantic misuse by permitted subclasses.
- `final` can make closed-world reasoning enforceable.
- Base references dispatch to supported overrides dynamically.
- Unit tests cannot prove arbitrary external subclasses correct; open designs need defensive contracts.

## Failure Modes

- **Strengthened precondition:** A valid base input fails only for one subtype.
- **Weakened postcondition:** A subtype returns incomplete or differently normalized data.
- **Hidden effect:** An override blocks, performs I/O, or changes ordering unexpectedly.
- **Asymmetric equality:** `a == b` differs from `b == a` across dynamic types.
- **Subtype switch:** Clients downcast before every meaningful operation.
- **Isolation escape:** Override exposes shared mutable state beyond the base actor boundary.

## Engineering Judgment

Use inheritance only when one stable contract governs every subtype. Use protocols for
capability composition, enums for closed alternatives, and strategy/decorator objects
for replaceable behavior. Favor a final class when identity is needed but subclassing is not.

## Production Considerations

Build contract tests once and run them against all supported implementations. Include
boundary inputs, failures, cancellation, ordering, equality, performance envelopes,
and concurrency isolation. Observe behavior by contract outcome rather than assuming
subtype names map permanently to product policy.

## Staff and Principal Perspective

Substitutability failures are system failures when base types cross team boundaries.
Publish executable contract suites, compatibility budgets, ownership, and escalation
paths. Review subtype additions for operational effects and rollout impact, not only API shape.

## Common Mistakes

### Same Signature Means Substitutable

**Why it is wrong:** The compiler cannot verify domain invariants, latency, ordering,
or hidden side effects.

**Better approach:** Specify and execute behavioral contract tests.

### Inheritance Is Code Reuse

**Why it is wrong:** It creates a polymorphic promise and lifecycle coupling, not just reuse.

**Better approach:** Use composition when shared implementation does not imply substitutability.

## References

- [The Swift Programming Language: Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
