---
title: "Commands, Settings, Widgets, and System Actions"
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
  - commands
  - widgets
  - app-intents
---

# Commands, Settings, Widgets, and System Actions

> System entry points are adapters around application capabilities. Route commands to
> the focused scene, keep widgets timeline-driven, and make App Intents or environment
> actions validate identifiers through the same domain boundaries as the main app.

## Quick Recall

- Scene commands should act on focused window state, not an arbitrary global instance.
- A `Settings` scene integrates app preferences on platforms that support it.
- Widgets render timeline entries and receive refresh opportunities from the system.
- Interactive widget actions use App Intents rather than arbitrary in-process closures.
- Environment actions such as `openURL`, `dismiss`, and `openWindow` preserve system
  ownership of presentation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
