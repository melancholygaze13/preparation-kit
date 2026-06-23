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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - cancellation
  - stale-results
  - logical-races
---

# Cancellation, Stale Results, and Races

> Serialization prevents data races, but it does not prevent an older request from
> overwriting newer intent. Cancel obsolete work and validate relevance before commit.

## Quick Recall

- Cancellation is cooperative and idempotent.
- Treat `CancellationError` as control flow, not a user-visible failure.
- Actor isolation does not prevent stale-result races across `await`.
- Use task IDs, generations, or requested keys to validate commits.
- Define ordering, deduplication, and retry policy at the model boundary.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
