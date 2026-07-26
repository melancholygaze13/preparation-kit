---
title: "Property Animators and Animation Options"
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

# Property Animators and Animation Options

> Animation options control timing and behaviors such as repetition or user
> interaction. `UIViewPropertyAnimator` represents an animation as an object that
> code can pause, reverse, continue, or connect to a gesture.

## Quick Recall

- Keep logical correctness independent of animation duration or completion.
- Use block animations for simple one-shot changes and property animators for
  explicit lifecycle control.
- On iOS 18 and later, use a SwiftUI `Animation` with `UIView.animate` when a
  mixed-framework interface needs shared timing or continuous retargeting.
- Establish constraint start and end layouts with `layoutIfNeeded()`.
- Choose motion by purpose and frequency, preserve interaction, and provide a
  Reduce Motion alternative.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
