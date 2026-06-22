---
title: "Swift"
page_type: domain-index
status: reviewed
last_reviewed: 2026-06-22
---

# Swift

## Scope

This domain covers Swift knowledge used in senior iOS interviews. Focus on
language behavior that affects ownership, concurrency, correctness, API design,
and performance. Use lower-priority topics only when they match the role.

## Rapid Review

If the interview is close, study these topics first:

1. [Concurrency](concurrency/README.md)
2. [Automatic Reference Counting](automatic-reference-counting/README.md)
3. [Closures](closures/README.md)
4. [Classes and Structures](classes-and-structures/README.md)
5. [Protocols](protocols/README.md)
6. [Generics](generics/README.md)
7. [Error Handling](error-handling/README.md)
8. [Memory Safety](memory-safety/README.md)

This path is ordered by interview value, not by the order of chapters in the
Swift book. Use each topic's prerequisites when a concept is unfamiliar.

## Topics

### Core

| Topic | Why it matters |
|---|---|
| [Concurrency](concurrency/README.md) | Tasks, cancellation, actors, isolation, and sendability are central to modern Swift. |
| [Automatic Reference Counting](automatic-reference-counting/README.md) | Object lifetime, retain cycles, captures, and leaks appear in most iOS roles. |
| [Closures](closures/README.md) | Captures, escaping work, and callback lifetime connect Swift syntax to ownership. |
| [Classes and Structures](classes-and-structures/README.md) | Value and reference semantics affect state, copying, and architecture. |
| [Protocols](protocols/README.md) | Protocol design tests abstraction, dispatch, API evolution, and dependency boundaries. |
| [Generics](generics/README.md) | Generic constraints and type erasure are common API-design discussion points. |
| [Error Handling](error-handling/README.md) | Good answers distinguish failure modeling, recovery, cancellation, and API boundaries. |
| [Memory Safety](memory-safety/README.md) | Exclusive access and unsafe boundaries matter for correctness and performance. |

### High Priority

| Topic | Why it matters |
|---|---|
| [Language Basics](language-basics/README.md) | Optionals, types, and assertions support almost every coding discussion. |
| [Collection Types](collection-types/README.md) | Collection choice, hashing, indexing, and mutation affect correctness and cost. |
| [Control Flow](control-flow/README.md) | Pattern matching, `guard`, cleanup, and availability checks appear in practical code. |
| [Functions](functions/README.md) | Signatures and higher-order functions shape clear Swift APIs. |
| [Enumerations](enumerations/README.md) | Associated values and exhaustive state modeling are important Swift strengths. |
| [Properties](properties/README.md) | Stored, computed, observed, and wrapped properties define state boundaries. |
| [Initialization](initialization/README.md) | Initialization rules protect valid state and matter in class hierarchies. |
| [Strings and Characters](strings-and-characters/README.md) | Unicode and non-integer indexing are common correctness checks. |

### Situational

| Topic | Use it when |
|---|---|
| [Access Control](access-control/README.md) | The role covers modules, packages, SDKs, or large codebases. |
| [Extensions](extensions/README.md) | The discussion covers conformance ownership or API organization. |
| [Opaque and Boxed Protocol Types](opaque-and-boxed-protocol-types/README.md) | The role uses protocol-heavy APIs or SwiftUI-style abstractions. |
| [Inheritance](inheritance/README.md) | The codebase uses UIKit subclassing or framework extension points. |
| [Type Casting](type-casting/README.md) | Runtime types or heterogeneous Objective-C boundaries are relevant. |
| [Optional Chaining](optional-chaining/README.md) | You need a short review of optional access and assignment behavior. |
| [Macros](macros/README.md) | The role builds tooling, generated APIs, or modern Swift infrastructure. |
| [Deinitialization](deinitialization/README.md) | Resource lifetime and teardown ownership are likely discussion areas. |
| [Basic Operators](basic-operators/README.md) | You want to review overflow, equality, short-circuiting, or range boundaries. |

### Reference

| Topic | What to review |
|---|---|
| [Advanced Operators](advanced-operators/README.md) | Bitwise code, explicit wrapping, or custom operators when the role needs them. |
| [Methods](methods/README.md) | `mutating`, type methods, and method-level API details. |
| [Subscripts](subscripts/README.md) | Bounds policy and custom indexed access. |
| [Nested Types](nested-types/README.md) | Scoped names and generic nesting. |

## Primary Reference

- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
