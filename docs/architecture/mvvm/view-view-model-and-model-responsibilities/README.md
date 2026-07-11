---
title: "View, View Model, and Model Responsibilities"
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
  - responsibilities
  - presentation
---

# View, View Model, and Model Responsibilities

> MVVM separates presentation coordination from rendering and product policy. The
> view model earns its place only when it owns real presentation behavior.

## Quick Recall

- The view renders state and turns interaction into clear inputs.
- The view model owns presentation state, display transformation, and coordination.
- Models and use cases own reusable product rules; services and repositories own
  external mechanisms and data policy.
- Do not put navigation, persistence, networking, and every business rule into one
  view model. Delegate to the boundary that owns each decision.
- MVVM fits presentation-heavy screens. Direct Model-View is cheaper when a view model
  would only forward properties and methods.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
