---
title: "Architecture Rules and Dependency Enforcement"
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
  - dependency-rules
  - architecture-tests
  - module-graph
---

# Architecture Rules and Dependency Enforcement

> Put an architecture rule in the strongest mechanism that can express it. Prefer
> compiler and package-graph boundaries, then add focused automated checks for naming,
> imports, ownership, or graph constraints the type system cannot enforce.

## Quick Recall

- A diagram is guidance until the compiler, build graph, test, or review process checks it.
- Separate modules and access control enforce more than comments or folder names.
- Test dependency direction and forbidden edges, not an exact graph that blocks evolution.
- Source-text scans are useful but weaker than syntax-aware or build-graph checks.
- Every shared rule needs an owner, an exception path, and a migration plan.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
