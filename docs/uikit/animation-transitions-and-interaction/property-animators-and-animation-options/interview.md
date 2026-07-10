---
title: "Property Animators and Animation Options: Interview Questions"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
concept: "Property Animators and Animation Options"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-10
---

# Property Animators and Animation Options: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you choose `UIViewPropertyAnimator`?](#q1-property-animator) | Senior | API selection |
| [How do you animate Auto Layout changes correctly?](#q2-auto-layout-animation) | Senior | Constraint animation |
| [How do you handle repeated input during an animation?](#q3-repeated-input) | Senior | Retargeting and state |
| [How would you define animation standards for a large app?](#q4-motion-standards) | Staff | Consistency and governance |

---

<a id="q1-property-animator"></a>
## Q1: When would you choose `UIViewPropertyAnimator`?

### Short Answer

I use block animations for simple one-shot changes. I choose a property animator when
I need to pause, scrub, reverse, retarget, add animations, or continue with new timing.

### Expanded Answer

A property animator exposes lifecycle and progress through `UIViewAnimating`. It fits
gesture-driven cards, interruptible controls, and custom view-controller transitions.
I retain one animator for the interaction and clear it after completion.

For a fixed fade or constraint change, a block animation is simpler. I do not add
animator state when the feature never needs to control it.

---

<a id="q2-auto-layout-animation"></a>
## Q2: How do you animate Auto Layout changes correctly?

### Short Answer

I establish the start layout, change the constraint, and call `layoutIfNeeded()`
inside the animation block on the common ancestor that owns the affected layout.

### Expanded Answer

Changing a constraint constant changes layout rules, not visible pixels directly.
The first layout pass makes the starting frames current. The animated layout pass
computes and interpolates to the destination frames.

If the wrong view receives `layoutIfNeeded()`, part of the hierarchy may jump. I also
avoid forcing layout repeatedly in scrolling or gesture hot paths without profiling.

---

<a id="q3-repeated-input"></a>
## Q3: How do you handle repeated input during an animation?

### Short Answer

I keep one source of truth, accept or reject the new intent explicitly, and retarget
from the current presentation. I do not assume the first completion means success.

### Expanded Answer

For a simple block animation, `beginFromCurrentState` can continue from an in-flight
value. For direct manipulation, I pause or reverse a property animator. Completion
uses the final animator position or transition cancellation state.

Disabling all input can hide bugs and make the UI feel blocked. If actions conflict,
I gate only that command and restore it on every finish and cancellation path.

---

<a id="q4-motion-standards"></a>
## Q4: How would you define animation standards for a large app?

### Short Answer

I would define semantic motion roles, interruption and Reduce Motion behavior,
performance budgets, and testing expectations. I would keep feature-specific timing
possible when interaction meaning differs.

### Expanded Answer

Shared components should provide purposeful defaults and current-state retargeting.
They should not animate every change. I would profile worst-case screens, add
signposts for expensive shared transitions, and review frequent interactions more
strictly than rare onboarding motion.

Adoption should be incremental. A shared motion layer must preserve system gestures,
accessibility settings, and cancellation before teams treat it as a default.

### Trade-offs

Central standards improve cohesion and diagnostics. An inflexible abstraction can
erase interaction meaning or hide animator state, which makes interruption bugs
harder to solve.
