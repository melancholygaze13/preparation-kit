---
title: "Function Values and Higher-Order Functions"
domain: "Swift"
topic: "Functions"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 2
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-08-12
tags:
  - function-types
  - higher-order-functions
  - escaping
  - sendable
---

# Function Values and Higher-Order Functions

> A function can be stored, passed to another function, and returned like other
> values. A higher-order function takes or returns a function. Its complete
> contract includes both the arrow type and how the behavior will be invoked.

## Quick Recall

- A function type includes parameters, result, and supported effect markers.
- A higher-order function takes a function value, returns one, or both.
- A key path is a typed property-access value, useful for selection and projection
  when no custom behavior is needed.
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
