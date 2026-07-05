---
title: "MainActor and UI Thread Confinement"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-05
---

# MainActor and UI Thread Confinement

> UIKit state belongs on the main thread. In modern Swift, `MainActor` is the
> type-system way to express that rule for UI-facing code, while expensive work
> must still move away from the main actor.

## Quick Recall

- Touch UIKit views and view-controller state from the main actor.
- Mark UI-facing types or methods `@MainActor` when the boundary is yours.
- Use `await MainActor.run` for a small UI update from nonisolated async code.
- Do not run CPU-heavy work on the main actor just because the result updates UI.
- `Task.detached` does not inherit main-actor isolation; avoid it for UIKit work.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
