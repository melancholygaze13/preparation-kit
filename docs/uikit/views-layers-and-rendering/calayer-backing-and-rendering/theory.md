---
title: "CALayer Backing and Rendering: Theory"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
concept: "CALayer Backing and Rendering"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-08-12
---

# CALayer Backing and Rendering: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Every `UIView` has a Core Animation `CALayer` that provides its visual content.
This is called the view's backing layer. The view handles UIKit behavior such as
events, accessibility, and Auto Layout. The layer stores visual properties and
combines rendered content for display, a process called composition.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="CALayer Backing and Rendering" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the CALayer Backing and Rendering diagram</a></figcaption>
</figure>

This split matters because many visual changes do not require custom views or
custom drawing. A rounded corner, opacity change, border, image contents, or
basic transform can often be expressed as layer properties.

## View Responsibilities and Layer Responsibilities

Use a view when the object needs UIKit behavior:

- touch handling
- gesture recognizers
- Auto Layout participation
- accessibility
- responder-chain behavior
- subview ownership

Use a layer when the object is mainly visual:

- shadows
- masks
- borders
- gradients through `CAGradientLayer`
- shape drawing through `CAShapeLayer`
- efficient property animation

Layers do not replace views for controls. A layer cannot receive UIKit events or
provide accessibility by itself. A layer-heavy interface still needs views where
users interact.

## Model and Presentation Layers

Core Animation has a model layer tree that stores target property values and a
presentation layer tree that approximates the values currently onscreen. During an
animation, the model value may already be the final value while the presentation
value is what the user currently sees.

This matters for custom interactions. If you need the current animated position,
read a copy from `layer.presentation()`. It is available only while the layer has
presentation data and must not be modified. To set the intended final state,
update the normal model layer.

## Performance Costs

Layer-backed rendering is efficient, but not every layer effect is cheap. Shadows
without a `shadowPath`, masks, corner radius combined with clipping, blending,
large rasterized regions, and frequent offscreen rendering can hurt scrolling or
animations.

Do not guess from a rule of thumb alone. Use Instruments, Core Animation
debugging, and real devices. A small shadow may be fine. A shadow on dozens of
moving cells may not be.

## Engineering Decisions

Use layer properties for simple visual styling. Use specialized layers for
graphics that are cheaper as vector or composited content. Use custom drawing
when the visual output truly needs drawing code and cannot be represented by
standard views or layers.

If a layer's frame depends on a view's bounds, update it after layout:

```swift
override func layoutSubviews() {
    super.layoutSubviews()
    gradientLayer.frame = bounds
    layer.shadowPath = UIBezierPath(roundedRect: bounds, cornerRadius: 12).cgPath
}
```

This keeps layer geometry aligned with Auto Layout, rotation, dynamic type, and
container size changes.

## Production Application

Rendering bugs and performance issues often come from using the wrong level:

| Problem | Better direction |
|---|---|
| Custom drawing for a simple border | Use layer border properties |
| Interactive element built only from layers | Use a view or control |
| Shadow jank in scrolling cells | Set `shadowPath`, simplify, or redesign |
| Gradient frame wrong after rotation | Update layer frame after layout |
| Animation hit testing feels wrong | Check model versus presentation layer |

At Staff scope, teams should define reusable styling components for common layer
effects. That avoids each feature rediscovering shadow, mask, and rasterization
costs independently.

## References

- [Core Animation Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CoreAnimation_guide/)
- [CALayer](https://developer.apple.com/documentation/quartzcore/calayer)
- [UIView](https://developer.apple.com/documentation/uikit/uiview)
