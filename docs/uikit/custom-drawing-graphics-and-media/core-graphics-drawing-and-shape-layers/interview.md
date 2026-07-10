---
title: "Core Graphics Drawing and Shape Layers: Interview Questions"
domain: "UIKit"
topic: "Custom Drawing, Graphics, and Media"
concept: "Core Graphics Drawing and Shape Layers"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-10
---

# Core Graphics Drawing and Shape Layers: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you use `draw(_:)` instead of `CAShapeLayer`?](#q1-draw-or-shape-layer) | Senior | Rendering choice |
| [How do you update a custom-drawn view?](#q2-drawing-updates) | Senior | Invalidation model |
| [A custom chart stutters while scrolling. What do you inspect?](#q3-chart-performance) | Staff | Evidence-based diagnosis |

---

<a id="q1-draw-or-shape-layer"></a>
## Q1: When would you use `draw(_:)` instead of `CAShapeLayer`?

### Short Answer

I use `draw(_:)` when a view can regenerate a combined surface from current state.
I use `CAShapeLayer` when a path should remain in the layer tree or animate through
stroke, fill, or path properties.

### Expanded Answer

Drawing is immediate mode: UIKit supplies a context during a display pass and my
code recreates the pixels. A shape layer is retained mode: it stores the path and
style for Core Animation to composite.

I also consider standard UIKit views first because they already provide layout,
events, and accessibility. The right choice depends on update frequency, interaction,
animation, and measured cost rather than a rule that one API is always faster.

---

<a id="q2-drawing-updates"></a>
## Q2: How do you update a custom-drawn view?

### Short Answer

I update the model and call `setNeedsDisplay()`. UIKit schedules and can combine
display work. I never call `draw(_:)` directly or store application state only in
the graphics context.

### Expanded Answer

The drawing method reads the current bounds, traits, and model to create a complete
result. I keep decoding, I/O, and unrelated model computation outside the drawing
pass. For a shape layer, I update its frame and path during layout when geometry
changes and update visual properties when state changes.

---

<a id="q3-chart-performance"></a>
## Q3: A custom chart stutters while scrolling. What do you inspect?

### Short Answer

I profile the scroll and check repeated path construction, unnecessary display
invalidations, main-thread image work, large temporary bitmaps, and expensive layer
composition. Then I optimize the confirmed bottleneck.

### Expanded Answer

Static geometry may be prepared once and reused until its inputs change. A generated
bitmap may help when the same complex result is composited many times, but it adds
memory and invalidation rules. If only a stroke moves, a persistent shape layer may
avoid full redraws.

I keep interaction and accessibility separate from the drawing optimization and
verify the result on representative devices with realistic data.

### Trade-offs

Caching reduces repeated work but consumes memory and can show stale pixels.
Additional layers can enable cheap property animation but increase layer-tree and
compositing cost.
