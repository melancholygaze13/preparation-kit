---
title: "Opaque and Boxed Protocol Types"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Opaque and Boxed Protocol Types

## Scope

Opaque `some` types that hide a callee-selected concrete type, boxed `any` existential
types that erase runtime values, constrained and implicitly opened existentials, and
production decisions about abstraction boundaries, performance, and API evolution.

Protocol declaration, conformance, and extension dispatch belong to the Protocols topic;
generic parameter and constraint mechanics belong to Generics.

## Prerequisites

- [Protocols](../protocols/README.md)
- [Generics](../generics/README.md)

## Learning Path

1. [Opaque Type Identity and Underlying Types](opaque-type-identity-and-underlying-types/README.md)
2. [Boxed Protocol Types and Existential Semantics](boxed-protocol-types-and-existential-semantics/README.md)
3. [Constrained and Implicitly Opened Existentials](constrained-and-implicitly-opened-existentials/README.md)
4. [Abstraction Boundary Design and Evolution](abstraction-boundary-design-and-evolution/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Opaque Type Identity and Underlying Types](opaque-type-identity-and-underlying-types/README.md) | Hide a callee-selected concrete type while preserving its static identity and protocol capabilities. | Senior |
| [Boxed Protocol Types and Existential Semantics](boxed-protocol-types-and-existential-semantics/README.md) | Store runtime-selected conforming values while accepting erased relationships and dynamic representation. | Senior |
| [Constrained and Implicitly Opened Existentials](constrained-and-implicitly-opened-existentials/README.md) | Preserve selected associated-type facts and temporarily recover a boxed value's dynamic type for generic calls. | Staff |
| [Abstraction Boundary Design and Evolution](abstraction-boundary-design-and-evolution/README.md) | Choose generic, opaque, existential, or manual erasure boundaries using system-wide criteria. | Staff |

## Source Section

- [The Swift Programming Language: Opaque and Boxed Protocol Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/opaquetypes/)
