---
title: "Model-View and SwiftUI State Ownership"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - model-view
  - swiftui
  - state-ownership
---

# Model-View and SwiftUI State Ownership

> Model-View is a valid SwiftUI architecture when models own state and rules while
> views render and send clear actions. Add a boundary when another responsibility
> needs an explicit owner.

## Quick Recall

- SwiftUI does not require MVVM. Observation lets views depend directly on model
  data while SwiftUI keeps the interface in sync.
- Model-View fits when state, actions, navigation, and async lifetime remain simple
  and testable through the model.
- A view can own transient presentation state. Durable product state and business
  rules should not depend on a view's lifetime.
- Add a view model, reducer, coordinator, use case, or service for a specific pressure,
  not because every screen must have the same extra role.
- Watch for large view bodies, unrestricted bindings, duplicated state, hidden tasks,
  and behavior testable only through UI.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
