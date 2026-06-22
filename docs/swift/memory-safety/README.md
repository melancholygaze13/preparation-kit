---
title: "Memory Safety"
domain: "Swift"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-06-22
---

# Memory Safety

## Scope

This topic covers exclusive access, `inout`, disjoint mutation, and unsafe memory
boundaries. It explains which safety proof Swift provides and which proof remains
the programmer's responsibility.

The Language Basics memory-safety concept provides the broad foundation. This topic
decomposes the mutation and unsafe-boundary decisions expected at senior levels.

## Prerequisites

- [Language Basics: Memory Safety](../language-basics/memory-safety/README.md)
- [Functions](../functions/README.md)
- [Methods](../methods/README.md)

## Rapid Review

1. [Access Duration and Exclusivity Enforcement](access-duration-and-exclusivity-enforcement/README.md)
2. [`inout` Writeback and Mutation APIs](inout-writeback-and-mutation-apis/README.md)
3. [Disjoint Storage and Value Mutation](disjoint-storage-and-value-mutation/README.md)
4. [Unsafe Memory and Foreign Boundaries](unsafe-memory-and-foreign-boundaries/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Access Duration and Exclusivity Enforcement](access-duration-and-exclusivity-enforcement/README.md) | Explains overlapping read and write access. | Core | 7 min |
| [`inout` Writeback and Mutation APIs](inout-writeback-and-mutation-apis/README.md) | Treats `inout` as temporary exclusive access, not a stored pointer. | Core | 7 min |
| [Disjoint Storage and Value Mutation](disjoint-storage-and-value-mutation/README.md) | Shows when separate mutations can safely overlap. | High | 7 min |
| [Unsafe Memory and Foreign Boundaries](unsafe-memory-and-foreign-boundaries/README.md) | Defines manual lifetime, bounds, binding, and synchronization duties. | High | 7 min |

## Source Section

- [The Swift Programming Language: Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
