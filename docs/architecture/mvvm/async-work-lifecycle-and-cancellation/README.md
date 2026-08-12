---
title: "Async Work, Lifecycle, and Cancellation"
domain: "Architecture"
topic: "MVVM"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - mvvm
  - concurrency
  - cancellation
---

# Async Work, Lifecycle, and Cancellation

> Async work needs an owner whose lifetime matches the user outcome. Cancellation
> stops unwanted work only when the operation cooperates, and stale results still
> need an explicit acceptance rule.

## Quick Recall

- Use `@MainActor` for view-model presentation state unless another isolation model
  is deliberate.
- A SwiftUI `.task` follows view lifetime; view-model-created tasks need stored handles
  and explicit cancellation.
- Cancellation is cooperative. Check or propagate it and do not turn cancellation
  into a user-visible failure by default.
- Actor isolation prevents data races, not older requests overwriting newer intent.
- Durable or shared work belongs in a longer-lived service or repository, not a
  screen-scoped view model.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
