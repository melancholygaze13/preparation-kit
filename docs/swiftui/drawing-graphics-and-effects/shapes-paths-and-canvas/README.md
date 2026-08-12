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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - shapes
  - canvas
  - custom-drawing
---

# Shapes, Paths, and Canvas

> A `Shape` produces scalable geometry. A `Path` stores lines and curves. `Canvas`
> draws many operations into one surface. Shape content participates in ordinary
> SwiftUI composition; individual canvas draw calls do not become separate views.

## Quick Recall

- A `Shape` produces a `Path` inside the rectangle proposed by its parent.
- Use `InsettableShape` when a border must remain inside the shape's bounds.
- `Canvas` draws through `GraphicsContext` and can reuse resolved images, text, or symbols.
- Canvas marks need separate interaction and accessibility semantics.
- Measure before adding `drawingGroup`; offscreen rendering has memory and compositing cost.

Use a shape for one drawable SwiftUI element. Use a canvas for dense related marks
whose identity and layout do not need separate views. Build a second semantic layer
when canvas content needs focus, actions, or accessibility navigation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
