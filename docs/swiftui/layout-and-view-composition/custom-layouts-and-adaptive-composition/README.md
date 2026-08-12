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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - custom-layout
  - adaptive-ui
  - responsive-layout
---

# Custom Layouts and Adaptive Composition

> Adapt to the space a view actually receives. Use built-in adaptive containers for
> common alternatives, `AnyLayout` to switch algorithms without replacing content,
> and `Layout` when a reusable multi-child measurement and placement rule is needed.

An adaptive composition changes its arrangement when space, content, or user settings
change. A custom layout is a Swift type that measures and places a group of child
views. Most screens need adaptation, but few need a custom layout algorithm.

## Quick Recall

- Size class is environment context, not a precise measurement of available space.
- `ViewThatFits` chooses the first alternative that fits in the requested axes.
- `AnyLayout` switches layout algorithms while preserving the subview hierarchy.
- A custom `Layout` measures through proxies, returns a size, then places subviews.
- A proposal may contain exact, unspecified, zero, or infinite dimensions.
- Layout measurement must be cheap, deterministic, and free of application side effects.
- Layout methods may run away from the main actor, so their inputs must be safe to copy.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
