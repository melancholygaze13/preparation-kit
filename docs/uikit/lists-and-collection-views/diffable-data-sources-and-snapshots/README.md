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
last_reviewed: 2026-07-01
---

# Diffable Data Sources and Snapshots

> Diffable data sources update lists from section and item identifiers instead
> of manual index-path mutations. A snapshot is the current UI truth for what
> sections and items should appear.

## Quick Recall

- Diffable updates are based on stable `Hashable` identifiers.
- A snapshot describes sections and ordered item identifiers.
- Applying a snapshot computes inserts, deletes, moves, and reload behavior.
- Identity and content equality are different decisions.
- Build snapshots from model state, not from visible cells.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
