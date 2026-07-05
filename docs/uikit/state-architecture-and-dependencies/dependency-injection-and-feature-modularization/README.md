---
title: "Dependency Injection and Feature Modularization"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-05
---

# Dependency Injection and Feature Modularization

> Dependency injection gives a UIKit feature the collaborators it needs instead
> of letting it find global services. Modularization turns that rule into build
> and ownership boundaries when the app is large enough to need them.

## Quick Recall

- Prefer constructor or factory injection for required dependencies.
- Keep the composition root near app, scene, flow, or feature assembly code.
- Put protocols at the boundary that owns the need, not automatically beside the
  concrete service.
- Modularize to improve ownership, build times, testability, or reuse.
- Modules add API design, dependency-graph, and migration cost.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
