---
title: "Gestures, Hit Testing, and Event Composition: Interview Questions"
domain: "SwiftUI"
topic: "Animation and Interaction"
concept: "Gestures, Hit Testing, and Event Composition"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - gestures
  - hit-testing
  - interaction
---

# Gestures, Hit Testing, and Event Composition: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When do you use a gesture instead of a Button?](#q1-when-do-you-use-a-gesture-instead-of-a-button) | Senior | Semantic interaction |
| [How do you model a drag?](#q2-how-do-you-model-a-drag) | Senior | Transient and durable state |
| [How do you resolve competing gestures?](#q3-how-do-you-resolve-competing-gestures) | Senior | Composition and testing |

---

<a id="q1-when-do-you-use-a-gesture-instead-of-a-button"></a>
## Q1: When do you use a gesture instead of a Button?

### Short Answer

I use `Button` for ordinary activation. I use a gesture when location, count,
duration, velocity, or continuous movement is part of the interaction, then provide
equivalent accessibility and keyboard behavior.

### Expanded Answer

A custom visual is not a reason to abandon button semantics; I style the control.
Gesture-only critical actions exclude users and lose disabled, role, focus, and
activation behavior unless rebuilt deliberately.

<a id="q2-how-do-you-model-a-drag"></a>
## Q2: How do you model a drag?

### Short Answer

I keep current translation in `@GestureState` so it resets on end or cancellation,
combine it with committed position for rendering, then validate and commit the final
semantic value in `onEnded`.

### Expanded Answer

I avoid writing every movement into broad shared state. Raw coordinates are converted
to a stable item, normalized progress, or bounded position. The settle or rollback
animates after the gesture, while direct movement follows input.

<a id="q3-how-do-you-resolve-competing-gestures"></a>
## Q3: How do you resolve competing gestures?

### Short Answer

I define product precedence first, then use simultaneous, sequenced, or priority
composition. I narrow the gesture region and recognition threshold so child controls,
scrolling, and system gestures remain available.

### Expanded Answer

For a horizontal row drag inside vertical scrolling, I wait for enough directional
evidence before claiming it. I test taps, cancellations, edges, nested controls,
pointer input, VoiceOver actions, and navigation gestures rather than only the ideal path.
