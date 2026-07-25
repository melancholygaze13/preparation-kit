---
title: "Invalidation and Body Recomputation"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
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
  - invalidation
  - body-recomputation
  - observation
---

# Invalidation and Body Recomputation

> Invalidation marks a view description as needing an update. SwiftUI then calls
> `body` again to produce a new description. This is expected and does not mean the
> whole screen is rebuilt or redrawn.

## Quick Recall

- A `body` call does not mean the entire platform view hierarchy was rebuilt.
- Keep `body` and view initializers cheap, deterministic, and free of side effects.
- Read observable state only where the view needs it to narrow invalidation.
- Preserve structural and data identity across updates.
- Measure update causes before adding `EquatableView` or manual caching.

SwiftUI compares the new description with its existing view graph. It updates only
the parts whose data, identity, layout, or drawing changed. The main performance
questions are how often updates start and how much work follows each update.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
