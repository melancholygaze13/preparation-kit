---
title: "Custom Layouts and Adaptive Composition"
domain: "SwiftUI"
topic: "Layout and View Composition"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - custom-layout
  - adaptive-ui
  - responsive-layout
---

# Custom Layouts and Adaptive Composition

> Adapt to the space a view actually receives. Use built-in adaptive containers for
> common alternatives, `AnyLayout` to switch algorithms without replacing content,
> and `Layout` when a reusable multi-child measurement and placement rule is needed.

## Quick Recall

- Size class is environment context, not a precise measurement of available space.
- `ViewThatFits` chooses the first alternative that fits in the requested axes.
- `AnyLayout` switches layout algorithms while preserving the subview hierarchy.
- A custom `Layout` measures through proxies, returns a size, then places subviews.
- Layout measurement must be cheap, deterministic, and free of application side effects.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
