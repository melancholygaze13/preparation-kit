---
title: "Function Values and Higher-Order Functions"
domain: "Swift"
topic: "Functions"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - function-types
  - higher-order-functions
  - escaping
  - sendable
---

# Function Values and Higher-Order Functions

> Functions are values whose types describe inputs, outputs, and effects. Passing
> behavior safely also requires an execution contract: lifetime, call count,
> ordering, isolation, cancellation, and ownership are not captured by a plain
> arrow type alone.

## Quick Recall

- A function type includes parameters, result, and supported effect markers.
- An escaping function value can outlive the call that receives it.
- `@Sendable` checks transferable captures; it does not make shared state safe.
- Use a closure for one behavior and a protocol for a broader capability contract.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Function Signatures and Argument Semantics](../function-signatures-and-argument-semantics/README.md)
- [Memory Safety](../../language-basics/memory-safety/README.md)

## Related Concepts

- [Nested Functions and Local Abstraction](../nested-functions-and-local-abstraction/README.md)
