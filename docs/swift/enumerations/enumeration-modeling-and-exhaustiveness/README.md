---
title: "Enumeration Modeling and Exhaustiveness"
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
  - state-modeling
  - exhaustiveness
  - case-iterable
---

# Enumeration Modeling and Exhaustiveness

> An enum defines one value chosen from a finite set of cases. Its main benefit is
> not shorter syntax but making mutually exclusive states and exhaustive decisions
> compiler-visible.

## Quick Recall

- One enum value holds exactly one case at a time.
- An exhaustive `switch` forces handling of every known state.
- Prefer an enum over several Booleans that permit invalid combinations.
- `CaseIterable` is correct only when all cases can be listed without payloads.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Conditional Branching and Pattern Matching](../../control-flow/conditional-branching-and-pattern-matching/README.md)

## Related Concepts

- [Associated Values and Pattern Matching](../associated-values-and-pattern-matching/README.md)
- [Raw Values, Recursive Enums, and Evolution](../raw-values-recursive-enums-and-evolution/README.md)
