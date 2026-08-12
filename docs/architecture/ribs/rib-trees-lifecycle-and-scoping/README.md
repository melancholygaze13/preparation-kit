---
title: "RIB Trees, Lifecycle, and Scoping"
domain: "Architecture"
topic: "RIBs"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - ribs
  - lifecycle
  - dependency-scoping
---

# RIB Trees, Lifecycle, and Scoping

> The active RIB tree represents active business scopes, not the visible view hierarchy.
> Attaching a child starts a scope; detaching it must end work, release dependencies, and
> remove its view if it has one.

## Quick Recall

- Parent routers own attachment and detachment of child RIBs.
- Business and view trees can have different shapes.
- Dependencies flow from parent components into child builders.
- Subscriptions and tasks must end with the RIB lifecycle.
- A child should not reach sideways into sibling internals.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Router, Interactor, Builder, and Component](../router-interactor-builder-and-component/README.md)
- [Task and Effect Lifetimes](../../concurrency-state-and-side-effects/task-and-effect-lifetimes/README.md)
