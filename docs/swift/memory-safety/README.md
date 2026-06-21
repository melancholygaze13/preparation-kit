---
title: "Memory Safety"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Memory Safety

## Scope

Swift's exclusive-access model, access duration and enforcement, `inout` writeback,
disjoint stored-property mutation, unsafe pointer proof obligations, and production
design at foreign-memory boundaries.

The Language Basics memory-safety concept provides the broad foundation. This topic
decomposes the mutation and unsafe-boundary decisions expected at senior levels.

## Prerequisites

- [Language Basics: Memory Safety](../language-basics/memory-safety/README.md)
- [Functions](../functions/README.md)
- [Methods](../methods/README.md)

## Learning Path

1. [Access Duration and Exclusivity Enforcement](access-duration-and-exclusivity-enforcement/README.md)
2. [`inout` Writeback and Mutation APIs](inout-writeback-and-mutation-apis/README.md)
3. [Disjoint Storage and Value Mutation](disjoint-storage-and-value-mutation/README.md)
4. [Unsafe Memory and Foreign Boundaries](unsafe-memory-and-foreign-boundaries/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Access Duration and Exclusivity Enforcement](access-duration-and-exclusivity-enforcement/README.md) | Identify conflicting locations, access kinds, and overlapping durations before relying on static or runtime enforcement. | Senior |
| [`inout` Writeback and Mutation APIs](inout-writeback-and-mutation-apis/README.md) | Treat `inout` as scoped exclusive read-modify-write with observable writeback, not as a stored pointer. | Senior |
| [Disjoint Storage and Value Mutation](disjoint-storage-and-value-mutation/README.md) | Understand when Swift can prove separate stored-property access and when whole-value or hidden aliasing prevents it. | Senior |
| [Unsafe Memory and Foreign Boundaries](unsafe-memory-and-foreign-boundaries/README.md) | Contain manual lifetime, bounds, initialization, binding, ownership, and synchronization proofs behind safe APIs. | Staff |

## Source Section

- [The Swift Programming Language: Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
