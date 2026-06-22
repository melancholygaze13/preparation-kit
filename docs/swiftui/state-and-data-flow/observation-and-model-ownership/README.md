---
title: "Observation and Model Ownership"
domain: "SwiftUI"
topic: "State and Data Flow"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - observation
  - model-ownership
  - observable
---

# Observation and Model Ownership

> `@Observable` makes model property access trackable; it does not decide who owns
> the model. Use `@State` for a view-owned instance, a plain property for an
> injected reader, and `@Bindable` only when the consumer needs bindings.

## Quick Recall

- Observation tracks properties read from specific model instances.
- Create a view-owned observable model once with private `@State`.
- Passing an observable reference as a plain property still supports updates.
- `@Bindable` adds binding projection; it does not add ownership.
- Observation does not provide actor isolation, thread safety, or persistence.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
