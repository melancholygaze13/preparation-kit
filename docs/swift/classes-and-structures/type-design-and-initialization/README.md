---
title: "Type Design and Initialization"
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

# Type Design and Initialization

> Choose a structure for an independent value and a class when stable identity or
> shared lifecycle is part of the model; design initialization as an invariant boundary.

## Quick Recall

- Prefer a struct for an independent value.
- Prefer a class when identity or shared lifetime is part of the model.
- Initialization should reject or prevent invalid state.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Value and Reference Semantics](../value-and-reference-semantics/README.md)
- [Identity, Aliasing, and Mutation Ownership](../identity-aliasing-and-mutation-ownership/README.md)
