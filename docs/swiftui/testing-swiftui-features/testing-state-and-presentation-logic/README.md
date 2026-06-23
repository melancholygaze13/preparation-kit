---
title: "Testing State and Presentation Logic"
domain: "SwiftUI"
topic: "Testing SwiftUI Features"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
---

# Testing State and Presentation Logic

> Test observable decisions through plain state and model APIs. Keep SwiftUI's
> rendering engine out of fast tests unless rendering is the behavior under test.

## Quick Recall

- Put business rules, loading states, and presentation decisions behind a
  deterministic interface.
- Inject time, IDs, persistence, and services instead of using global live values.
- Use Swift Testing for new unit and integration tests; reserve XCTest for UI tests.
- Test outcomes and state transitions, not private implementation steps.
- Keep each test isolated because Swift Testing may run tests in parallel.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
