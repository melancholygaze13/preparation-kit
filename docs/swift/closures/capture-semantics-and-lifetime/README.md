---
title: "Capture Semantics and Lifetime"
domain: "Swift"
topic: "Closures"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - closures
  - captures
  - lifetime
  - sendable
---

# Capture Semantics and Lifetime

> A closure can keep access to values after their original scope ends. Decide
> whether it needs live state, a snapshot, or a non-owning reference.

## Quick Recall

- Ordinary capture can observe later changes to a captured variable.
- A capture-list value stores a snapshot when the closure is created.
- Closures are reference types and copied closures can share capture storage.
- Concurrent mutable captures need actor isolation or synchronization.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Nested Functions and Local Abstraction](../../functions/nested-functions-and-local-abstraction/README.md)
- [Memory Safety](../../language-basics/memory-safety/README.md)

## Related Concepts

- [Escaping, Autoclosure, and API Boundaries](../escaping-autoclosure-and-api-boundaries/README.md)
