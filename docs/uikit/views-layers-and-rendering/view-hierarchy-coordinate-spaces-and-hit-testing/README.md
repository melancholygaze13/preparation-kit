---
title: "View Hierarchy, Coordinate Spaces, and Hit Testing"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# View Hierarchy, Coordinate Spaces, and Hit Testing

> The view hierarchy records parent-child relationships. A coordinate space gives
> positions a reference system. Hit testing walks the hierarchy to find the view
> that should receive a touch. Mixing these concepts causes misplaced UI and
> controls that do not respond.

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
