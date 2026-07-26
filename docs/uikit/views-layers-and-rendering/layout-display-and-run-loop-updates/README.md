---
title: "Layout, Display, and Run Loop Updates"
domain: "UIKit"
topic: "Views, Layers, and Rendering"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Layout, Display, and Run Loop Updates

> Layout computes geometry. Display draws visual content. UIKit usually delays
> and combines this work until a later run-loop update. `setNeedsLayout` and
> `setNeedsDisplay` mark work for later, while `layoutIfNeeded` forces pending
> layout inside the current pass.

## Quick Recall

- Layout computes view frames and layer bounds.
- Display redraws content that needs drawing.
- `setNeedsLayout` invalidates layout for a later update.
- `layoutIfNeeded` performs pending layout immediately for that subtree.
- Avoid expensive work and repeated invalidation inside layout callbacks.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
