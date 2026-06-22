---
title: "Custom Operators and Precedence Groups"
domain: "Swift"
topic: "Advanced Operators"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Custom Operators and Precedence Groups

> Custom punctuation is a grammar extension: fixity, precedence, associativity, whitespace, and global collision behavior become part of the API.

## Quick Recall

- Fixity is part of the declaration; prefix and postfix forms of one symbol are distinct.
- Precedence determines grouping relative to other infix groups.
- Associativity controls chains at the same precedence: left, right, or none.
- `assignment: true` is reserved for assignment-like parsing behavior, including optional chaining interaction.
- Precedence does not create short-circuiting, concurrency ordering, or documented side-effect policy.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Operator Overloading and Compound Assignment](../operator-overloading-and-compound-assignment/README.md)

## Related Concepts

- [Conditional and Logical Operators](../../basic-operators/conditional-and-logical-operators/README.md)
