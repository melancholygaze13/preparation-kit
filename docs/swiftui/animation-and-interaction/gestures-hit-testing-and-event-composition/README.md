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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - gestures
  - hit-testing
  - interaction
---

# Gestures, Hit Testing, and Event Composition

> Use semantic controls for standard actions. Use gestures when location, duration,
> velocity, or continuous movement is the actual interaction requirement.

## Quick Recall

- Prefer `Button` to `onTapGesture` for ordinary activation.
- `contentShape` defines the interactive geometry independently from visible pixels.
- Gesture composition expresses simultaneous, sequenced, or precedence relationships.
- Keep transient drag state separate from committed model state.
- Provide keyboard and accessibility alternatives for gesture-only interaction.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
