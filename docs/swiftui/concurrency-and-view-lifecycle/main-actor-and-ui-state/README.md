---
title: "MainActor and UI State"
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
  - main-actor
  - actor-isolation
  - observable
---

# MainActor and UI State

> Put UI-facing mutable state in the main actor's isolation domain. Isolation
> serializes access; it does not make expensive synchronous work safe for responsiveness.

## Quick Recall

- SwiftUI `View` code is main-actor isolated in modern Swift.
- UI models should be `@MainActor` unless the module supplies that default isolation.
- An `await` is a suspension point, not a promise of background execution.
- Recheck actor state after every suspension.
- Move CPU-heavy pure work deliberately; ordinary async I/O does not block while suspended.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
