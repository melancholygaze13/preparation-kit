---
title: "Gestures, Hit Testing, and Event Composition"
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
  - gestures
  - hit-testing
  - interaction
---

# Gestures, Hit Testing, and Event Composition

> A gesture recognizes input over time. Hit testing chooses which view region receives
> input. Event composition defines how several gestures recognize together or compete.
> Use a semantic control for ordinary activation.

## Quick Recall

- Prefer `Button` to `onTapGesture` for ordinary activation.
- `contentShape` defines the interactive geometry independently from visible pixels.
- Gesture composition expresses simultaneous, sequenced, or precedence relationships.
- Keep transient drag state separate from committed model state.
- Provide keyboard and accessibility alternatives for gesture-only interaction.

Use a gesture when location, duration, velocity, or continuous movement is part of the
meaning. Keep temporary movement in `@GestureState`, then commit a semantic result to
durable state when the gesture ends.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
