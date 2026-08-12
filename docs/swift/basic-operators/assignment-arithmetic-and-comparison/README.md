---
title: "Assignment, Arithmetic, and Comparison"
domain: "Swift"
topic: "Basic Operators"
page_type: concept-index
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - arithmetic
  - equality
  - overflow
---

# Assignment, Arithmetic, and Comparison

> An operator's behavior depends on its operand types. The same symbol does not
> imply the same ownership, precision, or equality rules for every type.

## Quick Recall

- Assignment copies a value type's stored value. Any class references inside
  that value still refer to the same objects.
- Normal integer overflow traps. The `&+`, `&-`, and `&*` operators wrap.
- Integer division truncates toward zero. `%` returns a remainder.
- `==` tests value equality. `===` tests whether two class references point to
  the same instance.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisite

- [Numeric Types and Conversions](../../language-basics/numeric-types-and-conversions/README.md)
