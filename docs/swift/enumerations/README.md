---
title: "Enumerations"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-20
---

# Enumerations

## Scope

Swift enumerations as value-semantic sum types for finite states, case-specific
payloads, raw external representations, recursive structures, and evolving API or
data contracts.

General switch and pattern mechanics remain in Control Flow. Protocol synthesis,
encoding, methods, and initialization are covered here only where they affect enum
representation and production evolution.

## Prerequisites

- [Control Flow](../control-flow/README.md)
- [Functions](../functions/README.md)

## Learning Path

1. [Enumeration Modeling and Exhaustiveness](enumeration-modeling-and-exhaustiveness/README.md)
2. [Associated Values and Pattern Matching](associated-values-and-pattern-matching/README.md)
3. [Raw Values, Recursive Enums, and Evolution](raw-values-recursive-enums-and-evolution/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Enumeration Modeling and Exhaustiveness](enumeration-modeling-and-exhaustiveness/README.md) | Replace invalid combinations with one finite value while using exhaustive decisions and deliberate case iteration. | Senior |
| [Associated Values and Pattern Matching](associated-values-and-pattern-matching/README.md) | Attach exactly the payload valid for each state and extract it through explicit patterns and transitions. | Senior |
| [Raw Values, Recursive Enums, and Evolution](raw-values-recursive-enums-and-evolution/README.md) | Separate external codes from runtime payloads, model recursive data safely, and evolve persisted or public cases compatibly. | Senior |

## Related Topics

- [Control Flow](../control-flow/README.md)

## Source Section

- [Enumerations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/)
