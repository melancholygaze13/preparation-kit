---
title: "Constants and Variables"
domain: "Swift"
topic: "Language Basics"
page_type: concept-index
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-22
---

# Constants and Variables

> `let` creates a binding that is assigned once. `var` creates mutable storage
> whose value can be replaced or changed while keeping the same type.

## Quick Recall

- `var` allows reassignment, but the variable's type does not change.
- A `var` struct or collection can use mutating operations.
- `let` prevents reassignment and mutation through a value-type binding.
- `let` and `var` control rebinding of a class reference, not whether the object
  itself has mutable properties.
- Prefer `let` by default, but use a local `var` when an algorithm clearly
  accumulates or changes state.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
