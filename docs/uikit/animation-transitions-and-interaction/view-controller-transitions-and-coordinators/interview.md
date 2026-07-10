---
title: "View Controller Transitions and Coordinators: Interview Questions"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
concept: "View Controller Transitions and Coordinators"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-10
---

# View Controller Transitions and Coordinators: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Which objects participate in a custom transition?](#q1-transition-objects) | Senior | Responsibility boundaries |
| [How do you handle cancellation correctly?](#q2-transition-cancellation) | Senior | Hierarchy correctness |
| [When do you use a transition coordinator?](#q3-transition-coordinator) | Senior | Synchronized UI |
| [When is a custom transition worth its cost?](#q4-custom-transition-decision) | Staff | Product fit and adoption |

---

<a id="q1-transition-objects"></a>
## Q1: Which objects participate in a custom transition?

### Short Answer

A delegate vends an animation controller and, when needed, an interaction controller
or presentation controller. UIKit supplies the transition context and container.

### Expanded Answer

The animation controller implements `UIViewControllerAnimatedTransitioning`. It
configures views from the context and reports completion. The interaction controller
drives progress. A `UIPresentationController` owns chrome, sizing, and adaptation for
a custom modal presentation.

Navigation uses `UINavigationControllerDelegate`; custom modal presentation uses
`UIViewControllerTransitioningDelegate`. Routing policy should remain outside these
objects.

---

<a id="q2-transition-cancellation"></a>
## Q2: How do you handle cancellation correctly?

### Short Answer

I restore the original hierarchy, remove temporary views, and call
`completeTransition(false)` exactly once. I update durable route state from the
reported outcome.

### Expanded Answer

The transition context reports `transitionWasCancelled`. Dismissal and presentation
need mirrored cleanup because either can be interactive. A visual completion block is
not enough evidence that UIKit committed the destination.

Missing or incorrect `completeTransition` calls can leave containment and appearance
callbacks incomplete. Every guard and completion path must finish the context.

---

<a id="q3-transition-coordinator"></a>
## Q3: When do you use a transition coordinator?

### Short Answer

I use it to animate related UI alongside a navigation, presentation, dismissal, or
size transition and to react to cancellation with the same timing context.

### Expanded Answer

Examples include fading custom chrome, adjusting a backdrop, or coordinating a
rotation-dependent layout. Alongside animations inherit interactive progress and
timing. The completion context tells me whether the transition canceled.

Starting an unrelated animation in `viewWillAppear` can drift from an interactive
transition. The coordinator exists only while the transition is active.

---

<a id="q4-custom-transition-decision"></a>
## Q4: When is a custom transition worth its cost?

### Short Answer

It is worth it when motion communicates a meaningful spatial or object relationship
that system navigation and presentations cannot express.

### Expanded Answer

I prefer system sheets, popovers, and navigation because they already handle
adaptation, gestures, and accessibility. A custom transition adds cancellation,
rotation, resizing, backgrounding, focus, and Reduce Motion cases.

For shared adoption, I would prototype on target devices, test system-gesture
compatibility, instrument performance, and roll out to a small feature first.

### Trade-offs

Custom motion can improve continuity and product identity. It also creates a platform
surface that teams must maintain across OS behavior and device configurations.
