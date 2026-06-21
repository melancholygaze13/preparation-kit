---
title: "Extensions"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Extensions

## Scope

Adding behavior to existing types without subclassing: computed properties, methods,
initializers, subscripts, nested types, generic constraints, protocol conformance, and
the source, module, and ownership consequences of retroactive modeling.

Protocol requirement design and protocol-extension dispatch belong to the future
Protocols topic; this topic focuses on the extension declaration and the risks of
extending types across module boundaries.

## Prerequisites

- [Methods](../methods/README.md)
- [Initialization](../initialization/README.md)
- [Nested Types](../nested-types/README.md)

## Learning Path

1. [Extension Capabilities and Initialization](extension-capabilities-and-initialization/README.md)
2. [Conditional Extensions and Specialization](conditional-extensions-and-specialization/README.md)
3. [Conformance and Module Ownership](conformance-and-module-ownership/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Extension Capabilities and Initialization](extension-capabilities-and-initialization/README.md) | Add computed behavior and valid initializers without changing stored layout or overriding existing declarations. | Senior |
| [Conditional Extensions and Specialization](conditional-extensions-and-specialization/README.md) | Expose generic behavior only where constraints make its implementation and semantics valid. | Senior |
| [Conformance and Module Ownership](conformance-and-module-ownership/README.md) | Place conformances with a type or protocol owner and treat retroactive conformances as global compatibility commitments. | Staff |

## Source Section

- [The Swift Programming Language: Extensions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions/)
