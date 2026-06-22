---
title: "Macros"
domain: "Swift"
page_type: topic-index
interview_priority: situational
status: reviewed
last_reviewed: 2026-06-22
---

# Macros

## Scope

Swift macros as compile-time source transformations: freestanding and attached roles,
implementation and diagnostics, expansion testing, build integration, and API evolution.

Compiler internals and exhaustive SwiftSyntax APIs are outside scope; mechanics are
included only where they affect correctness, adoption, or maintainability.

## Prerequisites

- [Functions](../functions/README.md)

## Role-Specific Review

1. [Freestanding and Attached Macro Semantics](freestanding-and-attached-macro-semantics/README.md)
2. [Macro Implementation, Diagnostics, and Testing](macro-implementation-diagnostics-and-testing/README.md)
3. [Macro Adoption and API Evolution](macro-adoption-and-api-evolution/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Freestanding and Attached Macro Semantics](freestanding-and-attached-macro-semantics/README.md) | Select a macro role and reason about generated declarations, names, effects, and compile-time visibility. | Situational | 5 min |
| [Macro Implementation, Diagnostics, and Testing](macro-implementation-diagnostics-and-testing/README.md) | Transform syntax deterministically with actionable diagnostics and expansion-focused tests. | Situational | 4 min |
| [Macro Adoption and API Evolution](macro-adoption-and-api-evolution/README.md) | Govern dependencies, build cost, generated API compatibility, rollout, and organizational ownership. | Situational | 4 min |

## Source Section

- [Macros](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/)
