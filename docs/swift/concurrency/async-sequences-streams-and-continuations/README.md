---
title: "Async Sequences, Streams, and Continuations"
domain: "Swift"
topic: "Concurrency"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Async Sequences, Streams, and Continuations

> An async sequence produces values over time. Stream and continuation bridges
> must define buffering, cancellation, termination, and ownership.

## Quick Recall

- `for await` requests one value at a time from an `AsyncSequence`.
- A stream needs an explicit buffering and overflow policy.
- A checked continuation must resume exactly once on every path.
- Cancellation must reach the underlying callback or producer when possible.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
