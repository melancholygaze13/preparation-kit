---
title: "Properties"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Properties

## Scope

Swift properties as state and API boundaries: stored and computed representation,
observation semantics, reusable property wrappers, and type-level storage.

Detailed initialization, methods, concurrency, and memory management remain in
their dedicated topics. This topic covers those mechanics only where they change a
property's correctness, ownership, or production behavior.

## Prerequisites

- [Classes and Structures](../classes-and-structures/README.md)
- [Closures](../closures/README.md)

## Learning Path

1. [Stored and Computed Properties](stored-and-computed-properties/README.md)
2. [Property Observers and Mutation Boundaries](property-observers-and-mutation-boundaries/README.md)
3. [Property Wrappers and Type Properties](property-wrappers-and-type-properties/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Stored and Computed Properties](stored-and-computed-properties/README.md) | Choose storage, derivation, and lazy work from ownership, cost, consistency, and API requirements. | Senior |
| [Property Observers and Mutation Boundaries](property-observers-and-mutation-boundaries/README.md) | Use observation as a synchronous mutation hook without mistaking it for validation, transactions, or synchronization. | Senior |
| [Property Wrappers and Type Properties](property-wrappers-and-type-properties/README.md) | Centralize repeated property policy while keeping generated API, hidden storage, global state, and concurrency explicit. | Senior |

## Related Topics

- [Classes and Structures](../classes-and-structures/README.md)

## Source Section

- [Properties](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
