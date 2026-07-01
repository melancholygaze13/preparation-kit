---
title: "Table, Collection, and Cell Reuse"
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

# Table, Collection, and Cell Reuse

> Table and collection views virtualize large content by reusing cells. A cell is
> a short-lived view of model state, so configuration must fully describe the
> current item and reset anything that can outlive reuse.

## Quick Recall

- Reuse means a cell instance may display many different items over time.
- `prepareForReuse()` resets transient view state, not model state.
- Configuration should be complete and idempotent for the current item.
- Async work must be cancelled, validated, or keyed by item identity.
- Keep data ownership in the data source or view model, not in the cell.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
