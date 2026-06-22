---
title: "Inheritance"
domain: "Swift"
page_type: topic-index
interview_priority: situational
status: reviewed
last_reviewed: 2026-06-22
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

## Role-Specific Review

1. [Subclassing and Override Semantics](subclassing-and-override-semantics/README.md)
2. [Behavioral Contracts and Substitutability](behavioral-contracts-and-substitutability/README.md)
3. [Inheritance Boundaries and Framework Evolution](inheritance-boundaries-and-framework-evolution/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Subclassing and Override Semantics](subclassing-and-override-semantics/README.md) | Override methods, properties, and subscripts deliberately while preserving base behavior and extension controls. | Situational | 7 min |
| [Behavioral Contracts and Substitutability](behavioral-contracts-and-substitutability/README.md) | Require every subtype to honor the base type's invariants, failure behavior, effects, and concurrency contract. | Situational | 7 min |
| [Inheritance Boundaries and Framework Evolution](inheritance-boundaries-and-framework-evolution/README.md) | Choose inheritance only for stable is-a extension points and evolve open hierarchies as public protocols. | Situational | 8 min |

## Related Topics

- [Classes and Structures](../classes-and-structures/README.md)

## Source Section

- [Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
