---
title: "Frame, Bounds, Center, and Transforms"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-01
---

# Frame, Bounds, Center, and Transforms

> `frame`, `bounds`, and `center` describe related geometry from different
> coordinate spaces. Transforms change the visual result, so frame math becomes a
> poor source of truth after rotation, scale, or Auto Layout.

## Quick Recall

- `frame` is the view's rectangle in its superview's coordinate space.
- `bounds` is the view's own coordinate system and drawing area.
- `center` is the view's center point in its superview's coordinate space.
- Auto Layout normally controls final frame values.
- Avoid relying on `frame` as the source of truth after transforms.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
