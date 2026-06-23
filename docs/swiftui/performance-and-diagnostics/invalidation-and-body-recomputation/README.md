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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - invalidation
  - body-recomputation
  - observation
---

# Invalidation and Body Recomputation

> State changes invalidate dependent view descriptions. `body` recomputation is
> expected and usually cheap; performance depends on dependency scope, work per
> update, identity stability, and the resulting render changes.

## Quick Recall

- A `body` call does not mean the entire platform view hierarchy was rebuilt.
- Keep `body` and view initializers cheap, deterministic, and free of side effects.
- Read observable state only where the view needs it to narrow invalidation.
- Preserve structural and data identity across updates.
- Measure update causes before adding `EquatableView` or manual caching.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
