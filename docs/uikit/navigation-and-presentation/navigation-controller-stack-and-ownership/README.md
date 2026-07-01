---
title: "Navigation Controller Stack and Ownership"
domain: "UIKit"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-01
---

# Navigation Controller Stack and Ownership

> A navigation controller owns a stack of view controllers. Push when the next
> screen is part of the same task hierarchy; present when the user is entering a
> separate modal flow.

## Quick Recall

- `UINavigationController` is a container view controller.
- The navigation stack is ordered from root to top; only the top controller is
  active onscreen.
- A child view controller should not mutate unrelated siblings or the root flow.
- The pushed controller owns its content; the flow owner owns when to push, pop,
  or replace stack state.
- Back navigation should preserve task meaning, not just reverse an animation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
