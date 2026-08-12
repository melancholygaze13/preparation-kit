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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - commands
  - widgets
  - app-intents
---

# Commands, Settings, Widgets, and System Actions

> Commands expose menu and keyboard actions. Settings provide platform preference UI.
> Widgets show system-managed timeline entries. System actions ask the surrounding
> platform to open, dismiss, or perform another capability.

## Quick Recall

- Scene commands should act on focused window state, not an arbitrary global instance.
- A `Settings` scene integrates app preferences on platforms that support it.
- Widgets render timeline entries and receive refresh opportunities from the system.
- Interactive widget actions use App Intents rather than arbitrary in-process closures.
- Environment actions such as `openURL`, `dismiss`, and `openWindow` preserve system
  ownership of presentation.

Treat every surface as an adapter around one authorized application operation. The
focused scene, widget extension, App Intent, and main app have different lifetimes,
but they should not implement different business rules.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
