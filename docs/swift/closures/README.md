---
title: "Closures"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-20
---

# Closures

## Scope

Swift closure expressions, contextual type inference, trailing-closure call
syntax, captured state, reference lifetime, escaping behavior, and autoclosure
evaluation. The focus is readable call sites, explicit ownership, concurrency
safety, and predictable execution.

General higher-order API selection and callback execution contracts are covered
in Functions. Automatic reference counting is linked where closure capture creates
object cycles, without duplicating the full ARC topic.

## Prerequisites

- [Functions](../functions/README.md)
- [Memory Safety](../language-basics/memory-safety/README.md)

## Learning Path

1. [Closure Expressions and Call-Site Syntax](closure-expressions-and-call-site-syntax/README.md)
2. [Capture Semantics and Lifetime](capture-semantics-and-lifetime/README.md)
3. [Escaping, Autoclosure, and API Boundaries](escaping-autoclosure-and-api-boundaries/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Closure Expressions and Call-Site Syntax](closure-expressions-and-call-site-syntax/README.md) | Balance contextual inference, shorthand arguments, implicit returns, and trailing closures against ambiguity and readability. | Senior |
| [Capture Semantics and Lifetime](capture-semantics-and-lifetime/README.md) | Reason about shared captured state, capture lists, reference cycles, value snapshots, and concurrent access. | Senior |
| [Escaping, Autoclosure, and API Boundaries](escaping-autoclosure-and-api-boundaries/README.md) | Make deferred execution, storage, invocation timing, and hidden evaluation explicit at API boundaries. | Senior |

## Related Topics

- [Functions](../functions/README.md)

## Source Section

- [Closures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)
