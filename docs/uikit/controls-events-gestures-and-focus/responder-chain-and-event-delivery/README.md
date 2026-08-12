---
title: "Responder Chain and Event Delivery"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Responder Chain and Event Delivery

> UIKit first finds the view that should receive an input event. For actions
> that do not name a target, UIKit then walks the linked responder chain until an
> object can handle the requested method.

## Quick Recall

- Hit testing starts at the window and selects the frontmost eligible view.
- `UIResponder` objects form a chain through views, view controllers, windows,
  scenes, and the application.
- The first responder is the starting point for keyboard input and many commands.
- Targetless actions use the responder chain to find an object that implements
  the action.
- Custom event routing should be local and explainable; broad overrides are hard
  to debug.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
