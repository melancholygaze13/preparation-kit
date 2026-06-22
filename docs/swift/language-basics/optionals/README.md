---
title: "Optionals"
domain: "Swift"
topic: "Language Basics"
page_type: concept-index
levels:
  - senior
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Optionals

> `Optional<Wrapped>` represents either a wrapped value or `nil`. Use it only
> when absence is a valid state with clear meaning.

## Quick Recall

- Optional binding unwraps a value for one control-flow branch.
- `guard` is useful when the value is required for the remaining scope.
- Optional chaining propagates absence through member access.
- Force unwrap only when a nearby invariant proves the value exists.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
