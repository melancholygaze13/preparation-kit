---
title: "App, Scene, Window, and System Integration"
domain: "UIKit"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-07-26
---

# App, Scene, Window, and System Integration

This topic explains who owns UIKit state above a single screen. The app object
represents the process. Each scene represents one interface session, and each
window contains that scene's visible controller hierarchy.

## Preparation Paths

- **Rapid review:** Study process, scene, window, and controller ownership plus
  scene connection, backgrounding, disconnection, and discard behavior.
- **Standard preparation:** Complete Application, Scene, and Window Lifecycle.
- **Role-specific depth:** Add multiwindow and Handoff for document or iPad apps.
  Add system chrome for navigation-platform, branded, or immersive interfaces.

## Learning Path

1. [Application, Scene, and Window Lifecycle](application-scene-and-window-lifecycle/README.md)
2. **Optional role-specific depth:**
   [Multiwindow, State Restoration, and Handoff](multiwindow-state-restoration-and-handoff/README.md)
3. **Optional role-specific depth:**
   [Appearance, Bars, Status, and System Chrome](appearance-bars-status-and-system-chrome/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Application, Scene, and Window Lifecycle](application-scene-and-window-lifecycle/README.md) | Separates process, scene, and visible-window responsibilities. | High | 9 min |
| [Multiwindow, State Restoration, and Handoff](multiwindow-state-restoration-and-handoff/README.md) | Preserves independent user activities across scenes and devices. | Situational | 7 min |
| [Appearance, Bars, Status, and System Chrome](appearance-bars-status-and-system-chrome/README.md) | Coordinates app styling with platform-owned interface elements. | Situational | 7 min |
