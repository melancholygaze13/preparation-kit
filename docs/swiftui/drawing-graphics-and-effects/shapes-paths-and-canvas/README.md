---
title: "Shapes, Paths, and Canvas"
domain: "SwiftUI"
topic: "Drawing, Graphics, and Effects"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - shapes
  - canvas
  - custom-drawing
---

# Shapes, Paths, and Canvas

> A `Shape` is retained SwiftUI content with normal layout, styling, animation, and
> accessibility composition. `Canvas` is immediate-mode drawing for many related marks,
> but its individual operations are not separate views or accessibility elements.

## Quick Recall

- A `Shape` produces a `Path` inside the rectangle proposed by its parent.
- Use `InsettableShape` when a border must remain inside the shape's bounds.
- `Canvas` draws through `GraphicsContext` and can reuse resolved images, text, or symbols.
- Canvas marks need separate interaction and accessibility semantics.
- Measure before adding `drawingGroup`; offscreen rendering has memory and compositing cost.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
