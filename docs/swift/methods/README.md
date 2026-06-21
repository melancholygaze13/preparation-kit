---
title: "Methods"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Methods

## Scope

Swift methods as behavior owned by a type: instance access, `self`, value mutation,
validated state transitions, and type-level operations.

Function signature mechanics remain in Functions. Detailed inheritance, protocol
dispatch, subscripts, initialization, and ownership modifiers belong to their own
topics and appear here only where they affect method design.

## Prerequisites

- [Functions](../functions/README.md)
- [Classes and Structures](../classes-and-structures/README.md)
- [Properties](../properties/README.md)

## Learning Path

1. [Instance Methods and Self Semantics](instance-methods-and-self-semantics/README.md)
2. [Mutating Value Types and State Transitions](mutating-value-types-and-state-transitions/README.md)
3. [Type Methods and API Design](type-methods-and-api-design/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Instance Methods and Self Semantics](instance-methods-and-self-semantics/README.md) | Attach behavior to the state and invariants it owns while keeping receiver and side effects explicit. | Senior |
| [Mutating Value Types and State Transitions](mutating-value-types-and-state-transitions/README.md) | Use `mutating` methods to replace value state through validated, testable transitions. | Senior |
| [Type Methods and API Design](type-methods-and-api-design/README.md) | Use type-level behavior for operations about the type, not as a namespace for hidden global dependencies. | Senior |

## Related Topics

- [Functions](../functions/README.md)
- [Properties](../properties/README.md)

## Source Section

- [Methods](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
