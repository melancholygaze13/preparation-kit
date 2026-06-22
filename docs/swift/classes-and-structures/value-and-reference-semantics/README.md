---
title: "Value and Reference Semantics"
domain: "Swift"
topic: "Classes and Structures"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
---

# Value and Reference Semantics

> Value assignment produces an independent value, while class assignment shares
> one instance; neither statement implies eager copying, deep immutability, or thread safety.

## Quick Recall

- Assigning a value type creates an independent logical value.
- Assigning a class reference shares one instance.
- Copy-on-write is an optimization, not a different value-semantic contract.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Type Design and Initialization](../type-design-and-initialization/README.md)
- [Identity, Aliasing, and Mutation Ownership](../identity-aliasing-and-mutation-ownership/README.md)
