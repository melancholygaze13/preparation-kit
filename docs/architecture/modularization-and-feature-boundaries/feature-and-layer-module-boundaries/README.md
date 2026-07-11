---
title: "Feature and Layer Module Boundaries"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - modularization
  - feature-modules
  - boundaries
---

# Feature and Layer Module Boundaries

> Put code that changes and ships together behind one module boundary. Prefer feature
> ownership as the primary axis, then extract stable shared capabilities when evidence
> justifies their coordination cost.

## Quick Recall

- A module creates a namespace, access boundary, dependency edge, build unit, and often
  an ownership contract.
- Feature modules keep presentation, policy, and feature-specific data changes together.
- Layer modules help when a capability such as persistence or design system has a real
  shared owner and stable API.
- `Common`, `Core`, and `Utils` often become dependency hubs with unclear ownership.
- Start with source boundaries; use targets or packages when compiler enforcement,
  reuse, build isolation, or team independence pays for the cost.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
