---
title: "Inheritance"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Inheritance

## Scope

Swift class inheritance as a behavioral extension mechanism: subclass declarations,
overrides, substitutability, extension control, and safe framework evolution.

Detailed initialization, deinitialization, ARC, protocol dispatch, and type casting
remain in their dedicated topics. This topic covers their boundaries only where an
inheritance decision depends on them.

## Prerequisites

- [Classes and Structures](../classes-and-structures/README.md)
- [Methods](../methods/README.md)
- [Properties](../properties/README.md)
- [Subscripts](../subscripts/README.md)

## Learning Path

1. [Subclassing and Override Semantics](subclassing-and-override-semantics/README.md)
2. [Behavioral Contracts and Substitutability](behavioral-contracts-and-substitutability/README.md)
3. [Inheritance Boundaries and Framework Evolution](inheritance-boundaries-and-framework-evolution/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Subclassing and Override Semantics](subclassing-and-override-semantics/README.md) | Override methods, properties, and subscripts deliberately while preserving base behavior and extension controls. | Senior |
| [Behavioral Contracts and Substitutability](behavioral-contracts-and-substitutability/README.md) | Require every subtype to honor the base type's invariants, failure behavior, effects, and concurrency contract. | Senior |
| [Inheritance Boundaries and Framework Evolution](inheritance-boundaries-and-framework-evolution/README.md) | Choose inheritance only for stable is-a extension points and evolve open hierarchies as public protocols. | Staff |

## Related Topics

- [Classes and Structures](../classes-and-structures/README.md)

## Source Section

- [Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
