---
title: "Actors, Global Actors, and Reentrancy"
domain: "Swift"
topic: "Concurrency"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Actors, Global Actors, and Reentrancy

> Actors protect isolated state from data races. An actor method can still be
> reentrant: other work may change state while the method is suspended.

## Quick Recall

- Actor isolation protects access, not a whole method across `await`.
- Recheck state after suspension when an invariant depends on it.
- `@MainActor` expresses UI isolation, not a manual thread dispatch.
- Use `nonisolated` only for code that does not need isolated state.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
