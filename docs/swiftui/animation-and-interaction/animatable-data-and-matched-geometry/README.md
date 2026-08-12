---
title: "Animatable Data and Matched Geometry"
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
last_reviewed: 2026-08-12
tags:
  - animatable
  - matched-geometry
  - interpolation
---

# Animatable Data and Matched Geometry

> Animatable data is the continuous value SwiftUI interpolates between animation
> endpoints. Matched geometry connects the position and size of separate views that
> represent one semantic element across a structural change.

## Quick Recall

- Prefer the modern `@Animatable` macro for custom animatable types.
- Only continuously interpolatable values belong in animatable data.
- Mark non-animating stored values with `@AnimatableIgnored` when needed.
- Matched IDs must be stable and unique within the namespace.
- Matched geometry coordinates visuals; application state still owns the transition.

The `@Animatable` macro is a 2025 SwiftUI addition. Earlier deployment targets or
custom interpolation logic use a manual `animatableData` conformance. Matched geometry
does not preserve view-local state, tasks, or accessibility lifetime.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
