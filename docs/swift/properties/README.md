---
title: "Properties"
domain: "Swift"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-06-22
---

# Properties

## Scope

This topic covers stored, computed, observed, wrapped, and type properties. Focus
on who owns state, when work runs, and what callers can observe.

Detailed initialization, methods, concurrency, and memory management remain in
their dedicated topics. This topic covers those mechanics only where they change a
property's correctness, ownership, or production behavior.

## Prerequisites

- [Classes and Structures](../classes-and-structures/README.md)
- [Closures](../closures/README.md)

## Rapid Review

1. [Stored and Computed Properties](stored-and-computed-properties/README.md)
2. [Property Observers and Mutation Boundaries](property-observers-and-mutation-boundaries/README.md)
3. [Property Wrappers and Type Properties](property-wrappers-and-type-properties/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Stored and Computed Properties](stored-and-computed-properties/README.md) | Chooses between authoritative storage and derived values. | High | 8 min |
| [Property Wrappers and Type Properties](property-wrappers-and-type-properties/README.md) | Reuses storage policy while exposing generated and shared state. | High | 9 min |
| [Property Observers and Mutation Boundaries](property-observers-and-mutation-boundaries/README.md) | Explains synchronous assignment hooks and their limits. | Situational | 7 min |

## Related Topics

- [Classes and Structures](../classes-and-structures/README.md)

## Source Section

- [Properties](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
