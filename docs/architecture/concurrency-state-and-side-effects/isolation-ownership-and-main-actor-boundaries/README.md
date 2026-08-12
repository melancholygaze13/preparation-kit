---
title: "Isolation Ownership and Main-Actor Boundaries"
domain: "Architecture"
topic: "Concurrency, State, and Side Effects"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - actor-isolation
  - main-actor
  - ownership
---

# Isolation Ownership and Main-Actor Boundaries

> Put each mutable state domain behind one named owner. Use the main actor for
> presentation state and UI access, and cross into other owners with explicit async,
> `Sendable` interfaces.

## Quick Recall

- Isolation is an ownership rule, not a request to use a particular thread.
- Keep screen state and UI-facing mutations on `@MainActor`.
- Use a custom actor only when it owns shared mutable state that needs independent access.
- Treat every `await` inside an actor as a point where actor state may have changed.
- Pass immutable values across boundaries; do not leak actor-owned mutable objects.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Task and Effect Lifetimes](../task-and-effect-lifetimes/README.md)
- [Repository Boundaries and Query Ownership](../../data-layer-repositories-and-offline-state/repository-boundaries-and-query-ownership/README.md)
