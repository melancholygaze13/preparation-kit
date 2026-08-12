---
title: "App, Scene, and Window Lifecycle"
domain: "SwiftUI"
topic: "App, Scene, and System Integration"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - app-lifecycle
  - scenes
  - multiwindow
---

# App, Scene, and Window Lifecycle

> `App` is the SwiftUI entry point. A scene declares a system-managed UI instance,
> and a window is one visible scene presentation. One process can host several scenes
> and windows with independent navigation and selection.

## Quick Recall

- An `App` declares one or more scenes; a scene represents system-managed UI instances.
- `WindowGroup` can create multiple windows from the same scene declaration.
- Each window needs independent presentation state and stable access to shared data.
- `scenePhase` reports `.active`, `.inactive`, or `.background` for lifecycle reactions.
- Persist important changes continuously because background or termination callbacks
  are not guaranteed.

Put durable shared data above scenes and keep presentation state inside each scene.
Treat lifecycle changes as chances to pause or synchronize. They are not guaranteed
shutdown hooks and must not be the only time user work is saved.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
