---
title: "Identity, Aliasing, and Mutation Ownership"
domain: "Swift"
topic: "Classes and Structures"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-22
---

# Identity, Aliasing, and Mutation Ownership

> Identity asks whether two references name the same instance; safe shared mutation
> additionally requires one explicit owner for lifecycle, synchronization, and policy.

## Quick Recall

- `===` tests class-instance identity; `==` tests value equality.
- Aliases can observe mutation through the same reference.
- Shared mutation needs a clear owner and synchronization strategy.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Type Design and Initialization](../type-design-and-initialization/README.md)
- [Value and Reference Semantics](../value-and-reference-semantics/README.md)
