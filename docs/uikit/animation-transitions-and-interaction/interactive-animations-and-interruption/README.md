---
title: "Interactive Animations and Interruption"
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

# Interactive Animations and Interruption

> Interactive motion maps user input to progress and must remain correct when the
> person reverses, cancels, or repeats the gesture. The final model and hierarchy
> depend on completion, not on the animation merely starting.

## Quick Recall

- Clamp gesture progress and combine distance with velocity when deciding whether
  to finish.
- Return an interaction controller only while an interactive transition is active.
- Call `finish()` or `cancel()` once, then clean up from the reported outcome.
- Preserve velocity when settling and test repeated reversals on real hardware.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
