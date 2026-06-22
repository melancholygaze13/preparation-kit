---
title: "Error Handling"
domain: "Swift"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-06-22
---

# Error Handling

## Scope

This topic covers error values, throwing functions, recovery, cleanup,
cancellation, and error translation at system boundaries.

Optional absence and control-flow `defer` fundamentals remain in their owning topics;
concurrency is covered here only where cancellation changes error policy.

## Prerequisites

- [Control Flow](../control-flow/README.md)
- [Functions](../functions/README.md)
- [Optional Chaining](../optional-chaining/README.md)

## Rapid Review

1. [Error Modeling and Throwing APIs](error-modeling-and-throwing-apis/README.md)
2. [Propagation, Recovery, and Boundary Policy](propagation-recovery-and-boundary-policy/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Error Modeling and Throwing APIs](error-modeling-and-throwing-apis/README.md) | Separates recoverable failure, absence, and programmer error. | Core | 6 min |
| [Propagation, Recovery, and Boundary Policy](propagation-recovery-and-boundary-policy/README.md) | Catches errors only where a recovery or translation policy exists. | Core | 7 min |

## Source Section

- [Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
