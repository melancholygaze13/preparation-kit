---
title: "Automatic Reference Counting"
domain: "Swift"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-06-22
---

# Automatic Reference Counting

## Scope

This topic explains how Swift manages class-instance lifetime. It covers strong,
weak, and unowned references, closure and task captures, retain cycles, and leak
diagnosis.

General class identity belongs to Classes and Structures; closure value-capture semantics
belong to Closures; deinitializer rules belong to Deinitialization.

## Prerequisites

- [Classes and Structures](../classes-and-structures/README.md)
- [Closures](../closures/README.md)
- [Deinitialization](../deinitialization/README.md)

## Rapid Review

1. [ARC Ownership and Object Lifetime](arc-ownership-and-object-lifetime/README.md)
2. [Object Graph Cycles and Non-Owning References](object-graph-cycles-and-non-owning-references/README.md)
3. [Closure, Callback, and Task Lifetimes](closure-callback-and-task-lifetimes/README.md)
4. [Lifecycle Architecture and Leak Diagnosis](lifecycle-architecture-and-leak-diagnosis/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [ARC Ownership and Object Lifetime](arc-ownership-and-object-lifetime/README.md) | Explains what keeps an object alive and when it can be released. | Core | 8 min |
| [Object Graph Cycles and Non-Owning References](object-graph-cycles-and-non-owning-references/README.md) | Distinguishes ownership from observation and prevents retain cycles. | Core | 8 min |
| [Closure, Callback, and Task Lifetimes](closure-callback-and-task-lifetimes/README.md) | Connects captures, cancellation, and asynchronous lifetime. | Core | 8 min |
| [Lifecycle Architecture and Leak Diagnosis](lifecycle-architecture-and-leak-diagnosis/README.md) | Shows how to prove a leak and find the retaining path. | Core | 8 min |

## Source Section

- [The Swift Programming Language: Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
