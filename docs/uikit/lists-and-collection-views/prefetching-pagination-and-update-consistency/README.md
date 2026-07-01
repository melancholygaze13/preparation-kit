---
title: "Prefetching, Pagination, and Update Consistency"
domain: "UIKit"
topic: "Lists and Collection Views"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-01
---

# Prefetching, Pagination, and Update Consistency

> Prefetching starts work before rows are visible, but reuse means results may
> arrive late or no longer be needed. Pagination must merge new data into the
> current model before applying one consistent list update.

## Quick Recall

- Prefetching is a hint, not a guarantee.
- Cancel prefetch work when UIKit says rows are no longer likely to appear.
- Pagination should be idempotent and protect against duplicate requests.
- Apply list updates from the current model state, not from stale responses.
- Reuse, cancellation, and snapshot identity must agree.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
