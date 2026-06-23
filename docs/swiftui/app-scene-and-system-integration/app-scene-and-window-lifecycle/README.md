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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - app-lifecycle
  - scenes
  - multiwindow
---

# App, Scene, and Window Lifecycle

> The app process can host several independent scenes. Put durable shared state above
> scenes, scene-specific navigation and selection inside each scene, and treat lifecycle
> notifications as opportunities to synchronize rather than guaranteed shutdown hooks.

## Quick Recall

- An `App` declares one or more scenes; a scene represents system-managed UI instances.
- `WindowGroup` can create multiple windows from the same scene declaration.
- Each window needs independent presentation state and stable access to shared data.
- `scenePhase` reports `.active`, `.inactive`, or `.background` for lifecycle reactions.
- Persist important changes continuously because background or termination callbacks
  are not guaranteed.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
