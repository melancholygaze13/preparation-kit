---
title: "Initialization"
domain: "Swift"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-06-22
---

# Initialization

## Scope

This topic covers construction of valid values and objects. It includes property
initialization, delegation, two-phase class safety, failure, and subclass requirements.

ARC, deinitialization, inheritance generally, and concurrency are covered only where
they constrain safe construction.

## Prerequisites

- [Classes and Structures](../classes-and-structures/README.md)
- [Inheritance](../inheritance/README.md)
- [Properties](../properties/README.md)

## Rapid Review

1. [Stored-Property Initialization and Delegation](stored-property-initialization-and-delegation/README.md)
2. [Class Initialization and Two-Phase Safety](class-initialization-and-two-phase-safety/README.md)
3. [Failable, Required, and Evolving Initializers](failable-required-and-evolving-initializers/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Stored-Property Initialization and Delegation](stored-property-initialization-and-delegation/README.md) | Establishes valid stored state before use. | High | 5 min |
| [Class Initialization and Two-Phase Safety](class-initialization-and-two-phase-safety/README.md) | Prevents partially initialized class state from escaping. | High | 5 min |
| [Failable, Required, and Evolving Initializers](failable-required-and-evolving-initializers/README.md) | Models invalid input and subclass obligations. | High | 6 min |

## Related Topics

- [Inheritance](../inheritance/README.md)

## Source Section

- [Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
