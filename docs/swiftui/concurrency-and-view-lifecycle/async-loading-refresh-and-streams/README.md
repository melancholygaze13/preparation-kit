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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - loading-state
  - refreshable
  - async-sequence
---

# Async Loading, Refresh, and Streams

> Model loading as explicit user-visible state and consume long-lived updates with a
> task whose lifetime matches the screen or model that needs them.

Async loading produces one result later. Refresh repeats loading for content already
shown. An asynchronous stream can deliver many values over time and eventually
finish or fail.

## Quick Recall

- Distinguish initial loading, refreshing existing content, empty, and failed states.
- Keep stale content visible during refresh when that is safer for the task.
- A `refreshable` action remains active for the duration of its awaited work.
- Cancel stream consumption and finish producers cleanly.
- Choose buffering and back-pressure policy for the producer's rate and data semantics.
- The default `AsyncStream` buffer is unbounded; choose a limit for fast producers.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
