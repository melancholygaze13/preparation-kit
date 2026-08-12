---
title: "Cancellation, Stale Results, and Races"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - cancellation
  - stale-results
  - logical-races
---

# Cancellation, Stale Results, and Races

> Serialization prevents data races, but it does not prevent an older request from
> overwriting newer intent. Cancel obsolete work and validate relevance before commit.

Cancellation is a request for a task to stop. A stale result belongs to an input the
user no longer wants. A data race is unsafe simultaneous access; a logical race can
happen even when actor-isolated accesses occur safely but in the wrong order.

## Quick Recall

- Cancellation is cooperative and idempotent.
- Treat `CancellationError` as control flow, not a user-visible failure.
- Actor isolation does not prevent stale-result races across `await`.
- Use task IDs, generations, or requested keys to validate commits.
- Define ordering, deduplication, and retry policy at the model boundary.
- Unstructured `Task` values need explicit cancellation; they are not child tasks.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
