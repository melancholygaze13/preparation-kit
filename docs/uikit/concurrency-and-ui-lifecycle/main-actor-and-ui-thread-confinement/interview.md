---
title: "MainActor and UI Thread Confinement: Interview Questions"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
concept: "MainActor and UI Thread Confinement"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
---

# MainActor and UI Thread Confinement: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why does UIKit code belong on the main actor?](#q1-main-actor-purpose) | Senior | UI isolation |
| [How do you update UI from async work?](#q2-update-ui-from-async-work) | Senior | Actor hops |
| [Can `@MainActor` cause performance problems?](#q3-main-actor-performance) | Staff | Responsiveness |
| [When would you avoid `Task.detached`?](#q4-task-detached) | Staff | Isolation correctness |

---

<a id="q1-main-actor-purpose"></a>
## Q1: Why does UIKit code belong on the main actor?

### Short Answer

UIKit is main-thread-bound. `MainActor` lets Swift express that rule in the type
system, so UI state and view updates happen through one serialized isolation
domain.

### Expanded Answer

I would mark UI-facing controllers or view models `@MainActor` when I own them.
That makes labels, buttons, screen state, and rendering methods main-actor
isolated. Services, parsing, and caches should usually stay outside that
boundary.

---

<a id="q2-update-ui-from-async-work"></a>
## Q2: How do you update UI from async work?

### Short Answer

Run the expensive work outside UIKit, then hop back to the main actor for the UI
update. If the controller is already `@MainActor`, returning to its methods gives
you that isolation.

### Expanded Answer

For a small update from nonisolated code, I would use `await MainActor.run`.
For a screen flow, I prefer a main-actor controller or view model that awaits a
service call and then renders the accepted result.

---

<a id="q3-main-actor-performance"></a>
## Q3: Can `@MainActor` cause performance problems?

### Short Answer

Yes. `@MainActor` protects UI access, but any slow synchronous work on it can
still block rendering and input. It is a correctness boundary, not a background
execution mechanism.

### Expanded Answer

If image decoding or large data processing runs on the main actor, the app can
hitch even though the code is data-race safe. With Swift 6.2 approachable
concurrency, I use `@concurrent` for CPU-heavy async work that must leave the
caller's actor. I publish only the final UI state on `MainActor`.

---

<a id="q4-task-detached"></a>
## Q4: When would you avoid `Task.detached`?

### Short Answer

I avoid `Task.detached` for normal UIKit work because it does not inherit
main-actor isolation, priority, or structured cancellation. It is easy to update
UI from the wrong isolation.

### Expanded Answer

I use structured concurrency or a stored `Task` for screen-scoped work. If I
truly need detached background work, it should produce data, not touch UIKit.
The UI update still needs an explicit main-actor hop.
