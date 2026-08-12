---
title: "Test Boundaries and Confidence"
domain: "Architecture"
topic: "Architecture Testing and Testability"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - test-strategy
  - test-boundaries
  - confidence
---

# Test Boundaries and Confidence

> Test the behavior at the narrowest boundary that can prove the risk. Add broader
> tests only for failures that smaller tests cannot reveal, such as wiring, persistence,
> framework integration, or a critical user journey.

## Quick Recall

- A unit is a behavior and its controlled collaborators, not necessarily one type.
- Test public outcomes and owned interactions; avoid copying implementation structure.
- Use many fast logic tests, fewer integration tests, and a small set of UI journeys.
- Coverage shows which code ran. It does not show that useful behavior was asserted.
- Judge a suite by defect detection, speed, determinism, diagnosis, and maintenance cost.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
