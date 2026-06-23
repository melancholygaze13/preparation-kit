---
title: "List, ForEach, and Data Identity"
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
  - list
  - foreach
  - identity
---

# List, ForEach, and Data Identity

> `ForEach` creates repeated view descriptions; `List` adds platform collection
> behavior. Both rely on stable domain identity to retain the correct row state.

## Quick Recall

- Use stable entity IDs, not offsets or UUIDs generated during rendering.
- Identity stays stable while display properties change.
- Transform data before the row builder and preserve IDs through filtering and sorting.
- Row-local state follows row identity, not the current array position.
- Choose `List` for list semantics and lazy stacks for custom scroll composition.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
