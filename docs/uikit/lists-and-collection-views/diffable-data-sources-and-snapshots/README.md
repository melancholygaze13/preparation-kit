---
title: "Diffable Data Sources and Snapshots"
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

# Diffable Data Sources and Snapshots

> A diffable data source updates a list by comparing stable section and item
> identifiers. A snapshot is an ordered value that states which sections and
> items should appear now. UIKit calculates the needed insertions, removals, and
> moves.

## Quick Recall

- Diffable updates are based on stable `Hashable` identifiers.
- A snapshot describes sections and ordered item identifiers.
- Applying a snapshot computes inserts, deletes, moves, and reload behavior.
- Identity and content equality are different decisions.
- Build snapshots from model state, not from visible cells.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
