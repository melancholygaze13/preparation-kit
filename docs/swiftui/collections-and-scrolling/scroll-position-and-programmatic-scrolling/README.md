---
title: "Scroll Position and Programmatic Scrolling"
domain: "SwiftUI"
topic: "Collections and Scrolling"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - scroll-position
  - scroll-view-reader
  - restoration
---

# Scroll Position and Programmatic Scrolling

> Model semantic scroll targets with stable IDs. Treat exact offsets as presentation
> state and restore them only when the product truly needs that precision.

## Quick Recall

- A target must exist and have stable identity before scrolling to it.
- Use `ScrollViewReader` for imperative targeted scrolling at a specific event.
- Use scroll-position bindings when position itself is application state.
- Separate user scrolling from programmatic commands to avoid feedback loops.
- Restore a semantic item and anchor when data or row heights can change.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
