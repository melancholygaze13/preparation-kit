---
title: "Inputs, Outputs, Bindings, and Observation"
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
last_reviewed: 2026-07-11
tags:
  - mvvm
  - observation
  - bindings
---

# Inputs, Outputs, Bindings, and Observation

> A view model exposes renderable state and accepts user intent. Observation carries
> change notifications; it does not decide ownership or make every property safe to
> mutate.

## Quick Recall

- Prefer a small state model over many independent observable flags.
- Use intent methods for policy-sensitive changes and bindings for simple editing of
  state already owned by the view model.
- With Observation, a SwiftUI view tracks the observable properties read by `body`.
- `@State` manages view-owned observable model lifetime; `@Bindable` creates bindings;
  `@Environment` distributes a dependency through a hierarchy.
- Keep one-time events distinct from durable presentation state and define delivery
  behavior explicitly.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
