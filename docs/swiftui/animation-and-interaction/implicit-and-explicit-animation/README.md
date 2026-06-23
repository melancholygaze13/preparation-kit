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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - animation
  - transactions
  - reduce-motion
---

# Implicit and Explicit Animation

> SwiftUI animates changes between old and new animatable values when the state
> mutation occurs in a transaction carrying an animation.

## Quick Recall

- `withAnimation` animates animatable changes caused by mutations in its transaction.
- `.animation(_:value:)` scopes implicit animation to changes in one value.
- Animation does not create state or decide business timing.
- Interrupted animations continue from the current presentation value.
- Respect Reduce Motion and avoid motion required to understand the result.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
