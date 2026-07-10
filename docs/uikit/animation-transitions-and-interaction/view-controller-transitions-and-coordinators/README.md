---
title: "View Controller Transitions and Coordinators"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-10
---

# View Controller Transitions and Coordinators

> UIKit owns the transition lifecycle and container hierarchy. A custom animator
> configures views through the transition context, while a transition coordinator
> synchronizes related UI with system or custom transitions.

## Quick Recall

- Prefer built-in navigation, sheet, zoom, and presentation transitions unless
  custom motion communicates a relationship the system cannot express.
- Read controllers, views, frames, and cancellation from the transition context.
- Always call `completeTransition` with the correct cancellation result.
- Use the transition coordinator for alongside animations and cancellation-aware
  cleanup outside the main animator.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
