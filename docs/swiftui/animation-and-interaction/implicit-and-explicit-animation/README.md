---
title: "Implicit and Explicit Animation"
domain: "SwiftUI"
topic: "Animation and Interaction"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - animation
  - transactions
  - reduce-motion
---

# Implicit and Explicit Animation

> An implicit animation is attached to a view and a changing value. An explicit
> animation wraps a specific state mutation. Both put animation information into an
> update transaction so SwiftUI can interpolate changed presentation values.

## Quick Recall

- `withAnimation` animates animatable changes caused by mutations in its transaction.
- `.animation(_:value:)` scopes implicit animation to changes in one value.
- Animation does not create state or decide business timing.
- Interrupted animations continue from the current presentation value.
- Respect Reduce Motion and avoid motion required to understand the result.

The model changes immediately. Animation controls how the visual result moves toward
that new value. Business logic must remain correct when motion is disabled, interrupted,
or replaced by another target.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
