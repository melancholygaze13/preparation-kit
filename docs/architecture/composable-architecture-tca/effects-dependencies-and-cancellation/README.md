---
title: "Effects, Dependencies, and Cancellation"
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
last_reviewed: 2026-08-12
tags:
  - tca
  - effects
  - cancellation
---

# Effects, Dependencies, and Cancellation

> A reducer describes asynchronous work as an effect instead of performing it during
> state mutation. Dependencies provide the outside capability, and effect results return
> as actions so ordering, failure, cancellation, and state changes stay visible.

## Quick Recall

- Capture required state before creating an effect; do not access mutable state later.
- Use `@Dependency` for clocks, clients, IDs, and other outside capabilities.
- Map success and expected failure back into domain actions.
- Use stable cancellation IDs and distinguish operations that may run at the same time.
- Cancellation is cooperative; the dependency must stop or ignore cancelled work.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
