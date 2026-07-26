---
title: "CALayer Backing and Rendering"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# CALayer Backing and Rendering

> Every UIKit view owns a `CALayer`, called its backing layer. The view handles
> UIKit behavior and events. The layer stores visual content and properties and
> takes part in composition and animation.

## Quick Recall

- `UIView` manages interaction, hierarchy behavior, layout, and accessibility.
- `CALayer` manages visual properties such as contents, corner radius, shadow,
  opacity, and transforms.
- Layer changes can be animated by Core Animation.
- Expensive layer effects can hurt scrolling and animation smoothness.
- Use `layoutSublayers` or layout callbacks when layer geometry depends on bounds.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
