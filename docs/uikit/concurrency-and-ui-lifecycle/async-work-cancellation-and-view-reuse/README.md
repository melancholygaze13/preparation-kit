---
title: "Async Work, Cancellation, and View Reuse"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-05
---

# Async Work, Cancellation, and View Reuse

> Screen-scoped async work must end when the screen or reused view no longer
> needs it. Cancellation is cooperative, so UIKit code also needs identity checks
> before applying late results.

## Quick Recall

- Store task handles for work that outlives the current method call.
- Cancel obsolete work in `deinit`, disappearance, reuse, or new requests.
- Treat `CancellationError` as a normal lifecycle outcome.
- Check item identity before updating reused cells.
- Prefer model or view-model ownership for async state; cells should only render.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
