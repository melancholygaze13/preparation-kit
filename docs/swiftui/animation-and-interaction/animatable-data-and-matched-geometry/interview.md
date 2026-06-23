---
title: "Animatable Data and Matched Geometry: Interview Questions"
domain: "SwiftUI"
topic: "Animation and Interaction"
concept: "Animatable Data and Matched Geometry"
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
  - animatable
  - matched-geometry
  - interpolation
---

# Animatable Data and Matched Geometry: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When do you need custom animatable data?](#q1-when-do-you-need-custom-animatable-data) | Senior | Interpolation |
| [How does matched geometry work?](#q2-how-does-matched-geometry-work) | Senior | Visual continuity and identity |
| [How would you diagnose a broken hero animation?](#q3-how-would-you-diagnose-a-broken-hero-animation) | Senior | Namespace, source, and modifiers |

---

<a id="q1-when-do-you-need-custom-animatable-data"></a>
## Q1: When do you need custom animatable data?

### Short Answer

When a custom view, shape, or modifier has continuously varying properties SwiftUI
cannot otherwise interpolate. I expose those numeric values with `@Animatable` and
keep discrete state outside interpolation.

### Expanded Answer

The rendering function runs for intermediate values, so it must be cheap and free of
effects. I test the full range, including angle wraparound, path topology, and invalid
input, not only start and end.

<a id="q2-how-does-matched-geometry-work"></a>
## Q2: How does matched geometry work?

### Short Answer

Views with the same stable ID in one namespace represent the source and destination
of a visual relationship. SwiftUI interpolates selected geometry while application
state changes the actual hierarchy.

### Expanded Answer

It does not move one view instance or preserve its task and focus lifetime. IDs must
be unique, source selection unambiguous, and navigation correct without animation.
I provide a reduced-motion fallback.

<a id="q3-how-would-you-diagnose-a-broken-hero-animation"></a>
## Q3: How would you diagnose a broken hero animation?

### Short Answer

I verify stable matching IDs, a shared namespace, one clear source, and an animated
state transition. Then I inspect modifier order to ensure the matched layer owns the
geometry I expect.

### Expanded Answer

I simplify to position-only matching, add bounds diagnostics, then restore size,
clipping, backgrounds, and effects. I also test missing or offscreen sources and
ensure accessibility does not expose duplicate elements during overlap.
