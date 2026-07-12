---
title: "Task and Effect Lifetimes"
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
last_reviewed: 2026-07-11
tags:
  - task-lifetime
  - structured-concurrency
  - side-effects
---

# Task and Effect Lifetimes

> An asynchronous effect needs an owner whose lifetime and policy match the work. Prefer
> structured child tasks; keep an unstructured task handle only when work must outlive the
> current async scope.

## Quick Recall

- Make the caller await work when its result is part of the caller's operation.
- Use `async let` or task groups for bounded child work and automatic lifetime structure.
- Store and cancel unstructured task handles; never treat `Task {}` as free fire-and-forget.
- Screen, feature, session, and application work have different valid lifetimes.
- Durable business intent belongs in persistent state, not only in an in-memory task.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Cancellation, Stale Results, and Logical Races](../cancellation-stale-results-and-logical-races/README.md)
- [Remote, Local, Cache, and Synchronization](../../data-layer-repositories-and-offline-state/remote-local-cache-and-synchronization/README.md)
