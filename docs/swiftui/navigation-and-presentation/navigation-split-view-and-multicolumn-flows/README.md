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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - navigation-split-view
  - adaptive-navigation
  - selection
---

# NavigationSplitView and Multicolumn Flows

> A split view models related selections across two or three columns. The same
> selection state must remain meaningful when SwiftUI collapses those columns into
> a single compact navigation stack.

## Quick Recall

- Model sidebar and content selections explicitly; do not infer them from visibility.
- Expanded and compact layouts are two presentations of one navigation state.
- Column visibility is a preference and is not honored identically on every platform.
- Test selection changes, collapse, back navigation, deep links, and restoration together.
- Put independent detail pushes in a nested `NavigationStack` only when the flow needs them.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
