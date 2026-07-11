---
title: "Testing, Adoption, and Library Trade-offs"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - tca
  - test-store
  - architecture-adoption
---

# Testing, Adoption, and Library Trade-offs

> `TestStore` can prove state transitions, received actions, dependencies, and effect
> completion. That strength is valuable when a product has complex state and effects,
> but TCA also adds a library model, upgrade work, and team-wide conventions.

## Quick Recall

- Use `TestStore` with async tests; `@MainActor` is recommended for its isolated API.
- Exhaustive tests fit leaf features; non-exhaustive tests can focus composed flows.
- Override dependencies and advance controlled clocks instead of using live services or sleeps.
- Adopt TCA for a measured problem, not because reducers guarantee good architecture.
- Pin versions, budget migrations, and isolate product contracts from changing library syntax.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
