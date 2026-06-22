---
title: "Operator Overloading and Compound Assignment"
domain: "Swift"
topic: "Advanced Operators"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Operator Overloading and Compound Assignment

> Operator overloads are static functions whose familiar syntax creates strong expectations about laws, cost, mutation, and failure.

## Quick Recall

- Existing operators need no new declaration; custom symbols do.
- Prefix, postfix, and infix forms are distinct declarations.
- Compound assignment conventionally mutates `inout` left-hand storage and returns `Void`.
- Equality, ordering, and arithmetic overloads must preserve documented semantic laws.
- Familiar syntax should not hide surprising I/O, blocking, failure, or nonlinear cost.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Type Methods and API Design](../../methods/type-methods-and-api-design/README.md)

## Related Concepts

- [Custom Operators and Precedence Groups](../custom-operators-and-precedence-groups/README.md)
- [Requirements, Conformance, and Synthesis](../../protocols/requirements-conformance-and-synthesis/README.md)
