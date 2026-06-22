---
title: "Behavioral Contracts and Substitutability"
domain: "Swift"
topic: "Inheritance"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Behavioral Contracts and Substitutability

> A subtype is valid only when code written for the base type remains correct with
> the subtype, including invariants, failure, effects, ordering, and isolation.

## Quick Recall

- Do not strengthen accepted-input requirements or weaken promised results.
- Preserve invariants, failure categories, side-effect ordering, idempotency, and complexity commitments.
- Equality and hashing must remain coherent across a hierarchy used in sets or dictionaries.
- Isolation, sendability, and suspension behavior are part of modern behavioral contracts.
- If callers switch on concrete subtype to be safe, the base abstraction is not doing its job.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Subclassing and Override Semantics](../subclassing-and-override-semantics/README.md)
- [Inheritance Boundaries and Framework Evolution](../inheritance-boundaries-and-framework-evolution/README.md)
