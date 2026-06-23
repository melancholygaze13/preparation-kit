---
title: "Async Loading, Refresh, and Streams"
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
  - loading-state
  - refreshable
  - async-sequence
---

# Async Loading, Refresh, and Streams

> Model loading as explicit user-visible state and consume long-lived updates with a
> task whose lifetime matches the screen or model that needs them.

## Quick Recall

- Distinguish initial loading, refreshing existing content, empty, and failed states.
- Keep stale content visible during refresh when that is safer for the task.
- A `refreshable` action remains active for the duration of its awaited work.
- Cancel stream consumption and finish producers cleanly.
- Choose buffering and back-pressure policy for the producer's rate and data semantics.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
