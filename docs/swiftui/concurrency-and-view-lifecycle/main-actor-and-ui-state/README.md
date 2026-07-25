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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - main-actor
  - actor-isolation
  - observable
---

# MainActor and UI State

> Put UI-facing mutable state in the main actor's isolation domain. Isolation
> serializes access; it does not make expensive synchronous work safe for responsiveness.

An actor protects mutable state by allowing isolated code to access it in turn.
`MainActor` is Swift's global actor for UI work. UI state is the mutable information
that determines what the interface shows and which actions are available.

## Quick Recall

- SwiftUI `View` code is main-actor isolated in modern Swift.
- UI models should be `@MainActor` unless the module supplies that default isolation.
- An `await` is a suspension point, not a promise of background execution.
- Recheck actor state after every suspension.
- Move CPU-heavy pure work deliberately; ordinary async I/O does not block while suspended.
- Values crossing isolation boundaries should be `Sendable` or otherwise compiler-proven safe.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
