---
title: "Property Wrappers and Type Properties"
domain: "Swift"
topic: "Properties"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-22
---

# Property Wrappers and Type Properties

> Property wrappers reuse storage policy through generated APIs; type properties
> share state across instances, so both abstractions require explicit ownership.

## Quick Recall

- `wrappedValue` defines normal property access.
- `projectedValue` exposes an additional API through `$property`.
- Wrappers hide generated storage but not their runtime cost or behavior.
- Mutable type properties are global shared state and need isolation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Stored and Computed Properties](../stored-and-computed-properties/README.md)
- [Property Observers and Mutation Boundaries](../property-observers-and-mutation-boundaries/README.md)
