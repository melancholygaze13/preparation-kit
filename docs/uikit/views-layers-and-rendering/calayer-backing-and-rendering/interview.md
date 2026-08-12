---
title: "CALayer Backing and Rendering: Interview Questions"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
concept: "CALayer Backing and Rendering"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
---

# CALayer Backing and Rendering: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the relationship between `UIView` and `CALayer`?](#q1-view-layer-relationship) | Senior | Responsibility split |
| [When would you use a layer instead of a view?](#q2-layer-vs-view) | Senior | Design judgment |
| [Why can shadows or masks hurt performance?](#q3-layer-performance) | Senior | Rendering cost |
| [What is the difference between model and presentation layers?](#q4-model-presentation) | Staff | Animation correctness |

---

<a id="q1-view-layer-relationship"></a>
## Q1: What is the relationship between `UIView` and `CALayer`?

### Short Answer

Every UIKit view is backed by a Core Animation layer. The view handles UIKit
behavior such as events, layout, accessibility, and responder-chain behavior. The
layer handles visual composition and many animatable properties.

### Expanded Answer

The view is the right object when the element participates in UIKit interaction
or layout. The layer is the right object for visual backing: contents, opacity,
corner radius, border, shadow, transforms, and specialized drawing layers.

This split is why changing a layer property can update visuals without adding
new views or writing `draw(_:)`.

<a id="q2-layer-vs-view"></a>
## Q2: When would you use a layer instead of a view?

### Short Answer

I use a layer for visual-only content or effects, such as gradients, shapes,
borders, masks, and shadows. I use a view when the element needs interaction,
Auto Layout, accessibility, or responder-chain behavior.

### Expanded Answer

A layer is lighter for visual composition, but it is not a control. If users need
to tap it, focus it, or have VoiceOver describe it, a view or control should own
that behavior.

For example, a gradient background can be a `CAGradientLayer` inside a view. A
button should be a `UIButton` or custom control, even if it uses layers for
styling.

<a id="q3-layer-performance"></a>
## Q3: Why can shadows or masks hurt performance?

### Short Answer

Some layer effects require extra compositing or offscreen rendering. Shadows
without a path, masks, clipping with rounded corners, blending, and rasterization
can become expensive, especially in scrolling or animated views.

### Expanded Answer

The cost depends on size, movement, count, device, and surrounding content. I
would not ban these effects globally, but I would measure when they appear in hot
paths like collection view cells.

Common fixes include setting `shadowPath`, simplifying the effect, avoiding
unnecessary clipping, caching rendered content, or redesigning the repeated cell
visuals.

<a id="q4-model-presentation"></a>
## Q4: What is the difference between model and presentation layers?

### Short Answer

The model layer stores the target values your code sets. During an animation,
`presentation()` returns a read-only copy that approximates the values currently
shown onscreen.

### Expanded Answer

If a view is animating from one position to another, the model layer may already
contain the final position. The presentation layer is closer to what the user
currently sees.

This matters for interactive animation, collision checks, or custom hit behavior
during animations. For setting final state, update the model layer. For observing
in-flight visual state, read the presentation layer carefully.
