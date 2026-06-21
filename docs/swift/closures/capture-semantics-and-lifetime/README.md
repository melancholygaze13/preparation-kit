---
title: "Capture Semantics and Lifetime"
domain: "Swift"
topic: "Closures"
page_type: concept-index
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - closures
  - captures
  - lifetime
  - sendable
---

# Capture Semantics and Lifetime

> A closure can preserve access to surrounding bindings after their lexical scope
> ends. Correctness depends on whether state is shared or snapshotted, which
> objects are retained, and which isolation protects mutable captures.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Nested Functions and Local Abstraction](../../functions/nested-functions-and-local-abstraction/README.md)
- [Memory Safety](../../language-basics/memory-safety/README.md)

## Related Concepts

- [Escaping, Autoclosure, and API Boundaries](../escaping-autoclosure-and-api-boundaries/README.md)
