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
last_reviewed: 2026-07-26
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

This small view draws one model value. Changing the value invalidates display;
UIKit decides when to call `draw(_:)`:

```swift
final class ProgressBarView: UIView {
    var progress: CGFloat = 0 {
        didSet { setNeedsDisplay() }
    }

    override func draw(_ rect: CGRect) {
        UIColor.secondarySystemFill.setFill()
        UIBezierPath(roundedRect: bounds, cornerRadius: 6).fill()

        let clampedProgress = min(max(progress, 0), 1)
        let width = bounds.width * clampedProgress
        let filled = CGRect(x: 0, y: 0, width: width, height: bounds.height)
        UIColor.systemBlue.setFill()
        UIBezierPath(roundedRect: filled, cornerRadius: 6).fill()
    }
}
```

`UIBezierPath` is a UIKit wrapper around Core Graphics path drawing. A direct Core
Graphics implementation can use the current `CGContext`; the same rule applies:
draw from current state and never call `draw(_:)` yourself.

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
interpolation. For accessibility, expose a UIKit element with an accurate label and an appropriate
activation path; the shape layer itself is only visual output.

```swift
final class RingView: UIView {
    private let ring = CAShapeLayer()

    override init(frame: CGRect) {
        super.init(frame: frame)
        ring.fillColor = UIColor.clear.cgColor
        ring.strokeColor = UIColor.systemBlue.cgColor
        ring.lineWidth = 4
        layer.addSublayer(ring)
    }

    required init?(coder: NSCoder) { fatalError("Use init(frame:)") }

    override func layoutSubviews() {
        super.layoutSubviews()
        ring.frame = bounds
        ring.path = UIBezierPath(
            ovalIn: bounds.insetBy(dx: ring.lineWidth, dy: ring.lineWidth)
        ).cgPath
    }
}
```

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
