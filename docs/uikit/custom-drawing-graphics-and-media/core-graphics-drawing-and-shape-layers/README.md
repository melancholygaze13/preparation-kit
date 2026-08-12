---
title: "Core Graphics Drawing and Shape Layers"
domain: "UIKit"
topic: "Custom Drawing, Graphics, and Media"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Core Graphics Drawing and Shape Layers

> Core Graphics draws pixels into a graphics context. Use `draw(_:)` for custom
> pixels that can be regenerated from state. Use `CAShapeLayer` when a vector path
> should remain in the layer tree and animate through
> layer properties. In both cases, keep the model separate from rendering.

## Quick Recall

- UIKit calls `draw(_:)` during a display pass; request another pass with
  `setNeedsDisplay()` instead of calling `draw(_:)` yourself.
- Rebuild drawing from current state. Do not treat the graphics context as stored
  app state.
- A `CAShapeLayer` retains a path and exposes fill, stroke, and animation
  properties. Update its path when layout changes.
- Use `UIGraphicsImageRenderer` for an offscreen bitmap that will be reused.
- Measure before replacing a clear UIKit solution with a lower-level renderer.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
