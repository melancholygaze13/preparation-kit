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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - task-modifier
  - view-lifetime
  - cancellation
---

# Task Modifier and View Lifetime

> A SwiftUI `.task` belongs to a view identity. SwiftUI starts it when that identity
> enters the hierarchy and can cancel it when the identity disappears or its task ID changes.

A task is one asynchronous operation. The `.task` modifier attaches that operation
to a SwiftUI view identity. View lifetime means the period for which that identity
remains part of the hierarchy, not the time it is visible on screen.

## Quick Recall

- Prefer `.task` to launching `Task` from `onAppear`.
- Use `.task(id:)` when work depends on an equatable input.
- Cancellation is a request; called code must cooperate.
- View-scoped work should not own operations that must outlive the view.
- Appearance can happen repeatedly, so make loading idempotent or cache it in the model.
- Task names help diagnostics but do not change cancellation, priority, or ownership.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
