---
title: "Implicit and Explicit Animation: Interview Questions"
domain: "SwiftUI"
topic: "Animation and Interaction"
concept: "Implicit and Explicit Animation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-06-23
tags:
  - animation
  - transactions
  - reduce-motion
---

# Implicit and Explicit Animation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do explicit and implicit animation differ?](#q1-how-do-explicit-and-implicit-animation-differ) | Senior | Transaction scope |
| [What happens when an animation is interrupted?](#q2-what-happens-when-an-animation-is-interrupted) | Senior | Presentation state |
| [How do you support Reduce Motion?](#q3-how-do-you-support-reduce-motion) | Senior | Accessible motion |

---

<a id="q1-how-do-explicit-and-implicit-animation-differ"></a>
## Q1: How do explicit and implicit animation differ?

### Short Answer

`withAnimation` puts animation in the transaction for a state mutation.
`.animation(_:value:)` attaches animation to a subtree when one value changes. I use
the value-scoped form to avoid animating unrelated updates.

### Expanded Answer

Both animate resulting animatable values; neither delays logical state. Scope matters
because a transaction can affect several descendants. Insertions and removals also
need a transition and stable identity.

<a id="q2-what-happens-when-an-animation-is-interrupted"></a>
## Q2: What happens when an animation is interrupted?

### Short Answer

SwiftUI can retarget from the current presentation value toward the new state. The
model already contains the new target and should not track assumed animation progress.

### Expanded Answer

This keeps rapid interaction responsive. I do not sequence business logic using
fixed delays. For deliberate visual sequencing, I use completion, phase, or keyframe
APIs and keep behavior correct when motion is disabled.

<a id="q3-how-do-you-support-reduce-motion"></a>
## Q3: How do you support Reduce Motion?

### Short Answer

I read the accessibility setting and replace large spatial movement with opacity,
smaller motion, or immediate change while preserving hierarchy and completion feedback.

### Expanded Answer

Motion is never the only indication of state. I also test focus, VoiceOver output,
and interaction during changes. Decorative looping animation is removed or reduced
when it distracts or affects comprehension.
