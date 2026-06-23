---
title: "Task Modifier and View Lifetime"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
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
  - task-modifier
  - view-lifetime
  - cancellation
---

# Task Modifier and View Lifetime

> A SwiftUI `.task` belongs to a view identity. SwiftUI starts it when that identity
> enters the hierarchy and can cancel it when the identity disappears or its task ID changes.

## Quick Recall

- Prefer `.task` to launching `Task` from `onAppear`.
- Use `.task(id:)` when work depends on an equatable input.
- Cancellation is a request; called code must cooperate.
- View-scoped work should not own operations that must outlive the view.
- Appearance can happen repeatedly, so make loading idempotent or cache it in the model.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
