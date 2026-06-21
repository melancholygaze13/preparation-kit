---
title: "Classes and Structures"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-20
---

# Classes and Structures

## Scope

Choosing and designing Swift structures and classes, reasoning about value versus
reference behavior, and making identity, aliasing, and mutation ownership explicit
at production boundaries.

Detailed property behavior, methods, initialization rules, inheritance, and ARC
belong to their dedicated chapters. This topic uses only the mechanics needed to
make sound type and ownership decisions.

## Prerequisites

- [Language Basics](../language-basics/README.md)
- [Functions](../functions/README.md)

## Learning Path

1. [Type Design and Initialization](type-design-and-initialization/README.md)
2. [Value and Reference Semantics](value-and-reference-semantics/README.md)
3. [Identity, Aliasing, and Mutation Ownership](identity-aliasing-and-mutation-ownership/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Type Design and Initialization](type-design-and-initialization/README.md) | Select a struct or class from domain semantics and expose initialization that preserves invariants. | Senior |
| [Value and Reference Semantics](value-and-reference-semantics/README.md) | Predict assignment and mutation behavior without assuming deep copies or a particular storage optimization. | Senior |
| [Identity, Aliasing, and Mutation Ownership](identity-aliasing-and-mutation-ownership/README.md) | Separate identity from equality and place shared mutation behind an explicit lifecycle and synchronization owner. | Senior |

## Related Topics

- [Enumerations](../enumerations/README.md)

## Source Section

- [Classes and Structures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/)
