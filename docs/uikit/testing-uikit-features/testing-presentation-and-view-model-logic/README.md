---
title: "Testing Presentation and View Model Logic"
domain: "UIKit"
topic: "Testing UIKit Features"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-10
---

# Testing Presentation and View Model Logic

> Test presentation decisions at the lowest boundary that owns them. Keep UIKit
> wiring thin, inject nondeterministic dependencies, and reserve view-controller
> tests for behavior that depends on UIKit.

## Quick Recall

- Test state transitions, formatting, validation, and commands without creating
  a view controller.
- Inject networking, storage, time, IDs, and schedulers so tests stay isolated.
- Use Swift Testing for new unit and integration tests; it supports async tests
  and runs tests in parallel by default.
- Assert visible state and emitted intent, not private calls or implementation
  order.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
