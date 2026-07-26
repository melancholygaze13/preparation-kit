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
last_reviewed: 2026-07-26
---

# Testing Presentation and View Model Logic

> Test presentation decisions in the smallest object that makes them. Pass in
> dependencies such as clocks, repositories, and ID generators so tests control
> their results. Reserve view-controller tests for behavior that truly depends on
> UIKit.

## Quick Recall

- Test state transitions, formatting, validation, and commands without creating
  a view controller.
- Pass networking, storage, time, IDs, and schedulers into the code so each test
  controls them.
- Use Swift Testing for new unit and integration tests; it supports async tests
  and runs tests in parallel by default.
- Assert visible state and emitted intent, not private calls or implementation
  order.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
