---
title: "Lists and Collection Views"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-07-26
---

# Lists and Collection Views

UIKit list work is mostly about keeping three things in sync: each model's stable
identifier, cell configuration, and visible updates. Interview answers should separate what
the data source owns, what the cell owns, and what asynchronous work may still be
running after reuse.

## Learning Path

### Rapid Review

1. [Table, Collection, and Cell Reuse](table-collection-and-cell-reuse/README.md)
2. [Diffable Data Sources and Snapshots](diffable-data-sources-and-snapshots/README.md)

### Standard Preparation

3. [Compositional Layouts and List Configuration](compositional-layouts-and-list-configuration/README.md)
4. [Prefetching, Pagination, and Update Consistency](prefetching-pagination-and-update-consistency/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Table, Collection, and Cell Reuse](table-collection-and-cell-reuse/README.md) | Explains reusable view lifecycle and configuration boundaries. | Core | 14 min |
| [Diffable Data Sources and Snapshots](diffable-data-sources-and-snapshots/README.md) | Uses stable identity for consistent animated updates. | Core | 12 min |
| [Compositional Layouts and List Configuration](compositional-layouts-and-list-configuration/README.md) | Builds flexible modern collection layouts from reusable sections. | High | 9 min |
| [Prefetching, Pagination, and Update Consistency](prefetching-pagination-and-update-consistency/README.md) | Coordinates asynchronous data with reuse and collection updates. | Core | 11 min |
