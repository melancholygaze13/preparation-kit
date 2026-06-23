---
title: "Shapes, Paths, and Canvas: Theory"
domain: "SwiftUI"
topic: "Drawing, Graphics, and Effects"
concept: "Shapes, Paths, and Canvas"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-23
tags:
  - shapes
  - canvas
  - custom-drawing
---

# Shapes, Paths, and Canvas: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Use a shape when one drawable object should participate as SwiftUI content. Use a
canvas when many drawing operations belong to one rendered surface. The choice changes
identity, accessibility, hit testing, and update cost, not only syntax.

## Shapes and Paths

`Shape` requires `path(in:)`. SwiftUI supplies a local rectangle, and the shape returns
a `Path` using that coordinate space. Build proportionally from the rectangle when the
shape should scale; fixed coordinates make the result depend on one size.

A path contains geometry such as lines, curves, arcs, and closed subpaths. Fill and
stroke are presentation applied to that geometry. Stroke width is centered on the path,
so half can extend outside the nominal boundary. `InsettableShape` supports an inset
operation, allowing `strokeBorder` to keep the stroke inside the available bounds.

Shapes conform to `Animatable`. On current targets, the `@Animatable` macro can expose
continuous properties while `@AnimatableIgnored` excludes discrete configuration.
Animation requires compatible path topology and meaningful interpolation; morphing
unrelated point sets rarely produces a useful result.

Prefer semantic SwiftUI composition around the shape. A custom chart mark may be a
shape, but its label, selected state, and action should still be real views when users
need to inspect or activate them.

## Canvas and GraphicsContext

`Canvas` invokes a renderer closure with a `GraphicsContext` and size. The context can
stroke paths, fill shapes, draw resolved text and images, apply transforms, blend, and
add filters. A symbols builder lets the renderer resolve reusable SwiftUI content by tag.

Canvas is appropriate for dense charts, particles, diagrams, or many decorative marks
that update as one surface. It does not create a SwiftUI view for every draw call.
Consequently, individual marks do not automatically receive identity, layout,
accessibility, focus, gestures, or hit-testing behavior.

For interaction, map an input location into the same model coordinates used for drawing.
For accessibility, expose a separate semantic representation, such as a list of chart
values or accessibility children. Never make color or pixels the only way to obtain
important information.

`TimelineView` can provide time-driven updates for animation. The drawing closure must
remain cheap because it can run every frame. Precompute stable geometry outside the
renderer, bound the number of marks, and avoid allocation-heavy model transformations.

## Rendering Decisions

`drawingGroup` flattens a subtree into an offscreen rendered result. It can help a
complex vector composition that is expensive to composite repeatedly, but it also adds
an offscreen texture, memory bandwidth, and possible rasterization changes. It is not a
general performance modifier. Profile the actual animation and device class.

Canvas also supports opacity, color mode, and asynchronous rendering configuration.
Asynchronous rendering can improve responsiveness for suitable content, but the result
must tolerate delayed frames. Do not use it for drawing that must track input with
immediate visual feedback without testing latency.

## Production Decisions

Test at different sizes, display scales, contrast settings, color schemes, and Dynamic
Type sizes. Verify VoiceOver and keyboard alternatives separately from the pixels.
Profile frame time, offscreen passes, texture memory, and the cost of rebuilding paths.

At Staff or Principal scope, define a rendering boundary with model-space coordinates,
semantic data, quality tiers, and measurable budgets. A fallback should preserve the
information when advanced rendering or animation is reduced.

## References

- [`Shape`](https://developer.apple.com/documentation/swiftui/shape)
- [`Path`](https://developer.apple.com/documentation/swiftui/path)
- [`InsettableShape`](https://developer.apple.com/documentation/swiftui/insettableshape)
- [`Canvas`](https://developer.apple.com/documentation/swiftui/canvas)
- [`GraphicsContext`](https://developer.apple.com/documentation/swiftui/graphicscontext)
- [Add rich graphics to your SwiftUI app](https://developer.apple.com/videos/play/wwdc2021/10021/)
