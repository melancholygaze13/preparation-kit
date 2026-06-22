---
title: "Bitwise and Overflow Arithmetic"
domain: "Swift"
topic: "Advanced Operators"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Bitwise and Overflow Arithmetic

> Bitwise operators transform fixed-width representations; overflow policy must be explicit because ordinary integer arithmetic does not silently wrap.

## Quick Recall

- Ordinary integer overflow traps at runtime or is diagnosed for constant expressions.
- Wrapping arithmetic keeps the low fixed-width bits and is correct only for modular algorithms.
- Reporting-overflow APIs return a partial value plus an overflow flag without trapping.
- Bit masks need documented width, signedness, endianness, and reserved-bit policy.
- Bitwise syntax does not validate untrusted lengths, offsets, flags, or wire formats.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Numeric Types and Conversions](../../language-basics/numeric-types-and-conversions/README.md)

## Related Concepts

- [Assignment, Arithmetic, and Comparison](../../basic-operators/assignment-arithmetic-and-comparison/README.md)
- [Unsafe Memory and Foreign Boundaries](../../memory-safety/unsafe-memory-and-foreign-boundaries/README.md)
