---
title: "Generics"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Generics

## Scope

Generic functions and types, constraints, associated types, same-type relationships,
generic `where` clauses, conditional conformance, parameter packs, specialization,
public API evolution, and diagnostics at generic boundaries.

Opaque and boxed protocol types are covered by their own topic; this topic focuses on
preserving concrete type relationships rather than erasing them.

## Prerequisites

- [Functions](../functions/README.md)
- [Protocols](../protocols/README.md)
- [Extensions](../extensions/README.md)

## Learning Path

1. [Generic Abstraction and Constraints](generic-abstraction-and-constraints/README.md)
2. [Associated Types and Type Relationships](associated-types-and-type-relationships/README.md)
3. [Where Clauses and Conditional Conformance](where-clauses-and-conditional-conformance/README.md)
4. [Parameter Packs and Variadic Generics](parameter-packs-and-variadic-generics/README.md)
5. [Generic API Design and Evolution](generic-api-design-and-evolution/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Generic Abstraction and Constraints](generic-abstraction-and-constraints/README.md) | Preserve type information while sharing algorithms and state across a family of concrete types. | Senior |
| [Associated Types and Type Relationships](associated-types-and-type-relationships/README.md) | Model protocol families whose operations depend on conformer-selected types and explicit relationships. | Senior |
| [Where Clauses and Conditional Conformance](where-clauses-and-conditional-conformance/README.md) | State cross-type requirements and expose capabilities only when a generic type can uphold their contracts. | Senior |
| [Parameter Packs and Variadic Generics](parameter-packs-and-variadic-generics/README.md) | Abstract over heterogeneous lists of types without fixed-arity overload families. | Staff |
| [Generic API Design and Evolution](generic-api-design-and-evolution/README.md) | Balance semantic precision, usability, code size, performance, compatibility, and migration cost. | Staff |

## Source Section

- [The Swift Programming Language: Generics](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics/)
