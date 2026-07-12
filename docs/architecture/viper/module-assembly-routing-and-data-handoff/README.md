---
title: "Module Assembly, Routing, and Data Handoff"
domain: "Architecture"
topic: "VIPER"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-12
tags:
  - viper
  - composition-root
  - routing
---

# Module Assembly, Routing, and Data Handoff

> A VIPER builder or wireframe creates the object graph. The router owns transition
> mechanics, while typed module inputs and outputs keep navigation data from becoming
> hidden shared state.

## Quick Recall

- Assemble dependencies outside the presenter and interactor.
- Pass required input at construction when possible.
- Return outcomes through a small delegate, closure, or route result contract.
- Keep UIKit transition details in the router, not use-case logic.
- Give child-module ownership and dismissal one clear lifecycle path.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [View, Interactor, Presenter, Entity, and Router](../view-interactor-presenter-entity-and-router/README.md)
- [Coordinator and Navigation Architecture](../../coordinator-and-navigation-architecture/README.md)
