---
title: "Event Ordering, Streams, and Backpressure"
domain: "Architecture"
topic: "Concurrency, State, and Side Effects"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - async-sequence
  - event-ordering
  - backpressure
---

# Event Ordering, Streams, and Backpressure

> A stream contract must define who orders events, how much can wait, and what happens
> when the producer is faster than the consumer. API shape alone does not answer those
> questions.

## Quick Recall

- Define the ordering domain before selecting `AsyncSequence`, callbacks, or notifications.
- Prefer one serial producer when strict event order matters.
- Choose a bounded buffer and an explicit drop, coalesce, block, or persist policy.
- `AsyncStream` bridges push sources; it does not create real producer backpressure.
- Give every subscription a cancellation and termination path.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Cancellation, Stale Results, and Logical Races](../cancellation-stale-results-and-logical-races/README.md)
- [Unidirectional Data Flow](../../unidirectional-data-flow/README.md)
