---
title: "Stored and Computed Properties"
domain: "Swift"
topic: "Properties"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-08-12
---

# Stored and Computed Properties

> Store the original facts. Compute values that are derived, cheap enough, and
> consistent with their dependencies; use lazy storage only with a clear lifecycle.

## Quick Recall

- Store the original facts and compute values derived from them.
- A computed property runs its getter on each access unless another layer caches it.
- `lazy` delays first initialization and requires mutable storage.
- Lazy initialization alone is not thread-safe.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Property Observers and Mutation Boundaries](../property-observers-and-mutation-boundaries/README.md)
- [Property Wrappers and Type Properties](../property-wrappers-and-type-properties/README.md)
