---
title: "Dependency Tracking and Update Propagation"
domain: "SwiftUI"
topic: "View System and Rendering"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - observation
  - invalidation
  - dependency-tracking
---

# Dependency Tracking and Update Propagation

> SwiftUI records dependencies while evaluating a view, then invalidates affected
> work when those dependencies change. Invalidation makes an update eligible; it
> does not mean the entire screen redraws or that `body` runs immediately.

## Quick Recall

- View inputs, state, environment values, and observable properties can be
  dependencies.
- `@Observable` tracks properties read from specific instances during `body`.
- A computed property is tracked through the observable properties it reads.
- Narrow inputs and focused subviews can reduce unnecessary update work.
- Observation reports changes; it does not provide actor isolation or thread safety.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
