---
title: "Migration Sequencing and Dependency Untangling"
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
last_reviewed: 2026-07-12
tags:
  - migration-sequencing
  - dependencies
  - architecture-evolution
---

# Migration Sequencing and Dependency Untangling

> Sequence a migration by dependency direction and independently releasable outcomes.
> First create a seam, then move behavior behind it, then switch callers and delete the
> old dependency.

## Quick Recall

- Map real compile-time, runtime, data, release, and team dependencies.
- Break cycles before moving code between modules.
- Prefer thin vertical slices that can ship and be measured.
- Separate mechanical moves from behavior changes when possible.
- Track migration progress by retired dependencies, not files copied.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Incremental Replacement and Compatibility Boundaries](../incremental-replacement-and-compatibility-boundaries/README.md)
- [Rollout, Observability, and Reversal](../rollout-observability-and-reversal/README.md)
