---
title: "Macros"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Macros

## Scope

Swift macros as compile-time source transformations: freestanding and attached roles,
implementation and diagnostics, expansion testing, build integration, and API evolution.

Compiler internals and exhaustive SwiftSyntax APIs are outside scope; mechanics are
included only where they affect correctness, adoption, or maintainability.

## Prerequisites

- [Functions](../functions/README.md)

## Learning Path

1. [Freestanding and Attached Macro Semantics](freestanding-and-attached-macro-semantics/README.md)
2. [Macro Implementation, Diagnostics, and Testing](macro-implementation-diagnostics-and-testing/README.md)
3. [Macro Adoption and API Evolution](macro-adoption-and-api-evolution/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Freestanding and Attached Macro Semantics](freestanding-and-attached-macro-semantics/README.md) | Select a macro role and reason about generated declarations, names, effects, and compile-time visibility. | Senior |
| [Macro Implementation, Diagnostics, and Testing](macro-implementation-diagnostics-and-testing/README.md) | Transform syntax deterministically with actionable diagnostics and expansion-focused tests. | Senior |
| [Macro Adoption and API Evolution](macro-adoption-and-api-evolution/README.md) | Govern dependencies, build cost, generated API compatibility, rollout, and organizational ownership. | Staff |

## Source Section

- [Macros](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/)
