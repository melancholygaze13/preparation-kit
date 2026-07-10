---
title: "Core Graphics Drawing and Shape Layers: Theory"
domain: "UIKit"
topic: "Custom Drawing, Graphics, and Media"
concept: "Core Graphics Drawing and Shape Layers"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-10
---

# Core Graphics Drawing and Shape Layers: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Custom drawing turns current model state into pixels. UIKit decides when a view
needs a display pass and supplies a graphics context to `draw(_:)`. Your code
issues drawing commands into that context, then discards it. The result is not the
source of truth.

A shape layer uses a different ownership model. `CAShapeLayer` stays in the layer
tree and retains a `CGPath` plus fill and stroke properties. Core Animation can
composite and animate those properties without asking a view to redraw every frame.

## Choose the Smallest Rendering Tool

| Need | Good starting point | Important cost |
|---|---|---|
| Normal controls, text, and images | UIKit views | More objects, but built-in layout, events, and accessibility |
| Custom content regenerated as one surface | `UIView.draw(_:)` with Core Graphics | Redrawing work when invalidated |
| A persistent vector path or stroke animation | `CAShapeLayer` | Path construction and layer-tree complexity |
| A reusable generated bitmap | `UIGraphicsImageRenderer` | Bitmap memory and invalidation policy |
| Many changing effects or GPU-heavy pixels | Core Image or Metal | More pipeline, synchronization, and testing cost |

Do not replace standard UIKit views only to reduce view count. Standard views
provide behavior that custom pixels do not, including interaction and accessibility.

## Draw and Invalidate Correctly

Override `draw(_:)` only for a view that owns custom drawing. UIKit may pass a dirty
rectangle, but drawing the complete result is often simpler until measurement shows
that partial redraw matters. Do not call `draw(_:)` directly. Change the model and
call `setNeedsDisplay()`; UIKit can combine repeated invalidations into one display
pass.

Keep drawing code deterministic. Given the same bounds, traits, scale, and model, it
should produce the same result. Avoid network access, decoding, or expensive model
work inside `draw(_:)` because it runs on the UI update path.

For an offscreen image, `UIGraphicsImageRenderer` manages a Core Graphics-backed
context and output format. Cache the result only when reuse is likely and define
what model or trait change invalidates it.

## Keep Shape Geometry in Sync

Create a `CAShapeLayer` once, add it to the view's layer tree, and update its frame
and path when the view's bounds change. A path uses the shape layer's local
coordinate space. A stale path may remain sharp but appear at the wrong size or
position after rotation, split-screen resizing, or Dynamic Type changes.

`CAShapeLayer` preserves resolution independence where possible and exposes
animatable stroke and fill properties. Its `path` can be explicitly animated, but
source and destination paths need compatible structure for predictable
interpolation. For accessibility, expose a semantic UIKit element and an appropriate
activation path; the shape layer itself is only visual output.

## Production Decision

Profile the actual transition or scroll. Look for repeated path creation, excessive
display invalidation, large bitmap allocations, and too many compositing layers.
Optimize the confirmed cost while keeping state ownership clear.

## References

- [Drawing in UIKit](https://developer.apple.com/documentation/uikit/drawing)
- [`UIView.setNeedsDisplay()`](https://developer.apple.com/documentation/uikit/uiview/setneedsdisplay())
- [`CAShapeLayer`](https://developer.apple.com/documentation/quartzcore/cashapelayer)
- [`CAShapeLayer.path`](https://developer.apple.com/documentation/quartzcore/cashapelayer/path)
- [`UIGraphicsImageRenderer`](https://developer.apple.com/documentation/uikit/uigraphicsimagerenderer)
