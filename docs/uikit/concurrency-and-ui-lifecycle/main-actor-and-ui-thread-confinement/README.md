---
title: "MainActor and UI Thread Confinement"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# MainActor and UI Thread Confinement

> Code that reads or changes UIKit state runs on the main thread. In modern
> Swift, `MainActor` expresses that rule in the type system. CPU-heavy work must
> still run elsewhere so the interface stays responsive.

## Quick Recall

- Touch UIKit views and view-controller state from the main actor.
- Mark UI-facing types or methods `@MainActor` when the boundary is yours.
- Use `await MainActor.run` for a small UI update from nonisolated async code.
- Do not run CPU-heavy work on the main actor just because the result updates UI.
- `Task.detached` does not inherit main-actor isolation; avoid it for UIKit work.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
