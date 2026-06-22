---
title: "Failable, Required, and Evolving Initializers"
domain: "Swift"
topic: "Initialization"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Failable, Required, and Evolving Initializers

> Construction APIs must make invalid input, subclass obligations, external effects,
> and compatibility explicit rather than returning partially valid instances.

## Quick Recall

- `init?` returns `nil` when valid construction is impossible.
- `init!` can trap when implicitly unwrapped at use and is mainly for compatibility.
- `required` makes subclasses provide or inherit the initializer.
- Avoid hiding network or other long-running work inside initialization.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Stored-Property Initialization and Delegation](../stored-property-initialization-and-delegation/README.md)
- [Class Initialization and Two-Phase Safety](../class-initialization-and-two-phase-safety/README.md)
