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
last_reviewed: 2026-06-22
tags:
  - arithmetic
  - equality
  - overflow
---

# Assignment, Arithmetic, and Comparison

> An operator's behavior depends on its operand types. The same symbol does not
> imply the same ownership, precision, or equality rules for every type.

## Quick Recall

- Assignment copies a value type's value. It copies a class reference, not the
  referenced object.
- Normal integer overflow traps. The `&+`, `&-`, and `&*` operators wrap.
- Integer division truncates toward zero. `%` returns a remainder.
- `==` tests value equality. `===` tests whether two class references point to
  the same instance.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisite

- [Numeric Types and Conversions](../../language-basics/numeric-types-and-conversions/README.md)
