---
title: "View, Interactor, Presenter, Entity, and Router"
domain: "Architecture"
topic: "VIPER"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - viper
  - presentation
  - use-cases
---

# View, Interactor, Presenter, Entity, and Router

> VIPER splits a feature into passive UI, presentation logic, use-case logic, models, and
> navigation. The value comes from enforceable responsibility boundaries, not from having
> five objects with those names.

## Quick Recall

- View renders display data and forwards user events.
- Presenter coordinates presentation state and asks the interactor to run use cases.
- Interactor owns feature business rules and calls data/service dependencies.
- Router performs navigation; assembly creates and connects the module.
- Entity means domain data, not a reason to expose persistence models everywhere.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Module Assembly, Routing, and Data Handoff](../module-assembly-routing-and-data-handoff/README.md)
- [Clean Architecture and Ports and Adapters](../../clean-architecture-and-ports-adapters/README.md)
