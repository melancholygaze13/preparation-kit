---
title: "Enumerations"
domain: "Swift"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-06-22
---

# Enumerations

## Scope

This topic covers enums as finite state models. It includes associated data, raw
external codes, recursive structures, and compatibility when cases evolve.

General switch and pattern mechanics remain in Control Flow. Protocol synthesis,
encoding, methods, and initialization are covered here only where they affect enum
representation and production evolution.

## Prerequisites

- [Control Flow](../control-flow/README.md)
- [Functions](../functions/README.md)

## Rapid Review

1. [Enumeration Modeling and Exhaustiveness](enumeration-modeling-and-exhaustiveness/README.md)
2. [Associated Values and Pattern Matching](associated-values-and-pattern-matching/README.md)
3. [Raw Values, Recursive Enums, and Evolution](raw-values-recursive-enums-and-evolution/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Enumeration Modeling and Exhaustiveness](enumeration-modeling-and-exhaustiveness/README.md) | Makes valid states and exhaustive decisions visible to the compiler. | High | 13 min |
| [Associated Values and Pattern Matching](associated-values-and-pattern-matching/README.md) | Stores only data valid for each state. | High | 12 min |
| [Raw Values, Recursive Enums, and Evolution](raw-values-recursive-enums-and-evolution/README.md) | Separates runtime modeling from stable external contracts. | High | 13 min |

## Related Topics

- [Control Flow](../control-flow/README.md)

## Source Section

- [Enumerations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/)
