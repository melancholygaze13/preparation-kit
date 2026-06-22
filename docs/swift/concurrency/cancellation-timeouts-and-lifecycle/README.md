---
title: "Cancellation, Timeouts, and Lifecycle"
domain: "Swift"
topic: "Concurrency"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Cancellation, Timeouts, and Lifecycle

> Cancellation is a request, not a forced stop. Code must check for cancellation
> and end its work safely.

## Quick Recall

- `Task.cancel()` only sets cancellation state.
- Check cancellation before expensive work and inside long loops.
- A timeout races a deadline against work; it does not guarantee the work stops.
- The owner of a task should cancel it when the related feature ends.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
