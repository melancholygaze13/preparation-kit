---
title: "Type Methods and API Design"
domain: "Swift"
topic: "Methods"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Type Methods and API Design

> Type methods express behavior about a type as a whole; they should create values,
> describe type policy, or coordinate explicitly owned type state—not hide dependencies.

## Quick Recall

- Declare type methods with `static`; classes can use `class` when overriding the
  method is intentionally supported.
- Inside a type method, `self` is the type, which supports polymorphic factories where applicable.
- Prefer initializers for direct construction and named type methods for distinct
  policies, parsing, presets, or cached/canonical results.
- Type methods do not justify hidden singletons or mutable global dependencies.
- Mutable type state accessed by methods still requires explicit actor isolation or synchronization.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Instance Methods and Self Semantics](../instance-methods-and-self-semantics/README.md)
- [Mutating Value Types and State Transitions](../mutating-value-types-and-state-transitions/README.md)
