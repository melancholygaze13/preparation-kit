---
title: "Subscripts"
domain: "Swift"
page_type: topic-index
interview_priority: reference
status: reviewed
last_reviewed: 2026-06-22
---

# Subscripts

## Scope

Swift subscripts as indexed API contracts: read and write access, domain-specific
indices, failure behavior, overloads, type-level lookup, and production evolution.

Detailed collection conformance, key paths, generics, and actor isolation belong to
their dedicated topics and appear here only where they affect subscript correctness.

## Prerequisites

- [Collection Types](../collection-types/README.md)
- [Methods](../methods/README.md)
- [Properties](../properties/README.md)

## Optional Review

1. [Subscript Access and Domain Indexing](subscript-access-and-domain-indexing/README.md)
2. [Overloading, Type Subscripts, and API Evolution](overloading-type-subscripts-and-api-evolution/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Subscript Access and Domain Indexing](subscript-access-and-domain-indexing/README.md) | Design indexed reads and writes with explicit index meaning, bounds, complexity, and failure policy. | Reference | 3 min |
| [Overloading, Type Subscripts, and API Evolution](overloading-type-subscripts-and-api-evolution/README.md) | Evolve overloaded and type-level lookup without ambiguity, hidden global state, or compatibility surprises. | Reference | 3 min |

## Related Topics

- [Collection Types](../collection-types/README.md)

## Source Section

- [Subscripts](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/)
