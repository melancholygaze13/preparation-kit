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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - list
  - foreach
  - identity
---

# List, ForEach, and Data Identity

> `ForEach` creates one repeated view description for each data value. `List` adds
> scrolling and platform list behavior. Data identity tells SwiftUI which logical
> item each row represents across updates.

## Quick Recall

- Use stable entity IDs, not offsets or UUIDs generated during rendering.
- Identity stays stable while display properties change.
- Transform data before the row builder and preserve IDs through filtering and sorting.
- Row-local state follows row identity, not the current array position.
- Choose `List` for list semantics and lazy stacks for custom scroll composition.

An ID must be unique in the rendered collection and stable for the lifetime of the
logical item. A changed title is still the same item. A newly generated UUID makes it
a different item to SwiftUI, even when every visible field looks unchanged.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
