---
title: "App, Scene, and Window Lifecycle: Interview Questions"
domain: "SwiftUI"
topic: "App, Scene, and System Integration"
concept: "App, Scene, and Window Lifecycle"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-23
tags:
  - app-lifecycle
  - scenes
  - multiwindow
---

# App, Scene, and Window Lifecycle: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do app and scene lifetimes differ?](#q1-how-do-app-and-scene-lifetimes-differ) | Senior | State ownership |
| [How should an app react to scenePhase?](#q2-how-should-an-app-react-to-scenephase) | Senior | Lifecycle guarantees |
| [How would you design a multiwindow feature?](#q3-how-would-you-design-a-multiwindow-feature) | Staff | Independent scenes and shared data |

---

<a id="q1-how-do-app-and-scene-lifetimes-differ"></a>
## Q1: How do app and scene lifetimes differ?

### Short Answer

The app process can host multiple scene instances. I keep account data and durable
services at process scope, while each scene owns its navigation, selection, and
presentation state. View-local state remains below both.

### Expanded Answer

`WindowGroup` describes windows the system may instantiate repeatedly. Assuming it is
one global window causes navigation and sheets in different windows to interfere. A
scene should hold a stable identifier for the content it presents and resolve current
data through shared repositories.

<a id="q2-how-should-an-app-react-to-scenephase"></a>
## Q2: How should an app react to scenePhase?

### Short Answer

I use `scenePhase` to pause visible work and request synchronization when a scene moves
between active, inactive, and background. I do not depend on it for the only save,
because the process can end without a final lifecycle callback.

### Expanded Answer

Durable edits are persisted during the normal mutation path. Background handling is
idempotent and short. View tasks use structured cancellation, while genuinely shared
work has an owner whose lifetime is not tied to one view.

<a id="q3-how-would-you-design-a-multiwindow-feature"></a>
## Q3: How would you design a multiwindow feature?

### Short Answer

Each window gets independent presentation state and a stable content identifier. All
windows use a shared durable store that publishes coherent changes. System window
actions open or dismiss scenes, and restoration rebuilds from identifiers rather than
retaining view instances.

### Expanded Answer

I test conflicting edits, closing and restoring windows, deep links, backgrounding one
scene, and global events such as sign-out. The design specifies conflict policy and
whether opening the same identifier activates an existing window or creates another.

### Trade-offs

Sharing one scene model is simple but couples unrelated windows. Fully isolated data
copies avoid interference but create synchronization problems. Shared durable data with
scene-local presentation state usually gives the correct ownership boundary.
