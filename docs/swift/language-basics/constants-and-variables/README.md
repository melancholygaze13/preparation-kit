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
last_reviewed: 2026-06-22
---

# Constants and Variables

> `let` prevents reassignment of a binding. `var` allows reassignment. Neither
> keyword makes a referenced class instance thread-safe or deeply immutable.

## Quick Recall

- Prefer `let` when a binding should not change after initialization.
- A `let` property of a struct prevents mutation through that value.
- A `let` class reference can still refer to a mutable object.
- Local mutation is often clearer than hidden shared mutation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
