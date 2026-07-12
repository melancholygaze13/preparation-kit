---
title: "Cancellation, Stale Results, and Logical Races"
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
  - cancellation
  - logical-races
  - stale-results
---

# Cancellation, Stale Results, and Logical Races

> Cancellation saves work but does not prove that a result is still valid. Before
> committing an async result, check both cancellation and the feature's current request
> identity or state.

## Quick Recall

- Swift cancellation is cooperative; `cancel()` sets a flag rather than stopping code.
- Data-race freedom does not prevent valid operations from finishing in the wrong order.
- Use request identity, generation, or current input to reject stale results at commit time.
- Replaceable work should cancel its predecessor and still guard the final state change.
- Treat `CancellationError` as a normal lifecycle outcome unless the product says otherwise.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Task and Effect Lifetimes](../task-and-effect-lifetimes/README.md)
- [Event Ordering, Streams, and Backpressure](../event-ordering-streams-and-backpressure/README.md)
