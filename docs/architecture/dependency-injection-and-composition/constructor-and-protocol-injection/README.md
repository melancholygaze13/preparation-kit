---
title: "Constructor and Protocol Injection"
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
  - constructor-injection
  - protocols
---

# Constructor and Protocol Injection

> Constructor injection makes required capabilities visible and ensures an object is
> usable after initialization. Inject a protocol or closure only when it protects a
> meaningful boundary; concrete dependencies are valid too.

## Quick Recall

- Required dependencies belong in the initializer. Optional behavior needs an explicit
  default or optional contract.
- Dependency injection separates construction from use; dependency inversion controls
  which side owns the abstraction.
- Prefer narrow consumer-shaped capabilities over protocols that mirror one provider.
- Property or method injection fits dependencies that are genuinely late-bound or
  operation-specific, not required object state.
- Injection improves visibility and replacement but does not automatically fix lifetime,
  actor isolation, or poor boundaries.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
