---
title: "Error Handling"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Error Handling

## Scope

Swift error values, throwing functions, propagation, recovery, cleanup, cancellation,
and translation across module and service boundaries.

Optional absence and control-flow `defer` fundamentals remain in their owning topics;
concurrency is covered here only where cancellation changes error policy.

## Prerequisites

- [Control Flow](../control-flow/README.md)
- [Functions](../functions/README.md)
- [Optional Chaining](../optional-chaining/README.md)

## Learning Path

1. [Error Modeling and Throwing APIs](error-modeling-and-throwing-apis/README.md)
2. [Propagation, Recovery, and Boundary Policy](propagation-recovery-and-boundary-policy/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Error Modeling and Throwing APIs](error-modeling-and-throwing-apis/README.md) | Represent recoverable failures as meaningful values and expose effects without conflating absence or programmer defects. | Senior |
| [Propagation, Recovery, and Boundary Policy](propagation-recovery-and-boundary-policy/README.md) | Catch only where policy exists, preserve cancellation, clean up deterministically, and translate errors at ownership boundaries. | Senior |

## Source Section

- [Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
