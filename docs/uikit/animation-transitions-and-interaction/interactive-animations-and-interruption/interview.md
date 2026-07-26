---
title: "Interactive Animations and Interruption: Interview Questions"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
concept: "Interactive Animations and Interruption"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-26
---

# Interactive Animations and Interruption: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you build a percent-driven transition?](#q1-percent-driven-transition) | Senior | Interactive transition flow |
| [How do you decide whether a gesture finishes?](#q2-finish-decision) | Senior | Distance and velocity |
| [How do you keep state correct after cancellation?](#q3-cancellation-state) | Senior | Model and hierarchy |
| [How would you diagnose a jerky interactive transition?](#q4-diagnose-interaction) | Staff | Performance and integration |

---

<a id="q1-percent-driven-transition"></a>
## Q1: How do you build a percent-driven transition?

### Short Answer

I start navigation when the gesture begins, map clamped translation to progress, and
call `update`. On release I call `finish` or `cancel` exactly once.

### Expanded Answer

The container delegate returns the `UIPercentDrivenInteractiveTransition` only while
the gesture is active. A separate transition animator defines the start and end
visual states. Direction and progress must account for layout direction and bounds.

Returning the interaction controller for a normal transition can leave UIKit waiting
for updates that never arrive.

---

<a id="q2-finish-decision"></a>
## Q2: How do you decide whether a gesture finishes?

### Short Answer

I combine clamped progress with direction-aware velocity. Sufficient distance or a
deliberate flick toward the destination finishes; cancellation or opposing intent
returns to the start.

### Expanded Answer

A fixed halfway rule ignores fast, intentional flicks. Velocity alone can commit an
accidental move. I tune thresholds on real devices and include resistance beyond
natural bounds.

The remaining settlement should preserve release velocity when possible. Reduced
Motion can shorten travel or use a fade while keeping progress attached to input.

---

<a id="q3-cancellation-state"></a>
## Q3: How do you keep state correct after cancellation?

### Short Answer

I keep the old model state until the transition has definitely finished. I update
durable state only from the completed outcome and remove temporary views on cancel.

### Expanded Answer

Model state, target state, and presentation progress are different. A fraction of
one only describes pixels between endpoints. For view-controller transitions I read
the transition context. For property animators I use the final position and the
feature's finish policy.

Every interruption path must restore input policy and release the animator. A timer
based on nominal duration is not a valid completion signal.

---

<a id="q4-diagnose-interaction"></a>
## Q4: How would you diagnose a jerky interactive transition?

### Short Answer

I would separate input mapping, animator lifecycle, rendering cost, and gesture
conflicts, then profile the worst case on hardware.

### Expanded Answer

I first verify that progress is monotonic and clamped, one animator is reused, and no
layout jump occurs when direction changes. Then I inspect repeated layout, blur,
shadow, masking, image decoding, and main-thread work during the gesture.

I also test conflicts with scroll views and interactive back navigation. Signposts
around gesture updates and transition completion help distinguish slow rendering from
incorrect state transitions.

### Trade-offs

Simplifying the effect may reduce visual richness, but direct manipulation that drops
frames breaks the interaction contract. Responsiveness has priority over decoration.
