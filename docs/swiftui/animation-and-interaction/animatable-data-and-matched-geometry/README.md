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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - animatable
  - matched-geometry
  - interpolation
---

# Animatable Data and Matched Geometry

> Animatable data exposes the numeric values SwiftUI interpolates. Matched geometry
> visually connects different view instances that represent the same semantic element.

## Quick Recall

- Prefer the modern `@Animatable` macro for custom animatable types.
- Only continuously interpolatable values belong in animatable data.
- Mark non-animating stored values with `@AnimatableIgnored` when needed.
- Matched IDs must be stable and unique within the namespace.
- Matched geometry coordinates visuals; application state still owns the transition.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
