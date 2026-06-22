---
title: "Generics"
domain: "Swift"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-06-22
---

# Generics

## Scope

This topic explains how generics preserve type relationships while sharing code.
It covers constraints, associated types, conditional conformance, and API design.

Opaque and boxed protocol types are covered by their own topic; this topic focuses on
preserving concrete type relationships rather than erasing them.

## Prerequisites

- [Functions](../functions/README.md)
- [Protocols](../protocols/README.md)
- [Extensions](../extensions/README.md)

## Rapid Review

1. [Generic Abstraction and Constraints](generic-abstraction-and-constraints/README.md)
2. [Associated Types and Type Relationships](associated-types-and-type-relationships/README.md)
3. [Where Clauses and Conditional Conformance](where-clauses-and-conditional-conformance/README.md)
4. [Parameter Packs and Variadic Generics](parameter-packs-and-variadic-generics/README.md)
5. [Generic API Design and Evolution](generic-api-design-and-evolution/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Generic Abstraction and Constraints](generic-abstraction-and-constraints/README.md) | Shares code without erasing useful type information. | Core | 8 min |
| [Associated Types and Type Relationships](associated-types-and-type-relationships/README.md) | Models related types selected by a conformer. | Core | 6 min |
| [Where Clauses and Conditional Conformance](where-clauses-and-conditional-conformance/README.md) | Exposes behavior only when constraints make it valid. | Core | 6 min |
| [Generic API Design and Evolution](generic-api-design-and-evolution/README.md) | Balances precision, usability, performance, and compatibility. | High | 8 min |
| [Parameter Packs and Variadic Generics](parameter-packs-and-variadic-generics/README.md) | Replaces fixed-arity overloads in specialized generic APIs. | Situational | 8 min |

## Source Section

- [The Swift Programming Language: Generics](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics/)
