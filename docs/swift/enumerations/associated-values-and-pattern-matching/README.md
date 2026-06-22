---
title: "Associated Values and Pattern Matching"
domain: "Swift"
topic: "Enumerations"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - enumerations
  - associated-values
  - pattern-matching
  - state-machines
---

# Associated Values and Pattern Matching

> Associated values let each enum case carry exactly the data valid for that
> alternative. Patterns test the case and bind its payload in one type-safe
> operation.

## Quick Recall

- Each case can carry a different payload type.
- Associated values are runtime data; raw values are fixed case codes.
- Pattern matching checks the case and extracts its data together.
- Model state transitions where the enum's owner can enforce them.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Enumeration Modeling and Exhaustiveness](../enumeration-modeling-and-exhaustiveness/README.md)
- [Conditional Branching and Pattern Matching](../../control-flow/conditional-branching-and-pattern-matching/README.md)

## Related Concepts

- [Raw Values, Recursive Enums, and Evolution](../raw-values-recursive-enums-and-evolution/README.md)
