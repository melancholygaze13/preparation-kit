---
title: "Layout, Rendering, and Offscreen Cost"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Layout, Rendering, and Offscreen Cost

> Layout calculates geometry. Rendering produces pixels. Some visual effects need
> an extra offscreen image before UIKit can compose the final frame. Repeated
> constraints, needless updates, and expensive effects can all make scrolling or
> animation miss frames.

## Quick Recall

- Create view hierarchies and constraints once; update constants and state later.
- Avoid forcing layout repeatedly with `layoutIfNeeded` inside hot paths.
- Self-sizing cells need stable constraints and realistic estimated sizes.
- Layer effects such as masks, shadows, and opacity can add compositing cost.
- Rasterization can help repeated static content, but it can hurt dynamic views.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
