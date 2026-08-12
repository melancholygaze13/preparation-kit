---
title: "Test Overrides and Service-Locator Trade-offs"
domain: "Architecture"
topic: "Dependency Injection and Composition"
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
  - dependency-injection
  - test-doubles
  - service-locator
---

# Test Overrides and Service-Locator Trade-offs

> Tests should override dependencies within one explicit scope and restore them
> automatically. A service locator can simplify framework boundaries, but broad runtime
> lookup hides requirements and moves wiring failures from compile time to execution.

## Quick Recall

- Prefer per-test construction with focused fakes over mutating global shared services.
- Control values, failures, time, identifiers, and completion order—not internal call trivia.
- Parallel tests require isolated override scopes and concurrency-safe implementations.
- SwiftUI environment is appropriate for deliberate hierarchy context, but required
  feature dependencies should remain visible when practical.
- If a locator is necessary, confine it to composition or framework entry points and
  expose a narrow typed interface.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
