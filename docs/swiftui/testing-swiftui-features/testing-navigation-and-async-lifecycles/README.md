---
title: "Testing Navigation and Async Lifecycles"
domain: "SwiftUI"
topic: "Testing SwiftUI Features"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
---

# Testing Navigation and Async Lifecycles

> Navigation testing verifies route and presentation state. Async lifecycle testing
> verifies start, completion, cancellation, restart, and stale-result behavior. Control
> these events explicitly instead of depending on scheduler timing.

## Quick Recall

- Test typed routes and modal state below SwiftUI; use a few UI tests for wiring.
- Inject suspending dependencies or gates to control ordering without sleeps.
- Assert cancellation at an observable boundary, not by assuming when a task runs.
- Test stale-result rejection separately from task cancellation.
- Launch the app into deterministic states for deep-link and restoration UI tests.

Cancellation and stale-result rejection are separate contracts. A canceled dependency
may still return because cancellation is cooperative. The model must also verify that
the result still belongs to the current request before committing it.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
