---
title: "Functions"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-20
---

# Functions

## Scope

Swift function declarations and values, with emphasis on call-site API design,
parameter ownership, return contracts, higher-order behavior, effect annotations,
and local abstraction boundaries.

Detailed closure syntax and capture-list mechanics belong to the Closures topic.
Error modeling and async task structure remain in their owning topics; this topic
covers them only where they shape a function's type or caller contract.

## Prerequisites

- [Language Basics](../language-basics/README.md)
- [Control Flow](../control-flow/README.md)

## Learning Path

1. [Function Signatures and Argument Semantics](function-signatures-and-argument-semantics/README.md)
2. [Function Values and Higher-Order Functions](function-values-and-higher-order-functions/README.md)
3. [Nested Functions and Local Abstraction](nested-functions-and-local-abstraction/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Function Signatures and Argument Semantics](function-signatures-and-argument-semantics/README.md) | Design labels, defaults, variadics, returns, overloads, and `inout` mutation as explicit caller contracts. | Senior |
| [Function Values and Higher-Order Functions](function-values-and-higher-order-functions/README.md) | Pass behavior safely while reasoning about effects, escaping lifetime, sendability, identity, and abstraction cost. | Senior |
| [Nested Functions and Local Abstraction](nested-functions-and-local-abstraction/README.md) | Encapsulate algorithm-local behavior without obscuring captured state, lifetime, reuse, or test boundaries. | Senior |

## Related Topics

- [Control Flow](../control-flow/README.md)

## Source Section

- [Functions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/)
