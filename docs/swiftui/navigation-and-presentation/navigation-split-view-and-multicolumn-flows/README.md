---
title: "NavigationSplitView and Multicolumn Flows"
domain: "SwiftUI"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - navigation-split-view
  - adaptive-navigation
  - selection
---

# NavigationSplitView and Multicolumn Flows

> A split view models related selections across two or three columns. The same
> selection state must remain meaningful when SwiftUI collapses those columns into
> a single compact navigation stack.

A multicolumn flow shows related navigation levels side by side when space permits.
The sidebar is the leading column; content is the optional middle column; detail is
the trailing destination.

## Quick Recall

- Model sidebar and content selections explicitly; do not infer them from visibility.
- Expanded and compact layouts are two presentations of one navigation state.
- Column visibility is a preference and is not honored identically on every platform.
- Test selection changes, collapse, back navigation, deep links, and restoration together.
- Put independent detail pushes in a nested `NavigationStack` only when the flow needs them.
- `NavigationSplitView` starts with iOS 16 and the related 2022 platform releases.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
