---
title: "Escaping, Autoclosure, and API Boundaries"
domain: "Swift"
topic: "Closures"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - closures
  - escaping
  - autoclosure
  - api-design
---

# Escaping, Autoclosure, and API Boundaries

> `@escaping` allows later invocation. `@autoclosure` turns an expression into a
> hidden zero-argument closure. Both change lifetime or evaluation timing.

## Quick Recall

- Closure parameters are nonescaping by default.
- `@escaping` does not guarantee asynchronous or single execution.
- Escaping captures can extend object lifetime and form cycles.
- Use `@autoclosure` only when delayed evaluation is clear at the call site.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Function Values and Higher-Order Functions](../../functions/function-values-and-higher-order-functions/README.md)
- [Capture Semantics and Lifetime](../capture-semantics-and-lifetime/README.md)

## Related Concepts

- [Closure Expressions and Call-Site Syntax](../closure-expressions-and-call-site-syntax/README.md)
