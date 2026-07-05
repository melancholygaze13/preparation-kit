---
title: "Layout, Rendering, and Offscreen Cost"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-05
---

# Layout, Rendering, and Offscreen Cost

> UIKit performance is not only algorithmic. Bad constraint churn, unnecessary
> invalidation, and expensive layer effects can make a simple screen miss frames.

## Quick Recall

- Create view hierarchies and constraints once; update constants and state later.
- Avoid forcing layout repeatedly with `layoutIfNeeded` inside hot paths.
- Self-sizing cells need stable constraints and realistic estimated sizes.
- Layer effects such as masks, shadows, and opacity can add compositing cost.
- Rasterization can help repeated static content, but it can hurt dynamic views.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
