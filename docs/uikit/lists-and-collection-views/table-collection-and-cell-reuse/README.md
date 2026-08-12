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
last_reviewed: 2026-08-12
---

# Table, Collection, and Cell Reuse

> Table and collection views reuse cell objects instead of creating one for every
> item. Each configuration must describe the current item completely because the
> same cell may have displayed different content a moment earlier.

## Quick Recall

- Reuse means a cell instance may display many different items over time.
- `prepareForReuse()` resets temporary resources that are not visible content.
- Repeating configuration for the same item should produce the same visible result.
- Cell registrations centralize dequeueing and configuration for an item type.
- Async work must be cancelled, validated, or keyed by item identity.
- Keep data ownership in the data source or view model, not in the cell.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
