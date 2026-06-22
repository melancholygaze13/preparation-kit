---
title: "Runtime Type Checks and Downcasting"
domain: "Swift"
topic: "Type Casting"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Runtime Type Checks and Downcasting

> Use runtime casts when static information has been intentionally erased; prefer
> conditional casts unless a local invariant proves a forced cast cannot fail.

## Quick Recall

- `value is T` tests whether a value can be treated as `T`.
- `value as T` performs an upcast or another conversion the compiler can prove.
- `value as? T` conditionally downcasts and returns `T?`.
- `value as! T` traps when the runtime value is not `T`; reserve it for proven local invariants.
- Repeated subtype switching often signals a missing polymorphic method, protocol, or enum model.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Heterogeneous Values and Boundary Design](../heterogeneous-values-and-boundary-design/README.md)
