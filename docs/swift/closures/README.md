---
title: "Closures"
domain: "Swift"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-06-22
---

# Closures

## Scope

This topic covers closure syntax, captured state, object lifetime, escaping
closures, and autoclosures. Focus on ownership, execution timing, and concurrency
safety rather than memorizing syntax.

General higher-order API selection and callback execution contracts are covered
in Functions. Automatic reference counting is linked where closure capture creates
object cycles, without duplicating the full ARC topic.

## Prerequisites

- [Functions](../functions/README.md)
- [Memory Safety](../language-basics/memory-safety/README.md)

## Rapid Review

1. [Closure Expressions and Call-Site Syntax](closure-expressions-and-call-site-syntax/README.md)
2. [Capture Semantics and Lifetime](capture-semantics-and-lifetime/README.md)
3. [Escaping, Autoclosure, and API Boundaries](escaping-autoclosure-and-api-boundaries/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Closure Expressions and Call-Site Syntax](closure-expressions-and-call-site-syntax/README.md) | Explains type inference and readable closure-based APIs. | High | 13 min |
| [Capture Semantics and Lifetime](capture-semantics-and-lifetime/README.md) | Connects captures to shared state, retain cycles, and sendability. | Core | 17 min |
| [Escaping, Autoclosure, and API Boundaries](escaping-autoclosure-and-api-boundaries/README.md) | Defines lifetime and evaluation rules at callback boundaries. | Core | 16 min |

## Related Topics

- [Functions](../functions/README.md)

## Source Section

- [Closures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)
