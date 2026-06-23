---
title: "Side Effects and Dependency Boundaries"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - dependency-injection
  - side-effects
  - testing
---

# Side Effects and Dependency Boundaries

> Put time, randomness, storage, networking, analytics, and other external work
> behind explicit capabilities. Inject them at composition boundaries and keep
> feature decisions independent from concrete infrastructure.

## Quick Recall

- Prefer initializer injection for required feature dependencies.
- Inject the smallest capability the feature needs, not a global service container.
- Keep environment values for hierarchy-scoped dependencies and presentation context.
- Make async completion, cancellation, and error semantics part of the dependency contract.
- Test policy with deterministic fakes; retain integration tests for real adapters.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
