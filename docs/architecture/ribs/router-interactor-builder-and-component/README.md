---
title: "Router, Interactor, Builder, and Component"
domain: "Architecture"
topic: "RIBs"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-12
tags:
  - ribs
  - dependency-injection
  - business-logic
---

# Router, Interactor, Builder, and Component

> A RIB groups business logic, routing, construction, and scoped dependencies. Its
> interactor drives behavior, its router manages child RIBs, its builder creates the
> scope, and its component exposes dependencies to children.

## Quick Recall

- A RIB can exist without a view; business state drives the tree.
- Interactor owns business behavior for the scope.
- Router attaches and detaches child RIBs.
- Builder constructs the RIB from parent dependencies.
- Component provides dependencies whose lifetime matches the RIB scope.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [RIB Trees, Lifecycle, and Scoping](../rib-trees-lifecycle-and-scoping/README.md)
- [Dependency Injection and Composition](../../dependency-injection-and-composition/README.md)
