---
title: "Shapes, Paths, and Canvas: Interview Questions"
domain: "SwiftUI"
topic: "Drawing, Graphics, and Effects"
concept: "Shapes, Paths, and Canvas"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-23
tags:
  - shapes
  - canvas
  - custom-drawing
---

# Shapes, Paths, and Canvas: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you use Shape instead of Canvas?](#q1-when-would-you-use-shape-instead-of-canvas) | Senior | Retained and immediate drawing |
| [Why use InsettableShape for borders?](#q2-why-use-insettableshape-for-borders) | Senior | Stroke geometry |
| [How would you make an interactive Canvas accessible?](#q3-how-would-you-make-an-interactive-canvas-accessible) | Staff | Semantic representation |

---

<a id="q1-when-would-you-use-shape-instead-of-canvas"></a>
## Q1: When would you use Shape instead of Canvas?

### Short Answer

I use `Shape` when one drawable should remain normal SwiftUI content with layout,
styling, animation, and semantic composition. I use `Canvas` when many related drawing
operations should render as one surface and per-mark view identity is unnecessary.

### Expanded Answer

Canvas can reduce hierarchy cost for dense charts or particles, but its draw calls do
not become separate views. If each item needs focus, gestures, or accessibility, real
views or a separate semantic layer may be the better design.

<a id="q2-why-use-insettableshape-for-borders"></a>
## Q2: Why use InsettableShape for borders?

### Short Answer

A normal stroke is centered on a path, so part of it can extend beyond the shape's
bounds. `InsettableShape` can move its geometry inward, allowing `strokeBorder` to keep
the full border inside the available rectangle.

### Expanded Answer

The inset implementation must preserve the shape correctly as the inset grows. I use a
fill plus chained stroke when both are needed on current SwiftUI, and test thick borders
at small sizes rather than assuming the geometry remains valid.

<a id="q3-how-would-you-make-an-interactive-canvas-accessible"></a>
## Q3: How would you make an interactive Canvas accessible?

### Short Answer

I keep the data model independent of pixels. Hit testing maps pointer locations into
model coordinates, while accessibility exposes named values and actions through a
separate semantic view hierarchy. Canvas draw calls alone are not accessibility elements.

### Expanded Answer

For a chart, VoiceOver might navigate a list of points or summaries while sighted users
interact with the canvas. Selection updates both representations. I also provide a
non-color distinction and reduce frame-driven motion when the user requests it.

### Trade-offs

A semantic overlay adds synchronization work, but it preserves the performance benefit
of one drawing surface without making the information inaccessible.
