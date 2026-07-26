---
title: "Dependency Injection and Feature Modularization"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Dependency Injection and Feature Modularization

> Dependency injection passes required services into a feature instead of letting
> it find global objects. Modularization places related code behind a module's
> public interface. Use modules when separate builds or team ownership justify
> their added boundaries and maintenance cost.

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
