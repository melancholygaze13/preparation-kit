---
title: "Functions"
domain: "Swift"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-06-22
---

# Functions

## Scope

This topic covers function signatures, argument behavior, higher-order functions,
and local helpers. Focus on what the caller can observe and rely on.

Detailed closure syntax and capture-list mechanics belong to the Closures topic.
Error modeling and async task structure remain in their owning topics; this topic
covers them only where they shape a function's type or caller contract.

## Prerequisites

- [Language Basics](../language-basics/README.md)
- [Control Flow](../control-flow/README.md)

## Rapid Review

1. [Function Signatures and Argument Semantics](function-signatures-and-argument-semantics/README.md)
2. [Function Values and Higher-Order Functions](function-values-and-higher-order-functions/README.md)
3. [Nested Functions and Local Abstraction](nested-functions-and-local-abstraction/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Function Signatures and Argument Semantics](function-signatures-and-argument-semantics/README.md) | Defines labels, effects, return contracts, and scoped mutation. | High | 15 min |
| [Function Values and Higher-Order Functions](function-values-and-higher-order-functions/README.md) | Adds behavior as a value with lifetime and isolation rules. | High | 12 min |
| [Nested Functions and Local Abstraction](nested-functions-and-local-abstraction/README.md) | Keeps local behavior private without hiding long-lived state. | Situational | 9 min |

## Related Topics

- [Control Flow](../control-flow/README.md)

## Source Section

- [Functions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/)
