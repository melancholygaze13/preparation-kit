---
title: "View Hierarchy, Coordinate Spaces, and Hit Testing"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-01
---

# View Hierarchy, Coordinate Spaces, and Hit Testing

> A view's position is meaningful only in a coordinate space. UIKit walks the
> view hierarchy for event targeting, layout, rendering, and accessibility, so
> hierarchy mistakes become user-visible bugs.

## Quick Recall

- A subview's `frame` is in its superview's coordinate space.
- A view's `bounds` is its own local coordinate space.
- Use conversion APIs instead of hand-adjusting nested coordinates.
- Hit testing starts at the window and searches frontmost eligible subviews.
- Hidden views, disabled interaction, low alpha, and points outside bounds affect
  event targeting.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
