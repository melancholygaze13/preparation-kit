---
title: "Object Graph Cycles and Non-Owning References"
domain: "Swift"
topic: "Automatic Reference Counting"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Object Graph Cycles and Non-Owning References

> A strong cycle keeps objects alive after their real owner is gone. Break the
> cycle by making an edge non-owning only when the lifetime model supports it.

## Quick Recall

- `weak` references are optional and become `nil` after deallocation.
- `unowned` references assume the target is still alive when accessed.
- Use `weak` when the observed object may end first.
- Use `unowned` only when another invariant guarantees the lifetime.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [ARC Ownership and Object Lifetime](../arc-ownership-and-object-lifetime/README.md)

## Related Concepts

- [Conformance and Module Ownership](../../extensions/conformance-and-module-ownership/README.md)
- [Closure, Callback, and Task Lifetimes](../closure-callback-and-task-lifetimes/README.md)
