---
title: "Incremental Replacement and Compatibility Boundaries"
domain: "Architecture"
topic: "Architecture Evolution and Migration"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - incremental-migration
  - compatibility
  - architecture-evolution
---

# Incremental Replacement and Compatibility Boundaries

> Replace architecture through a stable boundary and small vertical slices. Keep old and
> new implementations compatible long enough to compare, roll back, and remove the old
> path safely.

## Quick Recall

- Define the desired boundary and measurable outcome before changing implementation.
- Insert an adapter or facade where callers can remain stable during replacement.
- Migrate complete behavior slices instead of copying an entire layer first.
- Keep one authority for writes; dual-write only with reconciliation and ownership.
- Time-box compatibility code and assign its removal to a named owner.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Migration Sequencing and Dependency Untangling](../migration-sequencing-and-dependency-untangling/README.md)
- [Modularization and Feature Boundaries](../../modularization-and-feature-boundaries/README.md)
