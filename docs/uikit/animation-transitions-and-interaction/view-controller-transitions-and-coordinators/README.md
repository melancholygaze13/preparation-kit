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
last_reviewed: 2026-07-26
---

# View Controller Transitions and Coordinators

> UIKit owns the transition lifecycle and temporary container view. A custom
> animator defines how the old and new screens move. A transition coordinator
> lets other UI animate at the same time as a system or custom transition.

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
