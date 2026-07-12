---
title: "Testability, Complexity, and Adoption"
domain: "Architecture"
topic: "VIPER"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-12
tags:
  - viper
  - testability
  - architecture-trade-offs
---

# Testability, Complexity, and Adoption

> VIPER can isolate presentation and use-case tests, but every boundary adds protocols,
> wiring, navigation contracts, and maintenance. Adopt it only when those costs solve a
> real team or feature problem.

## Quick Recall

- Test observable behavior at presenter, interactor, and routing boundaries.
- Do not create one protocol per concrete type without a substitution need.
- Small features often pay more in indirection than they gain in isolation.
- Prefer incremental adoption for new or high-change modules over a full rewrite.
- Compare VIPER with MVVM, coordinators, and unidirectional state for the actual constraints.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Architecture Testing and Testability](../../architecture-testing-and-testability/README.md)
- [Incremental Replacement and Compatibility Boundaries](../../architecture-evolution-and-migration/incremental-replacement-and-compatibility-boundaries/README.md)
