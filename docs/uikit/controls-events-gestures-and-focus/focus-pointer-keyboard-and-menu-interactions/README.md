---
title: "Focus, Pointer, Keyboard, and Menu Interactions"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Focus, Pointer, Keyboard, and Menu Interactions

> UIKit is not only touch. Focus identifies which item receives non-touch input.
> Pointer, keyboard, and menu interactions should trigger the same app actions as
> touch when the device and context support them.

## Quick Recall

- Focus selects the currently active element for keyboard, remote, or game
  controller navigation.
- Pointer interactions add hover feedback on pointer-capable devices.
- Keyboard commands should route to the active context and avoid stealing text
  input.
- Menus expose commands and alternate actions without crowding the screen.
- Non-touch input should reuse the same intent layer as touch controls.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
