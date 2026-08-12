---
title: "Testing State and Presentation Logic"
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

# Testing State and Presentation Logic

> State is feature data at one moment. Presentation logic decides what the interface
> should show from that state. Test both through plain values and model APIs, without
> rendering a SwiftUI view unless rendering is the behavior under test.

## Quick Recall

- Put business rules, loading states, and presentation decisions behind a
  deterministic interface.
- Inject time, IDs, persistence, and services instead of using global live values.
- Use Swift Testing for new unit and integration tests; reserve XCTest for UI tests.
- Test outcomes and state transitions, not private implementation steps.
- Keep each test isolated because Swift Testing may run tests in parallel.

Use Swift Testing for new unit and integration tests with Swift 6.2. Prefer struct
suites, `#expect` for outcomes, and `#require` for preconditions. UI automation remains
in XCTest because Swift Testing does not provide it.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
