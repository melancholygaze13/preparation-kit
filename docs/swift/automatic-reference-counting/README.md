---
title: "Automatic Reference Counting"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Automatic Reference Counting

## Scope

Class-instance lifetime under ARC, strong ownership graphs, weak and unowned references,
closure/callback/task retention, resource lifecycle design, leak diagnosis, and ownership
migration across production systems.

General class identity belongs to Classes and Structures; closure value-capture semantics
belong to Closures; deinitializer rules belong to Deinitialization.

## Prerequisites

- [Classes and Structures](../classes-and-structures/README.md)
- [Closures](../closures/README.md)
- [Deinitialization](../deinitialization/README.md)

## Learning Path

1. [ARC Ownership and Object Lifetime](arc-ownership-and-object-lifetime/README.md)
2. [Object Graph Cycles and Non-Owning References](object-graph-cycles-and-non-owning-references/README.md)
3. [Closure, Callback, and Task Lifetimes](closure-callback-and-task-lifetimes/README.md)
4. [Lifecycle Architecture and Leak Diagnosis](lifecycle-architecture-and-leak-diagnosis/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [ARC Ownership and Object Lifetime](arc-ownership-and-object-lifetime/README.md) | Reason from strong ownership and last-use lifetime without assuming lexical-scope deallocation. | Senior |
| [Object Graph Cycles and Non-Owning References](object-graph-cycles-and-non-owning-references/README.md) | Break cycles with weak or unowned edges only when the domain lifetime relationship justifies them. | Senior |
| [Closure, Callback, and Task Lifetimes](closure-callback-and-task-lifetimes/README.md) | Design capture, cancellation, and callback ownership so asynchronous work neither leaks nor disappears silently. | Senior |
| [Lifecycle Architecture and Leak Diagnosis](lifecycle-architecture-and-leak-diagnosis/README.md) | Make lifetime ownership observable, testable, and migratable across subsystem and team boundaries. | Staff |

## Source Section

- [The Swift Programming Language: Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
