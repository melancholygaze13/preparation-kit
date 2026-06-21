---
title: "Initialization"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Initialization

## Scope

Construction of valid Swift values and class instances: stored-property assignment,
delegation, two-phase class safety, failable and required initializers, and API evolution.

ARC, deinitialization, inheritance generally, and concurrency are covered only where
they constrain safe construction.

## Prerequisites

- [Classes and Structures](../classes-and-structures/README.md)
- [Inheritance](../inheritance/README.md)
- [Properties](../properties/README.md)

## Learning Path

1. [Stored-Property Initialization and Delegation](stored-property-initialization-and-delegation/README.md)
2. [Class Initialization and Two-Phase Safety](class-initialization-and-two-phase-safety/README.md)
3. [Failable, Required, and Evolving Initializers](failable-required-and-evolving-initializers/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Stored-Property Initialization and Delegation](stored-property-initialization-and-delegation/README.md) | Establish every stored property exactly once along a valid delegation path before use. | Senior |
| [Class Initialization and Two-Phase Safety](class-initialization-and-two-phase-safety/README.md) | Coordinate designated and convenience initializers without exposing partially initialized class state. | Senior |
| [Failable, Required, and Evolving Initializers](failable-required-and-evolving-initializers/README.md) | Model construction failure and subclass requirements while preserving API and migration contracts. | Senior |

## Related Topics

- [Inheritance](../inheritance/README.md)

## Source Section

- [Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
