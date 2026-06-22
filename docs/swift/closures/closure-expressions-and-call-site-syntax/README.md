---
title: "Closure Expressions and Call-Site Syntax"
domain: "Swift"
topic: "Closures"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - closures
  - type-inference
  - trailing-closures
  - api-design
---

# Closure Expressions and Call-Site Syntax

> Swift can infer closure parameter and return types from context. Use shorter
> syntax only while the argument roles and execution behavior stay clear.

## Quick Recall

- Context often provides a closure's parameter and result types.
- `$0` is useful only when argument roles remain obvious.
- Trailing closures improve DSL-like calls but can hide argument boundaries.
- Add a type annotation at the narrowest point when inference is ambiguous.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Function Values and Higher-Order Functions](../../functions/function-values-and-higher-order-functions/README.md)

## Related Concepts

- [Capture Semantics and Lifetime](../capture-semantics-and-lifetime/README.md)
- [Escaping, Autoclosure, and API Boundaries](../escaping-autoclosure-and-api-boundaries/README.md)
