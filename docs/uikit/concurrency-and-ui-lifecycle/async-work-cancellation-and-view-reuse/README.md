---
title: "Async Work, Cancellation, and View Reuse"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Async Work, Cancellation, and View Reuse

> Asynchronous work can continue after a screen disappears or a view is reused.
> Cancellation asks that work to stop; it does not force an immediate stop.
> Before applying a late result, also verify that it still matches the current
> screen or item.

## Quick Recall

- Store task handles for work that outlives the current method call.
- Cancel obsolete work in `deinit`, disappearance, reuse, or new requests.
- Treat `CancellationError` as a normal lifecycle outcome.
- Check item identity before updating reused cells.
- Prefer model or view-model ownership for async state; cells should only render.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
