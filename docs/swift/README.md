---
title: "Swift"
page_type: domain-index
status: draft
last_reviewed: 2026-06-21
---

# Swift

## Scope

Swift language semantics and the engineering decisions that follow from them.
This domain focuses on behavior a senior iOS engineer must reason about:
correctness, ownership, API design, concurrency, performance, and evolution.

Apple frameworks and platform-specific APIs belong in their own domains.

## Topics

| Topic | Summary |
|---|---|
| [Language Basics](language-basics/README.md) | Foundational language rules viewed through correctness, state management, and API design. |
| [Basic Operators](basic-operators/README.md) | Assignment, arithmetic, comparison, conditional, logical, and range semantics. |
| [Strings and Characters](strings-and-characters/README.md) | Unicode text semantics, indexing, slicing, storage, comparison, and boundary conversion. |
| [Collection Types](collection-types/README.md) | Ordered, unique, and keyed collections with value semantics, hashing, indexing, and mutation costs. |
| [Control Flow](control-flow/README.md) | Branches, pattern matching, loops, early exits, cleanup, and runtime availability decisions. |
| [Functions](functions/README.md) | Function signatures, argument semantics, higher-order behavior, and local abstraction boundaries. |
| [Closures](closures/README.md) | Closure expression syntax, capture and lifetime semantics, escaping behavior, and delayed evaluation. |
| [Enumerations](enumerations/README.md) | Finite state modeling, associated values, raw representations, recursion, and enum evolution. |
| [Classes and Structures](classes-and-structures/README.md) | Type design, value and reference semantics, identity, aliasing, and mutation ownership. |
| [Properties](properties/README.md) | Stored and computed state, observation hooks, property wrappers, and type-level storage. |
| [Methods](methods/README.md) | Instance and type behavior, value mutation, state transitions, and method-level API design. |
| [Subscripts](subscripts/README.md) | Indexed access, bounds and failure policy, overloading, type subscripts, and API evolution. |
| [Inheritance](inheritance/README.md) | Subclassing, overrides, behavioral substitutability, extension boundaries, and framework evolution. |
| [Initialization](initialization/README.md) | Stored-property safety, delegation, two-phase class initialization, failure, requirements, and API evolution. |
| [Deinitialization](deinitialization/README.md) | Class teardown semantics, deterministic resource release, isolation, and lifecycle ownership. |
| [Optional Chaining](optional-chaining/README.md) | Conditional member access, call and assignment semantics, composition, and missing-data policy. |
| [Error Handling](error-handling/README.md) | Error modeling, throwing and propagation, recovery, cancellation, cleanup, and boundary evolution. |
| [Concurrency](concurrency/README.md) | Async execution, structured task ownership, cancellation, actors, isolation, and sendability. |
| [Macros](macros/README.md) | Freestanding and attached expansion, implementation diagnostics, testing, build impact, and API evolution. |
| [Type Casting](type-casting/README.md) | Runtime type checks, conditional and forced casts, heterogeneous storage, and boundary design. |
| [Nested Types](nested-types/README.md) | Lexically scoped domain vocabulary, generic context, public naming, dependency boundaries, and API evolution. |
| [Extensions](extensions/README.md) | Add behavior, conditional specialization, and conformances without changing stored representation or ownership boundaries. |
| [Protocols](protocols/README.md) | Define capability contracts, model existential boundaries, provide defaults, and evolve conformances safely. |
| [Generics](generics/README.md) | Express reusable algorithms and types with compile-time relationships, conditional capabilities, and scalable generic APIs. |
| [Opaque and Boxed Protocol Types](opaque-and-boxed-protocol-types/README.md) | Hide implementation types with preserved identity or erase them deliberately at runtime abstraction boundaries. |
| [Automatic Reference Counting](automatic-reference-counting/README.md) | Manage object lifetime, cycles, callback/task retention, cleanup ownership, and leak diagnosis. |
| [Memory Safety](memory-safety/README.md) | Enforce exclusive access, design scoped mutation, prove disjoint storage, and contain unsafe memory boundaries. |
| [Access Control](access-control/README.md) | Control visibility across scopes, files, modules, and packages while evolving supported APIs deliberately. |
| [Advanced Operators](advanced-operators/README.md) | Apply bitwise and overflow arithmetic, overload operators, define precedence, and govern custom syntax safely. |

## Suggested Learning Path

1. [Language Basics](language-basics/README.md)
2. [Basic Operators](basic-operators/README.md)
3. [Strings and Characters](strings-and-characters/README.md)
4. [Collection Types](collection-types/README.md)
5. [Control Flow](control-flow/README.md)
6. [Functions](functions/README.md)
7. [Closures](closures/README.md)
8. [Enumerations](enumerations/README.md)
9. [Classes and Structures](classes-and-structures/README.md)
10. [Properties](properties/README.md)
11. [Methods](methods/README.md)
12. [Subscripts](subscripts/README.md)
13. [Inheritance](inheritance/README.md)
14. [Initialization](initialization/README.md)
15. [Deinitialization](deinitialization/README.md)
16. [Optional Chaining](optional-chaining/README.md)
17. [Error Handling](error-handling/README.md)
18. [Concurrency](concurrency/README.md)
19. [Macros](macros/README.md)
20. [Type Casting](type-casting/README.md)
21. [Nested Types](nested-types/README.md)
22. [Extensions](extensions/README.md)
23. [Protocols](protocols/README.md)
24. [Generics](generics/README.md)
25. [Opaque and Boxed Protocol Types](opaque-and-boxed-protocol-types/README.md)
26. [Automatic Reference Counting](automatic-reference-counting/README.md)
27. [Memory Safety](memory-safety/README.md)
28. [Access Control](access-control/README.md)
29. [Advanced Operators](advanced-operators/README.md)

## Primary Reference

- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
