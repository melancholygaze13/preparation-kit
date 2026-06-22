---
title: "Guard and Deferred Cleanup"
domain: "Swift"
topic: "Control Flow"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - guard
  - defer
  - resource-management
---

# Guard and Deferred Cleanup

> `guard` establishes requirements for the remaining scope; `defer` registers
> synchronous work for every normal control transfer out of its current scope.
> Together they make the success path and resource lifetime explicit.

## Quick Recall

- A `guard` body must leave its scope.
- Values unwrapped by `guard` remain available after the statement.
- `defer` runs when its current scope exits, in reverse registration order.
- Register cleanup immediately after acquiring the resource.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Optionals](../../language-basics/optionals/README.md)
- [Error Handling](../../language-basics/error-handling/README.md)

## Related Concepts

- [Conditional Branching and Pattern Matching](../conditional-branching-and-pattern-matching/README.md)
- [Availability Checking](../availability-checking/README.md)
